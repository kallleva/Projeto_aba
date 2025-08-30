import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import ApiService from '@/lib/api'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    responsavel: '',
    contato: '',
    diagnostico: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getPacientes()
      setPacientes(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar pacientes: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPaciente) {
        await ApiService.updatePaciente(editingPaciente.id, formData)
        toast({
          title: 'Sucesso',
          description: 'Paciente atualizado com sucesso!'
        })
      } else {
        await ApiService.createPaciente(formData)
        toast({
          title: 'Sucesso',
          description: 'Paciente cadastrado com sucesso!'
        })
      }
      setDialogOpen(false)
      resetForm()
      loadPacientes()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (paciente) => {
    setEditingPaciente(paciente)
    setFormData({
      nome: paciente.nome,
      data_nascimento: paciente.data_nascimento,
      responsavel: paciente.responsavel,
      contato: paciente.contato,
      diagnostico: paciente.diagnostico
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await ApiService.deletePaciente(id)
        toast({
          title: 'Sucesso',
          description: 'Paciente excluído com sucesso!'
        })
        loadPacientes()
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
      nome: '',
      data_nascimento: '',
      responsavel: '',
      contato: '',
      diagnostico: ''
    })
    setEditingPaciente(null)
  }

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return '-'
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return `${idade} anos`
  }

  const getDiagnosticoBadgeVariant = (diagnostico) => {
    switch (diagnostico) {
      case 'TEA': return 'default'
      case 'TDAH': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Gerencie os pacientes cadastrados no sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
              </DialogTitle>
              <DialogDescription>
                {editingPaciente 
                  ? 'Edite as informações do paciente abaixo.'
                  : 'Preencha as informações do novo paciente abaixo.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contato">Contato</Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => setFormData({...formData, contato: e.target.value})}
                    placeholder="Telefone ou email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Select 
                    value={formData.diagnostico} 
                    onValueChange={(value) => setFormData({...formData, diagnostico: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o diagnóstico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEA">TEA (Transtorno do Espectro Autista)</SelectItem>
                      <SelectItem value="TDAH">TDAH (Transtorno do Déficit de Atenção)</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPaciente ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pacientes cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : pacientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum paciente cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell className="font-medium">{paciente.nome}</TableCell>
                    <TableCell>{calcularIdade(paciente.data_nascimento)}</TableCell>
                    <TableCell>{paciente.responsavel}</TableCell>
                    <TableCell>{paciente.contato}</TableCell>
                    <TableCell>
                      <Badge variant={getDiagnosticoBadgeVariant(paciente.diagnostico)}>
                        {paciente.diagnostico}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(paciente)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(paciente.id)}
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

