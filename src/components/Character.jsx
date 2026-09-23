import React from 'react';
import { useGameState } from '../context/GameStateContext';

const accessories = [
  { name: 'Headphone', cost: 50 },
  { name: 'Beanie', cost: 50 },
  { name: 'Glasses', cost: 50 },
];

const Character = () => {
  const { character, purchaseAccessory, points } = useGameState();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Character Customization</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Your Character</h2>
        <div className="w-32 h-32 rounded-full" style={{ backgroundColor: character.color }}></div>
        <p className="mt-2">Color: {character.color}</p>
        <p>Accessories: {character.accessories.join(', ') || 'None'}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Shop</h2>
        <p>Your points: {points}</p>
        <div className="flex gap-4 mt-2">
          {accessories.map(acc => (
            <button
              key={acc.name}
              onClick={() => purchaseAccessory(acc.name)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy {acc.name} ({acc.cost} points)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Character;
