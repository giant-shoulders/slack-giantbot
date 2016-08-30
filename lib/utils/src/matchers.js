// Slack
export const USER_TAG = '<@([a-zA-Z0-9][a-zA-Z0-9._-]*)>';
export const CHANNEL_TAG = '<#([a-zA-Z0-9]*)(?:\\|[a-zA-Z0-9_-]*)>';

// General
export const URL = '<((?:https?:\\/\\/)?(?:[\\da-z\\.-]+)\\.(?:[a-z\\.]{2,6})(?:[\\/\\w \\.-]*)*\\/?.+)>';

// Color
export const HEX = '(#(?:[\\da-fA-F]{3}|[\\da-fA-F]{6}))';
export const RGB = '(?:rgb\\()? *([\\d]{1,3}) *,? *([\\d]{1,3}) *,? *([\\d]{1,3})(?:\\)?)';
export const HSL = '(?:hsl\\()? *([\\d]{1,3}) *,? *([\\d]{1,3}) *,? *([\\d]{1,3})(?:\\)?)';
