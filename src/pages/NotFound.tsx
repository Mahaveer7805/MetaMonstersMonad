
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-game-primary via-game-secondary to-game-accent">404</h1>
        <p className="text-xl text-game-foreground mb-8">Oops! This page doesn't exist in the monster realm</p>
        <Button asChild className="bg-game-primary hover:bg-game-secondary text-white">
          <Link to="/">Return to Arena</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
