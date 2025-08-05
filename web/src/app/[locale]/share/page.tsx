'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function SharePage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t('experienceSharingTitle')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('experienceSharingDesc')}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                我已经好了，好的很彻底
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                现在的我对于偶尔一次的失眠可以坦然到"啊😄失眠了哈哈😄"一点焦虑感也没有了
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>忘记漂泊的云</span>
                <span className="mx-2">•</span>
                <span>2022-10-03</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                用积极的生活方式对待失眠
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                不断失眠不断执行睡吧理念，相信以后面对失眠的时候我照样可以做到
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>枯</span>
                <span className="mx-2">•</span>
                <span>2022-10-01</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                失眠，黑夜里的极光
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                你要去战胜它，不要被黑夜所左右，而要做黑夜里的极光
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>不晓今生梦一场</span>
                <span className="mx-2">•</span>
                <span>2022-10-01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 