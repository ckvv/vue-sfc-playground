import type { Plugin } from 'vite';
import { compileSFCTemplate, parseVueRequest } from './compiler';
import { bodyParserMiddleware, updateSFCMiddleware } from './middleware';

export function VitePluginVueCode(): Plugin {
  return {
    name: 'vite-plugin-vue-code',
    // 应用顺序
    enforce: 'pre',
    // 应用模式 (只在开发模式应用)
    apply: 'serve',
    // 含义: 转换钩子,接收每个传入请求模块的内容和文件路径
    // 应用: 在这个钩子对SFC模版进行解析并注入自定义属性
    transform(code, id) {
      const { filename, query } = parseVueRequest(id);
      // 只处理SFC文件
      if (filename.endsWith('.vue') && query.type !== 'style') {
        return compileSFCTemplate(code, filename);
      }

      return code as any;
    },
    // 含义: 配置开发服务器钩子,可以添加自定义中间件
    // 应用: 在这个钩子实现更新 sfc 文件
    configureServer(server) {
      // 注册中间件
      // 请求参数解析中间件
      server.middlewares.use(bodyParserMiddleware);
      // 更新 sfc 文件
      server.middlewares.use(updateSFCMiddleware);
    },
  };
}
