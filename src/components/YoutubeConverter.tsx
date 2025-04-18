
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { validateYoutubeUrl, getVideoInfo, VideoInfo } from '@/services/youtubeService';
import { Download, Video, Music, Loader2 } from 'lucide-react';

const YoutubeConverter = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setVideoInfo(info);
      setIsModalOpen(true);
      toast.success(`Found video: ${info.title}`);
    } catch (error) {
      toast.error('Failed to process video');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoInfo || !quality) {
      toast.error('Please select a quality');
      return;
    }

    const selectedFormat = videoInfo.formats.find(f => 
      f.container === format && f.quality === quality
    );

    if (selectedFormat) {
      window.location.href = selectedFormat.url;
      toast.success('Download started');
      setIsModalOpen(false);
    } else {
      toast.error('Selected format not available');
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-center">YouTube to MP3/MP4 Converter</CardTitle>
        </CardHeader>
        <CardContent>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{videoInfo?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format">
                    {format === 'mp4' ? (
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        MP4 (Video)
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        MP3 (Audio)
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      MP4 (Video)
                    </div>
                  </SelectItem>
                  <SelectItem value="mp3">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      MP3 (Audio)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {format === 'mp4'
                    ? videoQualities.map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))
                    : audioQualities.map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleDownload}
              className="w-full"
              disabled={!quality}
            >
              <Download className="w-4 h-4 mr-2" />
              Download {format.toUpperCase()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YoutubeConverter;
