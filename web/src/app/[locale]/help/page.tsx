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
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-blue-600">学习如何对待失眠</h2>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                之所以陷入失眠是因为不懂得如何对待它，之所以恐惧失眠是因为不了解它。所以走出失眠的过程就是一个自我学习和自我努力的过程。我们不可能轻而易举的通过外部的药物和神奇的方法走出失眠，你必须去学习、去尝试、去坚持。
              </p>
              <p className="text-gray-700 mb-4">
                睡吧在几年的时间里积累了不少资料与珍贵的经验，你可以通过阅读这些资料和分享了解如何对待失眠，并按照文章中的建议去尝试和坚持。
              </p>
              <p className="text-gray-700 mb-6">
                在发起求助之前，阅读知识库和博客的文章，学习和寻找的过程会让你受益终生。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                睡吧知识库
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                睡吧博客
              </Link>
            </div>
          </div>

          {/* Step 2: Complete sleep assessment */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-blue-600">填写睡眠评估</h2>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                如果没法通过阅读资料找到自己失眠的原因，也不能明确的了解具体该如何做才能走出失眠。那就需要求助，但是每个人都应该通过正确的方式求助。
              </p>
              <p className="text-gray-700 mb-4">
                许多人只是在抱怨一番并询问该怎么办？这样的提问无法得到任何答案。因为你所经历的痛苦只是一些表象，而我们无法通过一些表面现象的抱怨和哭诉找出失眠的原因。
              </p>
              <p className="text-gray-700 mb-6">
                想要求助就需要填写睡眠评估，并发表在睡吧小组或者通过邮件发送。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/assessment"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                进行睡眠评估
              </Link>
            </div>
          </div>

          {/* Step 3: Ask questions correctly */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-blue-600">正确提出问题</h2>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                发表评估是正确的求助方式，每个人在发表评估之后都会得到一些意见。但是你一定会存有各种各样的疑问。我们一定要在自己的评估后面提出疑问，这能让帮助你的人参考之前的状态和之前的意见，也能让自己了解到进展。
              </p>
              <p className="text-gray-700 mb-4">
                在提出这些疑问之前，一定要问自己几个问题：
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>我的这个疑问是在抱怨还是在理智的求助？</li>
                <li>我是不是按照意见去做了？</li>
                <li>我有没有通过大家给出的意见反省自己？</li>
                <li>我这个问题是在试图解决造成失眠的原因，还是失眠的现象？</li>
              </ul>
              <p className="text-gray-700 mb-6">
                事实上，许多疑问都已经在之前的意见中给出了解答，我们只是需要回顾之前的意见并反省自己。确保自己的问题有价值，只有有价值的问题才会让自己有所进步。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                常见问题
              </Link>
              <Link
                href="/tutorial"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                失眠误区
              </Link>
            </div>
          </div>

          {/* Step 4: Read HelloSleep book */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-blue-600">阅读睡吧书籍</h2>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                睡吧出版的《乔装的失眠》非常详细和系统的告诉大家如何一步一步走出失眠。也是睡吧十几年经验和理念的沉淀。强烈建议每个失眠的人阅读。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                阅读《乔装的失眠》
              </Link>
            </div>
          </div>

          {/* Step 5: Help others */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">5</span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-blue-600">帮助他人</h2>
              </div>
            </div>
            <div className="prose max-w-none">
              <blockquote className="border-l-4 border-blue-600 pl-4 mb-4 italic text-gray-700">
                『一个非常明显的事实是，当你只是想着自己的时候，你的整个心智会变得狭窄，这种狭隘的心灵会放大那些看似糟糕的事情，并且带给你恐惧、不安和无法抑制的痛苦。然而，当你开始同情和关爱其他人的时候， 你的心灵会变得宽广并开放，自己的问题会显得微不足道，你的感受会变得大不相同。』
              </blockquote>
              <p className="text-gray-700 mb-6">
                失眠只是一个普通的烦恼，而走出这个烦恼最好的方式就是关爱和帮助其他的人。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/share"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                睡吧小组
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-md font-medium transition-colors"
              >
                帮助睡吧
              </Link>
            </div>
          </div>
        </div>

        {/* Additional guidance */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">记住：失眠只是暂时的</h3>
          <p className="text-blue-800">
            失眠是身体对生活变化的自然反应。通过正确的态度和方法，你一定能够走出失眠的困扰。按照以上步骤，循序渐进地学习和实践，你会发现自己逐渐掌握了应对失眠的能力。
          </p>
        </div>
      </div>
    </div>
  );
} 