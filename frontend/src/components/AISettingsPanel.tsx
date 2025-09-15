import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateAISettings } from '../store/slices/tryonSlice';

export const AISettingsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { aiSettings } = useAppSelector(state => state.tryon);

  const handleFittingStyleChange = (style: 'loose' | 'standard' | 'tight') => {
    dispatch(updateAISettings({ fittingStyle: style }));
  };

  const handleEffectIntensityChange = (intensity: 'natural' | 'enhanced' | 'fashion' | 'none') => {
    dispatch(updateAISettings({ effectIntensity: intensity }));
  };

  const fittingStyleOptions = [
    { value: 'loose', label: '宽松款' },
    { value: 'standard', label: '标准款' },
    { value: 'tight', label: '修身款' }
  ];

  const effectOptions = [
    { value: 'natural', label: '自然效果' },
    { value: 'enhanced', label: '增强光影 (推荐)' },
    { value: 'fashion', label: '时尚大片效果' },
    { value: 'none', label: '无特效' }
  ];

  return (
    <section className="mb-16 border-t border-gray-200 pt-16">
      <div className="flex items-center mb-8">
        <h2 className="section-title">AI处理设置</h2>
        <div className="ml-4 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
          步骤 2/4
        </div>
      </div>
      
      <div className="flex space-x-6 mb-8">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">服装贴合度</label>
          <div className="flex space-x-4">
            {fittingStyleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFittingStyleChange(option.value as any)}
                className={`rounded-lg px-4 py-2 flex-1 text-center transition-all ${
                  aiSettings.fittingStyle === option.value
                    ? 'btn-primary font-medium'
                    : 'btn-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">特效强度</label>
          <select
            value={aiSettings.effectIntensity}
            onChange={(e) => handleEffectIntensityChange(e.target.value as any)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:outline-none"
          >
            {effectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
