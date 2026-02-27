export function Header() {
  const foundryIcon = `${import.meta.env.BASE_URL}logos/Foundry White.png`;
  const githubIcon = `${import.meta.env.BASE_URL}icons/mark-github-24.svg`;
  
  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6">
      <div className="flex items-center gap-3">
        <img src={githubIcon} alt="GitHub" className="h-6 w-6 invert" />
        <img src={foundryIcon} alt="Foundry" className="h-6 w-6" />
        <h1 className="text-lg font-semibold">CoreAI Studio: Launch Kit</h1>
      </div>
    </header>
  );
}
