/**
 * SISTEMA DE DESIGN - PROJETO AURORA
 * Design System para Clínicas de Terapia e Acompanhamento
 * 
 * Paleta de cores, tipografia, espaçamento e componentes padrão
 */

// ============================================
// PALETA DE CORES
// ============================================
export const colors = {
  // Cores Primárias - Confiança e Saúde
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Azul confiável para healthcare
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },

  // Cores Secundárias - Bem-estar e Crescimento
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Verde para progresso e saúde
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },

  // Cores de Destaque - Atenção
  accent: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f8b4d8',
    400: '#f472b6',
    500: '#ec4899', // Rosa para destaque
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },

  // Cores Funcionais
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#0ea5e9',

  // Cores Neutras
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Cores de Fundo
  background: {
    light: '#ffffff',
    neutral: '#f9fafb',
    dark: '#f3f4f6',
  },
}

// ============================================
// TIPOGRAFIA
// ============================================
export const typography = {
  // Tamanhos de fonte
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },

  // Pesos
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Altura de linha
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Estilos pré-configurados
  styles: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.25,
    },
  },
}

// ============================================
// ESPAÇAMENTO
// ============================================
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  elevated: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
}

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
}

// ============================================
// TRANSIÇÕES
// ============================================
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// ============================================
// BREAKPOINTS (Responsive Design)
// ============================================
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// ============================================
// COMPONENTES PADRÃO - CSS-in-JS Classes
// ============================================
export const components = {
  // Cards
  card: {
    base: `
      background: ${colors.background.light};
      border: 1px solid ${colors.neutral[200]};
      border-radius: ${borderRadius.lg};
      box-shadow: ${shadows.sm};
      transition: all ${transitions.base};
      padding: ${spacing.lg};
    `,
    hover: `
      box-shadow: ${shadows.md};
      border-color: ${colors.primary[300]};
    `,
    elevated: `
      box-shadow: ${shadows.lg};
    `,
  },

  // Botões
  button: {
    base: `
      padding: ${spacing.md} ${spacing.lg};
      border-radius: ${borderRadius.md};
      font-weight: ${typography.weight.medium};
      transition: all ${transitions.base};
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: ${spacing.sm};
    `,
    primary: `
      background-color: ${colors.primary[500]};
      color: white;
      &:hover {
        background-color: ${colors.primary[600]};
        box-shadow: ${shadows.md};
      }
      &:active {
        background-color: ${colors.primary[700]};
      }
    `,
    secondary: `
      background-color: ${colors.secondary[500]};
      color: white;
      &:hover {
        background-color: ${colors.secondary[600]};
      }
    `,
    outline: `
      background-color: transparent;
      color: ${colors.primary[600]};
      border: 1.5px solid ${colors.primary[300]};
      &:hover {
        background-color: ${colors.primary[50]};
        border-color: ${colors.primary[500]};
      }
    `,
    ghost: `
      background-color: transparent;
      color: ${colors.primary[600]};
      &:hover {
        background-color: ${colors.neutral[100]};
      }
    `,
    danger: `
      background-color: ${colors.error};
      color: white;
      &:hover {
        background-color: #dc2626;
      }
    `,
  },

  // Inputs
  input: {
    base: `
      padding: ${spacing.sm} ${spacing.md};
      border: 1px solid ${colors.neutral[300]};
      border-radius: ${borderRadius.md};
      font-size: ${typography.size.base};
      transition: all ${transitions.base};
      &:focus {
        outline: none;
        border-color: ${colors.primary[500]};
        box-shadow: 0 0 0 3px ${colors.primary[100]};
      }
      &:disabled {
        background-color: ${colors.neutral[100]};
        color: ${colors.neutral[400]};
        cursor: not-allowed;
      }
    `,
  },

  // Badges
  badge: {
    base: `
      display: inline-flex;
      align-items: center;
      padding: ${spacing.xs} ${spacing.sm};
      border-radius: ${borderRadius.full};
      font-size: ${typography.size.sm};
      font-weight: ${typography.weight.medium};
    `,
    primary: `
      background-color: ${colors.primary[100]};
      color: ${colors.primary[800]};
    `,
    secondary: `
      background-color: ${colors.secondary[100]};
      color: ${colors.secondary[800]};
    `,
    success: `
      background-color: #dcfce7;
      color: #166534;
    `,
    warning: `
      background-color: #fef3c7;
      color: #92400e;
    `,
    error: `
      background-color: #fee2e2;
      color: #991b1b;
    `,
  },

  // Alerts
  alert: {
    base: `
      padding: ${spacing.lg};
      border-radius: ${borderRadius.lg};
      border-left: 4px solid;
      display: flex;
      gap: ${spacing.md};
    `,
    info: `
      background-color: ${colors.primary[50]};
      border-color: ${colors.primary[500]};
      color: ${colors.primary[900]};
    `,
    success: `
      background-color: #dcfce7;
      border-color: ${colors.secondary[500]};
      color: #166534;
    `,
    warning: `
      background-color: #fef3c7;
      border-color: ${colors.warning};
      color: #92400e;
    `,
    error: `
      background-color: #fee2e2;
      border-color: ${colors.error};
      color: #991b1b;
    `,
  },

  // Cards de Status
  statusCard: {
    base: `
      padding: ${spacing.lg};
      border-radius: ${borderRadius.lg};
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid ${colors.neutral[200]};
    `,
  },
}

// ============================================
// TEMAS PRÉ-DEFINIDOS
// ============================================
export const themes = {
  healthcare: {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    accent: colors.accent[500],
    background: colors.background.light,
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    border: colors.neutral[200],
  },
  minimal: {
    primary: colors.primary[600],
    secondary: colors.neutral[500],
    accent: colors.accent[500],
    background: colors.background.light,
    text: colors.neutral[900],
    textSecondary: colors.neutral[500],
    border: colors.neutral[300],
  },
}

export default {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  breakpoints,
  components,
  themes,
}
