import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { isHttpUrl } from './schema';

const parser = unified().use(remarkParse).use(remarkGfm);

export function markdownPlainText(body: string): string {
  const words: string[] = [];
  visit(parser.parse(body), node => {
    if (node.type === 'text' || node.type === 'code' || node.type === 'inlineCode') words.push(node.value);
    if (node.type === 'image' && node.alt) words.push(node.alt);
  });
  return words.join(' ').replace(/\s+/g, ' ').trim();
}

export function validateMarkdown(body: string): string[] {
  const errors: string[] = [];
  if (!markdownPlainText(body)) errors.push('mô tả Markdown phải có nội dung thực');
  visit(parser.parse(body), node => {
    if (node.type === 'html') errors.push('không hỗ trợ raw HTML; dùng cú pháp Markdown');
    if (node.type === 'link' || node.type === 'image' || node.type === 'definition') {
      const value = node.url;
      // Relative Markdown links and page anchors are allowed; explicit protocols must be HTTP(S).
      if (/^[\s\u0000-\u0020]*[a-z][a-z\d+.-]*:/i.test(value) && !isHttpUrl(value)) {
        errors.push(`liên kết Markdown không an toàn: ${value}`);
      }
      if (value.startsWith('//') || /[\u0000-\u001f\u007f\\]/.test(value)) errors.push(`liên kết Markdown không an toàn: ${value}`);
    }
  });
  return [...new Set(errors)];
}
