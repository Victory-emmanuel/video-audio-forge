
export interface VideoInfo {
  title: string;
  formats: {
    quality: string;
    container: string;
    url: string;
    label: string;
  }[];
}

// Function to extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Function to validate YouTube URL
export const validateYoutubeUrl = (url: string): boolean => {
  const videoId = extractVideoId(url);
  return videoId !== null;
};

// Function to get video information from a mock/simplified response
export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  
  try {
    // Fetch video details from YouTube API (using embed approach)
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video info');
    }
    
    const data = await response.json();
    
    // Create mock formats based on common YouTube formats
    // In a real implementation, we would use a backend API to get actual formats
    return {
      title: data.title,
      formats: [
        {
          quality: '360p',
          container: 'mp4',
          label: '360p (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '480p',
          container: 'mp4',
          label: '480p (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '720p',
          container: 'mp4',
          label: '720p (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '1080p',
          container: 'mp4',
          label: '1080p (MP4)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '128kbps',
          container: 'mp3',
          label: '128kbps (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '192kbps',
          container: 'mp3',
          label: '192kbps (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '256kbps',
          container: 'mp3',
          label: '256kbps (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        },
        {
          quality: '320kbps',
          container: 'mp3',
          label: '320kbps (MP3)',
          url: `https://www.youtube.com/watch?v=${videoId}`
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video info');
  }
};
