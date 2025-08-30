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
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Star, Calendar, Target, User } from 'lucide-react'
import ApiService from '@/lib/api'

export default function RegistroDiario() {
  const [registros, setRegistros] = useState([])
  const [metasAtivas, setMetasAtivas] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRegistro, setEditingRegistro] = useState(null)
  const [formData, setFormData] = useState({
    meta_id: '',
    data: new Date().toISOString().split('T')[0],
    nota: '',
    observacao: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [registrosData, metasData] = await Promise.all([
        ApiService.getChecklistsDiarios(),
        ApiService.getMetasAtivas()
      ])
      setRegistros(registrosData)
      setMetasAtivas(metasData)
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
        meta_id: parseInt(formData.meta_id),
        nota: parseInt(formData.nota)
      }

      if (editingRegistro) {
        await ApiService.updateChecklistDiario(editingRegistro.id, dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Registro diário atualizado com sucesso!'
        })
      } else {
        await ApiService.createChecklistDiario(dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Registro diário criado com sucesso!'
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

  const handleEdit = (registro) => {
    setEditingRegistro(registro)
    setFormData({
      meta_id: registro.meta_id.toString(),
      data: registro.data,
      nota: registro.nota.toString(),
      observacao: registro.observacao || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await ApiService.deleteChecklistDiario(id)
        toast({
          title: 'Sucesso',
          description: 'Registro diário excluído com sucesso!'
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

  const resetForm = () => {
    setFormData({
      meta_id: '',
      data: new Date().toISOString().split('T')[0],
      nota: '',
      observacao: ''
    })
    setEditingRegistro(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getNotaBadge = (nota) => {
    const variants = {
      1: 'destructive',
      2: 'destructive',
      3: 'secondary',
      4: 'default',
      5: 'default'
    }
    
    const colors = {
      1: 'text-red-600',
      2: 'text-orange-600',
      3: 'text-yellow-600',
      4: 'text-blue-600',
      5: 'text-green-600'
    }

    return (
      <Badge variant={variants[nota]} className={colors[nota]}>
        <Star className="w-3 h-3 mr-1 fill-current" />
        {nota}/5
      </Badge>
    )
  }

  const getMetaInfo = (metaId) => {
    const meta = metasAtivas.find(m => m.id === metaId)
    return meta ? meta.descricao : 'Meta não encontrada'
  }

  const renderStarRating = (currentRating, onRatingChange) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star.toString())}
            className={`p-1 rounded ${
              star <= parseInt(currentRating) 
                ? 'text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  // Filtrar registros de hoje para destaque
  const hoje = new Date().toISOString().split('T')[0]
  const registrosHoje = registros.filter(r => r.data === hoje)
  const outrosRegistros = registros.filter(r => r.data !== hoje)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registro Diário</h2>
          <p className="text-muted-foreground">
            Registre o progresso diário das metas terapêuticas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingRegistro ? 'Editar Registro Diário' : 'Novo Registro Diário'}
              </DialogTitle>
              <DialogDescription>
                {editingRegistro 
                  ? 'Edite as informações do registro diário abaixo.'
                  : 'Preencha as informações do novo registro diário abaixo.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="meta_id">Meta Terapêutica</Label>
                  <Select 
                    value={formData.meta_id} 
                    onValueChange={(value) => setFormData({...formData, meta_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a meta" />
                    </SelectTrigger>
                    <SelectContent>
                      {metasAtivas.map((meta) => (
                        <SelectItem key={meta.id} value={meta.id.toString()}>
                          {meta.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Nota (1 a 5)</Label>
                  <div className="space-y-2">
                    {renderStarRating(formData.nota, (nota) => setFormData({...formData, nota}))}
                    <p className="text-sm text-muted-foreground">
                      Clique nas estrelas para avaliar o progresso da meta
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observacao">Observações (opcional)</Label>
                  <Textarea
                    id="observacao"
                    value={formData.observacao}
                    onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    placeholder="Adicione observações sobre o progresso..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!formData.nota}>
                  {editingRegistro ? 'Atualizar' : 'Registrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Registros de hoje */}
      {registrosHoje.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Registros de Hoje
            </CardTitle>
            <CardDescription>
              Registros feitos hoje ({formatDate(hoje)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meta</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosHoje.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{registro.meta_descricao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getNotaBadge(registro.nota)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={registro.observacao}>
                        {registro.observacao || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(registro)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(registro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Todos os registros */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Registros</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os registros diários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : registros.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro diário criado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(registro.data)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{registro.meta_descricao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getNotaBadge(registro.nota)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={registro.observacao}>
                        {registro.observacao || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(registro)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(registro.id)}
                        >
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

