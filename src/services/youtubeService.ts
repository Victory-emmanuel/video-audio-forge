
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

// Function to get video information
export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video info');
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      formats: [
        {
          quality: '360p',
          container: 'mp4',
          label: '360p (MP4)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp4&quality=360`
        },
        {
          quality: '480p',
          container: 'mp4',
          label: '480p (MP4)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp4&quality=480`
        },
        {
          quality: '720p',
          container: 'mp4',
          label: '720p (MP4)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp4&quality=720`
        },
        {
          quality: '1080p',
          container: 'mp4',
          label: '1080p (MP4)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp4&quality=1080`
        },
        {
          quality: '128kbps',
          container: 'mp3',
          label: '128kbps (MP3)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp3&quality=128`
        },
        {
          quality: '192kbps',
          container: 'mp3',
          label: '192kbps (MP3)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp3&quality=192`
        },
        {
          quality: '256kbps',
          container: 'mp3',
          label: '256kbps (MP3)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp3&quality=256`
        },
        {
          quality: '320kbps',
          container: 'mp3',
          label: '320kbps (MP3)',
          url: `https://video-audio-forge.vercel.app/download?videoId=${videoId}&format=mp3&quality=320`
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video info');
  }
};
