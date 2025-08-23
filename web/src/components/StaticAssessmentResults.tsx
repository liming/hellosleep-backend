'use client';

import React, { useState, useEffect } from 'react';
import { staticAssessmentEngine, type AssessmentResult } from '@/lib/static-assessment-engine';
import { type StaticBooklet } from '@/data/static-assessment-booklets';
import { getTagByName } from '@/data/static-assessment-questions';

interface StaticAssessmentResultsProps {
  answers: Record<string, string>;
  onBack?: () => void;
}

export default function StaticAssessmentResults({ answers, onBack }: StaticAssessmentResultsProps) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAssessment = () => {
      try {
        const assessmentResult = staticAssessmentEngine.processAssessment(answers);
        setResult(assessmentResult);
        staticAssessmentEngine.saveResult(assessmentResult);
      } catch (error) {
        console.error('Error processing assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    processAssessment();
  }, [answers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在分析您的评估结果...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">处理评估结果时出现错误</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              返回
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">评估结果</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  基于科学规则的评估系统
                </span>
              </div>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← 返回
              </button>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            完成时间: {result.completedAt.toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Tags Summary */}
        {result.calculatedTags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">识别的问题标签</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.calculatedTags.map((tagName) => {
                const tag = getTagByName(tagName);
                return (
                  <span
                    key={tagName}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tag?.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : tag?.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tag?.text || tagName}
                    {tag?.priority && (
                      <span className="ml-1 text-xs">({tag.priority})</span>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>调试信息:</strong></p>
              <p>计算的标签: {result.calculatedTags.join(', ')}</p>
              <p>匹配的手册数量: {result.matchedBooklets.length}</p>
            </div>
          </div>
        )}

        {result.calculatedTags.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">⚠️ 未识别到问题标签</h2>
            <p className="text-yellow-800 mb-4">基于您的答案，评估引擎未识别到特定的问题标签。</p>
            <div className="text-sm text-yellow-700">
              <p><strong>调试信息:</strong></p>
              <p>可用标签总数: {staticAssessmentEngine.getAllTags().length}</p>
              <p>可用手册总数: {staticAssessmentEngine.getAllBooklets().length}</p>
              <p>您的答案: {Object.keys(answers).length} 个问题</p>
            </div>
          </div>
        )}

        {/* Booklets */}
        {result.matchedBooklets.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">个性化建议</h2>
            {result.matchedBooklets.map((booklet) => (
              <BookletCard key={booklet.id} booklet={booklet} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">暂无匹配的建议内容</p>
          </div>
        )}

        {/* Assessment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">评估摘要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">回答的问题数量</p>
              <p className="text-lg font-semibold">{Object.keys(answers).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">匹配的建议数量</p>
              <p className="text-lg font-semibold">{result.matchedBooklets.length}</p>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">调试信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">可用标签 ({staticAssessmentEngine.getAllTags().length})</h3>
              <div className="text-sm text-gray-600 max-h-40 overflow-y-auto">
                {staticAssessmentEngine.getAllTags().map(tag => (
                  <div key={tag.name} className="mb-1">
                    <span className="font-medium">{tag.name}</span>: {tag.text}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">可用手册 ({staticAssessmentEngine.getAllBooklets().length})</h3>
              <div className="text-sm text-gray-600 max-h-40 overflow-y-auto">
                {staticAssessmentEngine.getAllBooklets().map(booklet => (
                  <div key={booklet.id} className="mb-1">
                    <span className="font-medium">{booklet.tag}</span>: {booklet.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookletCard({ booklet }: { booklet: StaticBooklet }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {booklet.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              标签: {booklet.tag} | 优先级: {booklet.priority} | 难度: {booklet.difficulty}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {booklet.description}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            {expanded ? '收起' : '展开'}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">概述</h4>
              <p className="text-gray-700">{booklet.content.summary}</p>
            </div>

            {/* Problem */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">问题分析</h4>
              <p className="text-gray-700">{booklet.content.problem}</p>
            </div>

            {/* Solution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">解决方案</h4>
              <p className="text-gray-700">{booklet.content.solution}</p>
            </div>

            {/* Steps */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">实施步骤</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                {booklet.content.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">实用建议</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {booklet.content.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {booklet.content.warnings && booklet.content.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-red-900 mb-2">注意事项</h4>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {booklet.content.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {booklet.content.resources && booklet.content.resources.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">相关资源</h4>
                <div className="space-y-2">
                  {booklet.content.resources.map((resource, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <h5 className="font-medium text-gray-900">{resource.title}</h5>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-900">预计时间:</span>
                <p className="text-sm text-gray-600">{booklet.estimatedTime}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">预期效果:</span>
                <p className="text-sm text-gray-600">{booklet.expectedOutcome}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">严重程度:</span>
                <p className="text-sm text-gray-600">{booklet.severity}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
