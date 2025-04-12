import React, { useEffect, useState, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MicIcon, PhoneIcon, VolumeIcon, Volume2Icon } from 'lucide-react';

// Define available language type
interface Language {
  code: string;
  name: string;
}

// Translation session status
type SessionStatus = 'idle' | 'connecting' | 'active' | 'error';

/**
 * Real-time Translation Panel Component
 * 
 * This component provides a user interface for real-time audio translation between languages.
 * It includes controls for starting a translation session, selecting languages, and 
 * controlling audio input/output.
 */
export function TranslationPanel() {
  // Socket.io connection reference
  const socketRef = useRef<Socket | null>(null);
  
  // Audio recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Component state
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Initialize socket connection
  useEffect(() => {
    // Create socket connection to translation namespace
    const socket = io('/translation');
    socketRef.current = socket;
    
    // Set up socket event listeners
    socket.on('connect', () => {
      console.log('Connected to translation server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from translation server');
      setStatus('idle');
      setSessionId(null);
    });
    
    socket.on('available_languages', (languages: Language[]) => {
      setAvailableLanguages(languages);
    });
    
    socket.on('session_created', ({ sessionId }) => {
      setSessionId(sessionId);
      setStatus('active');
      setErrorMessage('');
    });
    
    socket.on('session_joined', () => {
      setStatus('active');
      setErrorMessage('');
    });
    
    socket.on('session_ended', () => {
      setStatus('idle');
      setSessionId(null);
      stopRecording();
    });
    
    socket.on('transcription', ({ text }) => {
      setTranscription(text);
    });
    
    socket.on('translated_audio', ({ audioData, transcription }) => {
      // In a real implementation, this would play the audio through the speakers
      console.log('Received translated audio', { transcription });
      if (!isMuted) {
        // Play audio (mock implementation)
        playAudioMock();
      }
    });
    
    socket.on('error', ({ message }) => {
      console.error('Translation error:', message);
      setErrorMessage(message);
      setStatus('error');
    });
    
    // Clean up on component unmount
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      socket.disconnect();
    };
  }, [isMuted]);
  
  // Create a new translation session
  const startSession = () => {
    if (!socketRef.current || status === 'active') return;
    
    setStatus('connecting');
    socketRef.current.emit('create_session', { language: selectedLanguage });
  };
  
  // End the current translation session
  const endSession = () => {
    if (!socketRef.current || !sessionId) return;
    
    stopRecording();
    socketRef.current.emit('end_session', { sessionId });
    setStatus('idle');
    setSessionId(null);
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Convert blob to ArrayBuffer and send to server
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result && socketRef.current && sessionId) {
              socketRef.current.emit('audio_chunk', {
                sessionId,
                audioChunk: reader.result,
                isFinal: false
              });
            }
          };
          reader.readAsArrayBuffer(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Final chunk with isFinal=true
        const blob = new Blob(audioChunksRef.current);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && socketRef.current && sessionId) {
            socketRef.current.emit('audio_chunk', {
              sessionId,
              audioChunk: reader.result,
              isFinal: true
            });
          }
        };
        reader.readAsArrayBuffer(blob);
        
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording in 100ms chunks
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('Could not access microphone. Please check your permissions.');
      setStatus('error');
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Toggle mute status
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    // In a real implementation, this would adjust the actual audio volume
  };
  
  // Mock function to simulate playing audio
  const playAudioMock = () => {
    // In a real implementation, this would play the received audio
    console.log('Playing audio at volume', volume);
  };
  
  // Render language selection options
  const renderLanguageOptions = () => {
    return availableLanguages.map((lang) => (
      <SelectItem key={lang.code} value={lang.code}>
        {lang.name}
      </SelectItem>
    ));
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Real-time Translation
          {status === 'active' && <Badge variant="outline" className="bg-green-100">Active</Badge>}
        </CardTitle>
        <CardDescription>
          Translate spoken language in real-time for accessible communication
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Language</label>
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={status === 'active'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.length > 0 
                ? renderLanguageOptions() 
                : <SelectItem value="loading">Loading languages...</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        
        {/* Transcription Display */}
        {status === 'active' && (
          <div className="mt-4 p-3 bg-slate-50 rounded-md min-h-[80px] border">
            <p className="text-sm text-slate-500 mb-1">Transcription:</p>
            <p className="text-base">{transcription || 'Waiting for speech...'}</p>
          </div>
        )}
        
        {/* Audio Controls (when in session) */}
        {status === 'active' && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {isRecording ? 'Recording...' : 'Mic off'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
              </Button>
              <span className="text-sm">
                {isMuted ? 'Muted' : 'Volume: ' + volume + '%'}
              </span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {status === 'idle' ? (
          <Button 
            className="w-full" 
            onClick={startSession}
          >
            Start Translation Session
          </Button>
        ) : status === 'active' ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={endSession}
          >
            End Session
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full"
          >
            Connecting...
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}