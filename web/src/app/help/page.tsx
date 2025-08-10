'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-brand-background to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-brand-text-dark sm:text-5xl mb-4">
            {t('helpGuide')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            如果你正在经历失眠，这里有一个系统性的方法来帮助你走出困境
          </p>
        </div>
        
        {/* Steps Container */}
        <div className="space-y-12">
          {/* Step 1: Learn how to treat insomnia */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">学习如何对待失眠</h2>
                <p className="text-gray-500 text-sm">Knowledge is the first step to recovery</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4 leading-relaxed">
                之所以陷入失眠是因为不懂得如何对待它，之所以恐惧失眠是因为不了解它。所以走出失眠的过程就是一个自我学习和自我努力的过程。我们不可能轻而易举的通过外部的药物和神奇的方法走出失眠，你必须去学习、去尝试、去坚持。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                睡吧在几年的时间里积累了不少资料与珍贵的经验，你可以通过阅读这些资料和分享了解如何对待失眠，并按照文章中的建议去尝试和坚持。
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                在发起求助之前，阅读知识库和博客的文章，学习和寻找的过程会让你受益终生。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                睡吧知识库
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                睡吧博客
              </Link>
            </div>
          </div>

          {/* Step 2: Complete sleep assessment */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">填写睡眠评估</h2>
                <p className="text-gray-500 text-sm">Assessment helps identify the root cause</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4 leading-relaxed">
                如果没法通过阅读资料找到自己失眠的原因，也不能明确的了解具体该如何做才能走出失眠。那就需要求助，但是每个人都应该通过正确的方式求助。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                许多人只是在抱怨一番并询问该怎么办？这样的提问无法得到任何答案。因为你所经历的痛苦只是一些表象，而我们无法通过一些表面现象的抱怨和哭诉找出失眠的原因。
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                想要求助就需要填写睡眠评估，并发表在睡吧小组或者通过邮件发送。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                进行睡眠评估
              </Link>
            </div>
          </div>

          {/* Step 3: Ask questions correctly */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">正确提出问题</h2>
                <p className="text-gray-500 text-sm">Ask the right questions to get better answers</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4 leading-relaxed">
                发表评估是正确的求助方式，每个人在发表评估之后都会得到一些意见。但是你一定会存有各种各样的疑问。我们一定要在自己的评估后面提出疑问，这能让帮助你的人参考之前的状态和之前的意见，也能让自己了解到进展。
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                在提出这些疑问之前，一定要问自己几个问题：
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2 mr-3"></span>
                    我的这个疑问是在抱怨还是在理智的求助？
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2 mr-3"></span>
                    我是不是按照意见去做了？
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2 mr-3"></span>
                    我有没有通过大家给出的意见反省自己？
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2 mr-3"></span>
                    我这个问题是在试图解决造成失眠的原因，还是失眠的现象？
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                事实上，许多疑问都已经在之前的意见中给出了解答，我们只是需要回顾之前的意见并反省自己。确保自己的问题有价值，只有有价值的问题才会让自己有所进步。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                常见问题
              </Link>
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                失眠误区
              </Link>
            </div>
          </div>

          {/* Step 4: Read HelloSleep book */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">阅读睡吧书籍</h2>
                <p className="text-gray-500 text-sm">Deep insights from years of experience</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                睡吧出版的《乔装的失眠》非常详细和系统的告诉大家如何一步一步走出失眠。也是睡吧十几年经验和理念的沉淀。强烈建议每个失眠的人阅读。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                阅读《乔装的失眠》
              </Link>
            </div>
          </div>

          {/* Step 5: Help others */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-8">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <div className="ml-6 flex-1">
                <h2 className="text-2xl font-bold text-brand-text-dark mb-2">帮助他人</h2>
                <p className="text-gray-500 text-sm">Helping others helps yourself</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-brand-primary/10 to-primary-200/10 border-l-4 border-brand-primary pl-6 py-4 mb-6 rounded-r-lg">
                <blockquote className="italic text-gray-700 text-lg leading-relaxed">
                  『一个非常明显的事实是，当你只是想着自己的时候，你的整个心智会变得狭窄，这种狭隘的心灵会放大那些看似糟糕的事情，并且带给你恐惧、不安和无法抑制的痛苦。然而，当你开始同情和关爱其他人的时候， 你的心灵会变得宽广并开放，自己的问题会显得微不足道，你的感受会变得大不相同。』
                </blockquote>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                失眠只是一个普通的烦恼，而走出这个烦恼最好的方式就是关爱和帮助其他的人。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/share"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                睡吧小组
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center px-6 py-3 border-2 border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                帮助睡吧
              </Link>
            </div>
          </div>
        </div>

        {/* Additional guidance */}
        <div className="mt-16 bg-gradient-to-r from-brand-primary/5 to-primary-200/5 rounded-xl p-8 border border-brand-primary/20">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-brand-text-dark">记住：失眠只是暂时的</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            失眠是身体对生活变化的自然反应。通过正确的态度和方法，你一定能够走出失眠的困扰。按照以上步骤，循序渐进地学习和实践，你会发现自己逐渐掌握了应对失眠的能力。
          </p>
        </div>
      </div>
    </div>
  );
} 