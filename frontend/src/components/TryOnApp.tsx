import React from 'react';
import { ImageUpload } from './ImageUpload';
import { AISettingsPanel } from './AISettingsPanel';
import { ResultPreview } from './ResultPreview';

export const TryOnApp: React.FC = () => {
  const handleUploadSuccess = (url: string) => {
    console.log('Upload successful:', url);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    alert(error);
  };

  return (
    <div className="app-container flex flex-col">
      {/* 顶部导航 */}
      <header className="header px-12 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">StyleAI · 智能虚拟试衣</h1>
        </div>
        <nav className="flex space-x-8">
          <a href="#" className="text-base font-medium text-gray-600 hover:text-blue-500 transition">首页</a>
          <a href="#" className="text-base font-medium text-gray-600 hover:text-blue-500 transition">教程</a>
          <a href="#" className="text-base font-medium text-gray-600 hover:text-blue-500 transition">模板</a>
          <a href="#" className="text-base font-medium text-blue-500">我的试衣</a>
        </nav>
      </header>

      {/* 主内容区 */}
      <main className="content-flex px-12 py-8">
        {/* 图像采集区 */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="section-title">图像采集</h2>
            <div className="ml-4 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">步骤 1/4</div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            {/* 用户照片上传 */}
            <ImageUpload 
              type="user" 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />

            {/* 服装图片上传 */}
            <ImageUpload 
              type="clothing" 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </section>

        {/* AI处理控制区 */}
        <AISettingsPanel />

        {/* 效果展示区 */}
        <ResultPreview />
      </main>

      {/* 底部操作区 */}
      <footer className="footer px-12 py-8">
        <div className="flex justify-between items-center">
          <div>
            <button className="bg-blue-500 hover:bg-blue-600 py-3 px-7 rounded-lg text-white font-medium mr-4">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载效果图
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 py-3 px-7 rounded-lg text-white font-medium">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              分享效果
            </button>
          </div>
          <div className="text-gray-400 text-sm flex space-x-6">
            <a href="#" className="hover:text-white transition">使用协议</a>
            <a href="#" className="hover:text-white transition">隐私政策</a>
            <a href="#" className="hover:text-white transition">帮助中心</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
