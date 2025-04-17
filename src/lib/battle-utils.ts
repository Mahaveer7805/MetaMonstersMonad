
import { Pet } from '@/lib/web3';

/**
 * Calculate the battle power of a monster based on its attributes,
 * level, and DNA.
 */
export function calculateBattlePower(monster: Pet): number {
  // Base power from attributes
  const attributesPower = (
    monster.attributes.strength + 
    monster.attributes.speed + 
    monster.attributes.intelligence + 
    monster.attributes.stamina
  ) / 4; // Average of all attributes
  
  // Level influence
  const levelBonus = monster.level * 1.5;
  
  // DNA modifier (use last 3 digits for some randomness)
  const dnaModifier = Number(monster.dna % BigInt(1000)) / 1000; // Scale to 0.0 - 1.0
  const dnaBonus = 5 * dnaModifier;
  
  // Type bonus based on element
  const typeBonus = getTypeBonus(monster.type);
  
  // Calculate total power
  return attributesPower + levelBonus + dnaBonus + typeBonus;
}

/**
 * Get special bonus based on monster type
 */
function getTypeBonus(type: string): number {
  // Different types have slight advantages
  const bonuses: Record<string, number> = {
    "Fire": 1.2,
    "Water": 1.0,
    "Earth": 1.5,
    "Air": 0.8,
    "Electric": 1.3
  };
  
  return bonuses[type] || 1.0;
}

/**
 * Calculate type effectiveness for battle
 */
export function calculateTypeEffectiveness(attackerType: string, defenderType: string): number {
  // Type advantages chart (similar to rock-paper-scissors)
  const advantages: Record<string, string[]> = {
    "Fire": ["Earth", "Air"],
    "Water": ["Fire", "Electric"],
    "Earth": ["Electric", "Water"],
    "Air": ["Earth", "Water"],
    "Electric": ["Air", "Fire"]
  };
  
  // Super effective
  if (advantages[attackerType]?.includes(defenderType)) {
    return 1.5;
  }
  
  // Not very effective (resistance)
  if (advantages[defenderType]?.includes(attackerType)) {
    return 0.67;
  }
  
  // Normal effectiveness
  return 1.0;
}

/**
 * Get move name based on monster type
 */
export function getTypeMove(type: string): string {
  const moves: Record<string, string[]> = {
    "Fire": ["Flame Burst", "Inferno", "Fire Blast", "Heat Wave", "Burning Slash"],
    "Water": ["Hydro Pump", "Tsunami", "Aqua Jet", "Water Cannon", "Whirlpool"],
    "Earth": ["Rock Slide", "Earthquake", "Ground Pound", "Boulder Crash", "Seismic Slam"],
    "Air": ["Tornado", "Hurricane", "Wind Slash", "Air Cutter", "Cyclone"],
    "Electric": ["Lightning Bolt", "Thunder Shock", "Volt Tackle", "Electric Surge", "Thunderwave"]
  };
  
  const typeMoves = moves[type] || ["Attack"];
  return typeMoves[Math.floor(Math.random() * typeMoves.length)];
}
