
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pet } from '@/lib/web3';
import { useToast } from "@/hooks/use-toast";

interface BattleSimProps {
  userMonster: Pet | null;
  opponent: Pet | null;
  onBattleComplete?: (winner: Pet) => void;
}

export function BattleSim({ userMonster, opponent, onBattleComplete }: BattleSimProps) {
  const [isBattling, setIsBattling] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<Pet | null>(null);
  const { toast } = useToast();

  const startBattle = async () => {
    if (!userMonster || !opponent) return;
    
    setIsBattling(true);
    setBattleLog([]);
    setWinner(null);

    // Simulate battle with delays for dramatic effect
    await simulateBattle(userMonster, opponent);
  };

  const simulateBattle = async (monster1: Pet, monster2: Pet) => {
    // Calculate total stats
    const monster1TotalStats = Object.values(monster1.attributes).reduce((a, b) => a + b, 0);
    const monster2TotalStats = Object.values(monster2.attributes).reduce((a, b) => a + b, 0);
    
    // Add level influence
    const monster1Power = monster1TotalStats * (1 + monster1.level * 0.1);
    const monster2Power = monster2TotalStats * (1 + monster2.level * 0.1);
    
    // Add some randomness (±15%)
    const randomFactor1 = 0.85 + Math.random() * 0.3;
    const randomFactor2 = 0.85 + Math.random() * 0.3;
    
    const monster1FinalPower = monster1Power * randomFactor1;
    const monster2FinalPower = monster2Power * randomFactor2;
    
    // Simulate battle with log
    logBattle(`Battle begins: ${monster1.name} vs ${monster2.name}!`);
    await delay(1000);
    
    logBattle(`${monster1.name} (Level ${monster1.level}) prepares to attack!`);
    await delay(1500);
    
    logBattle(`${monster2.name} (Level ${monster2.level}) gets ready to counter!`);
    await delay(1500);
    
    logBattle(`${monster1.name} attacks with ${monster1.attributes.strength} strength!`);
    await delay(1000);
    
    logBattle(`${monster2.name} defends with ${monster2.attributes.stamina} stamina!`);
    await delay(1500);
    
    // More battle narration...
    if (monster1.attributes.speed > monster2.attributes.speed) {
      logBattle(`${monster1.name} moves quickly with ${monster1.attributes.speed} speed!`);
      await delay(1000);
    } else {
      logBattle(`${monster2.name} dodges with ${monster2.attributes.speed} speed!`);
      await delay(1000);
    }
    
    if (monster1.attributes.intelligence > monster2.attributes.intelligence) {
      logBattle(`${monster1.name} outsmarts ${monster2.name}!`);
      await delay(1000);
    } else {
      logBattle(`${monster2.name} uses clever tactics!`);
      await delay(1000);
    }
    
    // Final blow
    logBattle("The battle reaches its climax...");
    await delay(2000);
    
    // Determine winner
    let battleWinner: Pet;
    if (monster1FinalPower > monster2FinalPower) {
      battleWinner = monster1;
      logBattle(`${monster1.name} wins the battle!`);
    } else {
      battleWinner = monster2;
      logBattle(`${monster2.name} wins the battle!`);
    }
    
    setWinner(battleWinner);
    setIsBattling(false);
    
    if (onBattleComplete) {
      onBattleComplete(battleWinner);
    }
    
    // Show toast with result
    toast({
      title: "Battle Complete!",
      description: `${battleWinner.name} is victorious!`,
      variant: battleWinner.id === userMonster.id ? "default" : "destructive",
    });
  };
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const logBattle = (message: string) => {
    setBattleLog(prev => [...prev, message]);
  };
  
  if (!userMonster || !opponent) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-game-primary/30 rounded-lg">
        <p className="text-lg text-game-foreground/70">
          Select your monster and an opponent to battle
        </p>
      </div>
    );
  }

  return (
    <div className="bg-game-background border border-game-primary/30 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-game-primary">{userMonster.name}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="font-bold">{userMonster.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Strength:</span>
              <span className="font-bold">{userMonster.attributes.strength}</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-bold">{userMonster.attributes.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Intelligence:</span>
              <span className="font-bold">{userMonster.attributes.intelligence}</span>
            </div>
            <div className="flex justify-between">
              <span>Stamina:</span>
              <span className="font-bold">{userMonster.attributes.stamina}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-bold">{userMonster.type}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-game-accent">{opponent.name}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="font-bold">{opponent.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Strength:</span>
              <span className="font-bold">{opponent.attributes.strength}</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span className="font-bold">{opponent.attributes.speed}</span>
            </div>
            <div className="flex justify-between">
              <span>Intelligence:</span>
              <span className="font-bold">{opponent.attributes.intelligence}</span>
            </div>
            <div className="flex justify-between">
              <span>Stamina:</span>
              <span className="font-bold">{opponent.attributes.stamina}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-bold">{opponent.type}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Battle Log</h3>
        <div className="bg-black/30 rounded-lg p-4 h-40 overflow-y-auto">
          {battleLog.length > 0 ? (
            battleLog.map((log, index) => (
              <p key={index} className="mb-1 text-sm">
                {log}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">Battle not started yet</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={startBattle}
          disabled={isBattling || !userMonster || !opponent}
          className="bg-game-accent hover:bg-game-accent/90 text-white"
          size="lg"
        >
          {isBattling ? "Battle in Progress..." : "Start Battle"}
        </Button>
      </div>
      
      {winner && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            <span className={winner.id === userMonster.id ? "text-game-primary" : "text-game-accent"}>
              {winner.name}
            </span> is Victorious!
          </h3>
        </div>
      )}
    </div>
  );
}
