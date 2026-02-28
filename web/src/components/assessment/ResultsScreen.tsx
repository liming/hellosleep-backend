'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getVisibleQuestions, questions, type Tag } from '@/lib/assessment';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentHistory from '@/components/assessment/AssessmentHistory';

interface ResultsScreenProps {
  answers: Record<string, string>;
  tags: Tag[];
  onRetake: () => void;
}

export default function ResultsScreen({ answers, tags, onRetake }: ResultsScreenProps) {
  const { user } = useAuth();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'advice' | 'qa'>('qa');
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const qaItems = useMemo(() => {
    const visible = getVisibleQuestions(questions, answers);
    const items: Array<{ question: string; answer: string }> = [];

    visible.forEach((q) => {
      const raw = answers[q.id];
      if (raw === undefined || raw === '') return;

      let displayValue = raw;

      if (q.type === 'single_choice' && q.options?.length) {
        const matched = q.options.find((o) => o.value === raw);
        if (matched?.text) displayValue = matched.text;
      }

      if ((q.type === 'scale' || q.type === 'number') && q.unit) {
        displayValue = `${raw}${q.unit}`;
      }

      items.push({
        question: q.text,
        answer: displayValue,
      });
    });

    return items;
  }, [answers]);

  const copyText = useMemo(() => {
    const lines: string[] = ['我的睡眠评估问答：', ''];

    if (qaItems.length === 0) {
      lines.push('暂无可复制的问答内容。');
      return lines.join('\n');
    }

    qaItems.forEach((item) => {
      lines.push(`${item.question} ：${item.answer}`);
    });

    return lines.join('\n');
  }, [qaItems]);

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
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
      }
      copyFeedbackTimeoutRef.current = setTimeout(() => setCopyState('idle'), 8000);
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
                复制问答结果
              </button>
            </div>
          </div>
          {copyState === 'copied' && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
              已复制问答内容，可直接粘贴到
              {' '}
              <a
                href="https://www.douban.com/group/hellosleep"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-green-800"
              >
                睡吧小组
              </a>
              {' '}
              提问。
            </p>
          )}
          {copyState === 'error' && (
            <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
              复制失败，请手动复制页面内容。
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveSection('advice')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'advice'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              重点建议
            </button>
            <button
              onClick={() => setActiveSection('qa')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'qa'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              评估问题和答案
            </button>
          </div>

          {activeSection === 'advice' ? (
            tags.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-2">您的睡眠状况良好</h2>
                <p className="text-green-800">基于您的答案，评估未发现明显的睡眠问题。继续保持健康的生活方式！</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">重点建议</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tags.map((tag) => (
                    <div key={tag.name} className="border border-gray-100 rounded-lg p-4">
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
            )
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">评估问题和答案</h2>
              {qaItems.length === 0 ? (
                <p className="text-sm text-gray-500">暂无问答记录。</p>
              ) : (
                <div className="space-y-3">
                  {qaItems.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="border border-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-900 font-medium">{item.question}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
