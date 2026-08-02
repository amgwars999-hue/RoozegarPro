export const palette = {
  // Primary Lime (from Lock Screen Notes screenshots)
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#C8E636', // Main app lime
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  },
  
  // Note designs from screenshots
  note: {
    yellow: { bg: '#F2D94E', grid: '#E5C840', text: '#1a1a1a', accent: '#d4b830' },
    cream:  { bg: '#F5F0D0', grid: '#E8E3C0', text: '#1a1a1a', accent: '#d4cfb0' },
    red:    { bg: '#E85D5D', grid: '#D85050', text: '#FFFFFF', accent: '#c04545' },
    orange: { bg: '#E8924A', grid: '#D88040', text: '#FFFFFF', accent: '#c07030' },
    beige:  { bg: '#E8D78A', grid: '#D8C880', text: '#5C4B2A', accent: '#c8b870' },
    teal:   { bg: '#5A9E8E', grid: '#4A8E7E', text: '#FFFFFF', accent: '#407a6c' },
    mint:   { bg: '#7FD8BE', grid: '#6FC8AE', text: '#1a3a30', accent: '#5fb89e' },
    blue:   { bg: '#5A8AE8', grid: '#4A7AD8', text: '#FFFFFF', accent: '#406ac8' },
    purple: { bg: '#8A6AE8', grid: '#7A5AD8', text: '#FFFFFF', accent: '#6a4ac8' },
    pink:   { bg: '#E86AA8', grid: '#D85A98', text: '#FFFFFF', accent: '#c04a80' },
    dark:   { bg: '#2A2A2A', grid: '#3A3A3A', text: '#F0F0F0', accent: '#1a1a1a' },
    white:  { bg: '#FFFFFF', grid: '#F0F0F0', text: '#1a1a1a', accent: '#e0e0e0' },
  },
  
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  }
};

export const accentOptions = [
  { name: 'Lime', value: '#C8E636' },
  { name: 'Gold', value: '#F2D94E' },
  { name: 'Orange', value: '#E8924A' },
  { name: 'Red', value: '#E85D5D' },
  { name: 'Pink', value: '#E86AA8' },
  { name: 'Purple', value: '#8A6AE8' },
  { name: 'Blue', value: '#5A8AE8' },
  { name: 'Teal', value: '#5A9E8E' },
  { name: 'Mint', value: '#7FD8BE' },
  { name: 'Slate', value: '#64748b' },
];

export function generateTheme(mode: 'light' | 'dark', accent: string) {
  const isDark = mode === 'dark';
  
  return {
    mode,
    primary: accent,
    background: isDark ? '#0a0a0a' : '#F5F5F0',
    surface: isDark ? '#141414' : '#FFFFFF',
    surfaceHighlight: isDark ? '#1f1f1f' : '#FAFAF5',
    text: isDark ? '#F5F5F0' : '#1a1a1a',
    textSecondary: isDark ? '#a3a3a3' : '#6b7280',
    textTertiary: isDark ? '#737373' : '#9ca3af',
    border: isDark ? '#262626' : '#e5e7eb',
    success: palette.semantic.success,
    warning: palette.semantic.warning,
    danger: palette.semantic.danger,
    info: palette.semantic.info,
    isDark,
  };
}
