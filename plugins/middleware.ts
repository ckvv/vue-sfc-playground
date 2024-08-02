import type { Connect } from 'vite';
import bodyParser from 'body-parser';
import { updateSourceCode } from './source-code';

const SERVER_URL = '/__code';
// // 请求body参数解析中间件
export const bodyParserMiddleware = bodyParser.json() as Connect.NextHandleFunction;

// 更新代码的中间件
export const updateSFCMiddleware: Connect.NextHandleFunction = async (
  req: Connect.IncomingMessage & { body?: Record<string, any> },
  res,
  next,
) => {
  // 只处理 __code 接口
  if (req.url && req.url.startsWith(SERVER_URL)) {
    // 解析SFC路径,行号,列号
    const { file, startLine, startColumn, endLine, endColumn, startOffset, endOffset, code } = req.body || {};
    if (!file || !endOffset || !code) {
      res.statusCode = 500;
      return res.end('launch-editor-middleware: required body param "file、endOffset、code" is missing.');
    }
    try {
      await updateSourceCode({
        file,
        endOffset,
        code,
      });
      res.end();
    } catch (error) {
      res.statusCode = 500;
      res.end(error);
    }
  } else {
    next();
  }
};
