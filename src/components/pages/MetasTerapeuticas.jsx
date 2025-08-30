import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Target, CheckCircle, Clock, Calendar } from 'lucide-react'
import ApiService from '@/lib/api'

export default function MetasTerapeuticas() {
  const [metas, setMetas] = useState([])
  const [planos, setPlanos] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState(null)
  const [formData, setFormData] = useState({
    plano_id: '',
    descricao: '',
    data_inicio: '',
    data_previsao_termino: '',
    status: 'EmAndamento'
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [metasData, planosData] = await Promise.all([
        ApiService.getMetasTerapeuticas(),
        ApiService.getPlanosTerapeuticos()
      ])
      setMetas(metasData)
      setPlanos(planosData)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        plano_id: parseInt(formData.plano_id)
      }

      if (editingMeta) {
        await ApiService.updateMetaTerapeutica(editingMeta.id, dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Meta terapêutica atualizada com sucesso!'
        })
      } else {
        await ApiService.createMetaTerapeutica(dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Meta terapêutica criada com sucesso!'
        })
      }
      setDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (meta) => {
    setEditingMeta(meta)
    setFormData({
      plano_id: meta.plano_id.toString(),
      descricao: meta.descricao,
      data_inicio: meta.data_inicio,
      data_previsao_termino: meta.data_previsao_termino,
      status: meta.status
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta terapêutica?')) {
      try {
        await ApiService.deleteMetaTerapeutica(id)
        toast({
          title: 'Sucesso',
          description: 'Meta terapêutica excluída com sucesso!'
        })
        loadData()
      } catch (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  const handleConcluir = async (id) => {
    try {
      await ApiService.concluirMeta(id)
      toast({
        title: 'Sucesso',
        description: 'Meta marcada como concluída!'
      })
      loadData()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      plano_id: '',
      descricao: '',
      data_inicio: '',
      data_previsao_termino: '',
      status: 'EmAndamento'
    })
    setEditingMeta(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'EmAndamento':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Em Andamento</Badge>
      case 'Concluida':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Concluída</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calcularProgresso = (dataInicio, dataPrevisaoTermino) => {
    if (!dataInicio || !dataPrevisaoTermino) return 0
    
    const hoje = new Date()
    const inicio = new Date(dataInicio)
    const termino = new Date(dataPrevisaoTermino)
    
    const totalDias = (termino - inicio) / (1000 * 60 * 60 * 24)
    const diasDecorridos = (hoje - inicio) / (1000 * 60 * 60 * 24)
    
    if (totalDias <= 0) return 100
    
    const progresso = Math.min(100, Math.max(0, (diasDecorridos / totalDias) * 100))
    return Math.round(progresso)
  }

  const getPlanoInfo = (planoId) => {
    const plano = planos.find(p => p.id === planoId)
    return plano ? `${plano.paciente_nome} - ${plano.profissional_nome}` : 'Plano não encontrado'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Metas Terapêuticas</h2>
          <p className="text-muted-foreground">
            Gerencie as metas terapêuticas dos pacientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMeta ? 'Editar Meta Terapêutica' : 'Nova Meta Terapêutica'}
              </DialogTitle>
              <DialogDescription>
                {editingMeta 
                  ? 'Edite as informações da meta terapêutica abaixo.'
                  : 'Preencha as informações da nova meta terapêutica abaixo.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="plano_id">Plano Terapêutico</Label>
                  <Select 
                    value={formData.plano_id} 
                    onValueChange={(value) => setFormData({...formData, plano_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano terapêutico" />
                    </SelectTrigger>
                    <SelectContent>
                      {planos.map((plano) => (
                        <SelectItem key={plano.id} value={plano.id.toString()}>
                          {plano.paciente_nome} - {plano.profissional_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição da Meta</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva a meta terapêutica..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="data_previsao_termino">Previsão de Término</Label>
                    <Input
                      id="data_previsao_termino"
                      type="date"
                      value={formData.data_previsao_termino}
                      onChange={(e) => setFormData({...formData, data_previsao_termino: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EmAndamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMeta ? 'Atualizar' : 'Criar Meta'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Metas Terapêuticas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as metas terapêuticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : metas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma meta terapêutica criada ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano (Paciente - Profissional)</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metas.map((meta) => {
                  const progresso = calcularProgresso(meta.data_inicio, meta.data_previsao_termino)
                  return (
                    <TableRow key={meta.id}>
                      <TableCell className="font-medium">
                        {getPlanoInfo(meta.plano_id)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={meta.descricao}>
                          {meta.descricao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(meta.data_inicio)} - {formatDate(meta.data_previsao_termino)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={progresso} className="w-16" />
                          <span className="text-xs text-muted-foreground">{progresso}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(meta.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {meta.status === 'EmAndamento' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConcluir(meta.id)}
                              title="Marcar como concluída"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(meta)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(meta.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

