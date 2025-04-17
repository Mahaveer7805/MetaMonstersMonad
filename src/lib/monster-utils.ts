
// Generates a random DNA value for monster creation
export function generateRandomDNA(preferredType: string = "Random"): number {
  // Generate a random 32-bit integer
  let dna = Math.floor(Math.random() * 0xFFFFFFFF);
  
  // If a specific type is preferred, modify the DNA to increase chances
  if (preferredType !== "Random") {
    // Map type names to type values (0-4)
    const typeMap: { [key: string]: number } = {
      "Fire": 0,
      "Water": 1,
      "Earth": 2,
      "Air": 3,
      "Electric": 4
    };
    
    // If the type is recognized, set the last 4 bits to match the type value
    if (typeMap[preferredType] !== undefined) {
      // Clear the last 4 bits
      dna = dna & 0xFFFFFFF0;
      // Set the type bits
      dna = dna | typeMap[preferredType];
    }
  }
  
  return dna;
}

// Monster images mapping
export const monsterImages = {
  fire1: "/monsters/fire_1.png",
  fire2: "/monsters/fire_2.png",
  water1: "/monsters/water_1.png",
  water2: "/monsters/water_2.png",
  earth1: "/monsters/earth_1.png",
  earth2: "/monsters/earth_2.png",
  air1: "/monsters/air_1.png",
  air2: "/monsters/air_2.png",
  electric1: "/monsters/electric_1.png",
  electric2: "/monsters/electric_2.png",
};

// Get a monster's evolution stage based on level
export function getEvolutionStage(level: number): number {
  if (level >= 10) return 3;
  if (level >= 5) return 2;
  return 1;
}

// Get monster image based on type and evolution stage
export function getMonsterImage(type: string, level: number): string {
  const stage = level > 5 ? 2 : 1;
  const key = `${type.toLowerCase()}${stage}` as keyof typeof monsterImages;
  return monsterImages[key] || monsterImages.fire1;
}

// Predefined opponent monsters for single player battles
export const opponentMonsters = [
  {
    id: -1,
    name: "Flameburst",
    level: 3,
    dna: BigInt(generateRandomDNA("Fire")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Fire",
    attributes: {
      strength: 65,
      speed: 45,
      intelligence: 30,
      stamina: 40,
    },
    image: monsterImages.fire1,
    description: "A fast and aggressive fire monster with powerful attacks!"
  },
  {
    id: -2,
    name: "Aquafin",
    level: 4,
    dna: BigInt(generateRandomDNA("Water")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Water",
    attributes: {
      strength: 40,
      speed: 50,
      intelligence: 60,
      stamina: 55,
    },
    image: monsterImages.water1,
    description: "A clever water monster that uses tactical moves and high intelligence."
  },
  {
    id: -3,
    name: "Terravore",
    level: 5,
    dna: BigInt(generateRandomDNA("Earth")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Earth",
    attributes: {
      strength: 70,
      speed: 25,
      intelligence: 40,
      stamina: 75,
    },
    image: monsterImages.earth1,
    description: "A durable earth monster with tremendous strength and defensive capabilities."
  },
  {
    id: -4,
    name: "Zephyros",
    level: 4,
    dna: BigInt(generateRandomDNA("Air")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Air",
    attributes: {
      strength: 35,
      speed: 80,
      intelligence: 50,
      stamina: 40,
    },
    image: monsterImages.air1,
    description: "An incredibly fast air monster that strikes before opponents can react."
  },
  {
    id: -5,
    name: "Voltshock",
    level: 5,
    dna: BigInt(generateRandomDNA("Electric")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Electric",
    attributes: {
      strength: 55,
      speed: 60,
      intelligence: 65,
      stamina: 30,
    },
    image: monsterImages.electric1,
    description: "A high-damage electric monster with devastating special attacks."
  },
  {
    id: -6,
    name: "Infernix",
    level: 8,
    dna: BigInt(generateRandomDNA("Fire")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Fire",
    attributes: {
      strength: 80,
      speed: 65,
      intelligence: 50,
      stamina: 60,
    },
    image: monsterImages.fire2,
    description: "An evolved fire monster with mastery over flame and heat."
  },
  {
    id: -7,
    name: "Tsunamis",
    level: 8,
    dna: BigInt(generateRandomDNA("Water")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Water",
    attributes: {
      strength: 60,
      speed: 70,
      intelligence: 85,
      stamina: 75,
    },
    image: monsterImages.water2,
    description: "An evolved water monster that can summon tidal waves to crush opponents."
  },
  {
    id: -8,
    name: "Mountainus",
    level: 9,
    dna: BigInt(generateRandomDNA("Earth")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Earth",
    attributes: {
      strength: 90,
      speed: 40,
      intelligence: 60,
      stamina: 95,
    },
    image: monsterImages.earth2,
    description: "An evolved earth monster with nearly impenetrable defenses."
  },
  {
    id: -9,
    name: "Hurricane",
    level: 7,
    dna: BigInt(generateRandomDNA("Air")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Air",
    attributes: {
      strength: 55,
      speed: 100,
      intelligence: 70,
      stamina: 60,
    },
    image: monsterImages.air2,
    description: "An evolved air monster that moves at the speed of wind."
  },
  {
    id: -10,
    name: "Thunderlord",
    level: 9,
    dna: BigInt(generateRandomDNA("Electric")),
    owner: "0x0000000000000000000000000000000000000000",
    type: "Electric",
    attributes: {
      strength: 75,
      speed: 80,
      intelligence: 85,
      stamina: 50,
    },
    image: monsterImages.electric2,
    description: "An evolved electric monster that harnesses storms to destroy opponents."
  },
];

// Function to get a random opponent based on player monster level
export function getRandomOpponent(playerLevel: number) {
  // Filter monsters by level range appropriate for player
  // For beginners (level 1-3), offer easier opponents
  // For mid-level (4-7), offer appropriate challenge
  // For high-level (8+), offer challenging opponents
  
  let eligibleOpponents;
  
  if (playerLevel <= 3) {
    // Easy opponents for beginners
    eligibleOpponents = opponentMonsters.filter(monster => monster.level <= 5);
  } else if (playerLevel <= 7) {
    // Medium difficulty opponents
    eligibleOpponents = opponentMonsters.filter(monster => monster.level >= 3 && monster.level <= 8);
  } else {
    // Hard opponents for experienced players
    eligibleOpponents = opponentMonsters.filter(monster => monster.level >= 5);
  }
  
  // If no eligible opponents are found, return any random opponent
  if (eligibleOpponents.length === 0) {
    eligibleOpponents = opponentMonsters;
  }
  
  // Return a random opponent from eligible ones
  return eligibleOpponents[Math.floor(Math.random() * eligibleOpponents.length)];
}
