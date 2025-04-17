
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AppHeader } from '@/components/AppHeader';
import { MonsterGrid } from '@/components/MonsterGrid';
import { MintMonster } from '@/components/MintMonster';
import { Pet, getUserPets, getConnectionState } from '@/lib/web3';
import { motion } from 'framer-motion';

const Monsters = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [monsters, setMonsters] = useState<Pet[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Check if wallet is connected and load monsters
  useEffect(() => {
    const connectionState = getConnectionState();
    setIsConnected(connectionState.isConnected);

    if (connectionState.isConnected) {
      loadUserMonsters();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserMonsters = async () => {
    setIsLoading(true);
    try {
      const pets = await getUserPets();
      setMonsters(pets);
    } catch (error) {
      console.error("Error loading monsters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-game-background bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1494&q=80')] bg-cover bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-gray-900/90 to-black/80 backdrop-blur-sm"></div>
      <AppHeader />

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-glow">My <span className="text-game-primary-bright">Monsters</span></h1>
            <p className="text-gray-300 mt-1 drop-shadow-md">
              Manage and train your monster collection
            </p>
          </div>

          {isConnected && <MintMonster onSuccess={loadUserMonsters} />}
        </motion.div>

        <div className="relative">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particle-lg particle-1"></div>
            <div className="particle-lg particle-2"></div>
            <div className="particle-lg particle-3"></div>
          </div>

          {/* Content with glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card rounded-xl p-6 border-gradient relative z-10"
          >
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-pulse-glow flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-game-primary to-game-secondary flex items-center justify-center mb-4 animate-spin">
                    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-game-primary to-game-secondary animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xl text-game-primary-bright">Loading your monsters...</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-game-primary/30 to-game-secondary/30 p-1 animate-pulse-slow">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-game-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl text-gray-300 mb-4">Connect your wallet to view your monsters</p>
                <div className="flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary-bright hover:to-game-secondary-bright text-white shadow-lg shadow-game-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-primary/30 hover:-translate-y-1"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            ) : monsters.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-game-primary/30 to-game-secondary/30 p-1 animate-pulse-slow">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-game-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl text-gray-300 mb-6">
                  You don't have any monsters yet. Mint your first one to get started!
                </p>
                <MintMonster onSuccess={loadUserMonsters} />
              </div>
            ) : (
              <MonsterGrid monsters={monsters} onLevelUp={loadUserMonsters} />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Monsters;
