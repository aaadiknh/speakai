import React from 'react';
import { Link } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';

const Header = () => {
  const { points } = useGameState();
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-gray-300">Missions</Link>
        <Link to="/character" className="hover:text-gray-300">Character</Link>
        <Link to="/submission" className="hover:text-gray-300">Submission</Link>
        <Link to="/profile" className="hover:text-gray-300">Profile</Link>
      </nav>
      <div>
        <span className="font-bold">Points: {points}</span>
      </div>
    </header>
  );
};

export default Header;
