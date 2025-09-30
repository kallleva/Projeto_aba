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
    formulario_id: '',
    meta_id: '',
    data: new Date().toISOString().split('T')[0],
    nota: '',
    observacao: '',
    respostas: {}
  })

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

  const handleRespostaChange = (perguntaId, valor) => {
    setFormData(prev => ({
      ...prev,
      respostas: { ...prev.respostas, [perguntaId]: valor }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        formulario_id: parseInt(formData.formulario_id),
        meta_id: parseInt(formData.meta_id),
        data: formData.data,
        nota: formData.nota ? parseInt(formData.nota) : null,
        observacao: formData.observacao || null,
        respostas: formData.respostas
      }

      // Validar se formulário foi selecionado
      if (!formData.formulario_id) {
        toast({ title: 'Erro', description: 'Selecione um formulário', variant: 'destructive' })
        return
      }

      // Validar se meta foi selecionada
      if (!formData.meta_id) {
        toast({ title: 'Erro', description: 'Selecione uma meta terapêutica', variant: 'destructive' })
        return
      }

      if (editingRegistro) {
        await ApiService.updateChecklistDiario(editingRegistro.id, dataToSend)
        toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso!' })
      } else {
        await ApiService.createChecklistDiario(dataToSend)
        toast({ title: 'Sucesso', description: 'Registro criado com sucesso!' })
      }

      setDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleEdit = (registro) => {
    setEditingRegistro(registro)
    setFormData({
      formulario_id: registro.formulario_id ? registro.formulario_id.toString() : '',
      meta_id: registro.meta_id ? registro.meta_id.toString() : '',
      data: registro.data || new Date().toISOString().split('T')[0],
      nota: registro.nota || '',
      observacao: registro.observacao || '',
      respostas: registro.respostas || {}
    })
    setDialogOpen(true)
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
      formulario_id: '',
      meta_id: '',
      data: new Date().toISOString().split('T')[0],
      nota: '',
      observacao: '',
      respostas: {}
    })
    setEditingRegistro(null)
  }

  const renderPerguntas = () => {
    const formularioAtual = formularios.find(f => f.id.toString() === formData.formulario_id)?.perguntas || []
    return formularioAtual
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => (
        <div key={p.id} className="grid gap-2">
          <Label>{p.texto} {p.obrigatoria && <span className="text-red-500">*</span>}</Label>

          {p.tipo === 'TEXTO' && (
            <Input
              value={formData.respostas[p.id] || ''}
              onChange={(e) => handleRespostaChange(p.id, e.target.value)}
              required={p.obrigatoria}
            />
          )}
          {p.tipo === 'NUMERO' && (
            <Input
              type="number"
              value={formData.respostas[p.id] || ''}
              onChange={(e) => handleRespostaChange(p.id, e.target.value)}
              required={p.obrigatoria}
            />
          )}
          {p.tipo === 'BOOLEANO' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`booleano-${p.id}`}
                  value="true"
                  checked={formData.respostas[p.id] === true}
                  onChange={() => handleRespostaChange(p.id, true)}
                  required={p.obrigatoria}
                />
                Sim
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`booleano-${p.id}`}
                  value="false"
                  checked={formData.respostas[p.id] === false}
                  onChange={() => handleRespostaChange(p.id, false)}
                />
                Não
              </label>
            </div>
          )}
          {p.tipo === 'MULTIPLA' && p.opcoes?.length > 0 && (
            <Select
              value={formData.respostas[p.id] || ''}
              onValueChange={(v) => handleRespostaChange(p.id, v)}
              required={p.obrigatoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {p.opcoes.map((opcao, idx) => (
                  <SelectItem key={idx} value={opcao}>{opcao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Registro Diário</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRegistro ? 'Editar Registro' : 'Novo Registro'}</DialogTitle>
              <DialogDescription>Preencha as respostas do formulário</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">

              {/* Formulário */}
              <div className="grid gap-2">
                <Label>Formulário</Label>
                <Select
                  value={formData.formulario_id}
                  onValueChange={(v) => setFormData({ ...formData, formulario_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formulário" />
                  </SelectTrigger>
                  <SelectContent>
                    {formularios.map(f => (
                      <SelectItem key={f.id} value={f.id.toString()}>{f.titulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Meta Terapêutica */}
              <div className="grid gap-2">
                <Label>Meta Terapêutica</Label>
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
                      <SelectItem key={m.id} value={m.id.toString()}>{m.descricao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="grid gap-2">
                <Label>Data</Label>
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
                />
              </div>

              {/* Observação */}
              <div className="grid gap-2">
                <Label>Observação</Label>
                <Input
                  type="text"
                  value={formData.observacao || ""}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                />
              </div>

              {/* Perguntas do formulário */}
              {renderPerguntas()}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingRegistro ? 'Atualizar' : 'Registrar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                      <SelectItem key={f.id} value={f.id.toString()}>{f.titulo}</SelectItem>
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
                    <TableCell>{r.formulario_titulo}</TableCell>
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
    </div>
  )
}
