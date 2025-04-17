
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WalletConnect } from '@/components/WalletConnect';
import { useState, useEffect } from 'react';

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-xl' : 'bg-black/70 backdrop-blur-md'} border-b ${scrolled ? 'border-white/10' : 'border-game-primary/40'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Subtle animated gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-game-primary/0 via-game-secondary/50 to-game-accent/0 animate-gradient-x"></div>
        <Link to="/" className="flex items-center group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-game-primary/30 via-game-secondary/20 to-game-accent/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <h1 className="text-xl sm:text-2xl font-bold relative flex items-center gap-0.5">
            <span className="text-gradient-meta text-glow text-float" style={{ animationDelay: '0.0s' }}>M</span>
            <span className="text-blue-300 text-glow text-float" style={{ animationDelay: '0.1s' }}>e</span>
            <span className="text-sky-300 text-glow text-float" style={{ animationDelay: '0.2s' }}>t</span>
            <span className="text-blue-200 text-glow text-float" style={{ animationDelay: '0.3s' }}>a</span>
            <span className="text-gradient-monsters text-glow text-float" style={{ animationDelay: '0.4s' }}>M</span>
            <span className="text-violet-300 text-glow text-float" style={{ animationDelay: '0.5s' }}>o</span>
            <span className="text-purple-300 text-glow text-float" style={{ animationDelay: '0.6s' }}>n</span>
            <span className="text-fuchsia-300 text-glow text-float" style={{ animationDelay: '0.7s' }}>s</span>
            <span className="text-pink-300 text-glow text-float" style={{ animationDelay: '0.8s' }}>t</span>
            <span className="text-fuchsia-300 text-glow text-float" style={{ animationDelay: '0.9s' }}>e</span>
            <span className="text-purple-300 text-glow text-float" style={{ animationDelay: '1.0s' }}>r</span>
            <span className="text-violet-300 text-glow text-float" style={{ animationDelay: '1.1s' }}>s</span>
            <span className="text-gradient-arena text-glow text-float" style={{ animationDelay: '1.2s' }}>A</span>
            <span className="text-blue-300 text-glow text-float" style={{ animationDelay: '1.3s' }}>r</span>
            <span className="text-sky-300 text-glow text-float" style={{ animationDelay: '1.4s' }}>e</span>
            <span className="text-blue-200 text-glow text-float" style={{ animationDelay: '1.5s' }}>n</span>
            <span className="text-sky-200 text-glow text-float" style={{ animationDelay: '1.6s' }}>a</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex space-x-3">
            <Button variant="ghost" className="relative overflow-hidden group rounded-lg border border-transparent hover:border-game-primary/30" asChild>
              <Link to="/">
                <span className="relative z-10 font-medium">Home</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-game-primary/20 to-game-secondary/20 transition-all duration-300 rounded-md"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-game-primary to-game-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </Button>
            <Button variant="ghost" className="relative overflow-hidden group rounded-lg border border-transparent hover:border-game-secondary/30" asChild>
              <Link to="/monsters">
                <span className="relative z-10 font-medium">My Monsters</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-game-secondary/20 to-game-accent/20 transition-all duration-300 rounded-md"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-game-secondary to-game-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </Button>
            <Button variant="ghost" className="relative overflow-hidden group rounded-lg border border-transparent hover:border-purple-500/30" asChild>
              <Link to="/battle">
                <span className="relative z-10 font-medium">Battle Arena</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transition-all duration-300 rounded-md"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </Button>
            <Button variant="ghost" className="relative overflow-hidden group rounded-lg border border-transparent hover:border-blue-500/30" asChild>
              <Link to="/about">
                <span className="relative z-10 font-medium">About</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 transition-all duration-300 rounded-md"></span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </Button>
          </nav>

          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
