// API URLS
export const TOKEN_API_URL = '/api/get-token';
export const ANSWER_API_URL = '/api/answer';

// CONTENT TAG TYPES
export const TAG = {
  SKETCH: 'Sketch',
  MUSIC: 'Music',
  MEMO: 'Memo',
  GENERATIVE: 'Generative',
  INTERACTIVE: 'Interactive',
  PENPLOT: 'Penplot',
  CASE_STUDY: 'Case Study',
} as const;

export type Tag = (typeof TAG)[keyof typeof TAG];

// CONTENT TEMPLATE TYPES
export const TEMPLATE = {
  IFRAME: 'iframe',
  CANVAS: 'canvas',
  NOTE: 'note',
} as const;

export type Template = (typeof TEMPLATE)[keyof typeof TEMPLATE];

// ASSET TYPES
export const ASSET_TYPE = {
  TEXTURE: 'texture',
  SCRIPT: 'script',
  IMAGE: 'image',
} as const;

export type AssetType = (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];
