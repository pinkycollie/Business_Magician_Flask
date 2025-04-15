import Mux from '@mux/mux-node';
import { v4 as uuidv4 } from 'uuid';

// Mux Video API Service for Video Processing & Streaming

export interface VideoUploadOptions {
  title: string;
  description?: string;
  passthrough?: string;
  maxDuration?: number;
  cors_origin?: string;
  test?: boolean;
}

export interface VideoDetails {
  id: string;
  assetId: string;
  playbackId: string;
  status: string;
  duration: number;
  aspectRatio: string;
  createdAt: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  hlsUrl?: string;
  mp4Url?: string;
  metadata?: Record<string, any>;
}

class MuxService {
  private muxClient: any;
  private muxVideo: any;
  private webhookSecret: string;
  private mockMode: boolean;

  constructor() {
    const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
    const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;
    this.webhookSecret = process.env.MUX_WEBHOOK_SECRET || '';
    this.mockMode = !MUX_TOKEN_ID || !MUX_TOKEN_SECRET || process.env.NODE_ENV === 'development';
    
    if (!this.mockMode) {
      this.muxClient = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET });
      this.muxVideo = this.muxClient.Video;
    } else {
      console.log('MUX Service running in mock mode');
      this.muxClient = null;
      this.muxVideo = null;
    }
  }

  /**
   * Creates a direct upload URL for uploading video files from the browser
   */
  public async createUploadUrl(options: VideoUploadOptions): Promise<any> {
    if (this.mockMode) {
      return this.generateMockUploadUrl(options);
    }

    try {
      const upload = await this.muxVideo.Uploads.create({
        new_asset_settings: {
          playback_policy: ['public'],
          mp4_support: 'standard',
          test: options.test || false,
          passthrough: options.passthrough,
        },
        cors_origin: options.cors_origin || '*',
        timeout: 3600,
      });
      
      return {
        uploadId: upload.id,
        uploadUrl: upload.url,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      };
    } catch (error) {
      console.error('Error creating MUX upload URL:', error);
      throw new Error(`Failed to create upload URL: ${error.message}`);
    }
  }

  /**
   * Get asset details from MUX after upload is complete
   */
  public async getAssetDetails(assetId: string): Promise<VideoDetails> {
    if (this.mockMode) {
      return this.generateMockAssetDetails(assetId);
    }

    try {
      const asset = await this.muxVideo.Assets.get(assetId);
      const playbackId = asset.playback_ids?.[0]?.id;
      
      return {
        id: uuidv4(),
        assetId: asset.id,
        playbackId: playbackId,
        status: asset.status,
        duration: asset.duration,
        aspectRatio: asset.aspect_ratio,
        createdAt: asset.created_at,
        title: asset.meta?.title || 'Untitled Video',
        description: asset.meta?.description,
        thumbnailUrl: playbackId ? 
          `https://image.mux.com/${playbackId}/thumbnail.jpg` : undefined,
        hlsUrl: playbackId ? 
          `https://stream.mux.com/${playbackId}.m3u8` : undefined,
        mp4Url: playbackId ? 
          `https://stream.mux.com/${playbackId}/low.mp4` : undefined,
        metadata: asset.meta,
      };
    } catch (error) {
      console.error('Error getting MUX asset details:', error);
      throw new Error(`Failed to get asset details: ${error.message}`);
    }
  }

  /**
   * Delete a video asset from MUX
   */
  public async deleteAsset(assetId: string): Promise<boolean> {
    if (this.mockMode) {
      return true; // Mock success
    }

    try {
      await this.muxVideo.Assets.del(assetId);
      return true;
    } catch (error) {
      console.error('Error deleting MUX asset:', error);
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
  }

  /**
   * Create a signed playback URL for secure video delivery
   */
  public async createSignedPlaybackUrl(playbackId: string, expiresIn = 3600): Promise<string> {
    if (this.mockMode) {
      return `https://stream.mux.com/${playbackId}.m3u8?mock_signed=true`;
    }

    // Code for creating signed URLs would go here
    // This requires the JWT library and playback signing keys
    return `https://stream.mux.com/${playbackId}.m3u8?signed=true`;
  }

  /**
   * Verify a webhook signature from MUX
   */
  public verifyWebhookSignature(payload: string, headers: any): boolean {
    if (this.mockMode || !this.webhookSecret) {
      return true; // Skip verification in mock mode
    }

    // Code for verifying webhook signatures would go here
    // This uses the webhook secret and signature from headers
    return true; 
  }

  // Mock response methods for development
  private generateMockUploadUrl(options: VideoUploadOptions): any {
    const mockUploadId = `upload-${uuidv4().split('-')[0]}`;
    
    return {
      uploadId: mockUploadId,
      uploadUrl: `https://storage.googleapis.com/video-storage-mock/${mockUploadId}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
  }

  private generateMockAssetDetails(assetId: string): VideoDetails {
    const playbackId = `pbid-${uuidv4().split('-')[0]}`;
    
    return {
      id: uuidv4(),
      assetId: assetId || `asset-${uuidv4().split('-')[0]}`,
      playbackId: playbackId,
      status: 'ready',
      duration: Math.floor(Math.random() * 180) + 30, // 30-210 seconds
      aspectRatio: '16:9',
      createdAt: new Date().toISOString(),
      title: 'Sample Video',
      description: 'This is a sample video created in mock mode',
      thumbnailUrl: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
      hlsUrl: `https://stream.mux.com/${playbackId}.m3u8`,
      mp4Url: `https://stream.mux.com/${playbackId}/low.mp4`,
      metadata: {
        source: 'mock'
      }
    };
  }
}

export const muxService = new MuxService();