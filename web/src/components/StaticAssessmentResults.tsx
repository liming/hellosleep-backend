'use client';

import React, { useState, useEffect } from 'react';
import { staticAssessmentEngine, type AssessmentResult } from '@/lib/static-assessment-engine';
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
              <p>匹配的建议数量: {result.bookletFacts.length}</p>
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
              <p>您的答案: {Object.keys(answers).length} 个问题</p>
            </div>
          </div>
        )}

        {/* Booklet Facts mapped from answers */}
        {result.bookletFacts && result.bookletFacts.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">重点建议</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.bookletFacts.map((fact) => (
                <div key={fact.tag} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{fact.description}</h3>
                      <p className="text-sm text-gray-600">{fact.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booklets */}
        {/* Removed booklet list; replaced by booklet facts above */}

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
              <p className="text-lg font-semibold">{result.bookletFacts.length}</p>
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
            {/* Removed booklet debug list */}
          </div>
        </div>
      </div>
    </div>
  );
}
 
