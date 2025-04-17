
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pet, levelUpPet } from '@/lib/web3';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Brain, Heart } from "lucide-react";
import { toast } from "sonner";

interface MonsterCardProps {
  monster: Pet;
  onLevelUp?: () => void;
  showActions?: boolean;
}

export function MonsterCard({ monster, onLevelUp, showActions = true }: MonsterCardProps) {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLevelUp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLevelingUp(true);
    
    try {
      const success = await levelUpPet(monster.id);
      if (success && onLevelUp) {
        onLevelUp();
        toast.success(`${monster.name} leveled up successfully!`);
      }
    } catch (error) {
      toast.error("Failed to level up monster");
    } finally {
      setIsLevelingUp(false);
    }
  };

  const handleClick = () => {
    navigate(`/monsters/${monster.id}`);
  };

  const handleBattleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('selectedMonsterId', monster.id.toString());
    navigate('/battle');
    toast.info(`${monster.name} selected for battle!`);
  };

  // Get type-specific color class
  const getTypeColor = () => {
    const typeMap = {
      "Fire": "monster-fire",
      "Water": "monster-water",
      "Earth": "monster-earth",
      "Air": "monster-air",
      "Electric": "monster-electric"
    };
    
    return typeMap[monster.type as keyof typeof typeMap] || "monster-fire";
  };

  const getTypeBgColor = () => {
    const typeMap = {
      "Fire": "bg-monster-fire",
      "Water": "bg-monster-water",
      "Earth": "bg-monster-earth",
      "Air": "bg-monster-air",
      "Electric": "bg-monster-electric"
    };
    
    return typeMap[monster.type as keyof typeof typeMap] || "bg-monster-fire";
  };

  const getTypeTextColor = () => {
    const typeMap = {
      "Fire": "text-monster-fire",
      "Water": "text-monster-water",
      "Earth": "text-monster-earth",
      "Air": "text-monster-air",
      "Electric": "text-monster-electric"
    };
    
    return typeMap[monster.type as keyof typeof typeMap] || "text-monster-fire";
  };

  const getTypeBorderColor = () => {
    const typeMap = {
      "Fire": "border-monster-fire",
      "Water": "border-monster-water",
      "Earth": "border-monster-earth",
      "Air": "border-monster-air",
      "Electric": "border-monster-electric"
    };
    
    return typeMap[monster.type as keyof typeof typeMap] || "border-monster-fire";
  };
  
  const getTypeGlowClass = () => {
    const typeMap = {
      "Fire": "shadow-glow-fire",
      "Water": "shadow-glow-water",
      "Earth": "shadow-glow-earth",
      "Air": "shadow-glow-air",
      "Electric": "shadow-glow-electric"
    };
    
    return typeMap[monster.type as keyof typeof typeMap] || "shadow-glow-fire";
  };

  return (
    <Card 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "monster-card cursor-pointer overflow-hidden border-2 transition-all duration-300",
        isHovered ? "transform scale-105" : "",
        getTypeBorderColor(),
        "hover:shadow-lg hover:shadow-game-primary/20"
      )}
    >
      <div className="relative">
        <div className={cn(
          "h-40 flex items-center justify-center relative overflow-hidden", 
          getTypeBgColor(),
          "transition-all duration-500"
        )}>
          {isHovered && (
            <div className="absolute inset-0 bg-black/10 z-10"></div>
          )}
          <div className={cn(
            "transition-all duration-300 z-20",
            isHovered ? "scale-110 shadow-xl" : "",
            "animate-float"
          )}>
            <img 
              src={monster.image || `/monsters/default.png`} 
              alt={monster.name}
              className={cn(
                "h-32 object-contain transition-all duration-500",
                isHovered && getTypeGlowClass()
              )}
            />
          </div>
          
          {/* Background effect particles */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        </div>
        
        <Badge 
          className={cn(
            "absolute top-2 right-2 transition-all duration-300",
            `bg-monster-${monster.type.toLowerCase()} text-white`,
            isHovered ? "scale-110" : ""
          )}
        >
          {monster.type}
        </Badge>
        
        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded-md backdrop-blur-sm">
          <span className="text-white text-xs font-bold">LVL {monster.level}</span>
        </div>
      </div>
      
      <CardContent className={cn(
        "pt-4 transition-all duration-300",
        isHovered ? "bg-gray-900/50" : ""
      )}>
        <div className="mb-4">
          <h3 className={cn(
            "font-bold text-xl mb-1 transition-all duration-300",
            isHovered ? getTypeTextColor() : ""
          )}>{monster.name}</h3>
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <p className="text-gray-400 mb-1 flex items-center gap-1">
                <Shield className="h-3 w-3 text-red-400" /> Strength
              </p>
              <Progress 
                value={monster.attributes.strength} 
                className="h-1.5"
                indicatorClassName={cn(getTypeBgColor(), "transition-all duration-1000")}
              />
            </div>
            <div>
              <p className="text-gray-400 mb-1 flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-400" /> Speed
              </p>
              <Progress 
                value={monster.attributes.speed} 
                className="h-1.5"
                indicatorClassName={cn(getTypeBgColor(), "transition-all duration-1000")}
              />
            </div>
            <div>
              <p className="text-gray-400 mb-1 flex items-center gap-1">
                <Brain className="h-3 w-3 text-blue-400" /> Intelligence
              </p>
              <Progress 
                value={monster.attributes.intelligence} 
                className="h-1.5"
                indicatorClassName={cn(getTypeBgColor(), "transition-all duration-1000")}
              />
            </div>
            <div>
              <p className="text-gray-400 mb-1 flex items-center gap-1">
                <Heart className="h-3 w-3 text-green-400" /> Stamina
              </p>
              <Progress 
                value={monster.attributes.stamina} 
                className="h-1.5"
                indicatorClassName={cn(getTypeBgColor(), "transition-all duration-1000")}
              />
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col gap-2 mt-2">
            <Button 
              onClick={handleLevelUp}
              disabled={isLevelingUp}
              className={cn(
                "w-full",
                getTypeBgColor(),
                "hover:opacity-90 text-white transition-transform hover:scale-105 active:scale-95"
              )}
            >
              {isLevelingUp ? "Training..." : "Train Monster"}
            </Button>
            
            <Button 
              onClick={handleBattleClick}
              className="w-full bg-game-primary hover:bg-game-secondary text-white transition-transform hover:scale-105 active:scale-95"
              variant="secondary"
            >
              Battle With This Monster
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
