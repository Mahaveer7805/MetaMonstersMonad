
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Pet } from '@/lib/web3';
import { calculateBattlePower, calculateTypeEffectiveness, getTypeMove } from '@/lib/battle-utils';
import { Progress } from "@/components/ui/progress";
import { Shield, Zap, Brain, Heart, Award } from "lucide-react";
import { cn } from '@/lib/utils';

interface BattleSimulatorProps {
  userMonster: Pet;
  opponent: Pet;
  onBattleComplete: (winner: Pet, battleLog: string[]) => void;
}

export function BattleSimulator({ userMonster, opponent, onBattleComplete }: BattleSimulatorProps) {
  const [isBattling, setIsBattling] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [userHealth, setUserHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [battleEnded, setBattleEnded] = useState(false);
  const [attackEffect, setAttackEffect] = useState<string | null>(null);
  const [effectTarget, setEffectTarget] = useState<'user' | 'opponent' | null>(null);
  const [battleTimer, setBattleTimer] = useState<number>(60); // 60 seconds battle timer
  
  // Reset state when monsters change
  useEffect(() => {
    setBattleLog([]);
    setUserHealth(100);
    setOpponentHealth(100);
    setCurrentTurn(0);
    setBattleEnded(false);
    setIsBattling(false);
    setAttackEffect(null);
    setEffectTarget(null);
    setBattleTimer(60);
  }, [userMonster, opponent]);
  
  // Auto-start battle when component loads
  useEffect(() => {
    const timer = setTimeout(() => {
      startBattle();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Battle timer countdown
  useEffect(() => {
    if (!isBattling || battleEnded) return;
    
    const countdownTimer = setInterval(() => {
      setBattleTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // End battle if time runs out - winner is whoever has more health
          const winner = userHealth >= opponentHealth ? userMonster : opponent;
          endBattle(winner, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownTimer);
  }, [isBattling, battleEnded]);
  
  const startBattle = () => {
    setIsBattling(true);
    setBattleLog([]);
    setUserHealth(100);
    setOpponentHealth(100);
    setCurrentTurn(0);
    setBattleEnded(false);
    setBattleTimer(60);
    
    // Log battle start
    logBattle(`Battle begins: ${userMonster.name} vs ${opponent.name}!`);
    logBattle(`You have 60 seconds to complete this battle!`);
    
    // Start battle loop with a small delay
    setTimeout(() => {
      simulateBattleTurn();
    }, 500); // Reduced delay to speed up battle
  };
  
  const simulateBattleTurn = () => {
    if (battleEnded) return;
    
    const attacker = currentTurn % 2 === 0 ? userMonster : opponent;
    const defender = currentTurn % 2 === 0 ? opponent : userMonster;
    
    // Calculate base damage using monster stats
    const attackerPower = calculateBattlePower(attacker);
    const defenderPower = calculateBattlePower(defender);
    
    // Add type advantage/disadvantage
    const typeModifier = calculateTypeEffectiveness(attacker.type, defender.type);
    
    // Calculate move effectiveness (random element)
    const effectiveness = 0.8 + Math.random() * 0.4; // 80% to 120% effectiveness
    
    // Calculate final damage
    let rawDamage = attackerPower * effectiveness * typeModifier;
    
    // Adjust by level difference
    const levelDiff = attacker.level - defender.level;
    if (levelDiff > 0) {
      rawDamage *= (1 + levelDiff * 0.05); // 5% more damage per level advantage
    }
    
    // Randomize for excitement
    const damage = Math.max(1, Math.floor(rawDamage));
    
    // Get a random move based on attacker's type
    const move = getTypeMove(attacker.type);
    
    // Show attack effect
    setAttackEffect(attacker.type.toLowerCase());
    setEffectTarget(currentTurn % 2 === 0 ? 'opponent' : 'user');
    
    // Clear attack effect after animation
    setTimeout(() => {
      setAttackEffect(null);
      setEffectTarget(null);
    }, 300); // Reduced effect duration to speed up battle
    
    // Update health
    if (currentTurn % 2 === 0) {
      // Player attacking opponent
      const newHealth = Math.max(0, opponentHealth - damage);
      setOpponentHealth(newHealth);
      logBattle(`${attacker.name} attacks with ${move}! Deals ${damage} damage.`);
      
      if (typeModifier > 1) {
        logBattle("It's super effective!");
      } else if (typeModifier < 1) {
        logBattle("It's not very effective...");
      }
      
      if (effectiveness > 1.1) {
        logBattle("Critical hit!");
      }
      
      if (newHealth <= 0) {
        endBattle(userMonster);
        return;
      }
    } else {
      // Opponent attacking player
      const newHealth = Math.max(0, userHealth - damage);
      setUserHealth(newHealth);
      logBattle(`${attacker.name} attacks with ${move}! Deals ${damage} damage.`);
      
      if (typeModifier > 1) {
        logBattle("It's super effective!");
      } else if (typeModifier < 1) {
        logBattle("It's not very effective...");
      }
      
      if (effectiveness > 1.1) {
        logBattle("Critical hit!");
      }
      
      if (newHealth <= 0) {
        endBattle(opponent);
        return;
      }
    }
    
    // Next turn
    setCurrentTurn(currentTurn + 1);
    
    // Continue battle with delay - reduced for faster battles
    setTimeout(() => {
      simulateBattleTurn();
    }, 1000); // Reduced from 2000ms to 1000ms to speed up battle
  };
  
  const endBattle = (winner: Pet, timeUp = false) => {
    setBattleEnded(true);
    
    if (timeUp) {
      logBattle(`Time's up! ${winner.name} is victorious with more remaining health!`);
    } else {
      logBattle(`${winner.name} is victorious!`);
    }
    
    // Delay to show final message before completing
    setTimeout(() => {
      setIsBattling(false);
      onBattleComplete(winner, battleLog);
    }, 1000); // Reduced from 2000ms to 1000ms for faster completion
  };
  
  const logBattle = (message: string) => {
    setBattleLog(prev => [...prev, message]);
    
    // Auto-scroll battle log to bottom
    setTimeout(() => {
      const battleLogElement = document.getElementById('battle-log');
      if (battleLogElement) {
        battleLogElement.scrollTop = battleLogElement.scrollHeight;
      }
    }, 50); // Reduced from 100ms to 50ms for smoother updates
  };
  
  // Get type-specific colors
  const getTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      "Fire": "bg-monster-fire text-white",
      "Water": "bg-monster-water text-white",
      "Earth": "bg-monster-earth text-white",
      "Air": "bg-monster-air text-white",
      "Electric": "bg-monster-electric text-white"
    };
    
    return typeMap[type] || "bg-purple-600 text-white";
  };
  
  const getTypeGlowClass = (type: string) => {
    const typeMap: Record<string, string> = {
      "Fire": "shadow-glow-fire",
      "Water": "shadow-glow-water",
      "Earth": "shadow-glow-earth",
      "Air": "shadow-glow-air",
      "Electric": "shadow-glow-electric"
    };
    
    return typeMap[type] || "";
  };
  
  const getAttackEffectClass = (type: string | null) => {
    if (!type) return "";
    
    const effectMap: Record<string, string> = {
      "fire": "battle-effect-fire",
      "water": "battle-effect-water",
      "earth": "battle-effect-earth",
      "air": "battle-effect-air",
      "electric": "battle-effect-electric"
    };
    
    return effectMap[type] || "";
  };
  
  return (
    <div className="space-y-6">
      {/* Battle timer */}
      <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
        <div 
          className={cn(
            "h-2.5 rounded-full transition-all duration-1000", 
            battleTimer > 30 ? "bg-green-500" : battleTimer > 10 ? "bg-yellow-500" : "bg-red-500 animate-pulse"
          )}
          style={{ width: `${(battleTimer / 60) * 100}%` }}
        ></div>
        <div className="text-center mt-1 text-sm">
          Time remaining: {battleTimer}s
        </div>
      </div>
      
      {/* Battle arena */}
      <div className="relative h-80 bg-gray-800/50 rounded-lg overflow-hidden">
        {/* Battle background elements */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1589&q=80')] bg-cover bg-center opacity-40"></div>
        
        {/* Battle effect overlay */}
        {attackEffect && effectTarget && (
          <div className={`absolute inset-0 ${getAttackEffectClass(attackEffect)} z-10`}></div>
        )}
        
        {/* Monster positions */}
        <div className="relative h-full flex items-center justify-between px-10">
          {/* Player monster */}
          <div className={`relative transition-all duration-300 ${effectTarget === 'user' ? 'animate-monster-hit' : ''} ${currentTurn % 2 === 0 && isBattling ? 'animate-battle-attack' : ''}`}>
            <div className={cn("absolute inset-0 rounded-full filter blur-xl opacity-30", getTypeGlowClass(userMonster.type))}></div>
            <img 
              src={userMonster.image} 
              alt={userMonster.name}
              className={cn("h-40 object-contain z-10 relative", userHealth <= 30 ? "animate-monster-low-health" : "animate-monster-float")}
            />
            <div className="mt-2 relative z-10">
              <p className="text-sm font-medium text-center text-white">{userMonster.name}</p>
              <div className="w-32 bg-gray-700/70 rounded-full h-2.5 mt-1 overflow-hidden">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${userHealth}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1 text-white/80">{userHealth}/100</p>
            </div>
          </div>
          
          {/* VS */}
          <div className={`text-2xl font-bold text-game-accent ${isBattling ? 'animate-pulse' : ''} relative z-10`}>
            VS
          </div>
          
          {/* Opponent monster */}
          <div className={`relative transition-all duration-300 ${effectTarget === 'opponent' ? 'animate-monster-hit' : ''} ${currentTurn % 2 !== 0 && isBattling ? 'animate-battle-attack' : ''}`}>
            <div className={cn("absolute inset-0 rounded-full filter blur-xl opacity-30", getTypeGlowClass(opponent.type))}></div>
            <img 
              src={opponent.image} 
              alt={opponent.name}
              className={cn("h-40 object-contain z-10 relative", opponentHealth <= 30 ? "animate-monster-low-health" : "animate-monster-float")}
            />
            <div className="mt-2 relative z-10">
              <p className="text-sm font-medium text-center text-white">{opponent.name}</p>
              <div className="w-32 bg-gray-700/70 rounded-full h-2.5 mt-1 overflow-hidden">
                <div 
                  className="bg-red-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${opponentHealth}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1 text-white/80">{opponentHealth}/100</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:border-game-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{userMonster.name}</h3>
            <span className={cn("px-2 py-0.5 text-xs rounded-full", getTypeColor(userMonster.type))}>
              {userMonster.type} Type
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-red-400" />
                <span className="text-sm">Strength: {userMonster.attributes.strength}</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                <span className="text-sm">Speed: {userMonster.attributes.speed}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-blue-400" />
                <span className="text-sm">Intelligence: {userMonster.attributes.intelligence}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-sm">Stamina: {userMonster.attributes.stamina}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center">
            <Award className="h-4 w-4 mr-1 text-purple-400" />
            <span className="text-sm">Battle Power: {calculateBattlePower(userMonster).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:border-game-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">{opponent.name}</h3>
            <span className={cn("px-2 py-0.5 text-xs rounded-full", getTypeColor(opponent.type))}>
              {opponent.type} Type
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-red-400" />
                <span className="text-sm">Strength: {opponent.attributes.strength}</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                <span className="text-sm">Speed: {opponent.attributes.speed}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-blue-400" />
                <span className="text-sm">Intelligence: {opponent.attributes.intelligence}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-green-400" />
                <span className="text-sm">Stamina: {opponent.attributes.stamina}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center">
            <Award className="h-4 w-4 mr-1 text-purple-400" />
            <span className="text-sm">Battle Power: {calculateBattlePower(opponent).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Battle log */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Battle Log</h3>
        <div id="battle-log" className="bg-black/50 backdrop-blur-sm rounded-lg p-4 h-40 overflow-y-auto border border-white/10">
          {battleLog.length > 0 ? (
            battleLog.map((log, index) => (
              <p key={index} className={`mb-1 text-sm ${index === battleLog.length - 1 ? 'text-game-accent animate-fade-in' : 'text-white/80'}`}>
                {log}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Battle not started yet</p>
          )}
        </div>
      </div>
      
      {/* Battle controls */}
      <div className="flex justify-center">
        <Button 
          onClick={startBattle}
          disabled={isBattling}
          className="bg-game-accent hover:bg-game-accent/90 text-white transition-transform hover:scale-105 active:scale-95"
          size="lg"
        >
          {isBattling ? "Battle in Progress..." : "Start Battle"}
        </Button>
      </div>
    </div>
  );
}
