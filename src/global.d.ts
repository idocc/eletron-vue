// 允许 TypeScript 识别样式文件导入。
declare module '*.css';

// 允许 TypeScript 识别 Vue 单文件组件。
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, unknown>;
  export default component;
}
