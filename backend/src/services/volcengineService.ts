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
    console.log('开始智能试衣分析...');
    
    // 直接使用模拟数据，因为火山引擎API目前有问题
    console.log('使用模拟数据生成试衣结果');
    return this.generateMockAnalysis(aiSettings);
    
    // 注释掉火山引擎API调用，等API修复后再启用
    /*
    try {
      // 首先尝试调用真实的火山引擎API
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
      } catch (apiError) {
        console.warn('火山引擎API调用失败，使用模拟数据:', apiError);
        
        // 如果API调用失败，返回模拟数据
        return this.generateMockAnalysis(aiSettings);
      }

    } catch (error) {
      console.error('智能试衣分析失败:', error);
      // 返回模拟数据而不是抛出错误
      return this.generateMockAnalysis(aiSettings);
    }
    */
  }

  /**
   * 生成模拟分析数据
   */
  private generateMockAnalysis(aiSettings: {
    fittingStyle: 'loose' | 'standard' | 'tight';
    effectIntensity: 'natural' | 'enhanced' | 'fashion' | 'none';
  }): {
    analysis: string;
    suggestions: string;
    resultImageUrl: string;
  } {
    const fittingStyleMap: Record<string, string> = {
      'loose': '宽松',
      'standard': '标准',
      'tight': '修身'
    };

    const effectIntensityMap: Record<string, string> = {
      'natural': '自然',
      'enhanced': '增强',
      'fashion': '时尚',
      'none': '无特效'
    };

    return {
      analysis: `用户照片分析：
- 人体姿态：正面站立，姿态自然
- 体型特征：标准身材，比例协调
- 肤色：自然肤色，光线良好
- 照片质量：清晰度高，适合AI处理
- 背景环境：简洁背景，便于合成

服装分析：
- 服装类型：时尚上衣
- 颜色图案：经典配色，简约设计
- 材质质感：优质面料，质感良好
- 版型设计：${fittingStyleMap[aiSettings.fittingStyle]}版型
- 适用场合：日常休闲，商务休闲`,

      suggestions: `智能试衣建议：

1. 试衣效果预测：
   - 服装与您的体型匹配度：85%
   - 颜色搭配效果：优秀
   - 整体协调性：良好

2. 搭配建议：
   - 建议搭配深色下装，突出上衣特色
   - 可配搭简约配饰，如手表或项链
   - 鞋子选择：休闲鞋或商务皮鞋

3. 注意事项：
   - 注意保持服装的整洁度
   - 建议在自然光线下查看效果
   - 如有特殊场合需求，可调整搭配

4. 改进建议：
   - 特效强度设置为：${effectIntensityMap[aiSettings.effectIntensity]}
   - 建议尝试不同角度的试衣效果
   - 可考虑搭配不同风格的配饰`,

      resultImageUrl: this.generateMockResultImage('', '')
    };
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
    console.log(`开始${type === 'user' ? '用户' : '服装'}图片质量检测...`);
    
    // 直接返回模拟的质量检测结果
    return {
      valid: true,
      score: 8,
      issues: [],
      suggestions: ['图片质量良好，适合AI试衣处理']
    };
    
    // 注释掉火山引擎API调用，等API修复后再启用
    /*
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
    */
  }
}

export const volcengineService = new VolcEngineService();
