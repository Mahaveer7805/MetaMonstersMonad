
import { Button } from "@/components/ui/button";
import { Pet } from '@/lib/web3';
import { Trophy, Award, ArrowRight, ArrowUp, RotateCw } from "lucide-react";
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useEffect } from "react";

interface BattleResultsProps {
  winner: Pet | null;
  loser: Pet | null;
  battleLogs: string[];
  playerWon: boolean;
  onLevelUp: () => void;
  isLevelingUp: boolean;
  onViewMonster: () => void;
  onPlayAgain: () => void;
}

export function BattleResults({
  winner,
  loser,
  battleLogs,
  playerWon,
  onLevelUp,
  isLevelingUp,
  onViewMonster,
  onPlayAgain
}: BattleResultsProps) {
  // Trigger confetti when player wins
  useEffect(() => {
    if (playerWon) {
      // Run the confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start from the top of the screen
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      
      // Clean up the interval when component unmounts
      return () => clearInterval(interval);
    }
  }, [playerWon]);

  if (!winner || !loser) return null;

  // Get type-specific color for styling
  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      "Fire": "text-monster-fire",
      "Water": "text-monster-water",
      "Earth": "text-monster-earth",
      "Air": "text-monster-air",
      "Electric": "text-monster-electric"
    };
    
    return typeMap[type] || "text-purple-600";
  };
  
  // Get type-specific background color
  const getTypeBgColor = (type: string) => {
    const typeMap: Record<string, string> = {
      "Fire": "bg-monster-fire/20",
      "Water": "bg-monster-water/20",
      "Earth": "bg-monster-earth/20",
      "Air": "bg-monster-air/20",
      "Electric": "bg-monster-electric/20"
    };
    
    return typeMap[type] || "bg-purple-600/20";
  };

  return (
    <div className="space-y-8">
      {/* Winner showcase */}
      <div className={cn(
        "relative rounded-lg overflow-hidden p-6",
        playerWon ? "bg-gradient-to-r from-game-primary/20 to-game-secondary/20 border border-game-primary/40" 
                 : "bg-gray-800/40 border border-gray-700/40"
      )}>
        {playerWon && (
          <div className="absolute top-4 right-4">
            <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={cn(
            "w-40 h-40 rounded-full flex items-center justify-center",
            getTypeBgColor(winner.type)
          )}>
            <img
              src={winner.image}
              alt={winner.name}
              className="h-32 object-contain animate-float"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{winner.name}</h2>
              <span className={cn(
                "text-sm py-0.5 px-2 rounded-full",
                playerWon ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {playerWon ? "YOUR MONSTER" : "OPPONENT"}
              </span>
            </div>
            
            <div className={cn("text-lg font-semibold mb-3", getTypeColor(winner.type))}>
              {winner.type} Type • Level {winner.level}
            </div>
            
            <p className="mb-4">
              {playerWon 
                ? "Congratulations! Your monster emerged victorious in battle."
                : "Your monster fought valiantly but was defeated this time."}
            </p>
            
            <div className="flex gap-3 flex-wrap">
              {playerWon && (
                <Button
                  onClick={onLevelUp}
                  disabled={isLevelingUp}
                  className="bg-game-primary hover:bg-game-secondary text-white"
                >
                  {isLevelingUp ? "Training..." : (
                    <>
                      <ArrowUp className="w-4 h-4 mr-1" /> Level Up Monster
                    </>
                  )}
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={onViewMonster}
                className="border-game-primary/50 text-game-primary hover:bg-game-primary/10"
              >
                <Award className="w-4 h-4 mr-1" /> View Monster Details
              </Button>
              
              <Button
                variant="outline"
                onClick={onPlayAgain}
                className="border-game-secondary/50 text-game-secondary hover:bg-game-secondary/10"
              >
                <RotateCw className="w-4 h-4 mr-1" /> Battle Again
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Battle summary */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Battle Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold mb-2">Battle Outcome</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <img 
                  src={winner.image} 
                  alt={winner.name}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{winner.name}</p>
                <p className="text-sm text-gray-400">Level {winner.level} {winner.type}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden opacity-50">
                <img 
                  src={loser.image} 
                  alt={loser.name}
                  className="h-10 w-10 object-contain grayscale"
                />
              </div>
              <div className="flex-1 opacity-70">
                <p className="font-medium">{loser.name}</p>
                <p className="text-sm text-gray-400">Level {loser.level} {loser.type}</p>
              </div>
            </div>
            
            {playerWon && (
              <div className="p-3 bg-green-900/20 border border-green-700/30 rounded-md">
                <p className="text-green-400 text-sm">
                  <span className="font-bold">Reward: </span> 
                  You can level up your monster to increase its strength and prepare for tougher opponents.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-2">Key Battle Moments</h4>
            <div className="bg-black/20 rounded-md p-3 h-36 overflow-y-auto">
              {battleLogs.filter(log => (
                log.includes("super effective") || 
                log.includes("Critical hit") || 
                log.includes("victorious")
              )).map((log, i) => (
                <p key={i} className="text-sm mb-1">{log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
