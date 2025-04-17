
import { Pet } from '@/lib/web3';
import { MonsterCard } from '@/components/MonsterCard';

interface MonsterGridProps {
  monsters: Pet[];
  onLevelUp?: () => void;
}

export function MonsterGrid({ monsters, onLevelUp }: MonsterGridProps) {
  if (monsters.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-400">No monsters found</h3>
        <p className="mt-2 text-gray-500">Mint your first monster to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {monsters.map((monster) => (
        <MonsterCard 
          key={monster.id} 
          monster={monster} 
          onLevelUp={onLevelUp}
        />
      ))}
    </div>
  );
}
