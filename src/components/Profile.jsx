import React from 'react';
import { useGameState } from '../context/GameStateContext';

const Profile = () => {
  const { badgeEarned } = useGameState();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div>
        <h2 className="text-xl font-semibold">Badges</h2>
        {badgeEarned ? (
          <div className="mt-2 p-4 bg-yellow-200 border border-yellow-400 rounded">
            <p className="font-bold">GitHub Submission Badge</p>
            <p>Awarded for submitting your project.</p>
          </div>
        ) : (
          <p>No badges earned yet. Complete the final submission to get your first badge!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
