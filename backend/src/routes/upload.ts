import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { config } from '../config';
import { volcengineService } from '../services/volcengineService';

const router = express.Router();

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只支持图片文件'));
    }
  }
});

// 上传图片接口
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const { type } = req.body;
    if (!type || !['user', 'clothing'].includes(type)) {
      return res.status(400).json({ error: '无效的图片类型' });
    }

    const file = req.file;
    const filename = file.filename;
    const filepath = path.join(config.uploadDir, filename);

    // 使用sharp处理图片
    const metadata = await sharp(filepath).metadata();
    
    // 生成缩略图
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = path.join(config.uploadDir, thumbnailFilename);
    
    await sharp(filepath)
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    // 将图片转换为base64用于AI分析
    const imageBuffer = await sharp(filepath).jpeg().toBuffer();
    const imageBase64 = imageBuffer.toString('base64');

    // 使用火山引擎进行图像质量检测
    let qualityCheck = null;
    try {
      qualityCheck = await volcengineService.validateImageQuality(imageBase64, type);
    } catch (error) {
      console.warn('图像质量检测失败，继续处理:', error);
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    res.json({
      imageUrl: `${baseUrl}/uploads/${filename}`,
      previewUrl: `${baseUrl}/uploads/${thumbnailFilename}`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        size: file.size,
        format: metadata.format
      },
      qualityCheck: qualityCheck
    });

  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

export default router;
