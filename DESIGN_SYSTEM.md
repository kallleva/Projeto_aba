# 🎨 SISTEMA DE DESIGN - PROJETO AURORA

## Visão Geral
Sistema de design profissional para clínicas de terapia e acompanhamento. Focado em confiança, bem-estar e clareza da informação.

---

## 📋 Índice
1. [Paleta de Cores](#paleta-de-cores)
2. [Tipografia](#tipografia)
3. [Componentes](#componentes)
4. [Padrões de Layout](#padrões-de-layout)
5. [Animações](#animações)
6. [Responsive Design](#responsive-design)

---

## 🎨 Paleta de Cores

### Cores Primárias - Confiança e Profissionalismo
- **Azul Principal**: `#0ea5e9` (Primary 500)
  - Usado em: Botões principais, links, highlights
  - Transmite: Confiança, segurança, profissionalismo
  - Variações: 50 até 900 para sombras e destaques

### Cores Secundárias - Progresso e Saúde
- **Verde**: `#22c55e` (Secondary 500)
  - Usado em: Indicadores de progresso, sucesso, campos completos
  - Transmite: Crescimento, positivo, saúde
  - Variações: 50 até 900

### Cores de Destaque - Atenção
- **Rosa/Magenta**: `#ec4899` (Accent 500)
  - Usado em: Chamadas para ação secundárias, destaques
  - Transmite: Dinamismo, energia
  - Variações: 50 até 900

### Cores Funcionais
- **Success (Verde)**: `#22c55e` - Ações bem-sucedidas
- **Warning (Amarelo)**: `#eab308` - Atenção, avisos
- **Error (Vermelho)**: `#ef4444` - Erros, crítico
- **Info (Azul)**: `#0ea5e9` - Informações

### Cores Neutras - Estrutura
- **Neutro 50-900**: Da mais clara (#fafafa) até a mais escura (#171717)
- Usado em: Textos, bordas, fundos secundários
- Garantem hierarquia visual clara

---

## 📝 Tipografia

### Fontes
- **Primária**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- Benefício: Carregamento rápido, consistência entre sistemas

### Tamanhos
```
xs:    12px (0.75rem)
sm:    14px (0.875rem)
base:  16px (1rem)      ← Tamanho base padrão
lg:    18px (1.125rem)
xl:    20px (1.25rem)
2xl:   24px (1.5rem)
3xl:   30px (1.875rem)
4xl:   36px (2.25rem)
```

### Pesos
- **300**: Light (raramente usado)
- **400**: Normal (corpo de texto)
- **500**: Medium (labels, destaques leves)
- **600**: Semibold (títulos secundários)
- **700**: Bold (títulos principais)
- **800**: Extrabold (títulos de página)

### Hierarquia de Texto

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| H1 (Page Title) | 36px | 700 | Títulos principais de página |
| H2 (Section) | 30px | 700 | Títulos de seções |
| H3 (Subsection) | 24px | 600 | Subtítulos |
| H4 (Card Title) | 20px | 600 | Títulos de cards |
| Body | 16px | 400 | Texto principal |
| Body Small | 14px | 400 | Texto secundário |
| Label | 14px | 500 | Labels, badges |

---

## 🎯 Componentes

### 1. Botões

#### Primary Button
```css
Background: #0ea5e9
Color: White
Padding: 1rem 1.5rem
Hover: #0284c7 + shadow
Active: #0369a1
```

#### Secondary Button
```css
Background: #22c55e
Color: White
Usado em: Ações confirmadas/positivas
```

#### Outline Button
```css
Background: Transparent
Border: 1.5px solid #7dd3fc
Color: #0284c7
Hover: Background #f0f9ff
```

#### Ghost Button
```css
Background: Transparent
Color: #0284c7
Hover: Background #f5f5f5
Usado em: Ações secundárias
```

#### Danger Button
```css
Background: #ef4444
Color: White
Usado em: Delete, ações críticas
```

### 2. Cards

```css
Background: White
Border: 1px solid #e5e5e5
Border Radius: 12px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Padding: 24px
Hover: Shadow aumenta + border azula
```

### 3. Inputs

```css
Padding: 8px 16px
Border: 1px solid #d4d4d4
Border Radius: 8px
Font Size: 16px
Focus: Border azul + ring #f0f9ff
Disabled: Background #f5f5f5
```

### 4. Badges/Tags

```css
Padding: 4px 8px
Border Radius: 9999px
Font Size: 14px
Font Weight: 600

Variantes:
- Primary: Background #f0f9ff, Color #075985
- Success: Background #dcfce7, Color #166534
- Warning: Background #fef3c7, Color #92400e
- Error: Background #fee2e2, Color #991b1b
```

### 5. Alerts

```css
Padding: 24px
Border Radius: 12px
Border Left: 4px solid (cor do tipo)
Display: Flex
Gap: 16px

Tipos:
- Info: Background #f0f9ff, Border #0ea5e9
- Success: Background #dcfce7, Border #22c55e
- Warning: Background #fef3c7, Border #eab308
- Error: Background #fee2e2, Border #ef4444
```

### 6. Status Indicators

```css
Tamanho: 12px
Animação: Pulse (opacity 1 → 0.5)
Cores: Verde (ativo), Amarelo (alerta), Vermelho (inativo)
```

---

## 🏗️ Padrões de Layout

### Container Principal
- Max Width: 1280px
- Padding: 24px (lateral)
- Centralizado com margin auto

### Grid Responsivo
```css
Default: Auto-fit, minmax(300px, 1fr)
Tablet (768px): 2 colunas
Mobile (640px): 1 coluna
```

### Spacing System
```
xs:  4px
sm:  8px
md:  16px  ← Padrão entre elementos
lg:  24px  ← Padrão entre seções
xl:  32px
2xl: 48px
3xl: 64px
```

### Header Sticky
- Position: Sticky
- Top: 0
- Z-index: 100
- Background: White com backdrop-filter blur
- Border Bottom: 1px light gray

---

## ✨ Animações

### Transições Padrão
```
Fast:  150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:  200ms cubic-bezier(0.4, 0, 0.2, 1)  ← Padrão
Slow:  300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Animações Disponíveis

#### Fade In
```css
De: opacity 0
Para: opacity 1
Duração: 300ms
```

#### Slide Down
```css
De: opacity 0, translateY(-10px)
Para: opacity 1, translateY(0)
Duração: 300ms
```

#### Pulse (para status)
```css
Ciclo: opacity 1 → 0.5 → 1
Duração: 2s infinito
```

#### Bounce
```css
Para elementos de atenção
Duração: 1s infinito
```

---

## 📱 Responsive Design

### Breakpoints
```
xs:  320px  (Mobile pequeno)
sm:  640px  (Mobile)
md:  768px  (Tablet)
lg:  1024px (Desktop pequeno)
xl:  1280px (Desktop)
2xl: 1536px (Desktop grande)
```

### Estratégia Mobile-First
1. Estilos base para mobile (100% do viewport)
2. Media queries para aumentar tamanho em telas maiores
3. Prioridade: Legibilidade > Estética em mobile

### Ajustes por Tamanho

**Mobile (< 640px)**
- Padding: 16px
- Font sizes: -1 nível
- Grid: 1 coluna
- Menus: Hamburger

**Tablet (640px - 1024px)**
- Padding: 24px
- Grid: 2 colunas
- Sidebar: Colapsável

**Desktop (> 1024px)**
- Padding: 32px
- Grid: 3-4 colunas
- Sidebar: Expandido por padrão

---

## 🎬 Implementação nos Componentes

### Exemplo: Dashboard Card

```jsx
<Card className="card">
  <div className="p-lg">
    <h3 className="mb-sm">Título</h3>
    <p className="text-muted">Descrição</p>
  </div>
  <button className="button button-primary">Ação</button>
</Card>
```

### Exemplo: Status Badge

```jsx
<span className="status-success">✓ Ativo</span>
<span className="status-warning">⚠ Atenção</span>
<span className="status-error">✕ Erro</span>
```

---

## 🔄 Próximos Passos para Integração

1. **Refatorar Dashboard.jsx** - Aplicar cores e spacing
2. **Refatorar RegistroDiarioGrid.jsx** - Nova paleta de cores
3. **Refatorar RegistroDiarioEdit.jsx** - Inputs e formulários
4. **Criar componentes reutilizáveis** - Button, Card, Alert
5. **Padronizar tabelas** - Com novo styling
6. **Otimizar responsivo** - Testar em todos os breakpoints

---

## 📞 Contato e Dúvidas

Para dúvidas sobre implementação, consulte:
- `designSystem.js` - Variáveis e constantes
- `designPatterns.js` - Padrões CSS
- `global.css` - Estilos globais

