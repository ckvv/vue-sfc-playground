import { readFile, writeFile } from 'node:fs/promises';
import MagicString from 'magic-string';

/**
 * 在指定位置插入代码
 */
export async function updateSourceCode(options: { file: string, code: string, endOffset: string }) {
  const beforeCode = (await readFile(options.file)).toString();
  const s = new MagicString(beforeCode);

  const endOffset = Number.parseInt(options.endOffset);
  s.update(endOffset, endOffset + 1, `${options.code}${beforeCode.charAt(endOffset)}`);

  await writeFile(options.file, s.toString());
}
