import { marked } from 'marked';
import * as cheerio from 'cheerio';
import juice from 'juice';
import { WECHAT_DEFAULT_CSS, WECHAT_HEADER_HTML, WECHAT_FOOTER_HTML } from './wechat-style';

/**
 * 将 Markdown 转换为符合微信公众号要求的 HTML
 */
export class WechatCompiler {
    static async compile(markdown: string): Promise<string> {
        // 1. Markdown 转基础 HTML
        const rawHtml = await marked.parse(markdown);

        // 2. 使用 Cheerio 处理 DOM：替换 div 为 section，注入头尾
        // cheatsheet: cheerio.load 返回一个可操作的文档上下文
        const $ = cheerio.load(rawHtml);

        // - 注入顶部
        if (WECHAT_HEADER_HTML) {
            $.root().prepend(WECHAT_HEADER_HTML);
        }
        // - 注入底部
        if (WECHAT_FOOTER_HTML) {
            $.root().append(WECHAT_FOOTER_HTML);
        }

        // - 遍历所有的块级元素 (div, p, ul, ol, blockquote)，如果存在层级结构的 div 需要被替换为 section
        $('div').each((i, elem) => {
            if (elem.type === 'tag') {
                elem.tagName = 'section'; // 强制替换 div 为 section
            }
        });

        // 如果有必要，也可以把包裹了图文的主节点（如果有）改成 section，但 marked 默认块级是 p 或 header 等，通常外层没有 div。
        // 但是为了稳妥，如果段落中混入了 div，它就被转成了 section。

        const modifiedHtml = $.html();

        // 3. 将 CSS 内联到 style 属性中
        //   微信客户端只能识别带 style 属性的元素
        const finalHtml = juice.inlineContent(modifiedHtml, WECHAT_DEFAULT_CSS, {
            inlinePseudoElements: true,
            preserveImportant: true,
            insertPreservedExtraCss: false, // 微信不支持外部额外 css 注入
        });

        return finalHtml;
    }
}
