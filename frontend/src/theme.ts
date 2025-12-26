import { createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        /* Brand Colors - Tesla Inspired */
        tesla: {
          50: { value: '#fff1f2' },
          100: { value: '#ffe4e6' },
          200: { value: '#fecdd3' },
          300: { value: '#fda4af' },
          400: { value: '#fb7185' },
          500: { value: '#E31937' }, // Primary Tesla red
          600: { value: '#c5162e' },
          700: { value: '#a01325' },
          800: { value: '#881020' },
          900: { value: '#6b0d19' },
        },
        
        /* Accent Colors */
        accent: {
          blue: { value: '#3b82f6' },
          purple: { value: '#8b5cf6' },
          green: { value: '#10b981' },
          amber: { value: '#f59e0b' },
        },
        
        /* Semantic Colors */
        success: {
          50: { value: '#ecfdf5' },
          500: { value: '#10b981' },
          700: { value: '#047857' },
        },
        warning: {
          50: { value: '#fffbeb' },
          500: { value: '#f59e0b' },
          700: { value: '#b45309' },
        },
        error: {
          50: { value: '#fef2f2' },
          500: { value: '#ef4444' },
          700: { value: '#b91c1c' },
        },
        info: {
          50: { value: '#eff6ff' },
          500: { value: '#3b82f6' },
          700: { value: '#1d4ed8' },
        },
        
        /* Dark Mode Neutrals */
        neutral: {
          50: { value: '#fafafa' },
          100: { value: '#f5f5f5' },
          200: { value: '#e5e5e5' },
          300: { value: '#d4d4d4' },
          400: { value: '#a3a3a3' },
          500: { value: '#737373' },
          600: { value: '#525252' },
          700: { value: '#404040' },
          800: { value: '#262626' },
          900: { value: '#171717' },
        },
        
        /* App-Specific Surfaces & Colors */
        app: {
          // Backgrounds
          bg: { value: '#0a0e17' },           // Deepest background
          bg2: { value: '#0f1419' },          // Secondary background
          bgGradient: { value: 'linear-gradient(180deg, #0a0e17 0%, #0f1419 100%)' },
          
          // Surfaces (Cards, Panels)
          surface: { value: '#141922' },      // Primary surface
          surface2: { value: '#1a1f2e' },     // Secondary surface
          surfaceHover: { value: '#1f2533' }, // Hover state
          
          // Borders
          border: { value: 'rgba(255, 255, 255, 0.08)' },
          borderStrong: { value: 'rgba(255, 255, 255, 0.12)' },
          borderSubtle: { value: 'rgba(255, 255, 255, 0.04)' },
          
          // Text
          text: { value: '#f1f5f9' },         // Primary text
          text2: { value: '#cbd5e1' },        // Secondary text
          text3: { value: '#94a3b8' },        // Tertiary text
          muted: { value: '#64748b' },        // Muted text
          
          // Overlays
          overlay: { value: 'rgba(0, 0, 0, 0.6)' },
          overlayStrong: { value: 'rgba(0, 0, 0, 0.8)' },
          
          // Glass Effects
          glass: { value: 'rgba(20, 25, 34, 0.6)' },
          glassStrong: { value: 'rgba(20, 25, 34, 0.8)' },
        },
        
        /* Shadows */
        shadow: {
          sm: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.3)' },
          md: { value: '0 4px 12px 0 rgba(0, 0, 0, 0.4)' },
          lg: { value: '0 10px 30px 0 rgba(0, 0, 0, 0.5)' },
          xl: { value: '0 20px 50px 0 rgba(0, 0, 0, 0.6)' },
          inner: { value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' },
          glow: { value: '0 0 20px rgba(227, 25, 55, 0.3)' },
          glowStrong: { value: '0 0 30px rgba(227, 25, 55, 0.5)' },
        },
      },
      
      /* Typography */
      fonts: {
        body: { value: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
        heading: { value: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
        mono: { value: '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Courier New", monospace' },
      },
      
      fontSizes: {
        xs: { value: '0.75rem' },      // 12px
        sm: { value: '0.875rem' },     // 14px
        md: { value: '1rem' },         // 16px
        lg: { value: '1.125rem' },     // 18px
        xl: { value: '1.25rem' },      // 20px
        '2xl': { value: '1.5rem' },    // 24px
        '3xl': { value: '1.875rem' },  // 30px
        '4xl': { value: '2.25rem' },   // 36px
      },
      
      fontWeights: {
        light: { value: '300' },
        normal: { value: '400' },
        medium: { value: '500' },
        semibold: { value: '600' },
        bold: { value: '700' },
      },
      
      lineHeights: {
        tight: { value: '1.25' },
        normal: { value: '1.5' },
        relaxed: { value: '1.7' },
        loose: { value: '2' },
      },
      
      /* Spacing */
      spacing: {
        px: { value: '1px' },
        0: { value: '0' },
        0.5: { value: '0.125rem' },
        1: { value: '0.25rem' },
        2: { value: '0.5rem' },
        3: { value: '0.75rem' },
        4: { value: '1rem' },
        5: { value: '1.25rem' },
        6: { value: '1.5rem' },
        8: { value: '2rem' },
        10: { value: '2.5rem' },
        12: { value: '3rem' },
        16: { value: '4rem' },
        20: { value: '5rem' },
      },
      
      /* Border Radius */
      radii: {
        none: { value: '0' },
        sm: { value: '0.375rem' },    // 6px
        md: { value: '0.5rem' },      // 8px
        lg: { value: '0.75rem' },     // 12px
        xl: { value: '1rem' },        // 16px
        '2xl': { value: '1.25rem' },  // 20px
        '3xl': { value: '1.5rem' },   // 24px
        full: { value: '9999px' },
      },
      
      /* Transitions */
      durations: {
        fast: { value: '150ms' },
        normal: { value: '250ms' },
        slow: { value: '350ms' },
        slower: { value: '500ms' },
      },
      
      easings: {
        default: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        in: { value: 'cubic-bezier(0.4, 0, 1, 1)' },
        out: { value: 'cubic-bezier(0, 0, 0.2, 1)' },
        inOut: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      },
      
      /* Z-Index */
      zIndex: {
        hide: { value: '-1' },
        base: { value: '0' },
        docked: { value: '10' },
        dropdown: { value: '1000' },
        sticky: { value: '1100' },
        banner: { value: '1200' },
        overlay: { value: '1300' },
        modal: { value: '1400' },
        popover: { value: '1500' },
        skipLink: { value: '1600' },
        toast: { value: '1700' },
        tooltip: { value: '1800' },
      },
    },
    
    /* Breakpoints */
    breakpoints: {
      sm: '30em',    // 480px
      md: '48em',    // 768px
      lg: '62em',    // 992px
      xl: '80em',    // 1280px
      '2xl': '96em', // 1536px
    },
  },
});

export default system;

