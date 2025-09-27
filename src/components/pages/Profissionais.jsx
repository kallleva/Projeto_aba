import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Mail, Phone, Search } from 'lucide-react'
import ApiService from '@/lib/api'

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfissional, setEditingProfissional] = useState(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    email: '',
    telefone: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProfissionais()
  }, [])

  const loadProfissionais = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getProfissionais()
      setProfissionais(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar profissionais: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProfissional) {
        await ApiService.updateProfissional(editingProfissional.id, formData)
        toast({
          title: 'Sucesso',
          description: 'Profissional atualizado com sucesso!'
        })
      } else {
        await ApiService.createProfissional(formData)
        toast({
          title: 'Sucesso',
          description: 'Profissional cadastrado com sucesso!'
        })
      }
      setDialogOpen(false)
      resetForm()
      loadProfissionais()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (profissional) => {
    setEditingProfissional(profissional)
    setFormData({
      nome: profissional.nome,
      especialidade: profissional.especialidade,
      email: profissional.email,
      telefone: profissional.telefone
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await ApiService.deleteProfissional(id)
        toast({
          title: 'Sucesso',
          description: 'Profissional excluído com sucesso!'
        })
        loadProfissionais()
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
      especialidade: '',
      email: '',
      telefone: ''
    })
    setEditingProfissional(null)
  }

  const getEspecialidadeBadgeVariant = (especialidade) => {
    const especialidadeLower = especialidade.toLowerCase()
    if (especialidadeLower.includes('psicolog')) return 'default'
    if (especialidadeLower.includes('fonoaudi')) return 'secondary'
    if (especialidadeLower.includes('terapeuta')) return 'outline'
    return 'default'
  }

  // 🔎 Filtro aplicado à lista
  const profissionaisFiltrados = profissionais.filter((p) => {
    const termo = search.toLowerCase()
    return (
      p.nome.toLowerCase().includes(termo) ||
      p.especialidade.toLowerCase().includes(termo) ||
      p.email.toLowerCase().includes(termo) ||
      p.telefone.toLowerCase().includes(termo)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profissionais</h2>
          <p className="text-muted-foreground">
            Gerencie os profissionais cadastrados no sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingProfissional ? 'Editar Profissional' : 'Novo Profissional'}
              </DialogTitle>
              <DialogDescription>
                {editingProfissional 
                  ? 'Edite as informações do profissional abaixo.'
                  : 'Preencha as informações do novo profissional abaixo.'
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
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                    placeholder="Ex: Psicólogo, Fonoaudiólogo, Terapeuta Ocupacional"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProfissional ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>



      <Card>
        
        <CardHeader>
          <CardTitle>Lista de Profissionais</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os profissionais cadastrados
          </CardDescription>
        </CardHeader>
            {/* 🔎 Campo de busca */}
          <div className="flex items-center gap-4 max-w-sm pl-8">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              className="p-2" // 👈 padding interno do input
              placeholder="Buscar profissional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : profissionaisFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum profissional encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profissionaisFiltrados.map((profissional) => (
                  <TableRow key={profissional.id}>
                    <TableCell className="font-medium">{profissional.nome}</TableCell>
                    <TableCell>
                      <Badge variant={getEspecialidadeBadgeVariant(profissional.especialidade)}>
                        {profissional.especialidade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {profissional.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {profissional.telefone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(profissional)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(profissional.id)}
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
