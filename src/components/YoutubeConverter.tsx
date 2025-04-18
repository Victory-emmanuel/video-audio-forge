
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { validateYoutubeUrl, getVideoInfo, extractVideoId } from '@/services/youtubeService';
import { Download } from 'lucide-react';

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
      
      // Find the matching format based on selected quality and format
      const selectedFormat = info.formats.find(f => 
        f.container === format && f.quality === quality
      );

      if (selectedFormat) {
        // Start the download
        window.location.href = selectedFormat.url;
        toast.success('Download started');
      } else {
        toast.error('Selected format not available');
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
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            Enter a YouTube URL and select your preferred format and quality to download.
          </p>
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
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default YoutubeConverter;
