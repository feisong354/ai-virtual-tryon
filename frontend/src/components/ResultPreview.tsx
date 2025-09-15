import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setProcessing, setProgress, setResultImage, setError } from '../store/slices/tryonSlice';
import { tryonService } from '../services/api';

export const ResultPreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userImage, clothingImage, aiSettings, backgroundType, resultImage, processing, progress, analysis, suggestions } = useAppSelector(state => state.tryon);
  const [selectedBackground, setSelectedBackground] = useState('street');

  const handleGenerateResult = async () => {
    if (!userImage || !clothingImage) {
      alert('请先上传用户照片和服装图片');
      return;
    }

    console.log('开始生成试衣效果...', { userImage, clothingImage, aiSettings, backgroundType });
    
    dispatch(setProcessing(true));
    dispatch(setProgress(0));

    try {
      // 调用真实的API生成结果
      const result = await tryonService.generateTryOnResult(
        {
          userImage,
          clothingImage,
          aiSettings,
          backgroundType: backgroundType || undefined
        },
        (progress) => {
          console.log('处理进度:', progress);
          dispatch(setProgress(progress));
        }
      );
      
      console.log('试衣结果生成成功:', result);
      dispatch(setResultImage(result));
    } catch (error) {
      console.error('试衣生成失败:', error);
      dispatch(setError('生成失败，请重试'));
    }
  };

  const backgroundOptions = [
    { id: 'street', name: '商场街景', image: 'https://via.placeholder.com/200x200/2c3e50/ffffff?text=Street' },
    { id: 'home', name: '家居环境', image: 'https://via.placeholder.com/200x200/27ae60/ffffff?text=Home' },
    { id: 'office', name: '办公场景', image: 'https://via.placeholder.com/200x200/8e44ad/ffffff?text=Office' },
    { id: 'studio', name: '摄影棚', image: 'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Studio' }
  ];

  return (
    <section className="mb-16 border-t border-gray-200 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">试衣效果预览</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 font-medium">全屏查看</span>
          <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="preview-container h-[500px] relative">
            {processing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 mb-2">AI正在生成试衣效果...</p>
                <div className="w-64 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{progress}%</p>
              </div>
            ) : resultImage ? (
              <>
                <div className="absolute top-4 left-4 z-10 bg-white/80 rounded-full backdrop-blur flex px-4 py-2 text-blue-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">AI智能生成效果</span>
                </div>
                <img 
                  src={resultImage} 
                  alt="AI-generated outfit preview" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-white rounded-lg flex items-center py-2 px-4 shadow-md">
                    <span className="mr-2">处理状态: 完成</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg mb-2">暂无试衣效果</p>
                <p className="text-sm">请先上传照片并生成试衣效果</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-8">
            <h3 className="font-bold text-gray-700 mb-5">选择背景环境</h3>
            <div className="grid grid-cols-2 gap-4">
              {backgroundOptions.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`bg-option rounded-lg overflow-hidden relative ${
                    selectedBackground === bg.id ? 'active' : ''
                  }`}
                >
                  <img 
                    src={bg.image} 
                    alt={bg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2 text-center">
                    {bg.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-700 mb-3">AI增强选项</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                <span>显示服装材质细节</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                <span>智能光影合成</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>模拟动态效果</span>
              </label>
            </div>
          </div>

          {/* AI分析结果 */}
          {(analysis || suggestions) && (
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-3">AI智能分析</h3>
              {analysis && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-600 mb-2">图像分析</h4>
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {analysis}
                  </div>
                </div>
              )}
              {suggestions && (
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">搭配建议</h4>
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {suggestions}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!processing && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleGenerateResult}
            className="btn-primary rounded-full py-4 px-10 text-lg font-bold"
            disabled={!userImage || !clothingImage}
          >
            <svg className="w-6 h-6 inline-block mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            生成试衣效果
          </button>
        </div>
      )}
    </section>
  );
};
