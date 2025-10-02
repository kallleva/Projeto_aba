import { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import ApiService from '@/lib/api'

export default function RegistroDiario() {
  const [registros, setRegistros] = useState([])
  const [formularios, setFormularios] = useState([])
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRegistro, setEditingRegistro] = useState(null)
  const [showFullScreen, setShowFullScreen] = useState(false)
  const { toast } = useToast()

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    formulario_id: '',
    meta_id: '',
    data_inicio: '',
    data_fim: '',
    nota_min: '',
    nota_max: ''
  })
  const [registrosFiltrados, setRegistrosFiltrados] = useState([])

  const [formData, setFormData] = useState({
    meta_id: '',
    data: new Date().toISOString().split('T')[0],
    nota: '',
    observacao: '',
    respostas: {}
  })
  const [perguntas, setPerguntas] = useState([])
  const [formularioSelecionado, setFormularioSelecionado] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  // Aplicar filtros sempre que os registros ou filtros mudarem
  useEffect(() => {
    aplicarFiltros()
  }, [registros, filtros])

  const loadData = async () => {
    try {
      setLoading(true)
      const [registrosData, formulariosData, metasData] = await Promise.all([
        ApiService.getChecklistsDiarios(),
        ApiService.getFormularios(),
        ApiService.getMetasTerapeuticas()
      ])
      
      console.log('Registros carregados:', registrosData)
      console.log('Formulários carregados:', formulariosData)
      console.log('Metas carregadas:', metasData)
      
      setRegistros(registrosData)
      setFormularios(formulariosData)
      setMetas(metasData)
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar dados: ' + error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    if (!registros || !Array.isArray(registros)) {
      setRegistrosFiltrados([])
      return
    }

    let filtrados = [...registros]

    // Filtro por formulário
    if (filtros.formulario_id) {
      filtrados = filtrados.filter(r => r && r.formulario_id && r.formulario_id.toString() === filtros.formulario_id)
    }

    // Filtro por meta terapêutica
    if (filtros.meta_id) {
      filtrados = filtrados.filter(r => r && r.meta_id && r.meta_id.toString() === filtros.meta_id)
    }

    // Filtro por data início
    if (filtros.data_inicio) {
      filtrados = filtrados.filter(r => r && r.data && new Date(r.data) >= new Date(filtros.data_inicio))
    }

    // Filtro por data fim
    if (filtros.data_fim) {
      filtrados = filtrados.filter(r => r && r.data && new Date(r.data) <= new Date(filtros.data_fim))
    }

    // Filtro por nota mínima
    if (filtros.nota_min) {
      filtrados = filtrados.filter(r => r && r.nota && r.nota >= parseInt(filtros.nota_min))
    }

    // Filtro por nota máxima
    if (filtros.nota_max) {
      filtrados = filtrados.filter(r => r && r.nota && r.nota <= parseInt(filtros.nota_max))
    }

    setRegistrosFiltrados(filtrados)
  }

  const limparFiltros = () => {
    setFiltros({
      formulario_id: '',
      meta_id: '',
      data_inicio: '',
      data_fim: '',
      nota_min: '',
      nota_max: ''
    })
  }

  const carregarPerguntas = async (formularioId) => {
    try {
      const formulario = await ApiService.getFormulario(formularioId)
      setFormularioSelecionado(formulario)
      
      // Filtrar apenas as perguntas deste formulário específico
      const perguntasDoFormulario = formulario.perguntas || []
      setPerguntas(perguntasDoFormulario)
      
      // Limpar respostas anteriores quando carregar novo formulário
      setFormData(prev => ({
        ...prev,
        respostas: {}
      }))
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar perguntas: ' + error.message, variant: 'destructive' })
    }
  }

  const handleRespostaChange = (perguntaId, valor) => {
    const novasRespostas = { ...formData.respostas, [perguntaId]: valor }
    
    // Calcular fórmulas que dependem desta resposta
    const respostasCalculadas = calcularFormulas(novasRespostas)
    
    setFormData(prev => ({
      ...prev,
      respostas: respostasCalculadas
    }))
  }

  const calcularFormulas = (respostas) => {
    const respostasComCalculadas = { ...respostas }
    
    perguntas.forEach(pergunta => {
      if (pergunta.tipo === 'FORMULA' && pergunta.formula) {
        try {
          // Substituir variáveis na fórmula pelos valores das respostas
          let formula = pergunta.formula
          
          // Substituir IDs de perguntas pelos valores das respostas
          Object.keys(respostas).forEach(perguntaId => {
            const valor = respostas[perguntaId]
            if (valor && !isNaN(valor)) {
              // Substituir tanto por ID quanto por ordem (caso a fórmula use ordem)
              formula = formula.replace(new RegExp(`\\b${perguntaId}\\b`, 'g'), valor)
              const perguntaRef = perguntas.find(p => p.id.toString() === perguntaId)
              if (perguntaRef) {
                formula = formula.replace(new RegExp(`\\b${perguntaRef.ordem}\\b`, 'g'), valor)
              }
            }
          })
          
          // Calcular o resultado da fórmula
          const resultado = eval(formula)
          respostasComCalculadas[pergunta.id.toString()] = resultado.toString()
        } catch (error) {
          console.error('Erro ao calcular fórmula:', error)
          respostasComCalculadas[pergunta.id.toString()] = 'Erro no cálculo'
        }
      }
    })
    
    return respostasComCalculadas
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validar perguntas obrigatórias apenas do formulário atual
      // Garantir que estamos validando apenas perguntas do formulário selecionado
      const perguntasDoFormularioAtual = perguntas.filter(p => {
        // Verificar se a pergunta pertence ao formulário selecionado
        return formularioSelecionado && formularioSelecionado.perguntas && 
               formularioSelecionado.perguntas.some(fp => fp.id === p.id)
      })
      
      // Validar perguntas obrigatórias conforme documentação
      const perguntasObrigatorias = perguntasDoFormularioAtual.filter(p => p.obrigatoria && p.tipo !== 'FORMULA')
      
      const respostasFaltando = perguntasObrigatorias.filter(p => {
        const resposta = formData.respostas[p.id.toString()]
        return !resposta || resposta.trim() === ''
      })
      
      if (respostasFaltando.length > 0) {
        const perguntasFaltando = respostasFaltando.map(p => p.texto).join(', ')
        toast({ 
          title: 'Perguntas obrigatórias não respondidas', 
          description: `Responda as perguntas obrigatórias: ${perguntasFaltando}`, 
          variant: 'destructive' 
        })
        return
      }

      // Validar se perguntas MULTIPLA têm opções definidas (apenas do formulário atual)
      const perguntasMultipla = perguntasDoFormularioAtual.filter(p => p.tipo === 'MULTIPLA')
      const perguntasSemOpcoes = perguntasMultipla.filter(p => !p.opcoes || p.opcoes.length === 0)
      
      if (perguntasSemOpcoes.length > 0) {
        toast({ 
          title: 'Erro', 
          description: `Perguntas de múltipla escolha sem opções definidas: ${perguntasSemOpcoes.map(p => p.texto).join(', ')}`, 
          variant: 'destructive' 
        })
        return
      }

      // Validar se perguntas FORMULA têm fórmula definida (apenas do formulário atual)
      const perguntasFormula = perguntasDoFormularioAtual.filter(p => p.tipo === 'FORMULA')
      const perguntasSemFormula = perguntasFormula.filter(p => !p.formula || p.formula.trim() === '')
      
      if (perguntasSemFormula.length > 0) {
        toast({ 
          title: 'Erro', 
          description: `Perguntas de fórmula sem fórmula definida: ${perguntasSemFormula.map(p => p.texto).join(', ')}`, 
          variant: 'destructive' 
        })
        return
      }

      // Validar se formulário foi selecionado
      if (!formularioSelecionado) {
        toast({ title: 'Erro', description: 'Selecione um formulário', variant: 'destructive' })
        return
      }

      // Verificar se as perguntas carregadas pertencem ao formulário selecionado
      if (perguntas.length === 0) {
        toast({ title: 'Erro', description: 'Nenhuma pergunta encontrada para este formulário', variant: 'destructive' })
        return
      }

      // Validar se meta foi selecionada
      if (!formData.meta_id) {
        toast({ title: 'Erro', description: 'Selecione uma meta terapêutica', variant: 'destructive' })
        return
      }

      // Preparar respostas conforme documentação da API
      // Formato: { "pergunta_id": "resposta" }
      const respostasParaEnviar = {}
      
      // Incluir todas as respostas do formulário atual
      perguntasDoFormularioAtual.forEach(pergunta => {
        const perguntaId = pergunta.id.toString()
        if (pergunta.tipo === 'FORMULA') {
          // Para fórmulas, enviar string vazia (será calculada pelo backend)
          respostasParaEnviar[perguntaId] = ""
        } else {
          // Para outras perguntas, enviar a resposta do usuário ou string vazia
          const resposta = formData.respostas[perguntaId]
          respostasParaEnviar[perguntaId] = resposta || ""
        }
      })

      // Validar se há pelo menos uma resposta não vazia (exceto fórmulas)
      const respostasNaoFormula = perguntasDoFormularioAtual
        .filter(p => p.tipo !== 'FORMULA')
        .map(p => formData.respostas[p.id.toString()])
        .filter(r => r && r.trim() !== '')
      
      if (respostasNaoFormula.length === 0) {
        toast({ 
          title: 'Erro', 
          description: 'Responda pelo menos uma pergunta antes de salvar', 
          variant: 'destructive' 
        })
        return
      }

      const dataToSend = {
        meta_id: parseInt(formData.meta_id),
        data: formData.data, // Formato YYYY-MM-DD
        nota: formData.nota ? parseInt(formData.nota) : null,
        observacao: formData.observacao || "",
        respostas: respostasParaEnviar
      }

      console.log('Dados sendo enviados para API:', dataToSend)

      if (editingRegistro) {
        await ApiService.updateChecklistDiario(editingRegistro.id, dataToSend)
        toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso!' })
      } else {
        await ApiService.createChecklistDiario(dataToSend)
        toast({ title: 'Sucesso', description: 'Registro criado com sucesso!' })
      }

      setShowFullScreen(false)
      resetForm()
      loadData()
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleEdit = async (registro) => {
    setEditingRegistro(registro)
    
    // Preparar respostas do registro existente conforme estrutura da API
    const respostasExistentes = {}
    if (registro.respostas && Array.isArray(registro.respostas)) {
      registro.respostas.forEach(resposta => {
        // Para perguntas normais, usar a resposta original
        // Para fórmulas, usar o valor calculado se disponível
        if (resposta.eh_formula) {
          respostasExistentes[resposta.pergunta_id.toString()] = resposta.resposta_calculada || resposta.resposta || ""
        } else {
          respostasExistentes[resposta.pergunta_id.toString()] = resposta.resposta || ""
        }
      })
    }
    
    setFormData({
      meta_id: registro.meta_id ? registro.meta_id.toString() : '',
      data: registro.data || new Date().toISOString().split('T')[0],
      nota: registro.nota ? registro.nota.toString() : '',
      observacao: registro.observacao || '',
      respostas: respostasExistentes
    })
    
    // Limpar perguntas e formulário selecionado primeiro
    setPerguntas([])
    setFormularioSelecionado(null)
    
    // Carregar perguntas do formulário se existir
    if (registro.formulario_id) {
      await carregarPerguntas(registro.formulario_id)
    }
    
    setShowFullScreen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este registro?')) return
    try {
      await ApiService.deleteChecklistDiario(id)
      toast({ title: 'Sucesso', description: 'Registro excluído com sucesso!' })
      loadData()
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const resetForm = () => {
    setFormData({
      meta_id: '',
      data: new Date().toISOString().split('T')[0],
      nota: '',
      observacao: '',
      respostas: {}
    })
    setPerguntas([])
    setFormularioSelecionado(null)
    setEditingRegistro(null)
    setShowFullScreen(false)
  }

  const handleNovoRegistro = () => {
    resetForm()
    setShowFullScreen(true)
  }

  const renderPerguntas = () => {
    return perguntas
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => (
        <div key={p.id} className="grid gap-2 p-4 border rounded-lg">
          <Label className="text-sm font-medium">
            {p.texto} 
            {p.obrigatoria && p.tipo !== 'FORMULA' && <span className="text-red-500 ml-1">*</span>}
            {p.tipo === 'FORMULA' && <span className="text-blue-500 ml-1">(Calculado)</span>}
          </Label>

          {p.tipo === 'TEXTO' && (
            <Input
              value={formData.respostas[p.id.toString()] || ''}
              onChange={(e) => handleRespostaChange(p.id.toString(), e.target.value)}
              required={p.obrigatoria}
              placeholder="Digite sua resposta"
            />
          )}
          
          {p.tipo === 'NUMERO' && (
            <Input
              type="number"
              value={formData.respostas[p.id.toString()] || ''}
              onChange={(e) => handleRespostaChange(p.id.toString(), e.target.value)}
              required={p.obrigatoria}
              placeholder="Digite um número"
            />
          )}
          
          {p.tipo === 'BOOLEANO' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`booleano-${p.id}`}
                  value="Sim"
                  checked={formData.respostas[p.id.toString()] === 'Sim'}
                  onChange={() => handleRespostaChange(p.id.toString(), 'Sim')}
                  required={p.obrigatoria}
                />
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`booleano-${p.id}`}
                  value="Não"
                  checked={formData.respostas[p.id.toString()] === 'Não'}
                  onChange={() => handleRespostaChange(p.id.toString(), 'Não')}
                />
                Não
              </label>
            </div>
          )}
          
          {p.tipo === 'MULTIPLA' && (
            <Select
              value={formData.respostas[p.id.toString()] || ''}
              onValueChange={(v) => handleRespostaChange(p.id.toString(), v)}
              required={p.obrigatoria}
              disabled={!p.opcoes || p.opcoes.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !p.opcoes || p.opcoes.length === 0 
                    ? "Nenhuma opção disponível" 
                    : "Selecione uma opção"
                } />
              </SelectTrigger>
              <SelectContent>
                {p.opcoes && p.opcoes.length > 0 ? (
                  p.opcoes.map((opcao, idx) => (
                    <SelectItem key={idx} value={opcao}>{opcao}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>Nenhuma opção definida</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
          
          {p.tipo === 'FORMULA' && (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-700 mb-2">
                <strong>Fórmula:</strong> {p.formula}
              </div>
              <div className="text-lg font-semibold text-blue-900">
                Resultado: {formData.respostas[p.id.toString()] || 'Aguardando cálculo...'}
              </div>
              {editingRegistro && (
                <div className="text-xs text-blue-600 mt-1">
                  (Esta fórmula será recalculada automaticamente pelo sistema)
                </div>
              )}
            </div>
          )}
        </div>
      ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Registro Diário</h2>
        <Button onClick={handleNovoRegistro}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          <CardDescription>Filtre os registros por formulário, meta, data e nota</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por Formulário */}
            <div className="grid gap-2">
              <Label>Formulário</Label>
              <div className="flex gap-2">
                <Select
                  value={filtros.formulario_id || ""}
                  onValueChange={(v) => setFiltros({ ...filtros, formulario_id: v === "todos" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os formulários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os formulários</SelectItem>
                    {formularios.map(f => (
                      <SelectItem key={f.id} value={f.id.toString()}>{f.nome || f.titulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filtros.formulario_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, formulario_id: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filtro por Meta Terapêutica */}
            <div className="grid gap-2">
              <Label>Meta Terapêutica</Label>
              <div className="flex gap-2">
                <Select
                  value={filtros.meta_id || ""}
                  onValueChange={(v) => setFiltros({ ...filtros, meta_id: v === "todos" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as metas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as metas</SelectItem>
                    {metas.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.descricao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filtros.meta_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, meta_id: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filtro por Data Início */}
            <div className="grid gap-2">
              <Label>Data Início</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filtros.data_inicio}
                  onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
                />
                {filtros.data_inicio && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, data_inicio: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filtro por Data Fim */}
            <div className="grid gap-2">
              <Label>Data Fim</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filtros.data_fim}
                  onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
                />
                {filtros.data_fim && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, data_fim: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filtro por Nota Mínima */}
            <div className="grid gap-2">
              <Label>Nota Mínima</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={filtros.nota_min}
                  onChange={(e) => setFiltros({ ...filtros, nota_min: e.target.value })}
                  placeholder="1"
                />
                {filtros.nota_min && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, nota_min: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filtro por Nota Máxima */}
            <div className="grid gap-2">
              <Label>Nota Máxima</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={filtros.nota_max}
                  onChange={(e) => setFiltros({ ...filtros, nota_max: e.target.value })}
                  placeholder="5"
                />
                {filtros.nota_max && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltros({ ...filtros, nota_max: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              <X className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de registros */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Registros</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os registros
            {registrosFiltrados.length !== registros.length && (
              <span className="text-blue-600 font-medium">
                {' '}({registrosFiltrados.length} de {registros.length} registros)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {registros.length === 0 
                ? "Nenhum registro criado ainda."
                : "Nenhum registro encontrado com os filtros aplicados."
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{r.meta_descricao}</TableCell>
                    <TableCell>{r.formulario_nome || r.formulario_titulo}</TableCell>
                    <TableCell>
                      {r.nota ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {r.nota}/5
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {r.observacao || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(r)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Tela Cheia para Formulário */}
      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingRegistro ? 'Editar Registro' : 'Novo Registro'}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowFullScreen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formulário */}
                <div className="grid gap-2">
                  <Label>Formulário *</Label>
                  <Select
                    value={formularioSelecionado?.id?.toString() || ''}
                    onValueChange={(v) => carregarPerguntas(parseInt(v))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formulário" />
                    </SelectTrigger>
                    <SelectContent>
                    {formularios.map(f => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.nome || f.titulo || `Formulário ${f.id}`}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Meta Terapêutica */}
                <div className="grid gap-2">
                  <Label>Meta Terapêutica *</Label>
                  <Select
                    value={formData.meta_id}
                    onValueChange={(v) => setFormData({ ...formData, meta_id: v })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a meta" />
                    </SelectTrigger>
                    <SelectContent>
                      {metas.map(m => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.descricao || `Meta ${m.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data */}
                <div className="grid gap-2">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>

                {/* Nota */}
                <div className="grid gap-2">
                  <Label>Nota (1 a 5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.nota || ""}
                    onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                    placeholder="Digite uma nota de 1 a 5"
                  />
                </div>
              </div>

              {/* Observação */}
              <div className="grid gap-2">
                <Label>Observação</Label>
                <Input
                  type="text"
                  value={formData.observacao || ""}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Digite uma observação (opcional)"
                />
              </div>

              {/* Perguntas do formulário */}
              {perguntas.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Perguntas do Formulário: {formularioSelecionado?.nome || formularioSelecionado?.titulo}
                  </h3>
                  {renderPerguntas()}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowFullScreen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingRegistro ? 'Atualizar' : 'Registrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
