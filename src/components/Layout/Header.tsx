export function Header() {
  const copilotIcon = `${import.meta.env.BASE_URL}icons/copilot-24.svg`;
  const githubIcon = `${import.meta.env.BASE_URL}icons/mark-github-24.svg`;
  
  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src={copilotIcon} alt="Copilot" className="h-6 w-6 invert" />
        <h1 className="text-lg font-semibold">Copilot Model Launch Kit</h1>
      </div>
      <a 
        href="https://github.com/github/model-launchkit" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-70 transition-opacity"
      >
        <img src={githubIcon} alt="GitHub" className="h-6 w-6 invert" />
      </a>
    </header>
  );
}
