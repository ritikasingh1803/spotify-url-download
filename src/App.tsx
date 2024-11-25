import React, { useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { DownloadForm } from './components/DownloadForm';
import { downloadFile } from './utils/downloadHelper';
import { validateSpotifyUrl, extractSpotifyTrackId } from './utils/spotifyHelper';

interface SongResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
    releaseDate: string;
    downloadLink: string;
  };
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState<{
    downloadUrl: string;
    title: string;
    artist: string;
    cover: string;
  } | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSpotifyUrl(url)) {
      toast.error('Please enter a valid Spotify track URL');
      return;
    }

    setLoading(true);
    const downloadToast = toast.loading('Validating Spotify URL...');

    try {
      const trackId = extractSpotifyTrackId(url);
      const fullUrl = `https://open.spotify.com/track/${trackId}`;
      
      toast.loading('Fetching song information...', { id: downloadToast });
      
      const response = await axios.get<SongResponse>('https://spotify-downloader9.p.rapidapi.com/downloadSong', {
        params: { songId: fullUrl },
        headers: {
          'x-rapidapi-key': '53d36da411mshc55da25ad75d914p19c959jsnec7bf74dad86',
          'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
        },
        timeout: 30000 // 30 second timeout
      });

      if (!response.data?.success || !response.data?.data?.downloadLink) {
        throw new Error('Invalid response from server');
      }

      const { title, artist, cover, downloadLink } = response.data.data;
      const fileName = `${title} - ${artist}.mp3`.replace(/[<>:"/\\|?*]/g, '_');
      
      toast.loading('Starting download...', { id: downloadToast });
      
      const success = await downloadFile(downloadLink, fileName);

      if (success) {
        setSongData({
          downloadUrl: downloadLink,
          title,
          artist,
          cover
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.response?.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied. Please check your API key.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Song not found. Please check the URL.';
        }
      }
      
      toast.error(errorMessage);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
      toast.dismiss(downloadToast);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Header />
          
          <DownloadForm
            url={url}
            loading={loading}
            onUrlChange={setUrl}
            onSubmit={handleDownload}
          />

          {songData && (
            <div className="mt-8 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <img 
                  src={songData.cover} 
                  alt={`${songData.title} cover`} 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{songData.title}</h2>
                  <p className="text-gray-300">{songData.artist}</p>
                </div>
              </div>
              <button
                onClick={() => downloadFile(songData.downloadUrl, `${songData.title} - ${songData.artist}.mp3`)}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
              >
                <Download className="w-5 h-5" />
                Download Again
              </button>
            </div>
          )}

          <div className="mt-12 text-center text-sm text-gray-400">
            <p>Please ensure you have the rights to download the songs.</p>
            <p>This tool is for educational purposes only.</p>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;