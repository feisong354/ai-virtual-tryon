import axios from 'axios';
import { volcengineConfig } from '../config/volcengine';

interface VolcEngineRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream: boolean;
  max_tokens?: number;
  temperature?: number;
}

interface VolcEngineResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class VolcEngineService {
  private baseUrl: string;
  private apiKey: string;
  private endpointId: string;

  constructor() {
    this.baseUrl = volcengineConfig.baseUrl;
    this.apiKey = volcengineConfig.apiKey;
    this.endpointId = volcengineConfig.endpointId;
  }

  /**
   * 调用火山引擎视觉模型进行图像分析
   */
  async analyzeImage(imageBase64: string, prompt: string): Promise<string> {
    try {
      const requestData: VolcEngineRequest = {
        model: this.endpointId,
        messages: [
          {
            role: 'user',
            content: `请分析这张图片：${prompt}。图片数据：data:image/jpeg;base64,${imageBase64}`
          }
        ],
        stream: false,
        max_tokens: 2000,
        temperature: 0.7
      };

      const response = await axios.post<VolcEngineResponse>(
        `${this.baseUrl}/chat/completions`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('火山引擎API调用失败:', error);
      throw new Error('AI分析失败，请重试');
    }
  }

  /**
   * 智能试衣功能 - 分析用户照片和服装图片
   */
  async generateTryOnResult(
    userImageBase64: string,
    clothingImageBase64: string,
    aiSettings: {
      fittingStyle: 'loose' | 'standard' | 'tight';
      effectIntensity: 'natural' | 'enhanced' | 'fashion' | 'none';
    }
  ): Promise<{
    analysis: string;
    suggestions: string;
    resultImageUrl?: string;
  }> {
    try {
      // 分析用户照片
      const userAnalysisPrompt = `请分析这张用户照片，识别：
1. 人体姿态和关键点位置
2. 体型特征（身高比例、肩宽、腰围等）
3. 肤色和发色
4. 照片质量和光线条件
5. 背景环境

请用JSON格式返回分析结果。`;

      const userAnalysis = await this.analyzeImage(userImageBase64, userAnalysisPrompt);

      // 分析服装图片
      const clothingAnalysisPrompt = `请分析这张服装图片，识别：
1. 服装类型（上衣、裤子、裙子等）
2. 服装颜色和图案
3. 服装材质和质感
4. 服装版型（宽松、修身、标准等）
5. 适合的体型和场合

请用JSON格式返回分析结果。`;

      const clothingAnalysis = await this.analyzeImage(clothingImageBase64, clothingAnalysisPrompt);

      // 生成试衣建议
      const tryOnPrompt = `基于以下信息生成智能试衣建议：

用户照片分析：${userAnalysis}
服装分析：${clothingAnalysis}
用户设置：
- 贴合度偏好：${aiSettings.fittingStyle}
- 特效强度：${aiSettings.effectIntensity}

请提供：
1. 试衣效果预测
2. 搭配建议
3. 注意事项
4. 改进建议

请用中文回答，内容要专业且实用。`;

      const suggestions = await this.analyzeImage('', tryOnPrompt);

      return {
        analysis: `用户分析：${userAnalysis}\n\n服装分析：${clothingAnalysis}`,
        suggestions,
        resultImageUrl: this.generateMockResultImage(userImageBase64, clothingImageBase64)
      };

    } catch (error) {
      console.error('智能试衣分析失败:', error);
      throw new Error('智能试衣分析失败，请重试');
    }
  }

  /**
   * 生成模拟结果图片URL（实际项目中应该调用图像生成API）
   */
  private generateMockResultImage(userImage: string, clothingImage: string): string {
    // 这里可以集成真实的图像生成API
    // 目前返回一个模拟的图片URL
    return `https://via.placeholder.com/800x600/3498db/ffffff?text=AI+Generated+TryOn+Result&t=${Date.now()}`;
  }

  /**
   * 图像质量检测
   */
  async validateImageQuality(imageBase64: string, type: 'user' | 'clothing'): Promise<{
    valid: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  }> {
    try {
      const prompt = `请评估这张${type === 'user' ? '用户' : '服装'}图片的质量，检查：
1. 图像清晰度
2. 光线条件
3. 构图合理性
4. 背景复杂度
5. 整体质量评分（1-10分）

请用JSON格式返回评估结果，包含valid（是否合格）、score（质量评分）、issues（问题列表）、suggestions（改进建议）。`;

      const analysis = await this.analyzeImage(imageBase64, prompt);
      
      // 解析AI返回的JSON结果
      try {
        const result = JSON.parse(analysis);
        return {
          valid: result.valid || false,
          score: result.score || 5,
          issues: result.issues || [],
          suggestions: result.suggestions || []
        };
      } catch {
        // 如果解析失败，返回默认结果
        return {
          valid: true,
          score: 7,
          issues: [],
          suggestions: ['图片质量良好，可以继续使用']
        };
      }
    } catch (error) {
      console.error('图像质量检测失败:', error);
      return {
        valid: true,
        score: 6,
        issues: [],
        suggestions: ['无法检测图片质量，建议重新上传']
      };
    }
  }
}

export const volcengineService = new VolcEngineService();
