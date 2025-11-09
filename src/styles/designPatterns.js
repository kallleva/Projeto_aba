/**
 * DESIGN PATTERNS E COMPONENTES
 * Guia de componentes e padrões de design para Aurora
 */

import { colors, spacing, borderRadius, shadows, transitions } from './designSystem'

// ============================================
// PADRÕES DE LAYOUT
// ============================================
export const layoutPatterns = {
  // Grid responsivo para cards
  cardGrid: `
    display: grid;
    gap: ${spacing.lg};
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

  // Container principal
  container: `
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${spacing.lg};
    @media (max-width: 768px) {
      padding: 0 ${spacing.md};
    }
  `,

  // Flexbox para centrar
  centerFlex: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  // Header com shadow
  headerSticky: `
    position: sticky;
    top: 0;
    z-index: 100;
    background: ${colors.background.light};
    border-bottom: 1px solid ${colors.neutral[200]};
    box-shadow: ${shadows.sm};
    backdrop-filter: blur(10px);
  `,
}

// ============================================
// PADRÕES DE CORES POR CONTEXTO
// ============================================
export const colorPatterns = {
  // Para seções de sucesso/progresso
  success: {
    background: colors.secondary[50],
    border: colors.secondary[200],
    text: colors.secondary[900],
    icon: colors.secondary[500],
  },

  // Para seções de alerta/atenção
  warning: {
    background: '#fef3c7',
    border: colors.warning,
    text: '#92400e',
    icon: colors.warning,
  },

  // Para seções críticas/erro
  error: {
    background: '#fee2e2',
    border: colors.error,
    text: '#991b1b',
    icon: colors.error,
  },

  // Para informações
  info: {
    background: colors.primary[50],
    border: colors.primary[200],
    text: colors.primary[900],
    icon: colors.primary[500],
  },

  // Para seções neutras
  neutral: {
    background: colors.neutral[50],
    border: colors.neutral[200],
    text: colors.neutral[700],
    icon: colors.neutral[500],
  },
}

// ============================================
// PADRÕES DE COMPONENTES
// ============================================
export const componentPatterns = {
  // Card com ícone e dados
  statCard: `
    padding: ${spacing.lg};
    background: ${colors.background.light};
    border: 1px solid ${colors.neutral[200]};
    border-radius: ${borderRadius.lg};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${spacing.md};
    box-shadow: ${shadows.sm};
    transition: all ${transitions.base};
    
    &:hover {
      box-shadow: ${shadows.md};
      border-color: ${colors.primary[300]};
      transform: translateY(-2px);
    }
  `,

  // Header de seção
  sectionHeader: `
    margin-bottom: ${spacing.lg};
    padding-bottom: ${spacing.md};
    border-bottom: 2px solid ${colors.primary[500]};
    
    h2 {
      color: ${colors.neutral[900]};
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }
    
    p {
      color: ${colors.neutral[600]};
      margin: ${spacing.sm} 0 0 0;
    }
  `,

  // Tabela com estilos
  table: `
    width: 100%;
    border-collapse: collapse;
    
    thead {
      background-color: ${colors.neutral[100]};
      border-bottom: 2px solid ${colors.neutral[300]};
    }
    
    th {
      padding: ${spacing.md};
      text-align: left;
      font-weight: 600;
      color: ${colors.neutral[700]};
    }
    
    td {
      padding: ${spacing.md};
      border-bottom: 1px solid ${colors.neutral[200]};
      color: ${colors.neutral[600]};
    }
    
    tbody tr:hover {
      background-color: ${colors.primary[50]};
    }
  `,

  // Lista com ícones
  listWithIcons: `
    display: flex;
    flex-direction: column;
    gap: ${spacing.md};
    
    li {
      display: flex;
      align-items: flex-start;
      gap: ${spacing.md};
      list-style: none;
      
      .icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        color: ${colors.primary[500]};
        margin-top: 2px;
      }
      
      .content {
        flex: 1;
      }
    }
  `,

  // Modal/Dialog base
  modal: `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    
    .modal-content {
      background: ${colors.background.light};
      border-radius: ${borderRadius.xl};
      box-shadow: ${shadows.elevated};
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      padding: ${spacing.xl};
    }
  `,

  // Progress bar
  progressBar: `
    height: 8px;
    background-color: ${colors.neutral[200]};
    border-radius: ${borderRadius.full};
    overflow: hidden;
    
    .fill {
      height: 100%;
      background: linear-gradient(90deg, ${colors.secondary[400]}, ${colors.secondary[600]});
      transition: width ${transitions.base};
      border-radius: ${borderRadius.full};
    }
  `,

  // Badge com cor dinâmica
  statusBadge: `
    display: inline-flex;
    align-items: center;
    gap: ${spacing.xs};
    padding: ${spacing.xs} ${spacing.sm};
    border-radius: ${borderRadius.full};
    font-size: 0.875rem;
    font-weight: 600;
    transition: all ${transitions.base};
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: ${borderRadius.full};
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
}

// ============================================
// PADRÕES DE ANIMAÇÕES
// ============================================
export const animationPatterns = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    animation: fadeIn 300ms ease-in-out;
  `,

  slideDown: `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    animation: slideDown 300ms ease-out;
  `,

  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    animation: bounce 1s ease-in-out infinite;
  `,

  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `,

  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    animation: spin 1s linear infinite;
  `,
}

// ============================================
// PADRÕES DE TIPOGRAFIA
// ============================================
export const typographyPatterns = {
  pageTitle: `
    font-size: 2.25rem;
    font-weight: 700;
    color: ${colors.neutral[900]};
    line-height: 1.2;
    margin-bottom: ${spacing.md};
  `,

  pageSubtitle: `
    font-size: 1rem;
    color: ${colors.neutral[600]};
    line-height: 1.5;
    margin-bottom: ${spacing.lg};
  `,

  cardTitle: `
    font-size: 1.125rem;
    font-weight: 600;
    color: ${colors.neutral[900]};
    margin-bottom: ${spacing.sm};
  `,

  cardText: `
    font-size: 0.875rem;
    color: ${colors.neutral[600]};
    line-height: 1.5;
  `,

  label: `
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.neutral[700]};
    margin-bottom: ${spacing.xs};
    display: block;
  `,
}

// ============================================
// PADRÕES DE ESPAÇAMENTO
// ============================================
export const spacingPatterns = {
  pageSection: `
    padding: ${spacing.xl} 0;
    border-bottom: 1px solid ${colors.neutral[200]};
    
    &:last-section {
      border-bottom: none;
    }
  `,

  cardSpacing: `
    margin-bottom: ${spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,

  formGroup: `
    margin-bottom: ${spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,
}

// ============================================
// PADRÕES DE RESPONSIVE
// ============================================
export const responsivePatterns = {
  mobile: `
    @media (max-width: 640px) {
      padding: ${spacing.md};
      font-size: 0.875rem;
    }
  `,

  tablet: `
    @media (min-width: 640px) and (max-width: 1024px) {
      padding: ${spacing.lg};
    }
  `,

  desktop: `
    @media (min-width: 1024px) {
      padding: ${spacing.xl};
    }
  `,
}

export default {
  layoutPatterns,
  colorPatterns,
  componentPatterns,
  animationPatterns,
  typographyPatterns,
  spacingPatterns,
  responsivePatterns,
}
