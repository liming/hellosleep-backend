'use client';

import React, { useState } from 'react';
import { staticAssessmentDatabase } from '@/lib/static-assessment-database';

export default function MigrationPage() {
  const [activeTab, setActiveTab] = useState<'sql' | 'strapi' | 'typescript'>('sql');
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const generateSQLMigration = () => {
    const sql = staticAssessmentDatabase.generateSQLMigration();
    setGeneratedContent(sql);
    setActiveTab('sql');
  };

  const generateStrapiMigration = () => {
    const strapiData = staticAssessmentDatabase.generateStrapiMigration();
    setGeneratedContent(JSON.stringify(strapiData, null, 2));
    setActiveTab('strapi');
  };

  const generateTypeScriptInterfaces = () => {
    const interfaces = staticAssessmentDatabase.generateTypeScriptInterfaces();
    setGeneratedContent(interfaces);
    setActiveTab('typescript');
  };

  const downloadFile = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    let filename = 'migration';
    if (activeTab === 'sql') filename = 'static-assessment-migration.sql';
    else if (activeTab === 'strapi') filename = 'strapi-migration.json';
    else if (activeTab === 'typescript') filename = 'database-interfaces.ts';
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportData = () => {
    const data = staticAssessmentDatabase.exportForMigration();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'static-assessment-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">静态评估引擎数据库迁移工具</h1>
          <p className="text-gray-600">生成数据库迁移文件和类型定义</p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生成迁移文件</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateSQLMigration}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              生成 SQL 迁移
            </button>
            <button
              onClick={generateStrapiMigration}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              生成 Strapi 迁移
            </button>
            <button
              onClick={generateTypeScriptInterfaces}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              生成 TypeScript 接口
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              导出原始数据
            </button>
          </div>
        </div>

        {/* Content Display */}
        {generatedContent && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('sql')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sql'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  SQL 迁移
                </button>
                <button
                  onClick={() => setActiveTab('strapi')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'strapi'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Strapi 迁移
                </button>
                <button
                  onClick={() => setActiveTab('typescript')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'typescript'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  TypeScript 接口
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'sql' && 'SQL 迁移脚本'}
                  {activeTab === 'strapi' && 'Strapi 迁移数据'}
                  {activeTab === 'typescript' && 'TypeScript 接口定义'}
                </h3>
                <button
                  onClick={downloadFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  下载文件
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {generatedContent}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">数据统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {staticAssessmentDatabase.exportForMigration().tags.length}
              </div>
              <div className="text-sm text-gray-600">标签数量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {staticAssessmentDatabase.exportForMigration().booklets.length}
              </div>
              <div className="text-sm text-gray-600">手册数量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {staticAssessmentDatabase.exportForMigration().calculationFunctions.length}
              </div>
              <div className="text-sm text-gray-600">计算函数数量</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
