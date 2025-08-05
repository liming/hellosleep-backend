'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t('blog')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            最新的睡眠健康资讯和专家观点
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                慢性失眠，来自于我们的精心培育
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                失眠就像是一根柱子，而失眠所带来的焦虑和担忧就像是一根绳子...
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>专家观点</span>
                <span className="mx-2">•</span>
                <span>2022-09-28</span>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                我要努力睡着
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                如果睡眠发生，那就让它自然的发生。如果睡眠不发生，那就让它自然的不发生。
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>生活哲学</span>
                <span className="mx-2">•</span>
                <span>2022-09-27</span>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                "抱怨"的背后
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                抱怨这种负能量不仅影响听到看到言论的每个人，更是在培育我们对失眠的执着。
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>心理分析</span>
                <span className="mx-2">•</span>
                <span>2022-09-23</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
} 