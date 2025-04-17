
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AppHeader } from '@/components/AppHeader';
import { MonsterCard } from '@/components/MonsterCard';
import { BattleSimulator } from '@/components/BattleSimulator';
import { BattleResults } from '@/components/BattleResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pet, getUserPets, getConnectionState, levelUpPet } from '@/lib/web3';
import { calculateBattlePower } from '@/lib/battle-utils';
import { toast } from "sonner";
import { Loader2, Swords, Trophy, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getRandomOpponent, opponentMonsters } from '@/lib/monster-utils';

// Game states for the battle flow
enum GameState {
  SELECT_MONSTER,
  BATTLE,
  RESULTS,
}

const BattleArena = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(GameState.SELECT_MONSTER);
  const [isLoading, setIsLoading] = useState(true);
  const [myMonsters, setMyMonsters] = useState<Pet[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<Pet | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<Pet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    winner: Pet | null;
    loser: Pet | null;
    logs: string[];
    playerWon: boolean;
  } | null>(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  
  // Initialize data
  useEffect(() => {
    const connectionState = getConnectionState();
    setIsConnected(connectionState.isConnected);
    
    if (connectionState.isConnected) {
      loadBattleData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Check for monster pre-selection from the Monsters page
  useEffect(() => {
    const preSelectedId = localStorage.getItem('selectedMonsterId');
    if (preSelectedId && myMonsters.length > 0) {
      const monster = myMonsters.find(m => m.id.toString() === preSelectedId);
      if (monster) {
        handleMonsterSelect(monster);
        // Auto start battle if coming from monster selection
        setTimeout(() => {
          startBattle();
        }, 500);
        localStorage.removeItem('selectedMonsterId');
      }
    }
  }, [myMonsters]);
  
  const loadBattleData = async () => {
    setIsLoading(true);
    try {
      // Load user's monsters
      const userPets = await getUserPets();
      setMyMonsters(userPets);
    } catch (error) {
      console.error("Error loading battle data:", error);
      toast.error("Failed to load battle data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMonsterSelect = (monster: Pet) => {
    setSelectedMonster(monster);
    
    // Add visual indication of selection
    document.querySelectorAll('.monster-selection').forEach(el => {
      el.classList.remove('scale-105', 'ring-2', 'ring-game-primary');
    });
    
    // Find the element and add selection class
    const selectedElement = document.getElementById(`monster-${monster.id}`);
    if (selectedElement) {
      selectedElement.classList.add('scale-105', 'ring-2', 'ring-game-primary');
    }
    
    toast.success(`${monster.name} selected for battle!`);
  };
  
  const startBattle = () => {
    if (!selectedMonster) {
      toast.error("Please select a monster first");
      return;
    }
    
    // Get an appropriate opponent based on player's monster level
    const opponent = getRandomOpponent(selectedMonster.level);
    setSelectedOpponent(opponent);
    
    // Move to battle state with animation
    document.querySelector('.game-container')?.classList.add('animate-fade-out');
    setTimeout(() => {
      setGameState(GameState.BATTLE);
      setTimeout(() => {
        document.querySelector('.battle-container')?.classList.add('animate-fade-in');
      }, 100);
    }, 300);
    
    // Show toast with opponent info
    toast.info(`You're battling against ${opponent.name}!`, {
      description: opponent.description
    });
  };
  
  const handleBattleComplete = async (winner: Pet, logs: string[]) => {
    const playerWon = winner.id === selectedMonster?.id;
    
    setBattleResult({
      winner,
      loser: playerWon ? selectedOpponent : selectedMonster,
      logs,
      playerWon
    });
    
    document.querySelector('.battle-container')?.classList.add('animate-fade-out');
    setTimeout(() => {
      setGameState(GameState.RESULTS);
      setTimeout(() => {
        document.querySelector('.results-container')?.classList.add('animate-fade-in');
      }, 100);
    }, 300);
    
    // If player won, show celebration and option to level up
    if (playerWon) {
      toast.success(`${winner.name} won the battle!`);
    } else {
      toast.error(`${winner.name} defeated your monster!`);
    }
  };
  
  const handleLevelUp = async () => {
    if (!selectedMonster || isLevelingUp) return;
    
    setIsLevelingUp(true);
    try {
      const success = await levelUpPet(selectedMonster.id);
      if (success) {
        toast.success(`${selectedMonster.name} leveled up!`);
        // Reload monsters data to reflect the level up
        await loadBattleData();
      }
    } catch (error) {
      console.error("Error leveling up:", error);
      toast.error("Failed to level up your monster");
    } finally {
      setIsLevelingUp(false);
    }
  };
  
  const resetGame = () => {
    document.querySelector('.results-container')?.classList.add('animate-fade-out');
    setTimeout(() => {
      setGameState(GameState.SELECT_MONSTER);
      setSelectedOpponent(null);
      setBattleResult(null);
      
      // Reset selection visual indicators
      document.querySelectorAll('.monster-selection').forEach(el => {
        el.classList.remove('scale-105', 'ring-2', 'ring-game-primary');
      });
      
      setTimeout(() => {
        document.querySelector('.game-container')?.classList.add('animate-fade-in');
      }, 100);
    }, 300);
  };
  
  const viewMonsterDetails = (monsterId: number) => {
    navigate(`/monsters/${monsterId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-game-background bg-[url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1589&q=80')] bg-cover bg-fixed">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <AppHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-game-foreground animate-fade-in">Battle Arena</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse-glow flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-game-primary mb-4" />
              <p className="text-xl text-game-primary">Loading battle arena...</p>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-gray-400 mb-4">Connect your wallet to enter the battle arena</p>
          </div>
        ) : myMonsters.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-gray-400 mb-4">You don't have any monsters to battle with</p>
            <Button asChild className="bg-game-primary hover:bg-game-secondary text-white transition-transform hover:scale-105 active:scale-95">
              <a href="/monsters">Mint Your First Monster</a>
            </Button>
          </div>
        ) : (
          <div className="bg-gray-900/60 border border-game-primary/30 rounded-lg p-6 mb-8 backdrop-blur-md animate-fade-in">
            {/* Game State UI */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-game-primary">
                {gameState === GameState.SELECT_MONSTER && "Select Your Monster"}
                {gameState === GameState.BATTLE && "Battle In Progress"}
                {gameState === GameState.RESULTS && "Battle Results"}
              </h2>
              
              {/* Game progress indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${gameState >= GameState.SELECT_MONSTER ? 'bg-game-primary' : 'bg-gray-600'}`}></div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${gameState >= GameState.BATTLE ? 'bg-game-primary' : 'bg-gray-600'}`}></div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${gameState >= GameState.RESULTS ? 'bg-game-primary' : 'bg-gray-600'}`}></div>
              </div>
            </div>
            
            {/* Game content based on state */}
            {gameState === GameState.SELECT_MONSTER && (
              <div className="space-y-6 game-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {myMonsters.map((monster) => (
                    <div 
                      key={monster.id}
                      id={`monster-${monster.id}`}
                      className={`monster-selection cursor-pointer transition-all duration-300 rounded-lg ${
                        selectedMonster?.id === monster.id ? 'scale-105 ring-2 ring-game-primary' : ''
                      }`}
                      onClick={() => handleMonsterSelect(monster)}
                    >
                      <MonsterCard 
                        monster={monster}
                        showActions={false}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    size="lg"
                    onClick={startBattle}
                    disabled={!selectedMonster}
                    className="bg-game-primary hover:bg-game-secondary text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-game-primary/20"
                  >
                    <Swords className="w-5 h-5 mr-2" />
                    Enter Battle Arena
                  </Button>
                </div>
              </div>
            )}
            
            {gameState === GameState.BATTLE && selectedMonster && selectedOpponent && (
              <div className="battle-container">
                <BattleSimulator
                  userMonster={selectedMonster}
                  opponent={selectedOpponent}
                  onBattleComplete={handleBattleComplete}
                />
              </div>
            )}
            
            {gameState === GameState.RESULTS && battleResult && (
              <div className="results-container">
                <BattleResults
                  winner={battleResult.winner}
                  loser={battleResult.loser}
                  battleLogs={battleResult.logs}
                  playerWon={battleResult.playerWon}
                  onLevelUp={handleLevelUp}
                  isLevelingUp={isLevelingUp}
                  onViewMonster={() => viewMonsterDetails(battleResult.winner?.id || 0)}
                  onPlayAgain={resetGame}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Available Opponents and Leaderboard */}
        {isConnected && myMonsters.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <Tabs defaultValue="opponents" className="battle-arena-tabs">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 backdrop-blur-sm">
                <TabsTrigger value="opponents" className="data-[state=active]:bg-game-primary">Available Opponents</TabsTrigger>
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-game-primary">Monster Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="opponents" className="bg-gray-900/60 border border-game-primary/30 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Shield className="text-red-400 mr-2" />
                  <h3 className="text-xl font-semibold">Available Opponents</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {opponentMonsters.slice(0, 6).map((opponent) => (
                    <div key={opponent.id} className="relative group">
                      <MonsterCard 
                        monster={opponent}
                        showActions={false}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                        <p className="text-white px-4 py-2 text-center">
                          {opponent.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="leaderboard" className="bg-gray-900/60 border border-game-primary/30 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Trophy className="text-yellow-500 mr-2" />
                  <h3 className="text-xl font-semibold">Monster Stats</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">Monster</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Level</th>
                        <th className="text-left py-3 px-4">Battle Power</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...myMonsters, ...opponentMonsters.slice(0, 5)]
                        .sort((a, b) => {
                          const powerA = calculateBattlePower(a);
                          const powerB = calculateBattlePower(b);
                          return powerB - powerA;
                        })
                        .slice(0, 10)
                        .map((monster, index) => (
                          <tr key={monster.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 flex items-center">
                              <div className="w-8 h-8 mr-2 overflow-hidden rounded-full bg-gray-700">
                                <img 
                                  src={monster.image} 
                                  alt={monster.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {monster.name}
                              {monster.id > 0 && (
                                <span className="ml-2 text-xs bg-game-primary/20 text-game-primary px-1.5 py-0.5 rounded">Yours</span>
                              )}
                            </td>
                            <td className="py-3 px-4">{monster.type}</td>
                            <td className="py-3 px-4">{monster.level}</td>
                            <td className="py-3 px-4">{calculateBattlePower(monster).toFixed(2)}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default BattleArena;
