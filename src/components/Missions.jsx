import React from 'react';
import { useGameState } from '../context/GameStateContext';

const Missions = () => {
  const { completeMission, missionsCompleted } = useGameState();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Missions</h1>
      <p className="mb-4">Complete the mission to earn 100 points and unlock the final submission.</p>
      <button
        onClick={completeMission}
        disabled={missionsCompleted}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
      >
        {missionsCompleted ? 'Mission Completed!' : 'Complete Mission'}
      </button>
    </div>
  );
};

export default Missions;
