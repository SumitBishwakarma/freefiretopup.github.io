export interface CodeState {
  html: string;
  css: string;
  js: string;
}

export type EditorTab = 'html' | 'css' | 'js';

export interface GeneratedCodeResponse {
  html: string;
  css: string;
  js: string;
  explanation?: string;
}
