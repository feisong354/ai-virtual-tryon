#!/bin/bash

echo "🚀 启动AI虚拟试衣应用开发环境..."

# 检查Node.js版本
node_version=$(node -v)
echo "📦 Node.js版本: $node_version"

# 安装依赖
echo "📥 安装项目依赖..."
npm install

# 安装前端依赖
echo "📥 安装前端依赖..."
cd frontend
npm install
cd ..

# 安装后端依赖
echo "📥 安装后端依赖..."
cd backend
npm install
cd ..

echo "✅ 依赖安装完成!"

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 使用concurrently同时启动前后端
npx concurrently \
  --names "前端,后端" \
  --prefix-colors "blue,green" \
  "cd frontend && npm run dev" \
  "cd backend && npm run dev"
