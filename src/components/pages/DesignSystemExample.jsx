/**
 * EXEMPLO DE COMPONENTE USANDO O DESIGN SYSTEM
 * Este arquivo demonstra como aplicar o design system em componentes React
 */

import React from 'react'
import { colors, spacing, borderRadius, shadows, transitions } from '@/styles/designSystem'
import './DesignSystemExample.css'

export default function DesignSystemExample() {
  return (
    <div className="design-system-showcase">
      <div className="container mt-xl">
        {/* Seção de Cores */}
        <section className="showcase-section">
          <h2>🎨 Paleta de Cores</h2>
          <p className="text-muted mb-lg">Cores principais do sistema de design Aurora</p>

          <div className="colors-grid">
            {/* Azul Primário */}
            <div className="color-card">
              <div 
                className="color-sample"
                style={{ backgroundColor: colors.primary[500] }}
              />
              <h4>Azul Primário</h4>
              <p className="code">#0ea5e9</p>
              <p className="description">Confiança, profissionalismo, ações principais</p>
            </div>

            {/* Verde Secundário */}
            <div className="color-card">
              <div 
                className="color-sample"
                style={{ backgroundColor: colors.secondary[500] }}
              />
              <h4>Verde Secundário</h4>
              <p className="code">#22c55e</p>
              <p className="description">Progresso, sucesso, saúde</p>
            </div>

            {/* Rosa Accent */}
            <div className="color-card">
              <div 
                className="color-sample"
                style={{ backgroundColor: colors.accent[500] }}
              />
              <h4>Rosa Accent</h4>
              <p className="code">#ec4899</p>
              <p className="description">Destaque, atenção, energia</p>
            </div>

            {/* Vermelho de Erro */}
            <div className="color-card">
              <div 
                className="color-sample"
                style={{ backgroundColor: colors.error }}
              />
              <h4>Vermelho - Erro</h4>
              <p className="code">#ef4444</p>
              <p className="description">Erros, críticos, delete</p>
            </div>
          </div>
        </section>

        {/* Seção de Botões */}
        <section className="showcase-section">
          <h2>🔘 Variações de Botões</h2>
          <p className="text-muted mb-lg">Diferentes estilos de botões para diferentes contextos</p>

          <div className="buttons-grid">
            <div className="button-group">
              <button className="btn btn-primary">
                ✓ Primary Button
              </button>
              <p>Ação principal da página</p>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary">
                + Secondary Button
              </button>
              <p>Ações secundárias positivas</p>
            </div>

            <div className="button-group">
              <button className="btn btn-outline">
                ⓘ Outline Button
              </button>
              <p>Ações alternativas</p>
            </div>

            <div className="button-group">
              <button className="btn btn-ghost">
                ← Ghost Button
              </button>
              <p>Ações discretas</p>
            </div>

            <div className="button-group">
              <button className="btn btn-danger">
                🗑 Delete Button
              </button>
              <p>Ações críticas/delete</p>
            </div>
          </div>
        </section>

        {/* Seção de Cards */}
        <section className="showcase-section">
          <h2>📦 Variações de Cards</h2>
          <p className="text-muted mb-lg">Diferentes estilos de cards para apresentar informações</p>

          <div className="cards-grid">
            {/* Card Básico */}
            <div className="card card-basic">
              <h4>📊 Card Básico</h4>
              <p>Estrutura simples para apresentação de dados e informações gerais.</p>
            </div>

            {/* Card com Status */}
            <div className="card card-success">
              <div className="card-header">
                <h4>✅ Card Sucesso</h4>
                <span className="badge badge-success">Ativo</span>
              </div>
              <p>Indica um estado positivo ou ação bem-sucedida.</p>
            </div>

            {/* Card com Alerta */}
            <div className="card card-warning">
              <div className="card-header">
                <h4>⚠️ Card Alerta</h4>
                <span className="badge badge-warning">Atenção</span>
              </div>
              <p>Requer atenção do usuário. Algo precisa de revisão.</p>
            </div>

            {/* Card com Erro */}
            <div className="card card-error">
              <div className="card-header">
                <h4>❌ Card Erro</h4>
                <span className="badge badge-error">Crítico</span>
              </div>
              <p>Indica um erro ou situação crítica que precisa de ação.</p>
            </div>
          </div>
        </section>

        {/* Seção de Badges */}
        <section className="showcase-section">
          <h2>🏷️ Badges e Tags</h2>
          <p className="text-muted mb-lg">Diferentes estilos de badges para estados e categorias</p>

          <div className="badges-showcase">
            <span className="badge badge-primary">Primário</span>
            <span className="badge badge-secondary">Secundário</span>
            <span className="badge badge-success">✓ Sucesso</span>
            <span className="badge badge-warning">⚠ Alerta</span>
            <span className="badge badge-error">✕ Erro</span>
            <span className="badge badge-info">ⓘ Info</span>
          </div>
        </section>

        {/* Seção de Alerts */}
        <section className="showcase-section">
          <h2>🔔 Alertas</h2>
          <p className="text-muted mb-lg">Diferentes tipos de mensagens de alerta</p>

          <div className="alerts-grid">
            <div className="alert alert-info">
              <span className="alert-icon">ⓘ</span>
              <div>
                <strong>Informação</strong>
                <p>Esta é uma mensagem informativa para o usuário.</p>
              </div>
            </div>

            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <div>
                <strong>Sucesso</strong>
                <p>Ação realizada com sucesso!</p>
              </div>
            </div>

            <div className="alert alert-warning">
              <span className="alert-icon">⚠</span>
              <div>
                <strong>Aviso</strong>
                <p>Esta ação requer sua atenção.</p>
              </div>
            </div>

            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <div>
                <strong>Erro</strong>
                <p>Ocorreu um erro ao processar sua solicitação.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Tipografia */}
        <section className="showcase-section">
          <h2>📝 Tipografia</h2>
          <p className="text-muted mb-lg">Hierarquia de tipografia do sistema</p>

          <div className="typography-showcase">
            <h1>Título H1 - 36px Bold</h1>
            <h2>Título H2 - 30px Bold</h2>
            <h3>Título H3 - 24px Semibold</h3>
            <h4>Título H4 - 20px Semibold</h4>
            <p>Parágrafo - 16px Normal - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-small">Texto Pequeno - 14px Normal - Detalhes e informações secundárias.</p>
          </div>
        </section>

        {/* Seção de Grid Responsivo */}
        <section className="showcase-section">
          <h2>📱 Grid Responsivo</h2>
          <p className="text-muted mb-lg">O layout se adapta automaticamente para diferentes tamanhos de tela</p>

          <div className="responsive-grid">
            <div className="grid-item">
              <div className="grid-placeholder">1</div>
              <p>Adapta de 4 colunas (desktop) → 2 (tablet) → 1 (mobile)</p>
            </div>
            <div className="grid-item">
              <div className="grid-placeholder">2</div>
            </div>
            <div className="grid-item">
              <div className="grid-placeholder">3</div>
            </div>
            <div className="grid-item">
              <div className="grid-placeholder">4</div>
            </div>
          </div>
        </section>

        {/* Seção de Espaçamento */}
        <section className="showcase-section">
          <h2>📏 Sistema de Espaçamento</h2>
          <p className="text-muted mb-lg">Espaçamento consistente em toda a aplicação</p>

          <div className="spacing-showcase">
            <div>
              <label>Extra Small (4px)</label>
              <div style={{ 
                backgroundColor: colors.primary[100],
                height: `${4}px`,
                borderRadius: borderRadius.base
              }} />
            </div>
            <div>
              <label>Small (8px)</label>
              <div style={{ 
                backgroundColor: colors.primary[200],
                height: `${8}px`,
                borderRadius: borderRadius.base
              }} />
            </div>
            <div>
              <label>Medium (16px)</label>
              <div style={{ 
                backgroundColor: colors.primary[300],
                height: `${16}px`,
                borderRadius: borderRadius.base
              }} />
            </div>
            <div>
              <label>Large (24px)</label>
              <div style={{ 
                backgroundColor: colors.primary[400],
                height: `${24}px`,
                borderRadius: borderRadius.base
              }} />
            </div>
            <div>
              <label>Extra Large (32px)</label>
              <div style={{ 
                backgroundColor: colors.primary[500],
                height: `${32}px`,
                borderRadius: borderRadius.base
              }} />
            </div>
          </div>
        </section>

        {/* Próximos Passos */}
        <section className="showcase-section mb-3xl">
          <div className="card card-info">
            <h3>🚀 Próximos Passos</h3>
            <ol className="steps-list">
              <li>Revisar este exemplo de design system</li>
              <li>Decidir quais componentes refatorar primeiro</li>
              <li>Aplicar o design system em Dashboard.jsx</li>
              <li>Refatorar RegistroDiarioGrid.jsx</li>
              <li>Refatorar RegistroDiarioEdit.jsx</li>
              <li>Criar componentes reutilizáveis (Button, Card, Alert)</li>
              <li>Testar responsividade em todos os breakpoints</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
