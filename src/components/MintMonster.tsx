
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mintPet } from '@/lib/web3';
import { generateRandomDNA } from '@/lib/monster-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { toast } from "sonner";

interface MintMonsterProps {
  onSuccess?: () => void;
}

interface MonsterTypeInfo {
  type: string;
  price: string;
  color: string;
  textColor: string;
}

export function MintMonster({ onSuccess }: MintMonsterProps) {
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Random");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleMint = async () => {
    if (!name.trim()) return;

    setIsMinting(true);
    try {
      const dna = generateRandomDNA(selectedType);
      const txHash = await mintPet(name, dna);

      if (txHash) {
        setName("");
        setIsDialogOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setIsMinting(false);
    }
  };

  const monsterTypes: MonsterTypeInfo[] = [
    { type: "Random", price: "0.01", color: "bg-gray-700", textColor: "text-white" },
    { type: "Fire", price: "0.015", color: "bg-monster-fire", textColor: "text-white" },
    { type: "Water", price: "0.012", color: "bg-monster-water", textColor: "text-white" },
    { type: "Earth", price: "0.018", color: "bg-monster-earth", textColor: "text-white" },
    { type: "Air", price: "0.02", color: "bg-monster-air", textColor: "text-gray-800" },
    { type: "Electric", price: "0.025", color: "bg-monster-electric", textColor: "text-gray-800" }
  ];

  // Animation for particles
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, color: string, delay: number}[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      // Generate random particles when dialog opens
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 8,
        color: [
          'rgba(168, 85, 247, 0.4)',  // Purple
          'rgba(217, 70, 239, 0.4)',   // Pink
          'rgba(139, 92, 246, 0.4)',   // Violet
          'rgba(124, 58, 237, 0.4)',   // Indigo
          'rgba(236, 72, 153, 0.4)',   // Rose
        ][Math.floor(Math.random() * 5)],
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary-bright hover:to-game-secondary-bright text-white shadow-lg shadow-game-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-primary/30 hover:-translate-y-1">
          Mint New Monster
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/95 border-2 border-game-primary/50 backdrop-blur-xl rounded-xl overflow-hidden p-0 max-w-md">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                delay: particle.delay,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}
        </div>

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-game-primary to-game-secondary p-6 relative">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-md">Mint New Monster</DialogTitle>
            <DialogDescription className="text-white/80 mt-2">
              Create your unique monster with a name and select its type.
            </DialogDescription>
          </DialogHeader>

          {/* Decorative elements */}
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-gray-900/95 clip-path-wave"></div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <Label htmlFor="name" className="text-white text-lg font-medium">Monster Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter monster name"
              className="bg-gray-800/80 border-2 border-game-primary/30 text-white h-12 text-lg rounded-lg focus:border-game-primary focus:ring-game-primary/50 transition-all duration-300 placeholder:text-gray-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-3"
          >
            <Label className="text-white text-lg font-medium">Select Monster Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {monsterTypes.map((monsterType, index) => (
                <motion.div
                  key={monsterType.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className={`
                      w-full h-full py-3 px-2
                      ${selectedType === monsterType.type ?
                        `${monsterType.color} ${monsterType.textColor} border-2 border-white shadow-lg shadow-${monsterType.color}/30 scale-105` :
                        `bg-gray-800/50 border-2 border-game-primary/30 text-white hover:border-game-primary/70 hover:bg-gray-800/80`}
                      relative overflow-hidden transition-all duration-300 rounded-lg
                    `}
                    onClick={() => setSelectedType(monsterType.type)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-bold">{monsterType.type}</span>
                      <Badge variant="outline" className="mt-1 bg-black/30 backdrop-blur-sm border border-white/20 text-inherit font-mono">
                        {monsterType.price} MONAD
                      </Badge>
                    </div>

                    {/* Particle effect on selected */}
                    {selectedType === monsterType.type && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                      </div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2 italic">
              Selecting a type increases the chance of getting that type, but doesn't guarantee it.
              Different monster types have different minting prices.
            </p>
          </motion.div>
        </div>

        <div className="bg-gray-800/50 p-6 flex justify-between items-center border-t border-white/10">
          <div className="text-white">
            <span className="font-medium">Price: </span>
            <span className="text-game-accent-bright text-xl font-bold">
              {monsterTypes.find(t => t.type === selectedType)?.price || "0.01"} MONAD
            </span>
          </div>
          <Button
            onClick={handleMint}
            disabled={!name.trim() || isMinting}
            className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary-bright hover:to-game-secondary-bright text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-game-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-game-primary/30 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isMinting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                <span>Minting...</span>
              </div>
            ) : (
              "Mint Monster"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
