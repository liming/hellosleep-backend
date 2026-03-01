import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const INPUT_FILE = '/Users/ming/hellosleep/docs/migrated-remote-articles-improved.json';
const OUTPUT_DIR = '/Users/ming/hellosleep/docs/articles';

function slugifyZh(text) {
  return text
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article';
}

function lexicalNodeToMd(node, depth = 0) {
  const type = node.type || '';
  const children = node.children || [];

  if (type === 'root') {
    return children.map(c => lexicalNodeToMd(c, depth)).filter(p => p.trim()).join('\n\n');
  }

  if (type === 'paragraph') {
    return children.map(c => lexicalNodeToMd(c, depth)).join('');
  }

  if (type === 'text') {
    let text = node.text || '';
    if (!text) return '';
    const fmt = node.format || 0;
    if (fmt & 16) text = `\`${text}\``;
    if (fmt & 1)  text = `**${text}**`;
    if (fmt & 2)  text = `*${text}*`;
    if (fmt & 4)  text = `~~${text}~~`;
    return text;
  }

  if (type === 'linebreak') return '\n';

  if (type === 'link') {
    const url = node.url || '';
    const linkText = children.map(c => lexicalNodeToMd(c, depth)).join('');
    return `[${linkText}](${url})`;
  }

  if (type === 'image') {
    const img = node.image || {};
    const url = img.url || '';
    const alt = img.alternativeText || img.name || 'image';
    const caption = img.caption || '';
    let result = `![${alt}](${url})`;
    if (caption) result += `\n*${caption}*`;
    return result;
  }

  if (type === 'heading') {
    const tag = node.tag || 'h2';
    const level = parseInt(tag[1]) || 2;
    const content = children.map(c => lexicalNodeToMd(c, depth)).join('');
    return `${'#'.repeat(level)} ${content}`;
  }

  if (type === 'quote') {
    const content = children.map(c => lexicalNodeToMd(c, depth)).join('');
    return content.split('\n').map(l => `> ${l}`).join('\n');
  }

  if (type === 'ul' || type === 'ol') {
    return children.map((child, i) => {
      const marker = type === 'ul' ? '-' : `${i + 1}.`;
      const indent = '  '.repeat(depth);
      return `${indent}${marker} ${lexicalNodeToMd(child, depth + 1)}`;
    }).join('\n');
  }

  if (type === 'listitem') {
    const textParts = [];
    const nested = [];
    for (const child of children) {
      if (child.type === 'ul' || child.type === 'ol') {
        nested.push('\n' + lexicalNodeToMd(child, depth + 1));
      } else {
        textParts.push(lexicalNodeToMd(child, depth));
      }
    }
    return textParts.join('') + nested.join('');
  }

  if (type === 'horizontalrule') return '---';

  if (type === 'code') {
    const lang = node.language || '';
    const lines = children.map(c =>
      c.type === 'linebreak' ? '\n' : lexicalNodeToMd(c, depth)
    );
    return `\`\`\`${lang}\n${lines.join('')}\n\`\`\``;
  }

  // Fallback
  return children.map(c => lexicalNodeToMd(c, depth)).join('');
}

function bodyToMarkdown(body) {
  if (typeof body === 'string') return body;
  if (Array.isArray(body)) {
    return body.map(node => lexicalNodeToMd(node)).filter(p => p.trim()).join('\n\n');
  }
  if (body && typeof body === 'object') return lexicalNodeToMd(body);
  return String(body);
}

function articleToMarkdown(article) {
  const data = article.data || article;
  const title = data.title || 'Untitled';
  const category = data.category || '';
  const date = data.date || '';
  const excerpt = data.excerpt || '';
  const body = data.body || [];

  const slug = slugifyZh(title);
  const filename = `${slug}.md`;

  const lines = [
    `# ${title}`,
    '',
    `**分类**: ${category}`,
    `**发布时间**: ${date}`,
    '',
  ];

  if (excerpt) {
    lines.push(`> ${excerpt}`, '');
  }

  lines.push(bodyToMarkdown(body));
  return { filename, content: lines.join('\n') };
}

// Main
mkdirSync(OUTPUT_DIR, { recursive: true });

const articles = JSON.parse(readFileSync(INPUT_FILE, 'utf-8'));
console.log(`Total articles: ${articles.length}`);

const slugCounts = {};
let written = 0;
let skipped = 0;

for (const article of articles) {
  try {
    let { filename, content } = articleToMarkdown(article);
    const base = filename.slice(0, -3);
    if (base in slugCounts) {
      slugCounts[base]++;
      filename = `${base}-${slugCounts[base]}.md`;
    } else {
      slugCounts[base] = 0;
    }

    writeFileSync(join(OUTPUT_DIR, filename), content, 'utf-8');
    written++;
  } catch (e) {
    const title = (article.data || article).title || '?';
    console.error(`  ERROR [${title}]: ${e.message}`);
    skipped++;
  }
}

console.log(`\nDone! Written: ${written}, Skipped: ${skipped}`);

const files = readdirSync(OUTPUT_DIR).sort();
console.log(`\nFirst 10 of ${files.length} files:`);
files.slice(0, 10).forEach(name => {
  const size = statSync(join(OUTPUT_DIR, name)).size;
  console.log(`  ${name}  (${size} bytes)`);
});
