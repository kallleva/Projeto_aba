# 📋 Resumo Executivo - Sistema de Formulários e Perguntas

## 🎯 Estruturas Principais

### **Formulário**
```json
{
  "id": 1,
  "nome": "Avaliação Inicial TEA",
  "descricao": "Formulário para avaliação inicial",
  "categoria": "avaliacao",
  "criadoEm": "2024-10-02T10:00:00.000000",
  "atualizadoEm": "2024-10-02T10:00:00.000000",
  "perguntas": [...]
}
```

### **Pergunta**
```json
{
  "id": 1,
  "texto": "Qual a idade da criança?",
  "tipo": "NUMERO",
  "obrigatoria": true,
  "ordem": 1,
  "formulario_id": 1,
  "formula": null
}
```

## 🔗 Endpoints Principais

### **Formulários:**
- `GET /api/formularios` - Listar todos
- `GET /api/formularios/{id}` - Obter específico
- `POST /api/formularios` - Criar novo
- `PUT /api/formularios/{id}` - Atualizar
- `DELETE /api/formularios/{id}` - Deletar

### **Perguntas:**
- `GET /api/perguntas` - Listar todas
- `GET /api/perguntas/{id}` - Obter específica
- `POST /api/perguntas` - Criar nova
- `PUT /api/perguntas/{id}` - Atualizar
- `DELETE /api/perguntas/{id}` - Deletar

## 📝 Tipos de Pergunta

| Tipo | Descrição | Frontend | Exemplo |
|------|-----------|----------|---------|
| `TEXTO` | Texto livre | `<input type="text">` | "João Silva" |
| `NUMERO` | Numérico | `<input type="number">` | 36 |
| `BOOLEANO` | Sim/Não | `<input type="radio">` | true/false |
| `MULTIPLA` | Múltipla escolha | `<select>` | "opcao1" |
| `FORMULA` | Cálculo automático | `<input disabled>` | Calculado |

## 🧮 Sistema de Fórmulas

### **Sintaxe:**
- Referência: `pergunta_1`, `pergunta_2`, etc.
- Operadores: `+`, `-`, `*`, `/`, `%`
- Condicionais: `pergunta_1 ? valor_true : valor_false`
- Parênteses: `(pergunta_1 + pergunta_2) * 3`

### **Exemplos:**
```javascript
"pergunta_1 + pergunta_2"                    // Soma
"(pergunta_1 + pergunta_2) / 2"             // Média
"pergunta_3 ? 10 : 0"                       // Condicional
"pergunta_1 * 2 + (pergunta_2 ? 5 : 0)"     // Complexa
```

## 📤 Payload para Criar Formulário

```json
{
  "nome": "Avaliação Comportamental",
  "descricao": "Formulário para avaliar comportamentos",
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
      "texto": "Faz contato visual?",
      "tipo": "BOOLEANO",
      "obrigatoria": false
    },
    {
      "texto": "Índice (idade/12)",
      "tipo": "FORMULA",
      "obrigatoria": false,
      "formula": "pergunta_2 / 12"
    }
  ]
}
```

## 🎨 Componente Frontend Básico

```javascript
const FormularioEditor = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'avaliacao',
    perguntas: []
  });

  const adicionarPergunta = () => {
    setFormData(prev => ({
      ...prev,
      perguntas: [...prev.perguntas, {
        texto: '',
        tipo: 'TEXTO',
        obrigatoria: false,
        formula: null
      }]
    }));
  };

  const salvarFormulario = async () => {
    const response = await fetch('/api/formularios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Formulário salvo!');
    }
  };

  return (
    <div>
      <input 
        placeholder="Nome do formulário"
        value={formData.nome}
        onChange={(e) => setFormData(prev => ({
          ...prev, nome: e.target.value
        }))}
      />
      
      {formData.perguntas.map((pergunta, index) => (
        <div key={index}>
          <input 
            placeholder="Texto da pergunta"
            value={pergunta.texto}
            onChange={(e) => {
              const novasPerguntas = [...formData.perguntas];
              novasPerguntas[index].texto = e.target.value;
              setFormData(prev => ({
                ...prev, perguntas: novasPerguntas
              }));
            }}
          />
          
          <select 
            value={pergunta.tipo}
            onChange={(e) => {
              const novasPerguntas = [...formData.perguntas];
              novasPerguntas[index].tipo = e.target.value;
              setFormData(prev => ({
                ...prev, perguntas: novasPerguntas
              }));
            }}
          >
            <option value="TEXTO">Texto</option>
            <option value="NUMERO">Número</option>
            <option value="BOOLEANO">Sim/Não</option>
            <option value="MULTIPLA">Múltipla Escolha</option>
            <option value="FORMULA">Fórmula</option>
          </select>
        </div>
      ))}
      
      <button onClick={adicionarPergunta}>+ Pergunta</button>
      <button onClick={salvarFormulario}>Salvar</button>
    </div>
  );
};
```

## ✅ Validações Essenciais

### **Formulário:**
- Nome: obrigatório, máx 255 chars
- Categoria: string válida
- Pelo menos 1 pergunta

### **Pergunta:**
- Texto: obrigatório, máx 255 chars
- Tipo: deve ser um dos enums válidos
- Fórmula: obrigatória se tipo = FORMULA

## 🚀 Próximos Passos

1. **Implementar componentes** usando os exemplos
2. **Testar endpoints** no Swagger UI (`/api/`)
3. **Adicionar validações** robustas
4. **Sistema de fórmulas** seguro (usar mathjs)
5. **Salvar respostas** dos formulários

## 📁 Arquivos de Referência

- **Documentação completa:** `DOCUMENTACAO_FORMULARIOS_PERGUNTAS_FRONTEND.md`
- **Exemplos JSON:** `exemplos_json_formularios_frontend.json`
- **Modelos backend:** `src/models/formulario.py`, `src/models/pergunta.py`
- **Rotas backend:** `src/routes/formulario.py`, `src/routes/pergunta.py`

---

**🎯 Sistema pronto para implementação no frontend!**
