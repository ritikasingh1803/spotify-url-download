import React from 'react';
import { Music } from 'lucide-react';

export const Header = () => (
  <div className="text-center mb-12">
    <div className="flex justify-center mb-4">
      <Music className="w-16 h-16 text-green-400" />
    </div>
    <h1 className="text-4xl font-bold mb-4">Spotify Song Downloader</h1>
    <p className="text-gray-300">Enter a Spotify track URL to download your favorite songs</p>
  </div>
);