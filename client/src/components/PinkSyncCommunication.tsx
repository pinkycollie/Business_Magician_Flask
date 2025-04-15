import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Video, 
  User, 
  Users, 
  Settings, 
  Mic, 
  MicOff, 
  VideoOff, 
  Camera, 
  ScreenShare,
  Phone,
  FileText,
  Image as ImageIcon,
  PlusCircle,
  HandRaised,
  Smile,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type definitions
interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
  }[];
  isASL?: boolean;
  hasCaption?: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isDeaf?: boolean;
  communicationPreference?: 'asl' | 'text' | 'both';
  isPresenting?: boolean;
  hasVideo?: boolean;
  hasAudio?: boolean;
  handRaised?: boolean;
  techLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface PinkSyncProps {
  userTechLevel?: 'beginner' | 'intermediate' | 'advanced';
  userRole?: 'entrepreneur' | 'job_seeker' | 'content_creator' | 'vr_client';
  communicationPreference?: 'asl' | 'text' | 'both';
  isGroupChat?: boolean;
}

// Placeholder data
const demoParticipants: Participant[] = [
  {
    id: '1',
    name: 'You',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Entrepreneur',
    isDeaf: true,
    communicationPreference: 'asl',
    hasVideo: true,
    hasAudio: false,
    techLevel: 'intermediate'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Business Advisor',
    isDeaf: false,
    communicationPreference: 'both',
    hasVideo: true,
    hasAudio: true,
    techLevel: 'advanced'
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'VR Counselor',
    isDeaf: false,
    communicationPreference: 'text',
    hasVideo: true,
    hasAudio: true,
    techLevel: 'intermediate'
  },
  {
    id: '4',
    name: 'Maya Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=10',
    role: 'ASL Interpreter',
    isDeaf: false,
    communicationPreference: 'asl',
    hasVideo: true,
    hasAudio: true,
    techLevel: 'advanced'
  }
];

const demoMessages: Message[] = [
  {
    id: 'm1',
    sender: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Business Advisor'
    },
    content: "Welcome to our meeting! Today we'll discuss your business formation progress.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    hasCaption: true
  },
  {
    id: 'm2',
    sender: {
      id: '4',
      name: 'Maya Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=10',
      role: 'ASL Interpreter'
    },
    content: "I'll be interpreting the meeting today. Please let me know if you need me to adjust my signing speed or clarify anything.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    isASL: true
  },
  {
    id: 'm3',
    sender: {
      id: '1',
      name: 'You',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Entrepreneur'
    },
    content: "Thanks! I'm excited to continue working on my business formation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    isASL: true
  },
  {
    id: 'm4',
    sender: {
      id: '3',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'VR Counselor'
    },
    content: "I've reviewed your application for VR services, and I'm happy to share that you qualify for our entrepreneur support program.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    hasCaption: true
  }
];

// Message component with adaptive layout based on user preferences
const MessageItem = ({ 
  message, 
  isCurrentUser,
  techLevel,
  communicationPreference
}: { 
  message: Message; 
  isCurrentUser: boolean;
  techLevel: 'beginner' | 'intermediate' | 'advanced';
  communicationPreference: 'asl' | 'text' | 'both';
}) => {
  const [showTranslation, setShowTranslation] = useState(communicationPreference === 'both');
  
  // Simplified message layout for beginners
  if (techLevel === 'beginner') {
    return (
      <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-[70%] ${isCurrentUser ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100'} p-3 rounded-lg`}>
          {!isCurrentUser && <p className="font-semibold text-sm mb-1">{message.sender.name}</p>}
          
          {message.isASL && (
            <div className="bg-pink-100 p-2 rounded mb-2 flex items-center gap-2">
              <Video className="h-4 w-4 text-pink-600" />
              <span className="text-pink-700 text-sm">ASL Message Available</span>
            </div>
          )}
          
          <p>{message.content}</p>
          
          {message.hasCaption && !message.isASL && (
            <div className="mt-2 flex justify-end">
              <Badge variant="outline" className="text-gray-500 text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Captions On
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // More detailed layout for intermediate and advanced users
  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className="mr-3 flex flex-col items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {message.sender.role && (
            <span className="text-xs text-gray-500 mt-1">{message.sender.role}</span>
          )}
        </div>
      )}
      
      <div className={`max-w-[70%]`}>
        <div className="flex items-center gap-2 mb-1">
          {!isCurrentUser && <p className="font-semibold text-sm">{message.sender.name}</p>}
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
          
          {message.isASL && (
            <Badge className="bg-pink-100 text-pink-800 text-xs">
              <Video className="h-3 w-3 mr-1" />
              ASL
            </Badge>
          )}
          
          {message.hasCaption && !message.isASL && (
            <Badge variant="outline" className="text-gray-500 text-xs">
              <FileText className="h-3 w-3 mr-1" />
              CC
            </Badge>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-indigo-100 text-indigo-900' : 'bg-gray-100'}`}>
          {message.isASL && communicationPreference !== 'text' && (
            <div className="mb-2 bg-black rounded-md overflow-hidden">
              <div className="aspect-video relative flex items-center justify-center">
                <div className="text-white">ASL Video Placeholder</div>
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-white text-black">
                    ASL
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {(!message.isASL || showTranslation || communicationPreference !== 'asl') && (
            <p>{message.content}</p>
          )}
          
          {message.isASL && communicationPreference !== 'text' && techLevel === 'advanced' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs mt-1" 
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? 'Hide Text' : 'Show Text Translation'}
            </Button>
          )}
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, i) => (
                <div key={i} className="border rounded p-2 bg-white flex items-center gap-2">
                  {attachment.type === 'image' && <ImageIcon className="h-4 w-4" />}
                  {attachment.type === 'video' && <Video className="h-4 w-4" />}
                  {attachment.type === 'file' && <FileText className="h-4 w-4" />}
                  <span className="text-sm truncate">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="ml-3 flex flex-col items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {message.sender.role && techLevel !== 'beginner' && (
            <span className="text-xs text-gray-500 mt-1">{message.sender.role}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Video participant component
const VideoParticipant = ({ 
  participant,
  isLarge = false,
  techLevel
}: { 
  participant: Participant;
  isLarge?: boolean;
  techLevel: 'beginner' | 'intermediate' | 'advanced';
}) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${isLarge ? 'aspect-video' : 'aspect-[4/3]'} group`}>
      {participant.hasVideo ? (
        <div className="bg-gray-800 w-full h-full flex items-center justify-center">
          <img 
            src={participant.avatar} 
            alt={participant.name} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-gray-800 w-full h-full flex items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gray-600 text-white text-2xl">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">{participant.name}</span>
            
            {participant.isDeaf && (
              <Badge className="bg-pink-600">Deaf</Badge>
            )}
            
            {participant.communicationPreference === 'asl' && techLevel !== 'beginner' && (
              <Badge variant="outline" className="text-white border-white/40 text-xs">ASL</Badge>
            )}
          </div>
          
          <div className="flex gap-1">
            {!participant.hasAudio && (
              <div className="bg-gray-800/80 p-1 rounded">
                <MicOff className="h-3.5 w-3.5 text-red-400" />
              </div>
            )}
            
            {participant.handRaised && (
              <div className="bg-amber-500/80 p-1 rounded">
                <HandRaised className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            
            {participant.isPresenting && techLevel !== 'beginner' && (
              <div className="bg-green-500/80 p-1 rounded">
                <ScreenShare className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {techLevel === 'advanced' && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/30 text-white rounded-full">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Main PinkSync component
export default function PinkSyncCommunication({ 
  userTechLevel = 'intermediate',
  userRole = 'entrepreneur',
  communicationPreference = 'both',
  isGroupChat = true
}: PinkSyncProps) {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [participants, setParticipants] = useState<Participant[]>(demoParticipants);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [aslMode, setAslMode] = useState<boolean>(communicationPreference === 'asl' || communicationPreference === 'both');
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [isRecordingASL, setIsRecordingASL] = useState<boolean>(false);
  
  const currentUser = participants.find(p => p.id === '1');
  
  // Layout adjustments based on user tech level
  const getInterfaceClassName = () => {
    switch(userTechLevel) {
      case 'beginner':
        return 'p-3 rounded-xl border-2 border-pink-200';
      case 'intermediate':
        return 'p-4 rounded-xl shadow-md';
      case 'advanced':
        return 'p-4 rounded-xl shadow-md';
      default:
        return 'p-4 rounded-xl shadow-md';
    }
  };
  
  const sendMessage = () => {
    if (newMessage.trim() === '' && !isRecordingASL) return;
    
    const message: Message = {
      id: `m${messages.length + 1}`,
      sender: {
        id: '1',
        name: 'You',
        avatar: currentUser?.avatar,
        role: currentUser?.role
      },
      content: newMessage || '[ASL Video Message]',
      timestamp: new Date(),
      isASL: isRecordingASL,
      hasCaption: captionsEnabled && !isRecordingASL
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    setIsRecordingASL(false);
  };
  
  // Render different controls based on user's tech level
  const renderControls = () => {
    switch(userTechLevel) {
      case 'beginner':
        return (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className={`rounded-full p-6 ${aslMode ? 'bg-pink-100 text-pink-700 border-pink-300' : ''}`}
                onClick={() => setAslMode(!aslMode)}
              >
                <Video className="h-6 w-6" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full p-6"
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
              >
                <FileText className="h-6 w-6" />
              </Button>
              
              <Button
                variant="outline" 
                size="lg"
                className="rounded-full p-6 text-red-600"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="text-center space-x-2">
              <Badge variant={captionsEnabled ? "default" : "outline"}>
                Captions {captionsEnabled ? 'On' : 'Off'}
              </Badge>
              
              <Badge variant={aslMode ? "default" : "outline"} className={aslMode ? 'bg-pink-500' : ''}>
                ASL Mode {aslMode ? 'On' : 'Off'}
              </Badge>
            </div>
          </div>
        );
        
      case 'intermediate':
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="captions" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Enable Captions
                </Label>
                <Switch
                  id="captions"
                  checked={captionsEnabled}
                  onCheckedChange={setCaptionsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="asl-mode" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  ASL Mode
                </Label>
                <Switch
                  id="asl-mode"
                  checked={aslMode}
                  onCheckedChange={setAslMode}
                />
              </div>
            </div>
            
            <div>
              <div className="flex gap-2 justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        {currentUser?.hasAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentUser?.hasAudio ? 'Mute Audio' : 'Unmute Audio'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        {currentUser?.hasVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentUser?.hasVideo ? 'Turn Off Camera' : 'Turn On Camera'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <ScreenShare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Screen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="text-red-600">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End Call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="mt-3">
                <Button
                  variant={isRecordingASL ? "destructive" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={() => setIsRecordingASL(!isRecordingASL)}
                >
                  {isRecordingASL ? (
                    <>
                      <Camera className="h-4 w-4 mr-2 animate-pulse" />
                      Stop ASL Recording
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Record ASL Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'advanced':
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="adv-captions" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Enable Captions
                </Label>
                <Switch
                  id="adv-captions"
                  checked={captionsEnabled}
                  onCheckedChange={setCaptionsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="adv-asl-mode" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  ASL Mode
                </Label>
                <Switch
                  id="adv-asl-mode"
                  checked={aslMode}
                  onCheckedChange={setAslMode}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="caption-speed" className="text-xs flex justify-between">
                  <span>Caption Speed</span>
                  <span className="text-gray-500">Medium</span>
                </Label>
                <Slider defaultValue={[50]} max={100} step={10} id="caption-speed" />
              </div>
            </div>
            
            <div>
              <div className="flex gap-1 flex-wrap justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        {currentUser?.hasAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentUser?.hasAudio ? 'Mute Audio' : 'Unmute Audio'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        {currentUser?.hasVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentUser?.hasVideo ? 'Turn Off Camera' : 'Turn On Camera'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <ScreenShare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Screen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HandRaised className={`h-4 w-4 ${participants.find(p => p.id === '1')?.handRaised ? 'text-amber-500' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Raise Hand</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="text-red-600">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End Call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button
                  variant={isRecordingASL ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsRecordingASL(!isRecordingASL)}
                >
                  {isRecordingASL ? (
                    <>
                      <Camera className="h-4 w-4 mr-2 animate-pulse" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Record ASL
                    </>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Transcript
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Participants
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`${getInterfaceClassName()} max-w-5xl mx-auto`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <span className="bg-pink-100 text-pink-600 p-1 rounded-md mr-2">
                <MessageSquare className="h-5 w-5" />
              </span>
              PinkSync Communication
            </CardTitle>
            <CardDescription>
              Accessible communication platform for deaf entrepreneurs
            </CardDescription>
          </div>
          
          {userTechLevel !== 'beginner' && (
            <Badge className="bg-pink-100 text-pink-800">
              {userTechLevel === 'advanced' ? 'Advanced Mode' : 'Standard Mode'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 border-b">
            <TabsList className="border-b-0">
              <TabsTrigger value="video" className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none">
                <Video className="h-4 w-4 mr-2" />
                Video Chat
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              {userTechLevel !== 'beginner' && (
                <TabsTrigger value="participants" className="data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none">
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="video" className="m-0">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <VideoParticipant 
                    participant={participants[3]} // ASL interpreter
                    isLarge={true}
                    techLevel={userTechLevel}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {participants.slice(0, 3).map(participant => (
                    <VideoParticipant 
                      key={participant.id}
                      participant={participant}
                      techLevel={userTechLevel}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="m-0">
            <div className="px-4 pt-4 pb-0">
              <ScrollArea className="h-[400px]">
                <div className="pr-4 space-y-1">
                  {messages.map(message => (
                    <MessageItem 
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender.id === '1'}
                      techLevel={userTechLevel}
                      communicationPreference={communicationPreference as 'asl' | 'text' | 'both'}
                    />
                  ))}
                  
                  {isRecordingASL && (
                    <div className="my-3 bg-pink-50 border border-pink-200 p-3 rounded-lg flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <Camera className="h-5 w-5 text-pink-600 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-medium text-pink-700">Recording ASL Message</p>
                        <p className="text-sm text-pink-600">Sign your message and click "Send" when finished</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="participants" className="m-0">
            <div className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="pr-4 space-y-3">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {participant.name}
                            {participant.isDeaf && <Badge className="bg-pink-600">Deaf</Badge>}
                            {participant.id === '1' && <Badge className="bg-indigo-600">You</Badge>}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {participant.role}
                            
                            {!participant.hasAudio && (
                              <MicOff className="h-3 w-3 text-red-500" />
                            )}
                            
                            {participant.communicationPreference === 'asl' && (
                              <Badge variant="outline" className="text-xs py-0 px-1">ASL</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {participant.id !== '1' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Private Message</DropdownMenuItem>
                            <DropdownMenuItem>Pin Video</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <div className="w-full mb-4">
          {renderControls()}
        </div>
        
        {activeTab === 'messages' && (
          <div className="w-full flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder={isRecordingASL ? "ASL recording ready to send..." : "Type your message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                disabled={isRecordingASL}
              />
              
              {userTechLevel !== 'beginner' && !isRecordingASL && (
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <Smile className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <Button 
              onClick={sendMessage}
              className={isRecordingASL ? "bg-pink-600 hover:bg-pink-700" : ""}
              disabled={!newMessage && !isRecordingASL}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}