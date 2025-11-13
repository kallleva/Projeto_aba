# Documentação: Suporte ao Tipo PERCENTUAL no Frontend

## Visão Geral

O frontend foi atualizado para suportar o novo tipo de pergunta `PERCENTUAL` e as opções padronizadas para perguntas de múltipla escolha, seguindo a estrutura implementada no backend.

## Mudanças Implementadas

### 1. FormularioEditor.jsx

#### ✅ Novo Tipo PERCENTUAL
- Adicionado `PERCENTUAL` à lista de tipos de pergunta
- Interface específica para configuração de fórmulas PERCENTUAL
- Validação de fórmulas no formato `PERCENTUAL(P1:P15)`

#### ✅ Opções Padronizadas para Múltipla Escolha
- Checkbox para ativar opções padronizadas
- Opções automáticas: "Não Adquirido", "Parcial", "Adquirido"
- Valores correspondentes: 0, 1, 2

#### ✅ Validações Aprimoradas
- Validação de fórmulas PERCENTUAL com regex
- Verificação de formato correto: `PERCENTUAL(P{inicio}:P{fim})`
- Mensagens de erro específicas

### 2. Pergunta.jsx

#### ✅ Suporte ao Tipo PERCENTUAL
- Adicionado `PERCENTUAL` à lista de tipos disponíveis
- Interface consistente com FormularioEditor

## Interface do Usuário

### 1. Criação de Perguntas PERCENTUAL

Quando o usuário seleciona o tipo "Percentual":

```jsx
// Campo de fórmula aparece automaticamente
<Input
  placeholder="Ex: PERCENTUAL(P1:P15)"
  value={p.formula || ''}
  onChange={(e) => {
    // Atualiza a fórmula
  }}
/>

// Instruções de uso
<div className="text-xs text-gray-500 space-y-1">
  <div>Use PERCENTUAL(P{inicio}:P{fim}) para calcular percentual de aquisição</div>
  <div className="font-mono text-xs">
    Exemplos: PERCENTUAL(P1:P15) | PERCENTUAL(P10:P20) | PERCENTUAL(P5:P5)
  </div>
  <div className="text-blue-600">
    Calcula: (SOMA(respostas) / (N × 2)) × 100
  </div>
</div>
```

### 2. Opções Padronizadas para Múltipla Escolha

Para perguntas do tipo "Múltipla Escolha":

```jsx
// Checkbox para ativar opções padronizadas
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    checked={p.opcoes_padronizadas || false}
    onChange={(e) => {
      // Ativa/desativa opções padronizadas
      if (e.target.checked) {
        novas[index].opcoes = ['Não Adquirido', 'Parcial', 'Adquirido']
      }
    }}
  />
  <label>Usar opções padronizadas (Adquirido, Parcial, Não Adquirido)</label>
</div>

// Exibição das opções padronizadas
{p.opcoes_padronizadas ? (
  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
    Opções: "Não Adquirido" (0), "Parcial" (1), "Adquirido" (2)
  </div>
) : (
  // Campo personalizado para opções
)}
```

## Validações Implementadas

### 1. Validação de Fórmulas PERCENTUAL

```javascript
// Regex para validar formato PERCENTUAL
const percentuaisInvalidos = perguntasPercentual.filter(p => 
  !p.formula || 
  p.formula.trim() === '' || 
  !p.formula.match(/^PERCENTUAL\(P\d+:P\d+\)$/)
)

if (percentuaisInvalidos.length > 0) {
  toast({
    title: 'Fórmulas de percentual inválidas',
    description: `Perguntas do tipo Percentual devem ter uma fórmula no formato PERCENTUAL(P1:P15): ${percentuaisInvalidos.map(p => p.texto).join(', ')}`,
    variant: 'destructive'
  })
}
```

### 2. Validação de Opções Múltipla Escolha

```javascript
// Validação de opções para múltipla escolha
const perguntasMultipla = formData.perguntas.filter(p => p.tipo === 'MULTIPLA')
const opcoesInvalidas = perguntasMultipla.filter(p => !p.opcoes || p.opcoes.length < 2)

if (opcoesInvalidas.length > 0) {
  toast({
    title: 'Opções inválidas',
    description: `Perguntas de Múltipla Escolha devem ter pelo menos 2 opções: ${opcoesInvalidas.map(p => p.texto).join(', ')}`,
    variant: 'destructive'
  })
}
```

## Exemplos de Uso

### 1. Criando uma Pergunta PERCENTUAL

1. **Selecionar tipo**: "Percentual"
2. **Definir texto**: "Indicador de Comunicação Receptiva"
3. **Configurar fórmula**: `PERCENTUAL(P1:P15)`
4. **Salvar**: O sistema valida o formato automaticamente

### 2. Criando uma Pergunta com Opções Padronizadas

1. **Selecionar tipo**: "Múltipla Escolha"
2. **Definir texto**: "Nível de aquisição da habilidade"
3. **Ativar checkbox**: "Usar opções padronizadas"
4. **Opções automáticas**: "Não Adquirido", "Parcial", "Adquirido"

### 3. Fórmulas PERCENTUAL Válidas

```javascript
// Exemplos de fórmulas válidas
"PERCENTUAL(P1:P15)"    // Perguntas 1 a 15
"PERCENTUAL(P10:P20)"    // Perguntas 10 a 20
"PERCENTUAL(P5:P5)"      // Apenas pergunta 5
"PERCENTUAL(P1:P30)"     // Perguntas 1 a 30
```

## Integração com Backend

### 1. Payload de Envio

```javascript
// Estrutura enviada para o backend
const payload = {
  nome: formData.nome.trim(),
  descricao: formData.descricao?.trim() || "",
  categoria: formData.categoria || "avaliacao",
  perguntas: formData.perguntas.map((p, index) => {
    const pergunta = {
      texto: p.texto.trim(),
      tipo: p.tipo.toUpperCase(),
      obrigatoria: p.obrigatoria || false
    }
    
    // Campos específicos por tipo
    if (p.tipo === 'FORMULA' || p.tipo === 'PERCENTUAL') {
      pergunta.formula = p.formula?.trim() || null
    }
    
    if (p.tipo === 'MULTIPLA') {
      pergunta.opcoes = p.opcoes || []
      // Se usar opções padronizadas, garantir que estão corretas
      if (p.opcoes_padronizadas) {
        pergunta.opcoes = ['Não Adquirido', 'Parcial', 'Adquirido']
      }
    }
    
    return pergunta
  })
}
```

### 2. Tratamento de Respostas

O frontend agora suporta:
- **Perguntas PERCENTUAL**: Calculadas automaticamente pelo backend
- **Opções padronizadas**: Valores 0, 1, 2 mapeados para "Não Adquirido", "Parcial", "Adquirido"
- **Validação em tempo real**: Feedback imediato sobre fórmulas inválidas

## Benefícios da Implementação

### 1. **Padronização**
- Opções consistentes para avaliações de aquisição
- Fórmulas padronizadas para cálculos percentuais
- Interface intuitiva para configuração

### 2. **Validação Robusta**
- Verificação de formato de fórmulas
- Validação de opções obrigatórias
- Mensagens de erro claras e específicas

### 3. **Flexibilidade**
- Opção de usar opções personalizadas ou padronizadas
- Suporte a diferentes ranges de perguntas
- Compatibilidade com sistema existente

### 4. **Experiência do Usuário**
- Interface clara e intuitiva
- Feedback visual imediato
- Instruções contextuais

## Próximos Passos

1. **Testes**: Criar testes unitários para as novas funcionalidades
2. **Documentação da API**: Atualizar documentação das rotas
3. **Relatórios**: Implementar visualizações para indicadores percentuais
4. **Migração**: Atualizar formulários existentes para usar as novas opções

## Considerações Técnicas

- **Compatibilidade**: Mantida com sistema existente
- **Performance**: Validações otimizadas para não impactar performance
- **Segurança**: Validação de entrada para prevenir XSS
- **Acessibilidade**: Interface acessível com labels e instruções claras
