import toast from 'react-hot-toast';

export const downloadFile = async (url: string, filename: string) => {
  try {
    const downloadToast = toast.loading('Starting download...');
    
    // Try downloading through a more reliable proxy first
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'audio/mpeg,audio/*,*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the content length if available
    const contentLength = response.headers.get('content-length');
    
    // Stream the response
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    
    if (!reader) {
      throw new Error('Unable to read the response');
    }

    let receivedLength = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      chunks.push(value);
      receivedLength += value.length;
      
      // Update progress if we know the total size
      if (contentLength) {
        const progress = (receivedLength / parseInt(contentLength)) * 100;
        toast.loading(`Downloading: ${Math.round(progress)}%`, { id: downloadToast });
      }
    }

    // Concatenate chunks into a single Uint8Array
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }

    // Convert to blob
    const blob = new Blob([allChunks], { type: 'audio/mpeg' });
    
    if (blob.size === 0) {
      throw new Error('Downloaded file is empty');
    }

    // Create and trigger download
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    window.URL.revokeObjectURL(downloadUrl);
    toast.success('Download completed!', { id: downloadToast });
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    
    let errorMessage = 'Failed to download the file';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(`Download failed: ${errorMessage}`);
    return false;
  }
};