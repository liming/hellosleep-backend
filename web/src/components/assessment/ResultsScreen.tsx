'use client';

import type { Tag } from '@/lib/assessment';

interface ResultsScreenProps {
  tags: Tag[];
  answeredCount: number;
  onBack: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const PRIORITY_LABELS: Record<string, string> = {
  high: '重要',
  medium: '中等',
  low: '参考',
};

export default function ResultsScreen({ tags, answeredCount, onBack }: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">评估结果</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1 inline-block">
                基于科学规则的评估系统
              </span>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← 返回
            </button>
          </div>
        </div>

        {tags.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-2">您的睡眠状况良好</h2>
            <p className="text-green-800">基于您的答案，评估未发现明显的睡眠问题。继续保持健康的生活方式！</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">识别的睡眠问题</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.name}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${PRIORITY_COLORS[tag.priority]}`}
                  >
                    {tag.text}
                    <span className="ml-1 text-xs opacity-75">({PRIORITY_LABELS[tag.priority]})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">重点建议</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tags.map((tag) => (
                  <div key={tag.name} className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {tag.recommendation.title}
                    </h3>
                    <p className="text-sm text-gray-600">{tag.recommendation.content}</p>
                    {tag.recommendation.tutorialLink && (
                      <a
                        href={tag.recommendation.tutorialLink}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                      >
                        查看详细教程 →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">评估摘要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">回答的问题数量</p>
              <p className="text-lg font-semibold">{answeredCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">匹配的建议数量</p>
              <p className="text-lg font-semibold">{tags.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
