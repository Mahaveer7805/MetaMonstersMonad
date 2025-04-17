
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from '@/components/AppHeader';
import { getPet, levelUpPet, Pet, getConnectionState } from '@/lib/web3';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const MonsterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [monster, setMonster] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const loadMonster = async () => {
      setIsLoading(true);
      try {
        const monsterData = await getPet(Number(id));
        setMonster(monsterData);

        // Check if connected wallet is the owner
        const connectionState = getConnectionState();
        if (monsterData && connectionState.isConnected &&
            monsterData.owner.toLowerCase() === connectionState.address.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error("Error loading monster:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonster();
  }, [id]);

  const handleLevelUp = async () => {
    if (!monster || !isOwner) return;

    setIsLevelingUp(true);
    try {
      const success = await levelUpPet(monster.id);
      if (success) {
        // Refresh monster data
        const updatedMonster = await getPet(monster.id);
        setMonster(updatedMonster);
      }
    } finally {
      setIsLevelingUp(false);
    }
  };

  const handleBattleClick = () => {
    if (!monster) return;

    // Store the selected monster ID in localStorage
    localStorage.setItem('selectedMonsterId', monster.id.toString());

    // Navigate to the battle arena
    navigate('/battle');

    // Show a success message
    toast.info(`${monster.name} selected for battle!`);
  };

  // Get type-specific color classes
  const getTypeBgColor = () => {
    if (!monster) return "bg-monster-fire";

    const typeMap = {
      "Fire": "bg-monster-fire",
      "Water": "bg-monster-water",
      "Earth": "bg-monster-earth",
      "Air": "bg-monster-air",
      "Electric": "bg-monster-electric"
    };

    return typeMap[monster.type as keyof typeof typeMap] || "bg-monster-fire";
  };

  const getTypeBorderColor = () => {
    if (!monster) return "border-monster-fire";

    const typeMap = {
      "Fire": "border-monster-fire",
      "Water": "border-monster-water",
      "Earth": "border-monster-earth",
      "Air": "border-monster-air",
      "Electric": "border-monster-electric"
    };

    return typeMap[monster.type as keyof typeof typeMap] || "border-monster-fire";
  };

  return (
    <div className="min-h-screen flex flex-col bg-game-background">
      <AppHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-6 border-game-secondary text-game-secondary hover:bg-game-secondary/10">
          <Link to="/monsters">← Back to Monsters</Link>
        </Button>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse-glow">
              <p className="text-xl text-game-primary">Loading monster details...</p>
            </div>
          </div>
        ) : !monster ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">Monster not found</p>
            <Button asChild className="mt-6 bg-game-primary hover:bg-game-secondary text-white">
              <Link to="/monsters">Back to My Monsters</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Monster Image Card */}
            <div className={cn(
              "monster-card lg:col-span-1 border-2",
              getTypeBorderColor()
            )}>
              <div className={cn("h-80 flex items-center justify-center", getTypeBgColor())}>
                <div className="animate-float">
                  <img
                    src={monster.image || `/monsters/default.png`}
                    alt={monster.name}
                    className="h-64 object-contain"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <Badge className={cn(
                  "mb-3",
                  `bg-monster-${monster.type.toLowerCase()} text-white`
                )}>
                  {monster.type} Type
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{monster.name}</h1>
                <p className="text-xl mb-4">Level {monster.level}</p>

                {isOwner && (
                  <Button
                    onClick={handleLevelUp}
                    disabled={isLevelingUp}
                    className={cn(
                      "w-full mt-2",
                      getTypeBgColor(),
                      "hover:opacity-90 text-white"
                    )}
                  >
                    {isLevelingUp ? "Training..." : "Train Monster"}
                  </Button>
                )}
              </div>
            </div>

            {/* Monster Stats and Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-800/30 rounded-lg p-6 border border-game-primary/20">
                <h2 className="text-2xl font-bold mb-4 text-game-primary">Monster Stats</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Strength</span>
                      <span className="font-bold">{monster.attributes.strength}</span>
                    </div>
                    <Progress value={monster.attributes.strength} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Speed</span>
                      <span className="font-bold">{monster.attributes.speed}</span>
                    </div>
                    <Progress value={monster.attributes.speed} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Intelligence</span>
                      <span className="font-bold">{monster.attributes.intelligence}</span>
                    </div>
                    <Progress value={monster.attributes.intelligence} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Stamina</span>
                      <span className="font-bold">{monster.attributes.stamina}</span>
                    </div>
                    <Progress value={monster.attributes.stamina} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-6 border border-game-primary/20">
                <h2 className="text-2xl font-bold mb-4 text-game-secondary">Monster Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">ID</span>
                        <span>#{monster.id}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Type</span>
                        <span>{monster.type}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Evolution</span>
                        <span>Stage {monster.level > 5 ? 2 : 1}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">DNA</span>
                        <span className="font-mono text-sm">
                          {monster.dna.toString(16).toUpperCase().padStart(8, '0')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Ownership</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Owner</span>
                        <span className="font-mono text-sm">
                          {monster.owner.slice(0, 6)}...{monster.owner.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">You own this</span>
                        <span>
                          {isOwner ? (
                            <span className="text-green-400">Yes</span>
                          ) : (
                            <span className="text-red-400">No</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Transferable</span>
                        <span>Yes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-6 border border-game-primary/20">
                <h2 className="text-2xl font-bold mb-4 text-game-accent">Actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleBattleClick}
                    variant="outline"
                    className="border-game-primary text-game-primary hover:bg-game-primary/10"
                  >
                    Battle With This Monster
                  </Button>

                  {isOwner && (
                    <Button
                      onClick={handleLevelUp}
                      disabled={isLevelingUp}
                      className="bg-game-primary hover:bg-game-secondary text-white"
                    >
                      {isLevelingUp ? "Training..." : "Train Monster"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MonsterDetail;
