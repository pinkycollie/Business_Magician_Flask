import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// PinkSync Communication API Service for Deaf Accessibility

export interface PinkSyncTranslator {
  id: string;
  name: string;
  profileImageUrl?: string;
  languages: string[];
  specialties: string[];
  businessPhases: ('idea' | 'build' | 'grow' | 'manage')[];
  certifications: string[];
  availability: {
    timezone: string;
    availableHours: string[];
    availableDays: string[];
  };
  rating: number;
  ratingCount: number;
  hourlyRate?: number;
  biography: string;
  videoIntroUrl?: string;
}

export interface TranslationSession {
  id: string;
  translatorId: string;
  userId: string;
  businessId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  recordings?: string[];
  topics: string[];
  businessPhase?: 'idea' | 'build' | 'grow' | 'manage';
}

export interface PinkSyncSettings {
  preferredLanguage: 'ASL' | 'SEE' | 'PSE' | 'Other';
  otherLanguage?: string;
  needsRealTimeTranslation: boolean;
  preferredTranslators?: string[];
  communicationPreferences: {
    videoFirst: boolean;
    needsCaptions: boolean;
    captionFontSize?: 'small' | 'medium' | 'large';
    highContrast: boolean;
    flashNotifications: boolean;
  };
  accessibilityAccommodations?: string[];
}

class PinkSyncService {
  private apiKey: string;
  private apiBaseUrl: string;
  private mockMode: boolean;

  constructor() {
    this.apiKey = process.env.PINKSYNC_API_KEY || '';
    this.apiBaseUrl = 'https://api.pinksync.com/v1';
    this.mockMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.mockMode) {
      console.log('PinkSync Service running in mock mode');
    }
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    if (this.mockMode) {
      return this.generateMockResponse<T>(endpoint, data);
    }

    try {
      const response = await axios({
        method,
        url: `${this.apiBaseUrl}${endpoint}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `PinkSync API error: ${error.response.status} - ${
            error.response.data?.message || error.message
          }`
        );
      }
      throw error;
    }
  }

  // Mock response generator for development and testing
  private generateMockResponse<T>(endpoint: string, data?: any): T {
    if (endpoint === '/translators') {
      return [
        {
          id: 'tr-0001',
          name: 'Sarah Johnson',
          profileImageUrl: '/profiles/sarah-johnson.jpg',
          languages: ['ASL', 'SEE'],
          specialties: ['Business Formation', 'Financial Planning', 'Marketing'],
          businessPhases: ['idea', 'build'],
          certifications: ['RID Certified', 'NIC Master', 'BEI Advanced'],
          availability: {
            timezone: 'America/New_York',
            availableHours: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
          },
          rating: 4.9,
          ratingCount: 127,
          hourlyRate: 75,
          biography: 'Sarah is a nationally certified interpreter with over 10 years of experience in business settings. She specializes in helping deaf entrepreneurs navigate the early stages of business development.',
          videoIntroUrl: '/videos/intro-sarah-johnson.mp4'
        },
        {
          id: 'tr-0002',
          name: 'Michael Chen',
          profileImageUrl: '/profiles/michael-chen.jpg',
          languages: ['ASL', 'PSE'],
          specialties: ['Technology', 'Web Development', 'E-commerce'],
          businessPhases: ['build', 'grow'],
          certifications: ['RID Certified', 'NIC', 'Tech Specialist'],
          availability: {
            timezone: 'America/Los_Angeles',
            availableHours: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
            availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday']
          },
          rating: 4.8,
          ratingCount: 93,
          hourlyRate: 80,
          biography: 'Michael specializes in technical interpreting for deaf business owners in the technology sector. He has a background in computer science and deep understanding of technical concepts.',
          videoIntroUrl: '/videos/intro-michael-chen.mp4'
        },
        {
          id: 'tr-0003',
          name: 'Jamal Washington',
          profileImageUrl: '/profiles/jamal-washington.jpg',
          languages: ['ASL'],
          specialties: ['Legal', 'Business Operations', 'Management'],
          businessPhases: ['grow', 'manage'],
          certifications: ['RID Certified', 'SC:L', 'MBA'],
          availability: {
            timezone: 'America/Chicago',
            availableHours: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
            availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          rating: 4.7,
          ratingCount: 85,
          hourlyRate: 85,
          biography: 'Jamal combines his MBA and interpreting certifications to provide specialized interpreting for business operations, legal matters, and management scenarios.',
          videoIntroUrl: '/videos/intro-jamal-washington.mp4'
        },
        {
          id: 'tr-0004',
          name: 'Elena Rodriguez',
          profileImageUrl: '/profiles/elena-rodriguez.jpg',
          languages: ['ASL', 'Spanish', 'SEE'],
          specialties: ['Marketing', 'International Business', 'Customer Relations'],
          businessPhases: ['idea', 'grow'],
          certifications: ['RID Certified', 'NIC', 'Trilingual Certification'],
          availability: {
            timezone: 'America/New_York',
            availableHours: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday']
          },
          rating: 4.9,
          ratingCount: 112,
          hourlyRate: 90,
          biography: 'Elena is a trilingual interpreter specializing in international business contexts. She helps deaf entrepreneurs connect with global markets and develop marketing strategies.',
          videoIntroUrl: '/videos/intro-elena-rodriguez.mp4'
        },
        {
          id: 'tr-0005',
          name: 'David Kim',
          profileImageUrl: '/profiles/david-kim.jpg',
          languages: ['ASL', 'Korean', 'PSE'],
          specialties: ['Financial Planning', 'Accounting', 'Tax Preparation'],
          businessPhases: ['build', 'manage'],
          certifications: ['RID Certified', 'CPA', 'Financial Specialist'],
          availability: {
            timezone: 'America/Los_Angeles',
            availableHours: ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
          },
          rating: 4.8,
          ratingCount: 76,
          hourlyRate: 85,
          biography: 'David combines his accounting expertise with interpreting skills to provide specialized financial services for deaf business owners.',
          videoIntroUrl: '/videos/intro-david-kim.mp4'
        }
      ] as unknown as T;
    }
    
    if (endpoint === '/sessions/schedule' && data) {
      return {
        id: `session-${uuidv4().substring(0, 8)}`,
        translatorId: data.translatorId,
        userId: data.userId,
        businessId: data.businessId,
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        status: 'scheduled',
        topics: data.topics || [],
        businessPhase: data.businessPhase,
        createdAt: new Date().toISOString(),
        meetingUrl: `https://meeting.pinksync.com/${uuidv4().substring(0, 8)}`
      } as unknown as T;
    }
    
    if (endpoint.startsWith('/translators/') && endpoint.includes('/availability')) {
      const translatorId = endpoint.split('/')[2];
      
      // Generate mock availability slots for the next 7 days
      const availabilitySlots = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Generate 3-5 random slots per day
        const slotsCount = Math.floor(Math.random() * 3) + 3;
        
        for (let j = 0; j < slotsCount; j++) {
          const startHour = 9 + Math.floor(Math.random() * 7); // 9 AM to 4 PM
          const duration = 30 * (Math.floor(Math.random() * 4) + 1); // 30, 60, 90, or 120 minutes
          
          const startTime = new Date(date);
          startTime.setHours(startHour, 0, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + duration);
          
          availabilitySlots.push({
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            duration: duration,
            available: true
          });
        }
      }
      
      return {
        translatorId,
        availabilitySlots
      } as unknown as T;
    }
    
    if (endpoint === '/settings' && data) {
      return {
        ...data,
        id: 'settings-001',
        updatedAt: new Date().toISOString()
      } as unknown as T;
    }
    
    // Default mock response
    return { success: true, mockData: true } as unknown as T;
  }

  /**
   * Get available translators with optional filtering
   */
  public async getTranslators(
    businessPhase?: string,
    specialties?: string[],
    languages?: string[]
  ): Promise<PinkSyncTranslator[]> {
    const translators = await this.makeRequest<PinkSyncTranslator[]>('GET', '/translators');
    
    // Apply filters if provided
    return translators.filter(translator => {
      let match = true;
      
      if (businessPhase && !translator.businessPhases.includes(businessPhase as any)) {
        match = false;
      }
      
      if (specialties && specialties.length > 0) {
        const hasSpecialty = specialties.some(specialty => 
          translator.specialties.includes(specialty)
        );
        if (!hasSpecialty) match = false;
      }
      
      if (languages && languages.length > 0) {
        const hasLanguage = languages.some(language => 
          translator.languages.includes(language)
        );
        if (!hasLanguage) match = false;
      }
      
      return match;
    });
  }

  /**
   * Get translator details by ID
   */
  public async getTranslator(translatorId: string): Promise<PinkSyncTranslator> {
    return this.makeRequest<PinkSyncTranslator>('GET', `/translators/${translatorId}`);
  }

  /**
   * Get translator availability
   */
  public async getTranslatorAvailability(translatorId: string, startDate: Date, endDate: Date): Promise<any> {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return this.makeRequest<any>(
      'GET', 
      `/translators/${translatorId}/availability?startDate=${startDateStr}&endDate=${endDateStr}`
    );
  }

  /**
   * Schedule a translation session
   */
  public async scheduleSession(sessionData: Partial<TranslationSession>): Promise<any> {
    return this.makeRequest<any>('POST', '/sessions/schedule', sessionData);
  }

  /**
   * Get user's upcoming sessions
   */
  public async getUserSessions(userId: string, status?: string): Promise<TranslationSession[]> {
    const statusParam = status ? `?status=${status}` : '';
    return this.makeRequest<TranslationSession[]>('GET', `/users/${userId}/sessions${statusParam}`);
  }

  /**
   * Update user's PinkSync settings
   */
  public async updateSettings(userId: string, settings: PinkSyncSettings): Promise<any> {
    return this.makeRequest<any>('PUT', '/settings', {
      userId,
      ...settings
    });
  }

  /**
   * Get user's PinkSync settings
   */
  public async getSettings(userId: string): Promise<PinkSyncSettings> {
    return this.makeRequest<PinkSyncSettings>('GET', `/settings?userId=${userId}`);
  }
}

export const pinkSyncService = new PinkSyncService();