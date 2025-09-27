import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, User, UserCheck, Search } from 'lucide-react'
import ApiService from '@/lib/api'

export default function PlanosTerapeuticos() {
  const [planos, setPlanos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlano, setEditingPlano] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // 🔎 filtro de busca
  const [formData, setFormData] = useState({
    paciente_id: '',
    profissional_id: '',
    objetivo_geral: '',
    data_criacao: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [planosData, pacientesData, profissionaisData] = await Promise.all([
        ApiService.getPlanosTerapeuticos(),
        ApiService.getPacientes(),
        ApiService.getProfissionais()
      ])
      setPlanos(planosData)
      setPacientes(pacientesData)
      setProfissionais(profissionaisData)
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
        paciente_id: parseInt(formData.paciente_id),
        profissional_id: parseInt(formData.profissional_id)
      }

      if (editingPlano) {
        await ApiService.updatePlanoTerapeutico(editingPlano.id, dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Plano terapêutico atualizado com sucesso!'
        })
      } else {
        await ApiService.createPlanoTerapeutico(dataToSend)
        toast({
          title: 'Sucesso',
          description: 'Plano terapêutico criado com sucesso!'
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

  const handleEdit = (plano) => {
    setEditingPlano(plano)
    setFormData({
      paciente_id: plano.paciente_id.toString(),
      profissional_id: plano.profissional_id.toString(),
      objetivo_geral: plano.objetivo_geral,
      data_criacao: plano.data_criacao
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este plano terapêutico?')) {
      try {
        await ApiService.deletePlanoTerapeutico(id)
        toast({
          title: 'Sucesso',
          description: 'Plano terapêutico excluído com sucesso!'
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
      paciente_id: '',
      profissional_id: '',
      objetivo_geral: '',
      data_criacao: ''
    })
    setEditingPlano(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // 🔎 filtra os planos com base no termo digitado
  const filteredPlanos = planos.filter((plano) =>
    plano.paciente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.profissional_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.objetivo_geral?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planos Terapêuticos</h2>
          <p className="text-muted-foreground">
            Gerencie os planos terapêuticos dos pacientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPlano ? 'Editar Plano Terapêutico' : 'Novo Plano Terapêutico'}
              </DialogTitle>
              <DialogDescription>
                {editingPlano 
                  ? 'Edite as informações do plano terapêutico abaixo.'
                  : 'Preencha as informações do novo plano terapêutico abaixo.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="paciente_id">Paciente</Label>
                  <Select 
                    value={formData.paciente_id} 
                    onValueChange={(value) => setFormData({...formData, paciente_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map((paciente) => (
                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                          {paciente.nome} - {paciente.diagnostico}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profissional_id">Profissional</Label>
                  <Select 
                    value={formData.profissional_id} 
                    onValueChange={(value) => setFormData({...formData, profissional_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionais.map((profissional) => (
                        <SelectItem key={profissional.id} value={profissional.id.toString()}>
                          {profissional.nome} - {profissional.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objetivo_geral">Objetivo Geral</Label>
                  <Textarea
                    id="objetivo_geral"
                    value={formData.objetivo_geral}
                    onChange={(e) => setFormData({...formData, objetivo_geral: e.target.value})}
                    placeholder="Descreva o objetivo geral do plano terapêutico..."
                    rows={4}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data_criacao">Data de Criação</Label>
                  <Input
                    id="data_criacao"
                    type="date"
                    value={formData.data_criacao}
                    onChange={(e) => setFormData({...formData, data_criacao: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPlano ? 'Atualizar' : 'Criar Plano'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Planos Terapêuticos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os planos terapêuticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 🔎 Campo de busca */}
          <div className="flex items-center mb-4  max-w-sm">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente, profissional ou objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : filteredPlanos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum plano encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Objetivo Geral</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlanos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{plano.paciente_nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>{plano.profissional_nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={plano.objetivo_geral}>
                        {plano.objetivo_geral}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(plano.data_criacao)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plano)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plano.id)}
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
