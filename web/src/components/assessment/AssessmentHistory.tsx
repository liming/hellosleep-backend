'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAssessmentHistory, type AssessmentResult } from '@/lib/auth';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AssessmentHistory() {
  const { jwt } = useAuth();
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) return;
    fetchAssessmentHistory(jwt)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [jwt]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">历史评估记录</h2>
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        历史评估记录
        <span className="ml-2 text-sm font-normal text-gray-500">共 {history.length} 次</span>
      </h2>
      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === item.documentId ? null : item.documentId)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(item.completedAt)}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.name}
                      className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[tag.priority] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {tag.text}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{item.tags.length - 3} 项</span>
                  )}
                  {item.tags.length === 0 && (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">睡眠良好</span>
                  )}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${expanded === item.documentId ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded === item.documentId && (
              <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                <div className="pt-3">
                  <p className="text-xs text-gray-500 mb-2">全部识别问题：</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.length === 0 ? (
                      <span className="text-sm text-green-700">未发现明显睡眠问题</span>
                    ) : (
                      item.tags.map((tag) => (
                        <span
                          key={tag.name}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[tag.priority] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {tag.text}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
