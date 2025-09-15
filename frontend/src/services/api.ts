import axios from 'axios';
import type { TryOnRequest, TryOnResponse, UploadResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const tryonService = {
  // 上传图像
  async uploadImage(file: File, type: 'user' | 'clothing'): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await api.post<UploadResult>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    return response.data;
  },

  // 生成试衣结果
  async generateTryOnResult(
    request: TryOnRequest,
    onProgress?: (progress: number) => void
  ): Promise<{ imageUrl: string; analysis?: string; suggestions?: string }> {
    const response = await api.post<TryOnResponse>('/tryon/generate', request);
    
    // 轮询检查处理状态
    return new Promise((resolve, reject) => {
      const pollStatus = async () => {
        try {
          const statusResponse = await api.get<TryOnResponse>(`/tryon/status/${response.data.sessionId}`);
          
          if (statusResponse.data.progress) {
            onProgress?.(statusResponse.data.progress);
          }
          
          if (statusResponse.data.status === 'completed') {
            resolve({ 
              imageUrl: statusResponse.data.resultImageUrl!,
              analysis: statusResponse.data.analysis,
              suggestions: statusResponse.data.suggestions
            });
          } else if (statusResponse.data.status === 'failed') {
            reject(new Error(statusResponse.data.error || '处理失败'));
          } else {
            // 继续轮询
            setTimeout(pollStatus, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      pollStatus();
    });
  },

  // 获取背景模板
  async getBackgroundTemplates() {
    const response = await api.get('/backgrounds');
    return response.data;
  }
};

export default api;
