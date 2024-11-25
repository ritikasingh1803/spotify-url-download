export const extractSpotifyTrackId = (url: string): string | null => {
  try {
    // Handle both URL formats:
    // https://open.spotify.com/track/2gi4stMxjTzP10fUaU0U4t?si=...
    // spotify:track:2gi4stMxjTzP10fUaU0U4t
    const trackIdMatch = url.match(/track[:/]([a-zA-Z0-9]+)/);
    return trackIdMatch ? trackIdMatch[1] : null;
  } catch {
    return null;
  }
};

export const validateSpotifyUrl = (url: string): boolean => {
  const trackId = extractSpotifyTrackId(url);
  return !!trackId && trackId.length > 0;
};