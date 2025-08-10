'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function AssessmentPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t('sleepAssessment')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            通过专业的睡眠评估，了解你的失眠状况并获得个性化建议
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                开始你的睡眠评估
              </h2>
              <p className="text-gray-600">
                这个评估将帮助你了解自己的失眠类型和严重程度，并提供相应的建议。
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  评估包含以下方面：
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• 睡眠质量和持续时间</li>
                  <li>• 失眠的频率和严重程度</li>
                  <li>• 生活压力和情绪状态</li>
                  <li>• 睡眠环境和习惯</li>
                  <li>• 对失眠的态度和认知</li>
                </ul>
              </div>
              
              <div className="text-center">
                <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 transition-colors">
                  {t('startAssessment')}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  评估大约需要 5-10 分钟完成
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 