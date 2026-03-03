'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getVisibleQuestions, questions, type Tag } from '@/lib/assessment';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentHistory from '@/components/assessment/AssessmentHistory';
import actionSuggestions from '../../../../shared/data/action-suggestions.json';

interface ResultsScreenProps {
  answers: Record<string, string>;
  tags: Tag[];
  onRetake: () => void;
}

const priorityConfig = {
  high: { label: '高优先级', color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  medium: { label: '中优先级', color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  low: { label: '低优先级', color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
};

export default function ResultsScreen({ answers, tags, onRetake }: ResultsScreenProps) {
  const { user } = useAuth();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<'summary' | 'advice' | 'qa'>('summary');
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  // Calculate sleep efficiency if possible
  const sleepEfficiency = useMemo(() => {
    const hoursInBed = parseFloat(answers['hourstosleep'] || '0');
    const hoursAsleep = parseFloat(answers['hourstofallinsleep'] || '0');
    if (hoursInBed > 0) {
      return Math.round((hoursAsleep / hoursInBed) * 100);
    }
    return null;
  }, [answers]);

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

  const getActionItems = (tagName: string): string[] => {
    return actionSuggestions[tagName as keyof typeof actionSuggestions] || [];
  };

  const getEfficiencyStatus = (efficiency: number | null) => {
    if (efficiency === null) return null;
    if (efficiency >= 85) return { label: '良好', color: 'green' };
    if (efficiency >= 70) return { label: '偏低', color: 'yellow' };
    return { label: '较低', color: 'red' };
  };

  const efficiencyStatus = getEfficiencyStatus(sleepEfficiency);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🎯 您的睡眠评估报告</h1>
              <span className="text-sm text-gray-500 mt-1 block">基于科学规则的评估系统</span>
            </div>
            <button
              onClick={handleCopyResult}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copyState === 'copied' ? '✓ 已复制' : '复制结果'}
            </button>
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
        </div>

        {/* Summary Cards */}
        {efficiencyStatus && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 评估摘要</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border-2 ${
                efficiencyStatus.color === 'green' ? 'border-green-200 bg-green-50' :
                efficiencyStatus.color === 'yellow' ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }`}>
                <p className="text-sm text-gray-600">睡眠效率</p>
                <p className="text-3xl font-bold text-gray-900">{sleepEfficiency}%</p>
                <p className={`text-sm font-medium ${
                  efficiencyStatus.color === 'green' ? 'text-green-600' :
                  efficiencyStatus.color === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{efficiencyStatus.label}</p>
              </div>
              <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">发现的问题</p>
                <p className="text-3xl font-bold text-gray-900">{tags.length}</p>
                <p className="text-sm text-gray-500">个标签</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveSection('summary')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'summary'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🏠 首页
            </button>
            <button
              onClick={() => setActiveSection('advice')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'advice'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              💡 自助建议
            </button>
            <button
              onClick={() => setActiveSection('qa')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'qa'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📝 问答详情
            </button>
          </div>

          <div className="p-6">
            {/* Summary Tab */}
            {activeSection === 'summary' && (
              <div className="space-y-6">
                {tags.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎉</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">您的睡眠状况良好</h2>
                    <p className="text-gray-600">基于您的答案，评估未发现明显的睡眠问题。继续保持健康的生活方式！</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">⚠️ 您的睡眠问题</h2>
                      <div className="space-y-3">
                        {tags.map((tag) => {
                          const config = priorityConfig[tag.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                          return (
                            <div key={tag.name} className={`p-4 rounded-xl ${config.bg} border ${config.border}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                                      {config.label}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{tag.text}</h3>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{tag.recommendation.title}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Items Preview */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">📋 今日行动</h2>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        {tags.slice(0, 3).flatMap(tag => getActionItems(tag.name)).slice(0, 3).map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-gray-400">○</span>
                            <span className="text-gray-700">{action}</span>
                          </div>
                        ))}
                        {tags.length > 0 && (
                          <button
                            onClick={() => setActiveSection('advice')}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            查看全部建议 →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Upgrade CTA */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">💬 需要更多帮助？</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        评估只是开始。如果需要个性化指导，可以选择更深入的服务。
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 transition-colors text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🤖</span>
                            <span className="font-medium text-gray-900">AI 咨询</span>
                          </div>
                          <div className="text-sm text-gray-500">¥99 起</div>
                        </button>
                        <button className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📞</span>
                            <span className="font-medium text-gray-900">电话咨询</span>
                          </div>
                          <div className="text-sm text-gray-500">¥499 起</div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Advice Tab */}
            {activeSection === 'advice' && (
              <div className="space-y-6">
                {tags.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">您的睡眠状况良好，无需特别建议。</p>
                  </div>
                ) : (
                  tags.map((tag) => {
                    const config = priorityConfig[tag.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                    const actions = getActionItems(tag.name);
                    return (
                      <div key={tag.name} className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                            {config.label}
                          </span>
                          <h3 className="font-semibold text-lg text-gray-900">{tag.text}</h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{tag.recommendation.content}</p>
                        
                        {actions.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">✅ 立即行动</h4>
                            <ul className="space-y-2">
                              {actions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span className="text-gray-700">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {tag.recommendation.tutorialLink && (
                          <a
                            href={tag.recommendation.tutorialLink}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-3"
                          >
                            📖 查看详细教程 →
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* QA Tab */}
            {activeSection === 'qa' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 评估问答详情</h2>
                {qaItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无问答记录</p>
                ) : (
                  qaItems.map((item, index) => (
                    <div key={`${item.question}-${index}`} className="border border-gray-100 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900">{item.question}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {user && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">
              ✓ 本次评估结果已自动保存到您的账户
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onRetake}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
