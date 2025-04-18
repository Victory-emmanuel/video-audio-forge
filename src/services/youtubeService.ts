
import ytdl from 'ytdl-core';

export interface VideoInfo {
  title: string;
  formats: {
    quality: string;
    container: string;
    url: string;
  }[];
}

export const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  try {
    const info = await ytdl.getInfo(url);
    return {
      title: info.videoDetails.title,
      formats: info.formats.map(format => ({
        quality: format.qualityLabel || format.audioBitrate?.toString() || 'unknown',
        container: format.container || 'unknown',
        url: format.url
      }))
    };
  } catch (error) {
    throw new Error('Failed to fetch video info');
  }
};

export const validateYoutubeUrl = (url: string): boolean => {
  return ytdl.validateURL(url);
};
