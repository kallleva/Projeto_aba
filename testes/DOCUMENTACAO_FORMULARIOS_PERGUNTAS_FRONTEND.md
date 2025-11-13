# 📋 Documentação - Sistema de Formulários e Perguntas

## 🎯 Visão Geral

O sistema permite criar formulários dinâmicos com diferentes tipos de perguntas, incluindo suporte a fórmulas para cálculos automáticos. Cada formulário pode ter múltiplas perguntas ordenadas com validações específicas.

## 📊 Estrutura dos Modelos

### 🗂️ Modelo Formulário (`src/models/formulario.py`)

```python
class Formulario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(400))
    categoria = db.Column(db.String(50), nullable=False, default="avaliacao")
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com perguntas
    perguntas = db.relationship("Pergunta", backref="formulario", cascade="all, delete-orphan")
```

### ❓ Modelo Pergunta (`src/models/pergunta.py`)

```python
class TipoPerguntaEnum(Enum):
    TEXTO = "TEXTO"
    NUMERO = "NUMERO"
    BOOLEANO = "BOOLEANO"
    MULTIPLA = "MULTIPLA"
    FORMULA = "FORMULA"

class Pergunta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.Enum(TipoPerguntaEnum), nullable=False)
    obrigatoria = db.Column(db.Boolean, default=False)
    ordem = db.Column(db.Integer, nullable=False)
    formulario_id = db.Column(db.Integer, db.ForeignKey("formularios.id"), nullable=False)
    formula = db.Column(db.Text, nullable=True)  # Para perguntas do tipo FORMULA
```

## 🔗 Rotas da API

### 📝 Rotas de Formulários (`/api/formularios`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/formularios` | Lista todos os formulários |
| `GET` | `/api/formularios/{id}` | Obtém formulário específico |
| `POST` | `/api/formularios` | Cria novo formulário |
| `PUT` | `/api/formularios/{id}` | Atualiza formulário |
| `DELETE` | `/api/formularios/{id}` | Deleta formulário |

### ❓ Rotas de Perguntas (`/api/perguntas`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/perguntas` | Lista todas as perguntas |
| `GET` | `/api/perguntas/{id}` | Obtém pergunta específica |
| `POST` | `/api/perguntas` | Cria nova pergunta |
| `PUT` | `/api/perguntas/{id}` | Atualiza pergunta |
| `DELETE` | `/api/perguntas/{id}` | Deleta pergunta |

## 📋 Estruturas JSON para Frontend

### 1. Listar Formulários

**Request:**
```http
GET /api/formularios
```

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Avaliação Inicial TEA",
    "descricao": "Formulário para avaliação inicial de pacientes com TEA",
    "categoria": "avaliacao",
    "criadoEm": "2024-10-02T10:00:00.000000",
    "atualizadoEm": "2024-10-02T10:00:00.000000",
    "perguntas": [
      {
        "id": 1,
        "texto": "Qual a idade da criança?",
        "tipo": "NUMERO",
        "obrigatoria": true,
        "ordem": 1,
        "formulario_id": 1,
        "formula": null
      },
      {
        "id": 2,
        "texto": "A criança faz contato visual?",
        "tipo": "BOOLEANO",
        "obrigatoria": true,
        "ordem": 2,
        "formulario_id": 1,
        "formula": null
      },
      {
        "id": 3,
        "texto": "Pontuação total (idade * 2 + contato visual)",
        "tipo": "FORMULA",
        "obrigatoria": false,
        "ordem": 3,
        "formulario_id": 1,
        "formula": "pergunta_1 * 2 + (pergunta_2 ? 10 : 0)"
      }
    ]
  }
]
```

### 2. Criar Formulário

**Request:**
```http
POST /api/formularios
Content-Type: application/json
```

**Payload:**
```json
{
  "nome": "Avaliação Comportamental",
  "descricao": "Formulário para avaliar comportamentos específicos",
  "categoria": "comportamento",
  "perguntas": [
    {
      "texto": "Nome da criança",
      "tipo": "TEXTO",
      "obrigatoria": true
    },
    {
      "texto": "Idade em meses",
      "tipo": "NUMERO",
      "obrigatoria": true
    },
    {
      "texto": "Apresenta estereotipias?",
      "tipo": "BOOLEANO",
      "obrigatoria": false
    },
    {
      "texto": "Nível de comunicação",
      "tipo": "MULTIPLA",
      "obrigatoria": true
    },
    {
      "texto": "Índice de desenvolvimento (idade/12)",
      "tipo": "FORMULA",
      "obrigatoria": false,
      "formula": "pergunta_2 / 12"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 2,
  "nome": "Avaliação Comportamental",
  "descricao": "Formulário para avaliar comportamentos específicos",
  "categoria": "comportamento",
  "criadoEm": "2024-10-02T14:30:00.000000",
  "atualizadoEm": "2024-10-02T14:30:00.000000",
  "perguntas": [
    {
      "id": 4,
      "texto": "Nome da criança",
      "tipo": "TEXTO",
      "obrigatoria": true,
      "ordem": 1,
      "formulario_id": 2,
      "formula": null
    },
    {
      "id": 5,
      "texto": "Idade em meses",
      "tipo": "NUMERO",
      "obrigatoria": true,
      "ordem": 2,
      "formulario_id": 2,
      "formula": null
    },
    {
      "id": 6,
      "texto": "Apresenta estereotipias?",
      "tipo": "BOOLEANO",
      "obrigatoria": false,
      "ordem": 3,
      "formulario_id": 2,
      "formula": null
    },
    {
      "id": 7,
      "texto": "Nível de comunicação",
      "tipo": "MULTIPLA",
      "obrigatoria": true,
      "ordem": 4,
      "formulario_id": 2,
      "formula": null
    },
    {
      "id": 8,
      "texto": "Índice de desenvolvimento (idade/12)",
      "tipo": "FORMULA",
      "obrigatoria": false,
      "ordem": 5,
      "formulario_id": 2,
      "formula": "pergunta_2 / 12"
    }
  ]
}
```

### 3. Atualizar Formulário

**Request:**
```http
PUT /api/formularios/2
Content-Type: application/json
```

**Payload:**
```json
{
  "nome": "Avaliação Comportamental Atualizada",
  "descricao": "Versão atualizada do formulário comportamental",
  "categoria": "comportamento",
  "perguntas": [
    {
      "id": 4,
      "texto": "Nome completo da criança",
      "tipo": "TEXTO",
      "obrigatoria": true
    },
    {
      "id": 5,
      "texto": "Idade em meses",
      "tipo": "NUMERO",
      "obrigatoria": true
    },
    {
      "texto": "Nova pergunta adicionada",
      "tipo": "TEXTO",
      "obrigatoria": false
    }
  ]
}
```

### 4. Criar Pergunta Individual

**Request:**
```http
POST /api/perguntas
Content-Type: application/json
```

**Payload:**
```json
{
  "texto": "Quantas palavras a criança fala?",
  "tipo": "NUMERO",
  "formula": null
}
```

**Response (201):**
```json
{
  "id": 9,
  "texto": "Quantas palavras a criança fala?",
  "tipo": "NUMERO",
  "obrigatoria": false,
  "ordem": 0,
  "formulario_id": null,
  "formula": null
}
```

## 🎨 Tipos de Pergunta Disponíveis

### 1. **TEXTO**
- **Descrição:** Campo de texto livre
- **Frontend:** `<input type="text">` ou `<textarea>`
- **Validação:** String

### 2. **NUMERO**
- **Descrição:** Campo numérico
- **Frontend:** `<input type="number">`
- **Validação:** Number/Integer

### 3. **BOOLEANO**
- **Descrição:** Verdadeiro/Falso, Sim/Não
- **Frontend:** `<input type="checkbox">` ou `<input type="radio">`
- **Validação:** Boolean

### 4. **MULTIPLA**
- **Descrição:** Múltipla escolha
- **Frontend:** `<select>` ou `<input type="radio">`
- **Validação:** String (valor selecionado)

### 5. **FORMULA**
- **Descrição:** Cálculo automático baseado em outras perguntas
- **Frontend:** Campo readonly/disabled
- **Validação:** Calculado automaticamente

## 🧮 Sistema de Fórmulas

### Sintaxe das Fórmulas:
- **Referência a pergunta:** `pergunta_1`, `pergunta_2`, etc. (baseado na ordem)
- **Operadores:** `+`, `-`, `*`, `/`, `%`
- **Condicionais:** `pergunta_1 ? valor_se_true : valor_se_false`
- **Parênteses:** Para agrupamento `(pergunta_1 + pergunta_2) * 3`

### Exemplos de Fórmulas:
```javascript
// Soma simples
"pergunta_1 + pergunta_2"

// Média
"(pergunta_1 + pergunta_2 + pergunta_3) / 3"

// Condicional com booleano
"pergunta_4 ? 10 : 0"

// Fórmula complexa
"pergunta_1 * 2 + (pergunta_2 ? pergunta_3 * 0.5 : 0)"

// Percentual
"(pergunta_1 / pergunta_2) * 100"
```

## 🎯 Exemplos de Implementação Frontend

### 1. Componente de Lista de Formulários

```javascript
const ListaFormularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const response = await fetch('/api/formularios');
        const data = await response.json();
        setFormularios(data);
      } catch (error) {
        console.error('Erro ao carregar formulários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormularios();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="lista-formularios">
      <h2>Formulários Disponíveis</h2>
      {formularios.map(form => (
        <div key={form.id} className="formulario-card">
          <h3>{form.nome}</h3>
          <p>{form.descricao}</p>
          <span className="categoria">{form.categoria}</span>
          <div className="info">
            <small>Criado em: {new Date(form.criadoEm).toLocaleDateString()}</small>
            <small>{form.perguntas.length} pergunta(s)</small>
          </div>
          <div className="acoes">
            <button onClick={() => editarFormulario(form.id)}>Editar</button>
            <button onClick={() => visualizarFormulario(form.id)}>Visualizar</button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 2. Formulário de Criação/Edição

```javascript
const FormularioEditor = ({ formularioId = null }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'avaliacao',
    perguntas: []
  });

  const tiposDisponiveis = [
    { value: 'TEXTO', label: 'Texto' },
    { value: 'NUMERO', label: 'Número' },
    { value: 'BOOLEANO', label: 'Sim/Não' },
    { value: 'MULTIPLA', label: 'Múltipla Escolha' },
    { value: 'FORMULA', label: 'Fórmula' }
  ];

  const adicionarPergunta = () => {
    const novaPergunta = {
      texto: '',
      tipo: 'TEXTO',
      obrigatoria: false,
      formula: null
    };
    
    setFormData(prev => ({
      ...prev,
      perguntas: [...prev.perguntas, novaPergunta]
    }));
  };

  const atualizarPergunta = (index, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((p, i) => 
        i === index ? { ...p, [campo]: valor } : p
      )
    }));
  };

  const removerPergunta = (index) => {
    setFormData(prev => ({
      ...prev,
      perguntas: prev.perguntas.filter((_, i) => i !== index)
    }));
  };

  const salvarFormulario = async () => {
    try {
      const url = formularioId 
        ? `/api/formularios/${formularioId}` 
        : '/api/formularios';
      
      const method = formularioId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const resultado = await response.json();
        alert('Formulário salvo com sucesso!');
        // Redirecionar ou atualizar lista
      } else {
        const erro = await response.json();
        alert(`Erro: ${erro.erro}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar formulário');
    }
  };

  return (
    <div className="formulario-editor">
      <h2>{formularioId ? 'Editar' : 'Criar'} Formulário</h2>
      
      <div className="form-group">
        <label>Nome do Formulário:</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
          placeholder="Ex: Avaliação Inicial TEA"
          required
        />
      </div>

      <div className="form-group">
        <label>Descrição:</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
          placeholder="Descreva o objetivo do formulário..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Categoria:</label>
        <select
          value={formData.categoria}
          onChange={(e) => setFormData(prev => ({...prev, categoria: e.target.value}))}
        >
          <option value="avaliacao">Avaliação</option>
          <option value="comportamento">Comportamento</option>
          <option value="desenvolvimento">Desenvolvimento</option>
          <option value="progresso">Progresso</option>
        </select>
      </div>

      <div className="perguntas-section">
        <h3>Perguntas</h3>
        
        {formData.perguntas.map((pergunta, index) => (
          <div key={index} className="pergunta-item">
            <div className="pergunta-header">
              <span>Pergunta {index + 1}</span>
              <button 
                type="button" 
                onClick={() => removerPergunta(index)}
                className="btn-remover"
              >
                ✕
              </button>
            </div>
            
            <div className="form-group">
              <label>Texto da Pergunta:</label>
              <input
                type="text"
                value={pergunta.texto}
                onChange={(e) => atualizarPergunta(index, 'texto', e.target.value)}
                placeholder="Digite a pergunta..."
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={pergunta.tipo}
                  onChange={(e) => atualizarPergunta(index, 'tipo', e.target.value)}
                >
                  {tiposDisponiveis.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={pergunta.obrigatoria}
                    onChange={(e) => atualizarPergunta(index, 'obrigatoria', e.target.checked)}
                  />
                  Obrigatória
                </label>
              </div>
            </div>
            
            {pergunta.tipo === 'FORMULA' && (
              <div className="form-group">
                <label>Fórmula:</label>
                <input
                  type="text"
                  value={pergunta.formula || ''}
                  onChange={(e) => atualizarPergunta(index, 'formula', e.target.value)}
                  placeholder="Ex: pergunta_1 + pergunta_2"
                />
                <small className="help-text">
                  Use pergunta_1, pergunta_2, etc. para referenciar outras perguntas
                </small>
              </div>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={adicionarPergunta}
          className="btn-adicionar"
        >
          + Adicionar Pergunta
        </button>
      </div>

      <div className="form-actions">
        <button onClick={salvarFormulario} className="btn-primary">
          {formularioId ? 'Atualizar' : 'Criar'} Formulário
        </button>
        <button type="button" className="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  );
};
```

### 3. Renderizador de Formulário para Resposta

```javascript
const FormularioResposta = ({ formularioId }) => {
  const [formulario, setFormulario] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const response = await fetch(`/api/formularios/${formularioId}`);
        const data = await response.json();
        setFormulario(data);
        
        // Inicializar respostas vazias
        const respostasIniciais = {};
        data.perguntas.forEach((p, index) => {
          respostasIniciais[`pergunta_${index + 1}`] = '';
        });
        setRespostas(respostasIniciais);
      } catch (error) {
        console.error('Erro ao carregar formulário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulario();
  }, [formularioId]);

  const calcularFormula = (formula) => {
    try {
      // Substituir referências de perguntas pelos valores
      let formulaCalculada = formula;
      Object.keys(respostas).forEach(key => {
        const valor = respostas[key];
        formulaCalculada = formulaCalculada.replace(
          new RegExp(key, 'g'), 
          valor || '0'
        );
      });
      
      // Avaliar a fórmula (em produção, use uma biblioteca segura)
      return eval(formulaCalculada);
    } catch (error) {
      return 'Erro no cálculo';
    }
  };

  const renderizarPergunta = (pergunta, index) => {
    const chave = `pergunta_${index + 1}`;
    
    switch (pergunta.tipo) {
      case 'TEXTO':
        return (
          <input
            type="text"
            value={respostas[chave] || ''}
            onChange={(e) => setRespostas(prev => ({
              ...prev,
              [chave]: e.target.value
            }))}
            required={pergunta.obrigatoria}
          />
        );
        
      case 'NUMERO':
        return (
          <input
            type="number"
            value={respostas[chave] || ''}
            onChange={(e) => setRespostas(prev => ({
              ...prev,
              [chave]: parseFloat(e.target.value) || 0
            }))}
            required={pergunta.obrigatoria}
          />
        );
        
      case 'BOOLEANO':
        return (
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={chave}
                value="true"
                checked={respostas[chave] === true}
                onChange={() => setRespostas(prev => ({
                  ...prev,
                  [chave]: true
                }))}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                name={chave}
                value="false"
                checked={respostas[chave] === false}
                onChange={() => setRespostas(prev => ({
                  ...prev,
                  [chave]: false
                }))}
              />
              Não
            </label>
          </div>
        );
        
      case 'MULTIPLA':
        return (
          <select
            value={respostas[chave] || ''}
            onChange={(e) => setRespostas(prev => ({
              ...prev,
              [chave]: e.target.value
            }))}
            required={pergunta.obrigatoria}
          >
            <option value="">Selecione uma opção</option>
            <option value="opcao1">Opção 1</option>
            <option value="opcao2">Opção 2</option>
            <option value="opcao3">Opção 3</option>
          </select>
        );
        
      case 'FORMULA':
        const resultado = calcularFormula(pergunta.formula);
        return (
          <input
            type="text"
            value={resultado}
            disabled
            className="campo-formula"
          />
        );
        
      default:
        return <span>Tipo de pergunta não suportado</span>;
    }
  };

  if (loading) return <div>Carregando formulário...</div>;
  if (!formulario) return <div>Formulário não encontrado</div>;

  return (
    <div className="formulario-resposta">
      <h2>{formulario.nome}</h2>
      {formulario.descricao && (
        <p className="descricao">{formulario.descricao}</p>
      )}
      
      <form>
        {formulario.perguntas
          .sort((a, b) => a.ordem - b.ordem)
          .map((pergunta, index) => (
            <div key={pergunta.id} className="pergunta-container">
              <label className="pergunta-label">
                {pergunta.texto}
                {pergunta.obrigatoria && <span className="obrigatoria">*</span>}
              </label>
              
              {renderizarPergunta(pergunta, index)}
              
              {pergunta.tipo === 'FORMULA' && pergunta.formula && (
                <small className="formula-info">
                  Fórmula: {pergunta.formula}
                </small>
              )}
            </div>
          ))}
        
        <button type="submit" className="btn-enviar">
          Enviar Respostas
        </button>
      </form>
    </div>
  );
};
```

## 🔒 Validações e Regras

### Validações do Backend:
- **Nome do formulário:** Obrigatório, máximo 255 caracteres
- **Categoria:** String, padrão "avaliacao"
- **Texto da pergunta:** Obrigatório, máximo 255 caracteres
- **Tipo da pergunta:** Deve ser um dos valores do enum
- **Fórmula:** Opcional, apenas para tipo FORMULA

### Validações Sugeridas para Frontend:
```javascript
const validarFormulario = (formData) => {
  const erros = [];
  
  if (!formData.nome.trim()) {
    erros.push('Nome do formulário é obrigatório');
  }
  
  if (formData.nome.length > 255) {
    erros.push('Nome deve ter no máximo 255 caracteres');
  }
  
  formData.perguntas.forEach((pergunta, index) => {
    if (!pergunta.texto.trim()) {
      erros.push(`Pergunta ${index + 1}: Texto é obrigatório`);
    }
    
    if (pergunta.tipo === 'FORMULA' && !pergunta.formula) {
      erros.push(`Pergunta ${index + 1}: Fórmula é obrigatória para tipo FORMULA`);
    }
  });
  
  return erros;
};
```

## 📱 Considerações para Mobile

### Layout Responsivo:
- Use cards expansíveis para perguntas
- Implemente navegação por etapas para formulários longos
- Adicione validação em tempo real
- Use componentes nativos para melhor UX

### Exemplo CSS:
```css
.formulario-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.pergunta-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #f9f9f9;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: end;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .pergunta-item {
    padding: 12px;
  }
}
```

## 🚀 Próximos Passos

1. **Implementar Componentes:** Use os exemplos fornecidos como base
2. **Testar API:** Use o Swagger UI em `/api/`
3. **Adicionar Validações:** Implemente validações robustas no frontend
4. **Sistema de Fórmulas:** Considere usar uma biblioteca como `mathjs` para fórmulas seguras
5. **Persistir Respostas:** Crie endpoints para salvar respostas dos formulários

---

**📞 Suporte:** Para dúvidas sobre implementação, consulte a documentação da API em `/api/` ou teste os endpoints diretamente.
