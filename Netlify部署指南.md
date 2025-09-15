# Netlify部署指南

## 🚀 部署步骤

### 1. 准备工作
确保您的项目已经推送到GitHub仓库：
```bash
git add .
git commit -m "feat: 添加Netlify部署配置"
git push origin main
```

### 2. 在Netlify中部署

#### 方法一：通过GitHub连接（推荐）
1. 访问 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 "GitHub" 并授权
4. 选择您的仓库：`feisong354/ai-virtual-tryon`
5. 配置构建设置：
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Base directory**: 留空
6. 点击 "Deploy site"

#### 方法二：拖拽部署
1. 在本地运行构建命令：
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. 将 `frontend/dist` 文件夹拖拽到Netlify部署区域

### 3. 环境变量配置（如果需要）
如果您的应用需要环境变量，在Netlify控制台中：
1. 进入 Site settings
2. 点击 Environment variables
3. 添加必要的环境变量

### 4. 自定义域名（可选）
1. 在Netlify控制台中进入 Domain settings
2. 点击 "Add custom domain"
3. 按照提示配置DNS

## 📁 项目结构说明

```
ai-virtual-tryon/
├── netlify.toml              # Netlify配置文件
├── frontend/
│   ├── public/
│   │   └── _redirects        # SPA重定向规则
│   ├── dist/                 # 构建输出目录
│   ├── vite.config.ts        # Vite配置
│   └── package.json          # 前端依赖
└── backend/                  # 后端API（Netlify不部署）
```

## 🔧 配置文件说明

### netlify.toml
- 指定构建命令和发布目录
- 配置SPA重定向规则
- 设置安全头部和缓存策略

### frontend/public/_redirects
- 确保所有路由都重定向到index.html
- 支持React Router的客户端路由

### frontend/vite.config.ts
- 优化构建配置
- 设置正确的base路径
- 配置代码分割

## 🐛 常见问题解决

### 1. Page Not Found 错误
**原因**: SPA路由配置不正确
**解决**: 确保 `_redirects` 文件存在且内容正确

### 2. 构建失败
**原因**: 依赖安装或构建命令错误
**解决**: 检查 `netlify.toml` 中的构建命令

### 3. 静态资源404
**原因**: 路径配置错误
**解决**: 检查 `vite.config.ts` 中的 `base` 配置

### 4. API请求失败
**原因**: 后端API未部署
**解决**: 需要单独部署后端到其他平台（如Vercel、Railway等）

## 📊 部署后验证

1. **首页访问**: 确保能正常访问首页
2. **路由测试**: 测试直接访问子路由是否正常
3. **功能测试**: 验证主要功能是否正常工作
4. **性能检查**: 使用Lighthouse检查性能

## 🔄 自动部署

配置完成后，每次推送到GitHub的main分支都会自动触发Netlify部署。

## 📞 技术支持

如果遇到问题，请检查：
1. Netlify构建日志
2. 浏览器控制台错误
3. 网络请求状态

---

**部署成功后，您的AI虚拟试衣应用将在Netlify上运行！** 🎉
