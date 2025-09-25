// React + Tailwind ajustado para metas com formulários embutidos e edição completa
import { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'
import ApiService from '@/lib/api'

export default function RegistroDiario() {
  const [registros, setRegistros] = useState([])
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRegistro, setEditingRegistro] = useState(null)
  const { toast } = useToast()

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

  const loadData = async () => {
    try {
      setLoading(true)
      const [registrosData, metasData] = await Promise.all([
        ApiService.getChecklistsDiarios(),
        ApiService.getMetasTerapeuticas() // já retorna metas com formulários e perguntas
      ])
      setRegistros(registrosData)
      setMetas(metasData)
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar dados: ' + error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
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
    if (!registro) return

    const metaSelecionada = metas.find(m => m.id.toString() === registro.meta_id?.toString())
    const formularioSelecionado = metaSelecionada?.formularios.find(f => f.id.toString() === registro.formulario_id?.toString())

    const respostasInit = {}
    formularioSelecionado?.perguntas.forEach(p => {
      respostasInit[p.id] = registro.respostas?.[p.id] ?? (p.tipo === 'BOOLEANO' ? false : '')
    })

    setEditingRegistro(registro)
    setFormData({
      meta_id: registro.meta_id?.toString() || '',
      formulario_id: registro.formulario_id?.toString() || '',
      data: registro.data || new Date().toISOString().split('T')[0],
      nota: registro.nota || '',
      observacao: registro.observacao || '',
      respostas: respostasInit
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

  const formulariosFiltrados = formData.meta_id
    ? metas.find(m => m.id.toString() === formData.meta_id)?.formularios || []
    : []

  const renderPerguntas = () => {
    const formularioAtual = formulariosFiltrados.find(f => f.id.toString() === formData.formulario_id)?.perguntas || []
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
        <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRegistro ? 'Editar Registro' : 'Novo Registro'}</DialogTitle>
            <DialogDescription>Preencha as respostas do formulário</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">

            <div className="grid gap-2">
              <Label>Meta Terapêutica</Label>
              <Select
                value={formData.meta_id}
                onValueChange={(v) => setFormData({ ...formData, meta_id: v, formulario_id: '' })}
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

            <div className="grid gap-2">
              <Label>Formulário</Label>
              <Select
                value={formData.formulario_id}
                onValueChange={(v) => setFormData({ ...formData, formulario_id: v })}
                disabled={!formData.meta_id}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formulário" />
                </SelectTrigger>
                <SelectContent>
                  {formulariosFiltrados.map(f => (
                    <SelectItem key={f.id} value={f.id.toString()}>{f.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

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

            <div className="grid gap-2">
              <Label>Observação</Label>
              <Input
                type="text"
                value={formData.observacao || ""}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
              />
            </div>

            {renderPerguntas()}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{editingRegistro ? 'Atualizar' : 'Registrar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Registros</CardTitle>
          <CardDescription>Visualize e gerencie todos os registros</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : registros.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro criado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Formulário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{r.meta_descricao}</TableCell>
                    <TableCell>{r.formulario_nome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
