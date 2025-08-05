'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function TutorialPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t('knowledgeBaseTitle')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('knowledgeBaseDesc')}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">失眠的本质</h3>
            <p className="text-gray-600 text-sm">
              了解失眠的根本原因，为什么失眠是正常的生理反应，而不是疾病。
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">失眠的成因</h3>
            <p className="text-gray-600 text-sm">
              探索导致失眠的各种因素，从生活压力到心理状态的变化。
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">解决方案</h3>
            <p className="text-gray-600 text-sm">
              学习如何通过改变生活方式和心态来应对失眠。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 