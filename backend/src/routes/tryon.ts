import express from 'express';
import { body, validationResult } from 'express-validator';
import { volcengineService } from '../services/volcengineService';
import axios from 'axios';

const router = express.Router();

// 存储处理会话的简单内存存储（生产环境应使用Redis或数据库）
const sessions = new Map<string, any>();

// 处理试衣会话的异步函数
async function processTryOnSession(
  sessionId: string,
  userImageUrl: string,
  clothingImageUrl: string,
  aiSettings: any,
  backgroundType?: string
) {
  try {
    const session = sessions.get(sessionId);
    if (!session) return;

    // 更新进度
    session.progress = 10;
    sessions.set(sessionId, session);

    // 下载并转换图片为base64
    const [userImageResponse, clothingImageResponse] = await Promise.all([
      axios.get(userImageUrl, { responseType: 'arraybuffer' }),
      axios.get(clothingImageUrl, { responseType: 'arraybuffer' })
    ]);

    const userImageBase64 = Buffer.from(userImageResponse.data).toString('base64');
    const clothingImageBase64 = Buffer.from(clothingImageResponse.data).toString('base64');

    session.progress = 30;
    sessions.set(sessionId, session);

    // 调用火山引擎进行智能试衣分析
    const result = await volcengineService.generateTryOnResult(
      userImageBase64,
      clothingImageBase64,
      aiSettings
    );

    session.progress = 80;
    sessions.set(sessionId, session);

    // 更新会话状态
    session.status = 'completed';
    session.progress = 100;
    session.resultImageUrl = result.resultImageUrl;
    session.analysis = result.analysis;
    session.suggestions = result.suggestions;
    session.completedAt = new Date();
    sessions.set(sessionId, session);

  } catch (error) {
    console.error('试衣处理失败:', error);
    const session = sessions.get(sessionId);
    if (session) {
      session.status = 'failed';
      session.error = error instanceof Error ? error.message : '处理失败';
      sessions.set(sessionId, session);
    }
  }
}

// 生成试衣结果
router.post('/generate', [
  body('userImage').custom((value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('用户图片URL无效');
    }
    // 简单的URL格式检查
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      throw new Error('用户图片URL格式无效');
    }
    return true;
  }),
  body('clothingImage').custom((value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('服装图片URL无效');
    }
    // 简单的URL格式检查
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      throw new Error('服装图片URL格式无效');
    }
    return true;
  }),
  body('aiSettings.fittingStyle').isIn(['loose', 'standard', 'tight']).withMessage('无效的贴合度设置'),
  body('aiSettings.effectIntensity').isIn(['natural', 'enhanced', 'fashion', 'none']).withMessage('无效的特效强度设置')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userImage, clothingImage, aiSettings, backgroundType } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 创建处理会话
    sessions.set(sessionId, {
      id: sessionId,
      userImage,
      clothingImage,
      aiSettings,
      backgroundType,
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
      resultImageUrl: null,
      error: null
    });

    // 异步处理 - 调用火山引擎API
    processTryOnSession(sessionId, userImage, clothingImage, aiSettings, backgroundType);

    res.json({
      sessionId,
      status: 'processing',
      message: '试衣处理已开始'
    });

  } catch (error) {
    console.error('生成试衣结果失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取处理状态
router.get('/status/:sessionId', (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: '会话不存在' });
    }

    res.json({
      sessionId: session.id,
      status: session.status,
      progress: session.progress,
      resultImageUrl: session.resultImageUrl,
      analysis: session.analysis,
      suggestions: session.suggestions,
      error: session.error
    });

  } catch (error) {
    console.error('获取处理状态失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取背景模板
router.get('/backgrounds', (req: express.Request, res: express.Response) => {
  try {
    const backgrounds = [
      {
        id: 'street',
        name: '商场街景',
        category: 'outdoor',
        imageUrl: 'https://via.placeholder.com/800x600/2c3e50/ffffff?text=Street+Scene',
        thumbnailUrl: 'https://via.placeholder.com/200x200/2c3e50/ffffff?text=Street'
      },
      {
        id: 'home',
        name: '家居环境',
        category: 'indoor',
        imageUrl: 'https://via.placeholder.com/800x600/27ae60/ffffff?text=Home+Environment',
        thumbnailUrl: 'https://via.placeholder.com/200x200/27ae60/ffffff?text=Home'
      },
      {
        id: 'office',
        name: '办公场景',
        category: 'indoor',
        imageUrl: 'https://via.placeholder.com/800x600/8e44ad/ffffff?text=Office+Scene',
        thumbnailUrl: 'https://via.placeholder.com/200x200/8e44ad/ffffff?text=Office'
      },
      {
        id: 'studio',
        name: '摄影棚',
        category: 'studio',
        imageUrl: 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Photo+Studio',
        thumbnailUrl: 'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Studio'
      }
    ];

    res.json(backgrounds);

  } catch (error) {
    console.error('获取背景模板失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
