
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { validateYoutubeUrl, getVideoInfo, extractVideoId } from '@/services/youtubeService';
import { AlertCircle, ExternalLink } from 'lucide-react';

const YoutubeConverter = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);

  const videoQualities = ['360p', '480p', '720p', '1080p'];
  const audioQualities = ['128kbps', '192kbps', '256kbps', '320kbps'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!validateYoutubeUrl(url)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      const info = await getVideoInfo(url);
      setVideoTitle(info.title);
      toast.success(`Found video: ${info.title}`);
      
      // Since we can't actually download the video in the browser directly,
      // we'll open the video in a new tab and provide instructions
      const videoId = extractVideoId(url);
      if (format === 'mp4') {
        toast.info('Opening YouTube video in a new tab. Use a browser extension or online service to download.', {
          duration: 8000
        });
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      } else {
        // For MP3, we can direct users to a YouTube to MP3 converter
        toast.info('Opening YouTube video. Use a browser extension or online service to convert to MP3.', {
          duration: 8000
        });
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      }
    } catch (error) {
      toast.error('Failed to process video');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">YouTube to MP3/MP4 Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
          <AlertCircle className="text-amber-500 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p>This is a demo application. Due to browser security restrictions, direct downloading of YouTube videos isn't possible.</p>
            <p className="mt-1">This app will locate your video and open it in a new tab. To download, you'll need to use a YouTube downloader browser extension or online service.</p>
          </div>
        </div>
        
        {videoTitle && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium text-green-800">Found video: {videoTitle}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste YouTube URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 (Video)</SelectItem>
                <SelectItem value="mp3">MP3 (Audio)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                {format === 'mp4'
                  ? videoQualities.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))
                  : audioQualities.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Find Video'}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>For full YouTube downloads, consider using desktop software like <a href="https://www.4kdownload.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center">4K Video Downloader <ExternalLink className="ml-0.5 h-3 w-3" /></a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default YoutubeConverter;
