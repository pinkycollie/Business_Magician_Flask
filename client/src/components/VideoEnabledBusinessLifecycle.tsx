import { useState, useRef } from 'react';
import { 
  Lightbulb, 
  ConstructionIcon, 
  TrendingUp, 
  BarChart3, 
  Video, 
  Upload, 
  Download, 
  Edit3, 
  Scissors, 
  Save, 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Camera,
  Film,
  Stream,
  Wifi,
  Signal,
  MonitorSmartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Video control bar component with accessibility features
const VideoControlBar = ({ 
  onPlay, 
  isPlaying, 
  duration, 
  currentTime, 
  onSeek, 
  captionsEnabled, 
  onToggleCaptions,
  showASL,
  onToggleASL
}: { 
  onPlay: () => void; 
  isPlaying: boolean; 
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  captionsEnabled: boolean;
  onToggleCaptions: () => void;
  showASL: boolean;
  onToggleASL: () => void;
}) => {
  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-black/90 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20" 
          onClick={onPlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <span className="text-white text-xs font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        
        <div className="flex-1 mx-2">
          <Slider 
            value={[currentTime]} 
            max={duration} 
            step={1}
            onValueChange={(value) => onSeek(value[0])}
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${captionsEnabled ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/20'}`}
          onClick={onToggleCaptions}
        >
          <Badge className="h-4 uppercase text-[10px]">CC</Badge>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${showASL ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/20'}`}
          onClick={onToggleASL}
        >
          <Badge className="h-4 uppercase text-[10px]">ASL</Badge>
        </Button>
      </div>
    </div>
  );
};

// Video player with ASL support
const EnhancedVideoPlayer = ({ 
  mainVideoUrl, 
  aslVideoUrl,
  thumbnailUrl,
  title,
  description
}: { 
  mainVideoUrl: string; 
  aslVideoUrl?: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [showASL, setShowASL] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aslVideoRef = useRef<HTMLVideoElement>(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (aslVideoRef.current) aslVideoRef.current.pause();
      } else {
        videoRef.current.play();
        if (aslVideoRef.current) aslVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      
      if (aslVideoRef.current) {
        aslVideoRef.current.currentTime = time;
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Keep ASL video in sync
      if (aslVideoRef.current && Math.abs(aslVideoRef.current.currentTime - videoRef.current.currentTime) > 0.5) {
        aslVideoRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-black">
      <div className="relative aspect-video">
        {!isPlaying ? (
          <div className="absolute inset-0">
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-16 w-16 rounded-full border-2 hover:scale-110 transition-transform"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8" />
              </Button>
              <h3 className="text-xl font-bold mt-4">{title}</h3>
              {description && <p className="text-sm text-gray-300 mt-2 max-w-md text-center">{description}</p>}
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <div className={`${showASL && aslVideoUrl ? 'w-2/3' : 'w-full'} h-full`}>
              <video
                ref={videoRef}
                src={mainVideoUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              
              {captionsEnabled && (
                <div className="absolute bottom-14 left-0 right-0 text-center">
                  <div className="bg-black/70 text-white inline-block px-4 py-2 rounded-lg">
                    Sample caption text that would appear here
                  </div>
                </div>
              )}
            </div>
            
            {showASL && aslVideoUrl && (
              <div className="w-1/3 h-full bg-black border-l border-gray-800">
                <video
                  ref={aslVideoRef}
                  src={aslVideoUrl}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-pink-600">ASL</Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-1">
        <VideoControlBar
          onPlay={togglePlay}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          captionsEnabled={captionsEnabled}
          onToggleCaptions={() => setCaptionsEnabled(!captionsEnabled)}
          showASL={showASL}
          onToggleASL={() => setShowASL(!showASL)}
        />
      </div>
    </div>
  );
};

// Video recorder component with ASL support
const VideoRecorder = ({
  onRecordingComplete
}: {
  onRecordingComplete: (videoBlob: Blob) => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check your permissions.');
    }
  };
  
  const startRecording = () => {
    if (!streamRef.current) return;
    
    // Start countdown
    setCountDown(3);
    const countdownInterval = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          beginRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const beginRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onRecordingComplete(blob);
    };
    
    // Start timer
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    mediaRecorder.start();
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="rounded-lg overflow-hidden border">
      <div className="flex items-center justify-between p-3 bg-gray-100">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gray-700" />
          <h3 className="font-medium">Record ASL Video</h3>
        </div>
        
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-600 font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>
      
      <div className="aspect-video bg-gray-900 relative">
        {!cameraReady ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="mb-4">Camera access is required to record ASL videos</p>
            <Button onClick={startCamera}>Enable Camera</Button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          ></video>
        )}
        
        {countDown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-7xl font-bold text-white">{countDown}</span>
          </div>
        )}
      </div>
      
      <div className="p-3 flex justify-center gap-4">
        {!isRecording ? (
          <Button 
            onClick={startRecording} 
            disabled={!cameraReady || countDown > 0}
            className="bg-red-600 hover:bg-red-700"
          >
            <Video className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button 
            onClick={stopRecording} 
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

// Video editing component
const SimpleVideoEditor = ({
  videoUrl,
  onSave
}: {
  videoUrl: string;
  onSave: (editedVideo: Blob) => void;
}) => {
  // This is a simplified version - in a real app, you'd have actual video editing capabilities
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-100 flex items-center gap-2">
        <Scissors className="h-5 w-5 text-gray-700" />
        <h3 className="font-medium">Simple Video Editor</h3>
      </div>
      
      <div className="p-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video src={videoUrl} className="w-full h-full" controls></video>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Trim Video</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs">0:00</span>
              <div className="flex-1">
                <Slider value={[0, 100]} max={100} step={1} />
              </div>
              <span className="text-xs">2:30</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Brightness</h4>
            <Slider value={[50]} max={100} step={1} />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Contrast</h4>
            <Slider value={[50]} max={100} step={1} />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => onSave(new Blob())}>
              <Save className="h-4 w-4 mr-2" />
              Save Edits
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video upload component with progress bar
const VideoUploader = ({
  onUploadComplete
}: {
  onUploadComplete: (videoUrl: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      handleUpload(file);
    }
  };
  
  const handleUpload = (file: File) => {
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          onUploadComplete('https://example.com/uploaded-video.mp4');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-100 flex items-center gap-2">
        <Upload className="h-5 w-5 text-gray-700" />
        <h3 className="font-medium">Upload Video</h3>
      </div>
      
      <div className="p-6">
        {!uploading && !fileName ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <Film className="h-12 w-12 text-gray-400 mb-3" />
              <h4 className="text-lg font-medium">Drag video files here</h4>
              <p className="text-gray-500 mb-4">Or click to browse</p>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Video File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Film className="h-8 w-8 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fileName}</p>
                <p className="text-sm text-gray-500">Video file</p>
              </div>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {!uploading && progress === 100 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-600">
                  <Badge className="bg-green-100 text-green-800">
                    Upload Complete
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setFileName('');
                  setProgress(0);
                }}>
                  Upload Another
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Signal strength indicator
const SignalStrengthIndicator = ({
  strength
}: {
  strength: 'excellent' | 'good' | 'fair' | 'poor';
}) => {
  const getColor = () => {
    switch (strength) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  const getStrengthBars = () => {
    switch (strength) {
      case 'excellent': return (
        <div className="flex items-end gap-[2px] h-5">
          <div className="w-1 h-1 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-2 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-4 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-green-500 rounded-sm"></div>
        </div>
      );
      case 'good': return (
        <div className="flex items-end gap-[2px] h-5">
          <div className="w-1 h-1 bg-green-400 rounded-sm"></div>
          <div className="w-1 h-2 bg-green-400 rounded-sm"></div>
          <div className="w-1 h-3 bg-green-400 rounded-sm"></div>
          <div className="w-1 h-4 bg-green-400 rounded-sm"></div>
          <div className="w-1 h-5 bg-gray-200 rounded-sm"></div>
        </div>
      );
      case 'fair': return (
        <div className="flex items-end gap-[2px] h-5">
          <div className="w-1 h-1 bg-yellow-500 rounded-sm"></div>
          <div className="w-1 h-2 bg-yellow-500 rounded-sm"></div>
          <div className="w-1 h-3 bg-yellow-500 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-200 rounded-sm"></div>
          <div className="w-1 h-5 bg-gray-200 rounded-sm"></div>
        </div>
      );
      case 'poor': return (
        <div className="flex items-end gap-[2px] h-5">
          <div className="w-1 h-1 bg-red-500 rounded-sm"></div>
          <div className="w-1 h-2 bg-red-500 rounded-sm"></div>
          <div className="w-1 h-3 bg-gray-200 rounded-sm"></div>
          <div className="w-1 h-4 bg-gray-200 rounded-sm"></div>
          <div className="w-1 h-5 bg-gray-200 rounded-sm"></div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Signal className={`h-4 w-4 ${getColor()}`} />
      {getStrengthBars()}
      <span className={`text-xs ${getColor()}`}>{strength.charAt(0).toUpperCase() + strength.slice(1)}</span>
    </div>
  );
};

// Main component
export default function VideoEnabledBusinessLifecycle() {
  const [activeTab, setActiveTab] = useState('idea');
  
  // Example videos for the business lifecycle stages
  const stageVideos = {
    idea: {
      title: "Generating Business Ideas",
      description: "Learn how to discover and validate profitable business ideas",
      mainVideoUrl: "https://example.com/videos/idea-generation.mp4",
      aslVideoUrl: "https://example.com/videos/asl/idea-generation.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    build: {
      title: "Building Your Business Foundation",
      description: "Essential steps to set up your business for success",
      mainVideoUrl: "https://example.com/videos/business-building.mp4",
      aslVideoUrl: "https://example.com/videos/asl/business-building.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    grow: {
      title: "Growing Your Customer Base",
      description: "Strategies to expand your reach and increase sales",
      mainVideoUrl: "https://example.com/videos/business-growth.mp4",
      aslVideoUrl: "https://example.com/videos/asl/business-growth.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1573164574230-db1d5e960238?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    manage: {
      title: "Managing a Successful Business",
      description: "Tools and techniques for efficient business management",
      mainVideoUrl: "https://example.com/videos/business-management.mp4",
      aslVideoUrl: "https://example.com/videos/asl/business-management.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">360° Business Magician</h1>
          <p className="text-gray-600 mt-1">Visual business development platform for deaf entrepreneurs</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-2 rounded-lg">
            <SignalStrengthIndicator strength="excellent" />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Stream className="h-4 w-4" />
            Live Support
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-1">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger 
              value="idea" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg flex flex-col items-center py-3"
            >
              <Lightbulb className="h-6 w-6 mb-1" />
              <span>Idea</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="build" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-lg flex flex-col items-center py-3"
            >
              <ConstructionIcon className="h-6 w-6 mb-1" />
              <span>Build</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="grow" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg flex flex-col items-center py-3"
            >
              <TrendingUp className="h-6 w-6 mb-1" />
              <span>Grow</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="manage" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg flex flex-col items-center py-3"
            >
              <BarChart3 className="h-6 w-6 mb-1" />
              <span>Manage</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Idea Stage Content */}
        <TabsContent value="idea" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedVideoPlayer 
                mainVideoUrl={stageVideos.idea.mainVideoUrl}
                aslVideoUrl={stageVideos.idea.aslVideoUrl}
                thumbnailUrl={stageVideos.idea.thumbnailUrl}
                title={stageVideos.idea.title}
                description={stageVideos.idea.description}
              />
              
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Like</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comment</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-indigo-600" />
                    <span>Interactive Tools</span>
                  </CardTitle>
                  <CardDescription>
                    Record your own ASL business idea or upload a video
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Video className="h-4 w-4 text-indigo-600" />
                      <span>Create or Upload Video</span>
                    </h3>
                    
                    <Tabs defaultValue="record" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="record">Record</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="record" className="mt-4">
                        <VideoRecorder onRecordingComplete={(blob) => {
                          console.log('Recording completed', blob);
                        }} />
                      </TabsContent>
                      
                      <TabsContent value="upload" className="mt-4">
                        <VideoUploader onUploadComplete={(url) => {
                          console.log('Upload completed', url);
                        }} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Videos</CardTitle>
                  <CardDescription>
                    Previously recorded or uploaded videos
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <ScrollArea className="h-60">
                    <div className="space-y-1 p-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-16 h-9 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img 
                              src={`https://images.unsplash.com/photo-1580427331730-3b456b117e0d?w=150&h=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8${i * 5 + 1}%7CLb3JnYW5pemF0aW9ufGVufDB8fDB8fHww`} 
                              alt="Thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">My Business Idea #{i + 1}</p>
                            <p className="text-xs text-gray-500">Recorded {i + 1} days ago</p>
                          </div>
                          <Badge variant="outline" className="text-xs">ASL</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Business Ideas</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <Lightbulb className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">ASL Video Production</h4>
                          <p className="text-xs text-gray-600 mt-1">Create accessible content for deaf audiences</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="text-[10px] h-4">High Demand</Badge>
                            <Badge variant="outline" className="text-[10px] h-4">ASL</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Build Stage Content */}
        <TabsContent value="build" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedVideoPlayer 
                mainVideoUrl={stageVideos.build.mainVideoUrl}
                aslVideoUrl={stageVideos.build.aslVideoUrl}
                thumbnailUrl={stageVideos.build.thumbnailUrl}
                title={stageVideos.build.title}
                description={stageVideos.build.description}
              />
              
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Like</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comment</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ConstructionIcon className="h-5 w-5 text-teal-600" />
                    <span>Business Formation</span>
                  </CardTitle>
                  <CardDescription>
                    Complete these steps to form your business entity
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Choose Business Structure</h3>
                        <p className="text-sm text-gray-600 mb-2">Select the legal structure for your business</p>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          <Badge variant="outline" className="text-xs">LLC</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">File Formation Documents</h3>
                        <p className="text-sm text-gray-600 mb-2">Submit your business formation documents</p>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Apply for EIN</h3>
                        <p className="text-sm text-gray-600 mb-2">Get your tax ID from the IRS</p>
                        <div className="flex gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </div>
                        <Button size="sm" className="mt-2">Watch ASL Guide</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">Open Business Bank Account</h3>
                        <p className="text-sm text-gray-600">Set up your business banking</p>
                        <Button size="sm" className="mt-2">Start Process</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Grow Stage Content */}
        <TabsContent value="grow" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedVideoPlayer 
                mainVideoUrl={stageVideos.grow.mainVideoUrl}
                aslVideoUrl={stageVideos.grow.aslVideoUrl}
                thumbnailUrl={stageVideos.grow.thumbnailUrl}
                title={stageVideos.grow.title}
                description={stageVideos.grow.description}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    <span>Growth Strategies</span>
                  </CardTitle>
                  <CardDescription>
                    Resources to help expand your business
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-medium text-amber-800 mb-2">Marketing Workshop</h3>
                      <p className="text-sm text-amber-700 mb-3">Learn how to market your business to both deaf and hearing audiences</p>
                      <div className="flex gap-2">
                        <Badge className="bg-amber-100 text-amber-800">Live Workshop</Badge>
                        <Badge variant="outline" className="text-xs">ASL Interpreters</Badge>
                      </div>
                      <Button className="w-full mt-3 bg-amber-600 hover:bg-amber-700">Register Now</Button>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Growth Resources</h3>
                      
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 rounded-full ${i === 0 ? 'bg-purple-100' : i === 1 ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center`}>
                            <Video className={`h-5 w-5 ${i === 0 ? 'text-purple-600' : i === 1 ? 'text-blue-600' : 'text-green-600'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              {i === 0 ? 'Social Media Marketing' : i === 1 ? 'Email Campaigns' : 'Customer Retention'}
                            </h4>
                            <p className="text-xs text-gray-500">ASL Video Tutorial</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Manage Stage Content */}
        <TabsContent value="manage" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedVideoPlayer 
                mainVideoUrl={stageVideos.manage.mainVideoUrl}
                aslVideoUrl={stageVideos.manage.aslVideoUrl}
                thumbnailUrl={stageVideos.manage.thumbnailUrl}
                title={stageVideos.manage.title}
                description={stageVideos.manage.description}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Business Analytics</span>
                  </CardTitle>
                  <CardDescription>
                    Track your business performance
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Monthly Revenue</h3>
                      <Badge className="bg-green-100 text-green-800">+12% ↑</Badge>
                    </div>
                    
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Revenue chart placeholder</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Customers</h4>
                        <p className="text-2xl font-bold">248</p>
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">+18%</Badge>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600">Avg. Order</h4>
                        <p className="text-2xl font-bold">$87</p>
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">+5%</Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full">View Full Reports</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <MonitorSmartphone className="h-6 w-6 text-gray-700" />
          <h2 className="text-xl font-bold">Device Compatibility Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Wifi className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Network Status</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Connection</span>
                <SignalStrengthIndicator strength="excellent" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Video Streaming</span>
                <SignalStrengthIndicator strength="excellent" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Upload Speed</span>
                <SignalStrengthIndicator strength="good" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Camera className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">Camera Status</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Front Camera</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolution</span>
                <span className="text-sm font-medium">1080p HD</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Lighting Detection</span>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Film className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium">Video Processing</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">ASL Recognition</span>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Real-time Captions</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Video Editing</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// This type needed for compilation
type Square = any;