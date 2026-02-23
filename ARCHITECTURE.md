# Krea AI Integration Architecture

## System Overview

```

                         User Interface                          

                                                                 
             
       Canvas   Area                          Sidebar      
                                                           
                  
     SocialCardCanvas                    Background   
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_  -   Reads  backgroundSource DONE_MARKER___$EC";             }
  - Renders   custom/ default                         
               [ Generate   
                                             with  AI]   
                  
     HeaderCanvas                                       
  -   Reads  backgroundSource                
  - Renders   custom/ default             Preview     
                  
             
                                                                 

                              
 Opens Dialog                              
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_DONE_MARKER___$EC";             }

              Background Generator Dialog                        

                                                                 
      
 BackgroundGenerator     Component                            
                                                              
 Prompt     Input                                            
 Style Preset     Selector                                  
 [Generate Background]     Button                           
                                                              
          
 Generated     History   Grid                             
  [Image 1] [Image 2] [    Image   3]                     
                                                        
  [Use This] [Use This] [    Use   This]                  
          
      
                                                                
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_DONE_MARKER___$EC";             }
                               
 API Call                               
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_DONE_MARKER___$EC";             }

                      API Layer (krea.ts)                        

                                                                 
                    
     KreaAPIClient                         mockGenerate     
     generateImage()       Dev Mode Image()          
     getGenerationStatus()                                 
                                           Returns          
 Calls Krea     API                        Placeholder      
                    
                                                                
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_DONE_MARKER___$EC";             }
                                            
 HTTPS                                            
            {                 echo ___BEGIN___COMMAND_OUTPUT_MARKER___;                 PS1="";PS2="";                 EC=$?;                 echo "___BEGIN___COMMAND_DONE_MARKER___$EC";             }
                                   
   Krea AI API                                      
  api.krea.ai                                       
                                   
```

## Data Flow

### 1. Background Generation Flow

```
User Action                API Call                 State Update

                                                    
1. Click "Generate"                                 
                                                   
 Input validation                               
                                                   
 mockGenerateImage(request)                     
                                                   
 Simulate 2s delay                              
                                                   
 setGeneratedHistory() Return mock imageUrl        
                                                    
 Display in grid                                                    
```

### 2. Background Selection Flow

```
User Action                State Change             Canvas Re-render


1. Click "Use This"                                 
                                                   
 handleBackgroundGenerated(url)                 
                                                   
 onConfigChange({                               
             backgroundSource: 'custom',            
             customBackgroundUrl: url              
           })                                       
                                                   
 Canvas reads: AssetConfig updated            
 config.backgroundSource                                                      
 config.customBackgroundUrl                                                      
                                                      
 drawImage(customUrl)                                                      
```

### 3. Reset to Default Flow

```
User Action                State Change             Canvas Re-render


1. Click "Reset"                                    
                                                   
 handleResetToDefault()                         
                                                   
 onConfigChange({                               
             backgroundSource: 'default',           
             customBackgroundUrl: undefined         
           })                                       
                                                   
 Canvas reads: AssetConfig updated            
 config.backgroundSource                                                      
                                                      
 drawImage(defaultPath)                                                      
```

## Component Hierarchy

```
App
 Sidebar
 BackgroundSelector   
 Dialog (when opened)      
 BackgroundGenerator          
 Input (prompt)              
 Select (style preset)              
 Button (generate)              
 History Grid              
 Generated Images                  
   
 SocialCopyEditor   
 ModelSelector (x5)   

 Canvas Area
 SocialCardCanvas    
 useMultipleImages([defaultBg OR customBg, ...])       
    
 HeaderCanvas    
 useMultipleImages([defaultBg OR customBg, ...])        
```

## State Management

### AssetConfig (Single Source of Truth)

```typescript
interface AssetConfig {
  // ... existing fields
  backgroundSource: 'default' | ' NEWcustom',  // 
  customBackgroundUrl?:  NEWstring,             // 
}

// Flows down through props:
 BackgroundSelector Props
 Conditional Image Loading
```

## API Integration Modes

### Development Mode (Current)

```
BackgroundGenerator
  
 mockGenerateImage()  
       
 await delay(2000)       
       
 return {        
             id: 'mock-123',
             status: 'completed',
             imageUrl: 'https://unsplash.com/...'
           }
```

### Production Mode (When API Key Configured)

```
BackgroundGenerator
  
 createKreaClient(API_KEY)  
       
 client.generateImage(request)       
           
 POST https://api.krea.ai/v1/generate           
         Response: { id: 'abc123', status: 'pending' }       
       
 pollGenerationStatus(client, 'abc123')       
            
 Loop: GET /v1/generate/abc123            
 Check status every 2s                
            
 Return when status === 'completed'            
                 { imageUrl: 'https://cdn.krea.ai/...' }
```

## File Dependencies

```
src/types/index.ts
 (imported by)  
src/lib/api/krea.ts
 (imported by)  
src/components/BackgroundGenerator/BackgroundGenerator.tsx
 (exported via)  
src/components/BackgroundGenerator/index.ts
 (imported by)  
src/components/BackgroundGenerator/BackgroundSelector.tsx
 (exported via)  
src/components/BackgroundGenerator/index.ts
 (imported by)  
src/components/Layout/Sidebar.tsx
 (used by)  
src/App.tsx
```

## Canvas Rendering Logic

```typescript
// Pseudocode for both SocialCardCanvas and HeaderCanvas

function renderCanvas(config: AssetConfig) {
  // 1. Determine background URL
  const backgroundUrl = config.backgroundSource === 'custom'
    ? config.customBackgroundUrl
    : getBackgroundPath('Default_Background.jpg');
  
  // 2. Load all images (including dynamic background)
  const images = useMultipleImages([
     Dynamic!backgroundUrl,  // 
    overlayImages,
    providerLogos
  ]);
  
  // 3. Render to canvas
  useEffect(() => {
    const bgImg = images[backgroundUrl];
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    }
    // ... render other layers
  }, [images, config]);
}
```

## Security Considerations

### Current Implementation
-  API key in environment variable (not committed)
-  Mock mode prevents accidental API calls
  Frontend makes direct API calls (exposes key in browser)- 

### Production Recommendations
```
Frontend                    Backend                    Krea API


User clicks "Generate"
  
 POST /api/generate  
      {
        prompt: "...",
        stylePreset: "..."
      }
                             
 Validate request                             
                                  
 POST api.krea.ai/v1/generate                                  
                                      Authorization: Bearer [SECRET_KEY]
                                       
 Return imageUrl                                       
                                            
 Cache result                                            
                                                 
      
      { imageUrl: "..." }
```

## Extension Points

### Adding New Style Presets

```typescript
// src/lib/api/krea.ts
export const KREA_STYLE_PRESETS: KreaStylePreset[] = [
  // ... existing presets
  {
    id: 'new-style',
    name: 'New Style Name',
    description: 'Style description',
  },
];
```

### Adding Image History Persistence

```typescript
// src/components/BackgroundGenerator/BackgroundGenerator.tsx
useEffect(() => {
  // Load from localStorage on mount
  const saved = localStorage.getItem('backgroundHistory');
  if (saved) {
    setGeneratedHistory(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  // Save to localStorage on change
  localStorage.setItem('backgroundHistory', JSON.stringify(generatedHistory));
}, [generatedHistory]);
```

### Switching to Real API

```typescript
// src/components/BackgroundGenerator/BackgroundGenerator.tsx
const handleGenerate = async () => {
  // Replace this:
  const response = await mockGenerateImage(request);
  
  // With this:
  const client = createKreaClient(import.meta.env.VITE_KREA_API_KEY!);
  const response = await client.generateImage(request);
  
  if (response.status === 'pending') {
    const completed = await pollGenerationStatus(client, response.id);
    setGeneratedHistory(prev => [completed.imageUrl!, ...prev]);
  }
};
```

---

**Last Updated**: 2026-02-21  
**System Status Fully Functional (Mock Mode)  **: 
**Production   Requires API Key ConfigurationReady**: 
