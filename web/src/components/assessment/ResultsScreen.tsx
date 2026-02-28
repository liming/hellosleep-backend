'use client';

import { useMemo, useState } from 'react';
import type { Tag } from '@/lib/assessment';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentHistory from '@/components/assessment/AssessmentHistory';

interface ResultsScreenProps {
  tags: Tag[];
  onRetake: () => void;
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

export default function ResultsScreen({ tags, onRetake }: ResultsScreenProps) {
  const { user } = useAuth();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const copyText = useMemo(() => {
    if (!tags.length) {
      return [
        '我的睡眠评估结果：',
        '当前未发现明显睡眠问题，建议继续保持良好作息与生活习惯。',
      ].join('\n');
    }

    const lines: string[] = ['我的睡眠评估结果：', ''];
    lines.push('识别到的问题：');
    tags.forEach((tag) => lines.push(`- ${tag.text}（${PRIORITY_LABELS[tag.priority]}）`));
    lines.push('');
    lines.push('重点建议：');
    tags.forEach((tag, idx) => {
      lines.push(`${idx + 1}. ${tag.recommendation.title}`);
      lines.push(`   ${tag.recommendation.content}`);
      if (tag.recommendation.tutorialLink) {
        lines.push(`   教程：${tag.recommendation.tutorialLink}`);
      }
    });
    return lines.join('\n');
  }, [tags]);

  const handleCopyResult = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(copyText);
      setCopyState('copied');
    } catch (error) {
      console.error('Failed to copy assessment result:', error);
      setCopyState('error');
    } finally {
      setTimeout(() => setCopyState('idle'), 1800);
    }
  };

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyResult}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                复制评估结果
              </button>
            </div>
          </div>
          {copyState === 'copied' && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              已复制，可直接粘贴到 community 提问。
            </p>
          )}
          {copyState === 'error' && (
            <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
              复制失败，请手动复制页面内容。
            </p>
          )}
        </div>

        {tags.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-900 mb-2">您的睡眠状况良好</h2>
            <p className="text-green-800">基于您的答案，评估未发现明显的睡眠问题。继续保持健康的生活方式！</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          {user && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
              本次评估结果已自动保存到您的账户
            </p>
          )}
          <div className="mt-5">
            <button
              onClick={onRetake}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              重新评估
            </button>
          </div>
        </div>

        {user && <AssessmentHistory />}
      </div>
    </div>
  );
}
