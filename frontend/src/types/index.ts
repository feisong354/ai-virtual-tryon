export interface AISettings {
  fittingStyle: 'loose' | 'standard' | 'tight';
  effectIntensity: 'natural' | 'enhanced' | 'fashion' | 'none';
}

export interface TryOnRequest {
  userImage: string;
  clothingImage: string;
  aiSettings: AISettings;
  backgroundType?: string;
}

export interface TryOnResponse {
  sessionId: string;
  status: 'processing' | 'completed' | 'failed';
  resultImageUrl?: string;
  progress?: number;
  analysis?: string;
  suggestions?: string;
  error?: string;
}

export interface UploadResult {
  imageUrl: string;
  previewUrl: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  qualityCheck?: {
    valid: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  };
}

export interface BackgroundTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
}
