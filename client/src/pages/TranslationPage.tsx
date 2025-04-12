import React from 'react';
import { TranslationPanel } from '@/components/translation/TranslationPanel';

/**
 * Translation Page
 * 
 * This page hosts the real-time translation features for the 360 Business Magician platform.
 * It provides a user interface for accessible communication through AI-powered translation.
 */
export default function TranslationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Real-time Translation</h1>
          <p className="text-slate-600">
            Break communication barriers with AI-powered real-time translation. 
            Ideal for meetings, calls, and customer interactions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Start Translating</h2>
            <TranslationPanel />
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">1. Choose Your Language</h3>
                <p className="text-sm text-slate-600">
                  Select the target language you want to translate to.
                  Real-time translation supports multiple languages, including ASL.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">2. Start a Session</h3>
                <p className="text-sm text-slate-600">
                  Click 'Start Translation Session' to initialize the AI-powered
                  speech recognition and translation services.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">3. Speak Clearly</h3>
                <p className="text-sm text-slate-600">
                  Click the microphone button and speak clearly. 
                  Your speech will be captured, transcribed, and translated in real-time.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">4. Share with Others</h3>
                <p className="text-sm text-slate-600">
                  For group conversations, share the session ID with others so they
                  can join and receive translated audio in their preferred language.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Accessibility Features</h3>
              <p className="text-sm text-blue-700">
                Our translation service includes visual cues, transcription display, and
                is optimized to work with screen readers and assistive technologies.
                ASL translation is provided through visual AI processing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Translation FAQs</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">How accurate is the translation?</h3>
              <p className="text-sm text-slate-600">
                Our AI-powered translation achieves high accuracy for common phrases and business terminology,
                though specialized technical terms may sometimes require clarification.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Is my conversation data private?</h3>
              <p className="text-sm text-slate-600">
                Yes. All translation data is processed securely and not stored after your session ends.
                We prioritize privacy in all our services.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">What languages are supported?</h3>
              <p className="text-sm text-slate-600">
                We support major world languages including English, Spanish, French, German,
                Chinese, Japanese, Korean, Russian, Arabic, and more. ASL translation is available through visual processing.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Can I use this for business meetings?</h3>
              <p className="text-sm text-slate-600">
                Absolutely! The translation feature is designed to support business interactions,
                meetings with international clients, and team communications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}