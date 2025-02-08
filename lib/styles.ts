/**
 * Critical styles utility to ensure core styles are applied even if Tailwind fails
 * @version 1.0.0
 */

export const criticalStyles = {
  panel: {
    backgroundColor: '#1A1F2A',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#FFB800',
    color: '#1A1F2A',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
} as const;

export type StyleKey = keyof typeof criticalStyles;

/**
 * Combines Tailwind classes with critical CSS as inline styles
 */
export function withFallbackStyles(tailwindClasses: string, styleKey: StyleKey) {
  return {
    className: tailwindClasses,
    style: criticalStyles[styleKey],
  };
} 