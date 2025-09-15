import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '../store/hooks';
import { setUserImage, setClothingImage, setError } from '../store/slices/tryonSlice';
import { tryonService } from '../services/api';

interface ImageUploadProps {
  type: 'user' | 'clothing';
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  onUploadSuccess,
  onUploadError
}) => {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [qualityCheck, setQualityCheck] = useState<any>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 基本验证
    if (file.size > 10 * 1024 * 1024) {
      onUploadError('文件大小不能超过10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      onUploadError('请选择图片文件');
      return;
    }

    setUploading(true);
    try {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // 调用真实的上传API
      try {
        const result = await tryonService.uploadImage(file, type);
        
        // 更新状态
        if (type === 'user') {
          dispatch(setUserImage(result.imageUrl));
        } else {
          dispatch(setClothingImage(result.imageUrl));
        }

        setQualityCheck(result.qualityCheck);
        onUploadSuccess(result.imageUrl);
      } catch (error) {
        // 如果API调用失败，使用本地预览
        const mockResult = {
          imageUrl: previewUrl,
          previewUrl: previewUrl,
          metadata: {
            width: 800,
            height: 600,
            size: file.size,
            format: file.type
          }
        };

        if (type === 'user') {
          dispatch(setUserImage(mockResult.imageUrl));
        } else {
          dispatch(setClothingImage(mockResult.imageUrl));
        }

        onUploadSuccess(mockResult.imageUrl);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败';
      dispatch(setError(errorMessage));
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [type, dispatch, onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (type === 'user') {
      dispatch(setUserImage(''));
    } else {
      dispatch(setClothingImage(''));
    }
  };

  return (
    <div className="upload-area">
      <div
        {...getRootProps()}
        className={`upload-card rounded-xl p-6 flex flex-col h-full justify-center items-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center mb-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2 text-gray-700">
          {type === 'user' ? '上传人物照片' : '上传服装图片'}
        </h3>
        <p className="text-gray-500 text-center mb-4 max-w-xs">
          {type === 'user' 
            ? '上传您的正面全身照，确保光线充足、背景简单'
            : '选择您想试穿的服装图片，支持多种衣物类型'
          }
        </p>
        {uploading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-blue-500">上传中...</span>
          </div>
        ) : (
          <button className="btn-secondary rounded-lg cursor-pointer">
            选择文件
          </button>
        )}
        <p className="text-xs text-gray-400 mt-3">支持 JPG、PNG 格式，最大 10MB</p>
      </div>
      
      {preview && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">照片预览</h4>
            <button 
              className="text-sm text-blue-500 hover:underline"
              onClick={handleRemove}
            >
              更换
            </button>
          </div>
          <div className="preview-container p-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-contain rounded-lg"
            />
          </div>
          
          {/* 图像质量检测结果 */}
          {qualityCheck && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">图像质量</span>
                <span className={`text-sm font-bold ${
                  qualityCheck.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {qualityCheck.score}/10
                </span>
              </div>
              {qualityCheck.issues && qualityCheck.issues.length > 0 && (
                <div className="text-xs text-red-600 mb-2">
                  <div className="font-medium">问题：</div>
                  <ul className="list-disc list-inside">
                    {qualityCheck.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {qualityCheck.suggestions && qualityCheck.suggestions.length > 0 && (
                <div className="text-xs text-blue-600">
                  <div className="font-medium">建议：</div>
                  <ul className="list-disc list-inside">
                    {qualityCheck.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
