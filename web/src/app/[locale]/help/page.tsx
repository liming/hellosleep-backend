'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t('helpGuide')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            如果你正在经历失眠，这里有一个系统性的方法来帮助你走出困境
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Step 1: Learn how to treat insomnia */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">学习如何对待失眠</h2>
                <p className="mt-2 text-gray-600">
                  失眠不是疾病，而是我们身体和心理状态的自然反应。学会正确对待失眠，是走出失眠的第一步。
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                阅读睡吧理念
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                了解失眠本质
              </a>
            </div>
          </div>

          {/* Step 2: Complete sleep assessment */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">填写睡眠评估</h2>
                <p className="mt-2 text-gray-600">
                  通过详细的睡眠评估，了解自己的失眠类型和具体情况，为制定个性化解决方案做准备。
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="/assessment"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                开始评估
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                查看评估示例
              </a>
            </div>
          </div>

          {/* Step 3: Ask questions correctly */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">正确提出问题</h2>
                <p className="mt-2 text-gray-600">
                  在社区中正确描述你的失眠情况，让其他有经验的朋友能够更好地帮助你。
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                学习提问技巧
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                查看提问示例
              </a>
            </div>
          </div>

          {/* Step 4: Read HelloSleep book */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">阅读睡吧书籍</h2>
                <p className="mt-2 text-gray-600">
                  深入阅读睡吧的指导书籍，系统学习如何走出失眠，建立正确的睡眠观念。
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                开始阅读
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                下载电子书
              </a>
            </div>
          </div>

          {/* Step 5: Help others */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-brand-primary mb-2">帮助他人</h2>
                <p className="mt-2 text-gray-600">
                  当你走出失眠后，记得帮助其他还在失眠中挣扎的朋友，分享你的经验和心得。
                </p>
              </div>
            </div>
            <div className="mt-6">
              <blockquote className="border-l-4 border-brand-primary pl-4 mb-4 italic text-gray-700">
                "帮助他人不仅是对社区的贡献，也是巩固自己走出失眠成果的重要方式。"
              </blockquote>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                分享经验
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-brand-primary text-brand-primary bg-white hover:bg-brand-background rounded-md font-medium transition-colors"
              >
                成为志愿者
              </a>
            </div>
          </div>
        </div>

        {/* Additional guidance */}
        <div className="mt-12 bg-brand-background rounded-lg p-8">
          <h3 className="text-2xl font-bold text-brand-text-dark mb-4">记住：失眠只是暂时的</h3>
          <p className="text-brand-text-dark">
            失眠不是你的错，也不是什么严重的疾病。它只是你当前状态的自然反应。通过正确的态度和方法，
            你一定能够走出失眠，重新拥有良好的睡眠。睡吧社区会一直陪伴在你身边。
          </p>
        </div>
      </div>
    </div>
  );
} 