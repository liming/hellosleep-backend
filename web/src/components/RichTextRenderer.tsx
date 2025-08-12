'use client';

import React from 'react';

interface LexicalNode {
  type: string;
  text?: string;
  format?: number;
  children?: LexicalNode[];
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    caption?: string;
  };
  level?: number;
  tag?: string;
  listType?: string;
}

interface RichTextRendererProps {
  content: LexicalNode[];
  className?: string;
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content || !Array.isArray(content)) {
    return <div className={`text-gray-600 ${className}`}>No content available.</div>;
  }

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    const { type, text, format, children, image, level, tag, listType } = node;

    // Handle text nodes
    if (type === 'text' && text !== undefined) {
      const textElement = <span key={index}>{text}</span>;
      
      // Apply text formatting
      if (format) {
        if (format & 1) { // Bold
          return <strong key={index}>{textElement}</strong>;
        }
        if (format & 2) { // Italic
          return <em key={index}>{textElement}</em>;
        }
        if (format & 4) { // Underline
          return <u key={index}>{textElement}</u>;
        }
        if (format & 8) { // Strikethrough
          return <s key={index}>{textElement}</s>;
        }
      }
      
      return textElement;
    }

    // Handle different block types
    switch (type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {children?.map((child, childIndex) => renderNode(child, childIndex))}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className={`font-bold mb-4 mt-6 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}>
            {children?.map((child, childIndex) => renderNode(child, childIndex))}
          </HeadingTag>
        );

      case 'image':
        if (!image?.url) return null;
        
        // Check if it's an external image that might have CORS issues
        const isExternalImage = image.url.includes('mmbiz.qpic.cn') || 
                               image.url.includes('weixin.qq.com') ||
                               image.url.includes('qq.com');
        
        return (
          <div key={index} className="my-6">
            <div className="relative">
              <img
                src={image.url}
                alt={image.alternativeText || 'Article image'}
                width={image.width}
                height={image.height}
                className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.warn('Failed to load image:', image.url);
                  
                  // Show a fallback message for external images
                  if (isExternalImage) {
                    target.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'bg-gray-100 p-4 rounded-lg text-center text-gray-500';
                    fallbackDiv.innerHTML = `
                      <div class="text-sm">
                        <p>图片无法显示</p>
                        <p class="text-xs mt-1">External platform image</p>
                        <button onclick="window.open('${image.url}', '_blank')" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">
                          在新窗口打开
                        </button>
                      </div>
                    `;
                    target.parentNode?.appendChild(fallbackDiv);
                  }
                }}
              />
            </div>
            {image.caption && (
              <p className="text-sm text-gray-600 text-center mt-2 italic">
                {image.caption}
              </p>
            )}
          </div>
        );

      case 'list':
        const ListTag = listType === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={`mb-4 ${listType === 'ordered' ? 'list-decimal' : 'list-disc'} ml-6`}>
            {children?.map((child, childIndex) => (
              <li key={childIndex} className="mb-2">
                {child.children?.map((grandChild, grandChildIndex) => 
                  renderNode(grandChild, grandChildIndex)
                )}
              </li>
            ))}
          </ListTag>
        );

      case 'listitem':
        return (
          <li key={index} className="mb-2">
            {children?.map((child, childIndex) => renderNode(child, childIndex))}
          </li>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-brand-primary pl-4 py-2 my-4 bg-gray-50 italic">
            {children?.map((child, childIndex) => renderNode(child, childIndex))}
          </blockquote>
        );

      case 'code':
        return (
          <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {text}
          </code>
        );

      case 'link':
        // Assuming link structure with url and children
        const url = (node as any).url;
        return (
          <a key={index} href={url} className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {children?.map((child, childIndex) => renderNode(child, childIndex))}
          </a>
        );

      default:
        // For unknown types, try to render children
        if (children && children.length > 0) {
          return (
            <div key={index}>
              {children.map((child, childIndex) => renderNode(child, childIndex))}
            </div>
          );
        }
        
        // If it's just text, render it
        if (text) {
          return <span key={index}>{text}</span>;
        }
        
        return null;
    }
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.map((node, index) => renderNode(node, index))}
    </div>
  );
} 