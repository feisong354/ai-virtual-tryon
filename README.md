# AI虚拟试衣网页应用

基于React + Node.js + AI技术的智能虚拟试衣应用，为用户提供沉浸式的虚拟试衣体验。

## 🎯 项目特性

- **智能图像处理**：自动裁剪、质量检测、背景去除
- **AI虚拟试衣**：集成火山引擎AI进行智能分析和试衣效果生成
- **多样化背景**：街景、办公室、家庭、商场场景
- **个性化设置**：贴合度调整、特效强度选择
- **完整用户体验**：上传→处理→预览→下载→分享
- **AI智能分析**：图像质量检测、用户体型分析、服装搭配建议

## 🏗️ 技术架构

### 前端技术栈
- **框架**：React 18 + TypeScript
- **样式**：Tailwind CSS
- **状态管理**：Redux Toolkit
- **文件上传**：React Dropzone
- **构建工具**：Vite

### 后端技术栈
- **运行时**：Node.js + Express.js
- **语言**：TypeScript
- **文件处理**：Multer + Sharp
- **验证**：Express Validator
- **安全**：Helmet + CORS
- **AI服务**：火山引擎视觉模型API

## 🚀 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn
- 火山引擎API密钥（已配置）

### 安装和启动

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ai-virtual-tryon
```

2. **一键启动开发环境**
```bash
./start-dev.sh
```

或者手动启动：

3. **安装依赖**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

4. **启动开发服务器**
```bash
# 启动前端 (http://localhost:3000)
cd frontend && npm run dev

# 启动后端 (http://localhost:3001)
cd backend && npm run dev
```

## 📁 项目结构

```
ai-virtual-tryon/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── store/           # Redux状态管理
│   │   ├── services/        # API服务
│   │   └── types/           # TypeScript类型定义
│   └── package.json
├── backend/                 # Node.js后端API
│   ├── src/
│   │   ├── routes/          # API路由
│   │   ├── middleware/      # 中间件
│   │   └── services/        # 业务逻辑
│   └── uploads/             # 文件上传目录
├── tryOn/docs/             # 项目文档
│   ├── 需求描述.md
│   ├── 高保真原型.html
│   └── 产品设计方案.md
└── README.md
```

## 🎨 功能模块

### 1. 图像采集模块
- 用户照片上传（支持拖拽）
- 服装图片上传
- 图像质量检测
- 实时预览

### 2. AI处理设置
- 服装贴合度选择（宽松/标准/修身）
- 特效强度设置（自然/增强/时尚/无特效）
- 背景环境选择

### 3. 试衣效果预览
- AI生成结果展示
- 处理进度显示
- 全屏查看功能
- 背景切换

### 4. 下载分享
- 高清图片下载
- 社交媒体分享
- 效果图保存

## 🔧 开发指南

### 前端开发
```bash
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 后端开发
```bash
cd backend
npm run dev          # 启动开发服务器
npm run build        # 构建TypeScript
npm start            # 启动生产服务器
```

### API接口

#### 上传图片
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "image": File,
  "type": "user" | "clothing"
}
```

#### 生成试衣结果
```http
POST /api/tryon/generate
Content-Type: application/json

{
  "userImage": "string",
  "clothingImage": "string",
  "aiSettings": {
    "fittingStyle": "standard",
    "effectIntensity": "enhanced"
  },
  "backgroundType": "street"
}
```

#### 获取处理状态
```http
GET /api/tryon/status/:sessionId
```

## 🎯 使用说明

1. **上传照片**：拖拽或点击上传用户照片和服装图片
2. **设置参数**：选择服装贴合度和特效强度
3. **生成效果**：点击"生成试衣效果"按钮
4. **查看结果**：等待AI处理完成，查看试衣效果
5. **下载分享**：下载高清图片或分享到社交媒体

## 🔮 未来规划

- [ ] 集成真实AI算法（MediaPipe、OpenCV等）
- [ ] 添加用户认证系统
- [ ] 实现试衣历史记录
- [ ] 支持更多服装类型
- [ ] 添加3D试衣效果
- [ ] 移动端适配优化

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

*基于需求文档和高保真原型设计开发，提供完整的AI虚拟试衣解决方案。*
