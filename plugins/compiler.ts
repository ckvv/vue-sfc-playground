import path from 'node:path';
import MagicString from 'magic-string';
import { parse, transform } from '@vue/compiler-dom';

const EXCLUDE_TAG = ['template', 'script', 'style'];

export async function compileSFCTemplate(
  code: string,
  id: string,
) {
  // SFC => AST
  const ast = parse(code, { comments: true });

  // 直接操作字符串, 避免操作AST, 性能更好.
  const s = new MagicString(code);

  const result = await new Promise((resolve) => {
    transform(ast, {
      // ast node节点访问器
      nodeTransforms: [
        (node) => {
          if (node.type === 1) {
            // 只解析html标签
            if (node.tagType === 0 && !EXCLUDE_TAG.includes(node.tag)) {
              const { base } = path.parse(id);
              // 获取到相关信息,进行自定义属性注入
              if (!node.loc.source.includes('data-v-file')) {
                s.prependLeft(
                  node.loc.start.offset + node.tag.length + 1,
                  ` data-file="${id}" data-start-offset=${node.loc.start.offset} data-end-offset=${node.loc.end.offset} data-start-line=${node.loc.start.line} data-start-column=${node.loc.start.column} data-end-line=${node.loc.end.line} data-end-column=${node.loc.end.column}`,
                );
              }
            }
          }
        },
      ],
    });
    resolve(s.toString());
  });
  return result;
}

export function parseVueRequest(id: string): {
  filename: string
  query: any
} {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query: any = Object.fromEntries(new URLSearchParams(rawQuery));
  if (query.vue != null) {
    query.vue = true;
  }
  if (query.index != null) {
    query.index = Number(query.index);
  }
  if (query.raw != null) {
    query.raw = true;
  }
  if (query.url != null) {
    query.url = true;
  }
  if (query.scoped != null) {
    query.scoped = true;
  }
  return {
    filename,
    query,
  };
}
