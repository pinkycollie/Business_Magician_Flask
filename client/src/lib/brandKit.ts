/**
 * 360 Magician Brand Kit
 * This file contains the brand colors and styling guidelines for the 360 Magician ecosystem.
 */

export const brandColors = {
  // Primary brand colors
  business: {
    primary: '#0066CC',     // Blue
    secondary: '#FFD700',   // Gold
    accent: '#004D99',      // Dark Blue
    light: '#E6F0FF',       // Light Blue
    text: {
      primary: '#1A1A1A',   // Nearly Black
      secondary: '#4D4D4D', // Dark Gray
      light: '#FFFFFF'      // White
    }
  },
  
  job: {
    primary: '#0080FF',     // Bright Blue
    secondary: '#E6F0FF',   // Light Blue
    accent: '#005CB2',      // Medium Blue
    light: '#F0F7FF',       // Very Light Blue
    text: {
      primary: '#1A1A1A',   // Nearly Black
      secondary: '#4D4D4D', // Dark Gray
      light: '#FFFFFF'      // White
    }
  },
  
  vr: {
    primary: '#6A00FF',     // Purple
    secondary: '#F0E6FF',   // Light Purple
    accent: '#4B00B2',      // Dark Purple
    light: '#F7F0FF',       // Very Light Purple
    text: {
      primary: '#1A1A1A',   // Nearly Black
      secondary: '#4D4D4D', // Dark Gray
      light: '#FFFFFF'      // White
    }
  }
};

export const fontFamilies = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
};

export const borderRadiuses = {
  small: '0.25rem',    // 4px
  medium: '0.5rem',    // 8px 
  large: '0.75rem',    // 12px
  xl: '1rem',          // 16px
  xxl: '1.5rem',       // 24px
  full: '9999px'       // Full rounded (circles)
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Helper functions
export function getGradient(brand: 'business' | 'job' | 'vr', direction = 'to-r') {
  const colors = brandColors[brand];
  return `bg-gradient-${direction} from-${colors.primary} to-${colors.accent}`;
}