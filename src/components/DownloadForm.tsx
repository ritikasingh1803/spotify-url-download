import React from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadFormProps {
  url: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DownloadForm: React.FC<DownloadFormProps> = ({
  url,
  loading,
  onUrlChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://open.spotify.com/track/..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none transition"
          />
          <p className="text-xs text-gray-400 mt-2">
            Example: https://open.spotify.com/track/2gi4stMxjTzP10fUaU0U4t
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download
            </>
          )}
        </button>
      </div>
    </div>
  </form>
);