import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AISettings {
  fittingStyle: 'loose' | 'standard' | 'tight';
  effectIntensity: 'natural' | 'enhanced' | 'fashion' | 'none';
}

interface TryOnState {
  userImage: string | null;
  clothingImage: string | null;
  resultImage: string | null;
  backgroundType: string | null;
  aiSettings: AISettings;
  processing: boolean;
  progress: number;
  error: string | null;
  analysis: string | null;
  suggestions: string | null;
}

const initialState: TryOnState = {
  userImage: null,
  clothingImage: null,
  resultImage: null,
  backgroundType: null,
  aiSettings: {
    fittingStyle: 'standard',
    effectIntensity: 'enhanced'
  },
  processing: false,
  progress: 0,
  error: null,
  analysis: null,
  suggestions: null
};

export const tryonSlice = createSlice({
  name: 'tryon',
  initialState,
  reducers: {
    setUserImage: (state, action: PayloadAction<string>) => {
      state.userImage = action.payload;
      state.error = null;
    },
    setClothingImage: (state, action: PayloadAction<string>) => {
      state.clothingImage = action.payload;
      state.error = null;
    },
    setResultImage: (state, action: PayloadAction<{ imageUrl: string; analysis?: string; suggestions?: string }>) => {
      state.resultImage = action.payload.imageUrl;
      state.analysis = action.payload.analysis || null;
      state.suggestions = action.payload.suggestions || null;
      state.processing = false;
      state.progress = 0;
    },
    setBackgroundType: (state, action: PayloadAction<string>) => {
      state.backgroundType = action.payload;
    },
    updateAISettings: (state, action: PayloadAction<Partial<AISettings>>) => {
      state.aiSettings = { ...state.aiSettings, ...action.payload };
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
      if (action.payload) {
        state.progress = 0;
        state.error = null;
      }
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.processing = false;
    },
    clearTryOn: (state) => {
      state.userImage = null;
      state.clothingImage = null;
      state.resultImage = null;
      state.processing = false;
      state.progress = 0;
      state.error = null;
      state.analysis = null;
      state.suggestions = null;
    }
  }
});

export const {
  setUserImage,
  setClothingImage,
  setResultImage,
  setBackgroundType,
  updateAISettings,
  setProcessing,
  setProgress,
  setError,
  clearTryOn
} = tryonSlice.actions;

export default tryonSlice.reducer;
