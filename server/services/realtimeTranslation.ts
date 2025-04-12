/**
 * Real-time Translation Service
 * 
 * This service handles real-time audio translation using WebSockets
 * and an AI speech-to-speech model.
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// List of available languages for translation
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'asl', name: 'American Sign Language' }
];

// Define the session type for tracking active translations
interface TranslationSession {
  id: string;
  originatorId: string;
  listeners: Set<string>;
  language: string;
  active: boolean;
  createdAt: Date;
}

// Map to store active translation sessions
const activeSessions = new Map<string, TranslationSession>();

/**
 * Initialize real-time translation WebSocket server
 */
export function initializeRealtimeTranslation(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer);
  const translationNamespace = io.of('/translation');
  
  console.log('Real-time translation WebSocket server initialized');
  
  // Handle new socket connections
  translationNamespace.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send available languages to client
    socket.emit('available_languages', availableLanguages);
    
    // Handle session creation by client
    socket.on('create_session', ({ language }: { language: string }) => {
      // Create a new translation session
      const sessionId = generateSessionId();
      const session: TranslationSession = {
        id: sessionId,
        originatorId: socket.id,
        listeners: new Set<string>(),
        language,
        active: true,
        createdAt: new Date()
      };
      
      activeSessions.set(sessionId, session);
      
      console.log(`Session created: ${sessionId} for language: ${language}`);
      
      // Join the room for this session
      socket.join(sessionId);
      
      // Notify client of successful session creation
      socket.emit('session_created', { 
        sessionId,
        language,
        createdAt: session.createdAt
      });
    });
    
    // Handle client joining an existing session
    socket.on('join_session', ({ sessionId }: { sessionId: string }) => {
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      if (!session.active) {
        socket.emit('error', { message: 'Session is no longer active' });
        return;
      }
      
      // Add client to listeners
      session.listeners.add(socket.id);
      
      // Join the room for this session
      socket.join(sessionId);
      
      console.log(`Client ${socket.id} joined session: ${sessionId}`);
      
      // Notify client of successful join
      socket.emit('session_joined', { 
        sessionId,
        language: session.language
      });
    });
    
    // Handle audio chunk from the originator
    socket.on('audio_chunk', async ({ 
      sessionId, 
      audioChunk, 
      isFinal = false 
    }: { 
      sessionId: string, 
      audioChunk: ArrayBuffer,
      isFinal?: boolean
    }) => {
      const session = activeSessions.get(sessionId);
      
      if (!session || !session.active) {
        socket.emit('error', { message: 'Invalid or inactive session' });
        return;
      }
      
      // Verify the sender is the originator
      if (session.originatorId !== socket.id) {
        socket.emit('error', { message: 'Only the session originator can send audio' });
        return;
      }
      
      try {
        // In development, we'll use a mock implementation
        // In production, this would use an AI speech-to-speech model
        
        // 1. Transcribe audio to text
        const transcription = await mockTranscribeAudio(audioChunk);
        
        // 2. Translate text to target language
        const translatedAudio = await mockTranslateAudio(audioChunk, session.language);
        
        // 3. Send translated audio to all listeners in the session
        socket.to(sessionId).emit('translated_audio', {
          audioData: translatedAudio,
          transcription,
          isFinal
        });
        
        // Also send the transcription to the originator for UI feedback
        socket.emit('transcription', {
          text: transcription,
          isFinal
        });
        
      } catch (error) {
        console.error('Translation error:', error);
        socket.emit('error', { message: 'Failed to process audio' });
      }
    });
    
    // Handle session end request
    socket.on('end_session', ({ sessionId }: { sessionId: string }) => {
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        return;
      }
      
      // Check if requester is the originator
      if (session.originatorId !== socket.id) {
        socket.emit('error', { message: 'Only the session originator can end the session' });
        return;
      }
      
      // Mark session as inactive
      session.active = false;
      
      // Notify all clients in the session
      translationNamespace.to(sessionId).emit('session_ended', { sessionId });
      
      console.log(`Session ended: ${sessionId}`);
    });
    
    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      // Check if client was an originator of any session
      Array.from(activeSessions.entries()).forEach(([sessionId, session]) => {
        if (session.originatorId === socket.id) {
          // Mark session as inactive
          session.active = false;
          
          // Notify all listeners
          translationNamespace.to(sessionId).emit('session_ended', { 
            sessionId,
            reason: 'Originator disconnected'
          });
          
          console.log(`Session ${sessionId} ended due to originator disconnect`);
        } else if (session.listeners.has(socket.id)) {
          // Remove from listeners
          session.listeners.delete(socket.id);
          console.log(`Listener ${socket.id} removed from session ${sessionId}`);
        }
      });
    });
  });
  
  return io;
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `translation_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Mock function for audio translation (development only)
 * In production, this would use OpenAI's API
 */
async function mockTranslateAudio(audioData: ArrayBuffer, language: string): Promise<ArrayBuffer> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would send the audio to an AI service
  // For now, we'll just return the original audio with a slight modification
  const audioArray = new Uint8Array(audioData);
  
  // Make a copy to avoid modifying the original
  const resultArray = new Uint8Array(audioArray.length);
  
  // Apply a simple transformation to simulate a different language
  // (this is just for development testing, not real translation)
  for (let i = 0; i < audioArray.length; i++) {
    // Slight pitch modification (not a real translation, just a demo effect)
    resultArray[i] = Math.min(255, Math.max(0, audioArray[i] + 10));
  }
  
  return resultArray.buffer;
}

/**
 * Mock function for audio transcription (development only)
 * In production, this would use OpenAI's API
 */
async function mockTranscribeAudio(audioData: ArrayBuffer): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would send the audio to an AI service
  // For now, we'll return a placeholder message
  const responses = [
    "This is a simulated transcription of speech.",
    "Hello, this is a test of the real-time translation system.",
    "Speech recognition would convert audio to this text.",
    "In production, this would use an actual AI speech recognition service."
  ];
  
  // Randomly select one of the responses
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}