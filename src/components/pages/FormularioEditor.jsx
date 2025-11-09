import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApiService from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Plus, ArrowUp, ArrowDown, Trash2, X, AlertCircle, Save, FileUp, CheckCircle2, Download } from "lucide-react"

export default function FormularioEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    perguntas: [],
  })
  const [uploadedFile, setUploadedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Função auxiliar para parsear opções (suporta vírgula, ponto-e-vírgula, quebra de linha)
  const parseOpcoes = (opcoesStr) => {
    if (!opcoesStr || typeof opcoesStr !== 'string') return [];
    
    // Tentar diferentes separadores
    let opcoes = [];
    
    // Primeiro tenta separar por ponto seguido de espaço (". ")
    if (opcoesStr.includes('. ')) {
      opcoes = opcoesStr.split('. ').map(o => o.trim()).filter(o => o.length > 0);
      // Se encontrou muitos itens com ponto, retorna
      if (opcoes.length > 1) return opcoes;
    }
    
    // Tenta quebra de linha
    if (opcoesStr.includes('\n')) {
      opcoes = opcoesStr.split('\n').map(o => o.trim()).filter(o => o.length > 0);
      if (opcoes.length > 1) return opcoes;
    }
    
    // Tenta ponto-e-vírgula
    if (opcoesStr.includes(';')) {
      opcoes = opcoesStr.split(';').map(o => o.trim()).filter(o => o.length > 0);
      if (opcoes.length > 1) return opcoes;
    }
    
    // Tenta vírgula
    if (opcoesStr.includes(',')) {
      opcoes = opcoesStr.split(',').map(o => o.trim()).filter(o => o.length > 0);
      if (opcoes.length > 1) return opcoes;
    }
    
    // Se tudo falhar, retorna como uma única opção
    return [opcoesStr.trim()];
  };

  // Importação de Excel
  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file) return;
    
    setUploadedFile(file)
    setDragActive(false)
    
    try {
      const XLSX = await import('xlsx');
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        // CSV: ler como texto UTF-8
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvText = e.target.result;
          const worksheet = XLSX.read(csvText, { type: 'string', codepage: 65001 }).Sheets.Sheet1 || XLSX.read(csvText, { type: 'string', codepage: 65001 }).Sheets[XLSX.read(csvText, { type: 'string', codepage: 65001 }).SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const perguntas = json.map((row, idx) => {
            const tipo = (row['Tipo'] || 'TEXTO').toUpperCase();
            const formula = row['Formula'] || '';
            
            // Auto-preencher fórmula para PERCENTUAL vazio
            let finalFormula = formula;
            if (tipo === 'PERCENTUAL' && (!formula || formula.trim() === '')) {
              finalFormula = `PERCENTUAL(P1:P${idx + 1})`;
            }
            
            // Parsear opções com função auxiliar
            const opcoes = parseOpcoes(row['Opções'] || '');
            
            return {
              id: Date.now() + idx,
              ordem: row['Ordem'] || idx + 1,
              texto: row['Texto'] || '',
              sigla: (row['Sigla'] || '').toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 16),
              tipo: tipo,
              obrigatoria: row['Obrigatoria'] === 'TRUE' || row['Obrigatoria'] === true,
              formula: finalFormula,
              opcoes: opcoes,
            };
          });
          setFormData((prev) => ({ ...prev, perguntas }));
          toast({ title: '✓ Importação concluída', description: `${perguntas.length} pergunta${perguntas.length > 1 ? 's' : ''} importada${perguntas.length > 1 ? 's' : ''} do CSV.` });
        };
        reader.readAsText(file, 'utf-8');
      } else {
        // XLSX: ler como arraybuffer
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          const perguntas = json.map((row, idx) => {
            const tipo = (row['Tipo'] || 'TEXTO').toUpperCase();
            const formula = row['Formula'] || '';
            
            // Auto-preencher fórmula para PERCENTUAL vazio
            let finalFormula = formula;
            if (tipo === 'PERCENTUAL' && (!formula || formula.trim() === '')) {
              finalFormula = `PERCENTUAL(P1:P${idx + 1})`;
            }
            
            // Parsear opções com função auxiliar
            const opcoes = parseOpcoes(row['Opções'] || '');
            
            return {
              id: Date.now() + idx,
              ordem: row['Ordem'] || idx + 1,
              texto: row['Texto'] || '',
              sigla: row['Sigla'] || '',
              tipo: tipo,
              obrigatoria: row['Obrigatoria'] === 'TRUE' || row['Obrigatoria'] === true,
              formula: finalFormula,
              opcoes: opcoes,
            };
          });
          setFormData((prev) => ({ ...prev, perguntas }));
          toast({ title: '✓ Importação concluída', description: `${perguntas.length} pergunta${perguntas.length > 1 ? 's' : ''} importada${perguntas.length > 1 ? 's' : ''} do Excel.` });
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      toast({ title: '❌ Erro ao importar', description: err.message, variant: 'destructive' });
      setUploadedFile(null)
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImportExcel({ dataTransfer: e.dataTransfer });
    }
  };

  // Exportar perguntas em Excel
  const handleExportExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // Preparar dados para exportar
      const exportData = formData.perguntas.map(p => ({
        'Ordem': p.ordem,
        'Texto': p.texto,
        'Sigla': p.sigla || '',
        'Tipo': p.tipo,
        'Fórmula': p.formula || '',
        'Opções': p.opcoes ? p.opcoes.join(', ') : '',
        'Obrigatória': p.obrigatoria ? 'TRUE' : 'FALSE'
      }));

      // Criar workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Perguntas");

      // Ajustar largura das colunas
      ws['!cols'] = [
        { wch: 8 },   // Ordem
        { wch: 40 },  // Texto
        { wch: 12 },  // Sigla
        { wch: 15 },  // Tipo
        { wch: 30 },  // Fórmula
        { wch: 30 },  // Opções
        { wch: 12 }   // Obrigatória
      ];

      // Gerar nome do arquivo
      const nomeFormulario = formData.nome.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${nomeFormulario}_${timestamp}.xlsx`;

      // Fazer download
      XLSX.writeFile(wb, fileName);
      
      toast({ 
        title: '✓ Exportação concluída', 
        description: `Arquivo "${fileName}" baixado com sucesso!` 
      });
    } catch (err) {
      toast({ title: '❌ Erro ao exportar', description: err.message, variant: 'destructive' });
    }
  };
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchFormulario = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await ApiService.getFormulario(id)
        console.log('Formulário carregado:', data)
        setFormData(data)
      } catch (err) {
        console.error("Erro ao carregar formulário:", err)
        toast({
          title: 'Erro',
          description: 'Erro ao carregar formulário: ' + err.message,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchFormulario()
  }, [id, toast])

  const addPergunta = () => {
    setFormData((prev) => {
      // Gerar ID único baseado no timestamp e um número aleatório
      const novoId = Date.now() + Math.floor(Math.random() * 1000)
      const novaPergunta =         {
          //id: novoId,
          ordem: prev.perguntas.length + 1,
          texto: "Nova pergunta",
          tipo: "TEXTO",
          obrigatoria: false,
          formula: null,
          opcoes: []
        }
      
      console.log('Adicionando nova pergunta:', novaPergunta)
      
      return {
        ...prev,
        perguntas: [...prev.perguntas, novaPergunta]
      }
    })
  }

  const deletePergunta = (idPergunta) => {
    const novas = formData.perguntas.filter((p) => p.id !== idPergunta)
    setFormData((prev) => ({
      ...prev,
      perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })),
    }))
  }

  const movePergunta = (index, direction) => {
    const novas = [...formData.perguntas]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= novas.length) return
    ;[novas[index], novas[targetIndex]] = [novas[targetIndex], novas[index]]
    setFormData((prev) => ({
      ...prev,
      perguntas: novas.map((p, i) => ({ ...p, ordem: i + 1 })),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Validações básicas
      if (!formData.nome || formData.nome.trim() === '') {
        toast({
          title: 'Erro de validação',
          description: 'O nome do formulário é obrigatório',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      if (!formData.perguntas || formData.perguntas.length === 0) {
        toast({
          title: 'Erro de validação',
          description: 'Adicione pelo menos uma pergunta ao formulário',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar perguntas do tipo FORMULA
      const perguntasFormula = formData.perguntas.filter(p => p.tipo === 'FORMULA')
      const formulasInvalidas = perguntasFormula.filter(p => !p.formula || p.formula.trim() === '')
      
      if (formulasInvalidas.length > 0) {
        toast({
          title: 'Fórmulas inválidas',
          description: `Perguntas do tipo Fórmula devem ter uma fórmula definida: ${formulasInvalidas.map(p => p.texto).join(', ')}`,
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar perguntas do tipo PERCENTUAL
      const perguntasPercentual = formData.perguntas.filter(p => p.tipo === 'PERCENTUAL')
      
      // Auto-preencher fórmulas vazias de PERCENTUAL
      const perguntasAtualizadas = formData.perguntas.map((p, idx) => {
        if (p.tipo === 'PERCENTUAL' && (!p.formula || p.formula.trim() === '')) {
          return {
            ...p,
            formula: `PERCENTUAL(P1:P${idx + 1})`
          }
        }
        return p
      });
      
      // Atualizar formData com fórmulas preenchidas
      setFormData(prev => ({ ...prev, perguntas: perguntasAtualizadas }));
      
      const percentuaisInvalidos = perguntasAtualizadas.filter(p => p.tipo === 'PERCENTUAL' && (!p.formula || p.formula.trim() === '' || !p.formula.match(/^PERCENTUAL\(P\d+:P\d+\)$/)))
      
      if (percentuaisInvalidos.length > 0) {
        toast({
          title: 'Fórmulas de percentual inválidas',
          description: `Perguntas do tipo Percentual devem ter uma fórmula no formato PERCENTUAL(P1:P15): ${percentuaisInvalidos.map(p => p.texto).join(', ')}`,
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar perguntas do tipo MULTIPLA
      const perguntasMultipla = formData.perguntas.filter(p => p.tipo === 'MULTIPLA')
      const opcoesInvalidas = perguntasMultipla.filter(p => !p.opcoes || p.opcoes.length < 2)
      
      if (opcoesInvalidas.length > 0) {
        const nomesPerguntasErro = opcoesInvalidas.slice(0, 3).map(p => `"${p.texto}"`).join(', ');
        const maisQuantas = opcoesInvalidas.length > 3 ? ` e mais ${opcoesInvalidas.length - 3}` : '';
        toast({
          title: 'Opções inválidas',
          description: `${opcoesInvalidas.length} pergunta(s) de Múltipla Escolha devem ter pelo menos 2 opções: ${nomesPerguntasErro}${maisQuantas}`,
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Validar textos das perguntas
      const perguntasVazias = formData.perguntas.filter(p => !p.texto || p.texto.trim() === '')
      if (perguntasVazias.length > 0) {
        toast({
          title: 'Perguntas inválidas',
          description: 'Todas as perguntas devem ter um texto definido',
          variant: 'destructive'
        })
        setSaving(false)
        return
      }

      // Preparar payload para envio conforme documentação
      const payload = {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || "",
        categoria: formData.categoria || "avaliacao",
        perguntas: perguntasAtualizadas.map((p, index) => {
          // Não sobrescrever a sigla se já existir
          const sigla = (typeof p.sigla === 'string' && p.sigla.length > 0)
            ? p.sigla.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 16)
            : '';
          const pergunta = {
            texto: p.texto.trim(),
            tipo: p.tipo.toUpperCase(),
            obrigatoria: p.obrigatoria || false,
            sigla: sigla
          }
          // Adicionar campos específicos por tipo
          if (p.tipo === 'FORMULA' || p.tipo === 'PERCENTUAL') {
            pergunta.formula = p.formula?.trim() || null
          }
          if (p.tipo === 'MULTIPLA') {
            pergunta.opcoes = p.opcoes || []
            if (p.opcoes_padronizadas) {
              pergunta.opcoes = ['Não Adquirido', 'Parcial', 'Adquirido']
            }
          }
          if (p.id && !p.id.toString().startsWith('temp_')) {
            pergunta.id = p.id
          }
          return pergunta
        })
      }

      console.log('Payload sendo enviado:', payload)

      let resultado
      if (id) {
        resultado = await ApiService.updateFormulario(id, payload)
        toast({
          title: 'Sucesso',
          description: 'Formulário atualizado com sucesso!'
        })
      } else {
        resultado = await ApiService.createFormulario(payload)
        toast({
          title: 'Sucesso',
          description: 'Formulário criado com sucesso!'
        })
      }

      console.log('Resultado da API:', resultado)
      navigate(-1) // volta para a lista
    } catch (err) {
      console.error("Erro ao salvar formulário:", err)
      toast({
        title: 'Erro ao salvar',
        description: 'Erro ao salvar formulário: ' + err.message,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: '#0ea5e9'}}></div>
        <p className="mt-4 card-text font-medium">Carregando formulário...</p>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">{id ? "Editar Formulário" : "Novo Formulário"}</h1>
            <p className="page-subtitle">
              {id ? "Atualize as informações do formulário" : "Crie um novo formulário para checklists diários"}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 h-9 font-medium"
          >
            <X className="h-4 w-4" />
            Fechar
          </Button>
        </div>
      </div>

      {/* Card Principal */}
      <div className="card-spacing space-y-8">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          
          {/* Seção 1: Importação de Excel */}
          <div style={{borderBottomColor: 'var(--color-neutral-200)'}} className="border-b pb-8">
            <div className="section-header mb-6">
              <FileUp size={20} className="color-info-icon" />
              <h2 className="section-header-title">Importar Perguntas do Excel</h2>
            </div>
            <p className="card-text mb-6">Carregue um arquivo Excel ou CSV com suas perguntas pré-configuradas</p>
            
            {/* Zona de Upload com Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : uploadedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImportExcel}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center gap-3">
                {uploadedFile ? (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                      <CheckCircle2 className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Arquivo carregado com sucesso!</p>
                      <p className="text-sm text-green-700 mt-1">{uploadedFile.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <FileUp className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Arraste o arquivo aqui ou clique para selecionar</p>
                      <p className="text-sm text-gray-600 mt-1">Formatos aceitos: .xlsx, .xls, .csv</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Helper text */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700 mb-2">Estrutura esperada:</p>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-mono">
                  Ordem | Texto | Sigla | Tipo | Fórmula | Opções
                </div>
              </div>
              <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-9 whitespace-nowrap"
                  onClick={() => {
                    const XLSX = require('xlsx');
                    const ws = XLSX.utils.json_to_sheet([
                      { 'Ordem': 1, 'Texto': 'Exemplo de pergunta', 'Sigla': 'P1', 'Tipo': 'TEXTO', 'Fórmula': '', 'Opções': '' }
                    ]);
                    ws['!cols'] = [
                      { wch: 8 }, { wch: 40 }, { wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 30 }
                    ];
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Perguntas");
                    XLSX.writeFile(wb, 'template_perguntas.xlsx');
                    toast({ title: '✓ Download iniciado', description: 'Template baixado com sucesso!' });
                  }}
                >
                  <Download size={16} />
                  Template Vazio
                </Button>
                {formData.perguntas.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 h-9 whitespace-nowrap"
                    style={{borderColor: '#0ea5e9', color: '#0ea5e9'}}
                    onClick={handleExportExcel}
                  >
                    <Download size={16} />
                    Exportar Perguntas
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Informações Básicas */}
          <div style={{borderBottomColor: 'var(--color-neutral-200)'}} className="border-b pb-8">
            <div className="section-header mb-6">
              <AlertCircle size={20} className="color-info-icon" />
              <h2 className="section-header-title">Informações Básicas</h2>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {/* Nome */}
              <div className="form-group sm:col-span-1">
                <Label htmlFor="nome" className="font-semibold mb-2 block">Nome do Formulário *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Avaliação de Coordenação Motora"
                  required
                  className="h-10"
                />
              </div>

              {/* Categoria */}
              <div className="form-group sm:col-span-1">
                <Label htmlFor="categoria" className="font-semibold mb-2 block">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avaliacao">Avaliação Inicial</SelectItem>
                    <SelectItem value="evolucao">Evolução de Sessão</SelectItem>
                    <SelectItem value="pei">PEI</SelectItem>
                    <SelectItem value="relatorio">Relatório Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="form-group sm:col-span-2">
                <Label htmlFor="descricao" className="font-semibold mb-2 block">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descreva o objetivo e contexto deste formulário..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Perguntas */}
          <div>
            <div className="flex justify-between items-start gap-4 mb-6 flex-wrap">
              <div>
                <h2 className="section-header-title flex items-center gap-2 mb-2">
                  <AlertCircle size={20} className="color-warning-icon" />
                  Perguntas do Formulário
                </h2>
                <p className="card-text">
                  {formData.perguntas.length === 0 
                    ? "Adicione perguntas para criar o formulário"
                    : `${formData.perguntas.length} pergunta${formData.perguntas.length > 1 ? 's' : ''} adicionada${formData.perguntas.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                {formData.perguntas.length > 0 && (
                  <>
                    <Button 
                      type="button" 
                      onClick={() => {
                        // Marcar todas as MULTIPLA como obrigatórias
                        const atualizado = formData.perguntas.map(p => 
                          p.tipo === 'MULTIPLA' ? { ...p, obrigatoria: true } : p
                        );
                        setFormData({ ...formData, perguntas: atualizado });
                        toast({ title: '✓ Atualizadas', description: 'Todas as MULTIPLA marcadas como obrigatórias' });
                      }}
                      variant="outline"
                      className="flex items-center gap-2 h-9 font-medium whitespace-nowrap text-xs sm:text-sm"
                      style={{borderColor: '#f97316', color: '#f97316'}}
                    >
                      Obrigatórias
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        // Aplicar padrão (Não Adquirido, Parcial, Adquirido) a todas as MULTIPLA
                        const atualizado = formData.perguntas.map(p => 
                          p.tipo === 'MULTIPLA' 
                            ? { ...p, opcoes: ['Não Adquirido', 'Parcial', 'Adquirido'], opcoes_padronizadas: true }
                            : p
                        );
                        setFormData({ ...formData, perguntas: atualizado });
                        toast({ title: '✓ Atualizadas', description: 'Padrão aplicado a todas as MULTIPLA' });
                      }}
                      variant="outline"
                      className="flex items-center gap-2 h-9 font-medium whitespace-nowrap text-xs sm:text-sm"
                      style={{borderColor: '#10b981', color: '#10b981'}}
                    >
                      Padrão
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleExportExcel}
                      variant="outline"
                      className="flex items-center gap-2 h-9 font-medium whitespace-nowrap"
                      style={{borderColor: '#0ea5e9', color: '#0ea5e9'}}
                    >
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </>
                )}
                <Button 
                  type="button" 
                  onClick={addPergunta} 
                  style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                  className="flex items-center gap-2 h-9 font-medium whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Pergunta
                </Button>
              </div>
            </div>

            {formData.perguntas.length === 0 ? (
              <div className="alert alert-info">
                <AlertCircle size={18} />
                <div className="alert-content">
                  <p className="font-medium">Nenhuma pergunta adicionada</p>
                  <p className="text-sm mt-1 mb-3">Adicione perguntas para criar seu formulário de checklist diário.</p>
                  <Button 
                    onClick={addPergunta}
                    variant="outline"
                    className="flex items-center gap-2 h-8"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Primeira Pergunta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto -mx-4 sm:mx-0" style={{borderColor: 'var(--color-neutral-200)'}}>
                <div className="px-4 sm:px-0">
                  <div className="inline-block min-w-full rounded-lg border" style={{borderColor: 'var(--color-neutral-200)'}}>
                    <table className="table w-full">
                  <thead>
                    <tr style={{backgroundColor: 'var(--color-info-50)'}}>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Ordem</th>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Pergunta</th>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Sigla</th>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Tipo</th>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Fórmula/Opções</th>
                      <th style={{color: '#0c3d66', fontWeight: 600}}>Obrigatória</th>
                      <th style={{color: '#0c3d66', fontWeight: 600, textAlign: 'right'}}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                {formData.perguntas
                  .slice()
                  .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
                  .map((p, index) => (
                    <tr key={p.id}>
                      <td style={{fontWeight: 600, textAlign: 'center'}}>{p.ordem}</td>
                      <td>
                        <Input
                          value={p.texto}
                          onChange={(e) => {
                            const novas = [...formData.perguntas]
                            novas[index].texto = e.target.value
                            setFormData({ ...formData, perguntas: novas })
                          }}
                          placeholder="Digite a pergunta"
                          className="text-sm"
                        />
                      </td>
                      <td>
                        <Input
                          value={p.sigla || ''}
                          onChange={e => {
                            const novas = [...formData.perguntas]
                            novas[index].sigla = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 16)
                            setFormData({ ...formData, perguntas: novas })
                          }}
                          placeholder="Ex: P1"
                          maxLength={16}
                          className="text-sm"
                        />
                      </td>
                      <td>
                        <Select
                          value={p.tipo}
                          onValueChange={(value) => {
                            const novas = [...formData.perguntas]
                            novas[index].tipo = value.toUpperCase()
                            
                            // Auto-preencher fórmula para PERCENTUAL
                            if (value.toUpperCase() === 'PERCENTUAL') {
                              // Gerar fórmula baseada no índice: P1, P2, P3, etc.
                              const siglaPerc = (novas[index].sigla || `P${index + 1}`).replace(/[^A-Z0-9_]/g, '').slice(0, 2);
                              novas[index].formula = `PERCENTUAL(P1:P${index + 1})`;
                            }
                            
                            if (value.toUpperCase() !== 'FORMULA' && value.toUpperCase() !== 'PERCENTUAL') {
                              novas[index].formula = ''
                            }
                            if (value.toUpperCase() !== 'MULTIPLA') {
                              novas[index].opcoes = []
                            }
                            setFormData({ ...formData, perguntas: novas })
                          }}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXTO">Texto</SelectItem>
                            <SelectItem value="NUMERO">Número</SelectItem>
                            <SelectItem value="BOOLEANO">Sim/Não</SelectItem>
                            <SelectItem value="MULTIPLA">Múltipla</SelectItem>
                            <SelectItem value="FORMULA">Fórmula</SelectItem>
                            <SelectItem value="PERCENTUAL">Percentual</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td>
                        {p.tipo === 'FORMULA' && (
                          <Input
                            placeholder="Ex: pergunta_1 + pergunta_2"
                            value={p.formula || ''}
                            onChange={(e) => {
                              const novas = [...formData.perguntas]
                              novas[index].formula = e.target.value
                              setFormData({ ...formData, perguntas: novas })
                            }}
                            className="text-sm"
                          />
                        )}
                        {p.tipo === 'PERCENTUAL' && (
                          <Input
                            placeholder="Ex: PERCENTUAL(P1:P15)"
                            value={p.formula || ''}
                            onChange={(e) => {
                              const novas = [...formData.perguntas]
                              novas[index].formula = e.target.value
                              setFormData({ ...formData, perguntas: novas })
                            }}
                            className="text-sm"
                          />
                        )}
                        {p.tipo === 'MULTIPLA' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`padronizado-${index}`}
                                checked={p.opcoes_padronizadas || false}
                                onCheckedChange={(e) => {
                                  const novas = [...formData.perguntas]
                                  novas[index].opcoes_padronizadas = !!e
                                  if (e) {
                                    novas[index].opcoes = ['Não Adquirido', 'Parcial', 'Adquirido']
                                  } else {
                                    novas[index].opcoes = []
                                  }
                                  setFormData({ ...formData, perguntas: novas })
                                }}
                              />
                              <label htmlFor={`padronizado-${index}`} className="text-xs">Padrão</label>
                            </div>
                            {!p.opcoes_padronizadas && (
                              <Input
                                placeholder="Op1, Op2, Op3"
                                value={p.opcoes ? p.opcoes.join(', ') : ''}
                                onChange={(e) => {
                                  const novas = [...formData.perguntas]
                                  novas[index].opcoes = e.target.value.split(',').map(o => o.trim()).filter(o => o)
                                  setFormData({ ...formData, perguntas: novas })
                                }}
                                className="text-sm"
                              />
                            )}
                          </div>
                        )}
                        {(p.tipo !== 'FORMULA' && p.tipo !== 'PERCENTUAL' && p.tipo !== 'MULTIPLA') && (
                          <span style={{color: 'var(--color-neutral-400)'}} className="text-sm">-</span>
                        )}
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <Checkbox
                          checked={p.obrigatoria}
                          disabled={p.tipo === 'FORMULA'}
                          onCheckedChange={(checked) => {
                            const novas = [...formData.perguntas]
                            novas[index].obrigatoria = !!checked
                            setFormData({ ...formData, perguntas: novas })
                          }}
                        />
                      </td>
                      <td style={{textAlign: 'right'}}>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, "up")} disabled={index === 0} className="h-8 w-8 p-0">
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => movePergunta(index, "down")} disabled={index === formData.perguntas.length - 1} className="h-8 w-8 p-0">
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => deletePergunta(p.id)} className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div style={{borderTopColor: 'var(--color-neutral-200)'}} className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={saving}
              className="flex items-center gap-2 h-9 font-medium"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !formData.nome || formData.perguntas.length === 0}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              className="flex items-center gap-2 h-9 font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {id ? "Atualizar Formulário" : "Criar Formulário"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
