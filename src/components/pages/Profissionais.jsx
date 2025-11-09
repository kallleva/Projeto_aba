import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit, Trash2, Mail, Phone, Search, Users, AlertCircle } from 'lucide-react'
import ApiService from '@/lib/api'

export default function Profissionais() {
  const { user } = useAuth()
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
  }, [user])

  const loadProfissionais = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getProfissionais()
      setProfissionais(data)
    } catch (error) {
      // Se for erro 403 (acesso negado), mostrar mensagem
      if (error.status === 403) {
        toast({
          title: 'Acesso Negado',
          description: 'Você não tem permissão para acessar esta página',
          variant: 'destructive'
        })
        setProfissionais([])
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao carregar profissionais: ' + error.message,
          variant: 'destructive'
        })
      }
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
    if (especialidadeLower.includes('psicolog')) return 'badge-info'
    if (especialidadeLower.includes('fonoaudi')) return 'badge-success'
    if (especialidadeLower.includes('terapeuta')) return 'badge-warning'
    return 'badge-neutral'
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

  // Verificar se usuário é RESPONSAVEL (sem acesso)
  const isResponsavel = user?.tipo_usuario === 'RESPONSAVEL'

  if (isResponsavel) {
    return (
      <div className="page-section">
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <div className="alert-content">
            <p className="font-medium">Acesso Negado</p>
            <p className="text-sm mt-1">Responsáveis não têm permissão para acessar o cadastro de profissionais.</p>
          </div>
        </div>
      </div>
    )
  }

  const isProfissional = user?.tipo_usuario === 'PROFISSIONAL'
  const isAdmin = user?.tipo_usuario === 'ADMIN'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Profissionais</h1>
            <p className="page-subtitle">
              {isProfissional 
                ? 'Meus dados profissionais'
                : 'Gerencie os profissionais cadastrados no sistema'
              }
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Profissional
            </Button>
          )}
          {isProfissional && user?.profissional && (
            <Button 
              onClick={() => {
                handleEdit(user.profissional)
                setDialogOpen(true)
              }}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Meus Dados
            </Button>
          )}
        </div>
      </div>

      {/* Dialog Único para Edição/Criação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <Button 
                type="submit"
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              >
                {editingProfissional ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Card Principal - Lista de Profissionais */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Users size={18} className="color-info-icon" />
          <h2 className="section-header-title">
            {isProfissional ? 'Meu Perfil' : 'Lista de Profissionais'}
          </h2>
        </div>
        <p className="card-text mb-6">
          {isProfissional 
            ? 'Visualize suas informações profissionais'
            : 'Visualize e gerencie todos os profissionais cadastrados'
          }
        </p>

        {/* Campo de busca - apenas para ADMIN */}
        {isAdmin && (
          <div className="mb-6 flex items-center gap-3 max-w-md">
            <Search size={18} className="color-neutral-icon" />
            <Input
              className="flex-1"
              placeholder="Buscar por nome, especialidade, email ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Tabela ou Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando profissionais...</p>
          </div>
        ) : profissionaisFiltrados.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p className="font-medium">Nenhum profissional encontrado</p>
              {search && isAdmin && <p className="text-sm mt-1">Tente ajustar seus critérios de busca</p>}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Especialidade</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {profissionaisFiltrados.map((profissional) => (
                  <tr key={profissional.id}>
                    <td className="font-semibold">{profissional.nome}</td>
                    <td>
                      <span className={`badge ${getEspecialidadeBadgeVariant(profissional.especialidade)}`}>
                        {profissional.especialidade}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="color-neutral-icon flex-shrink-0" />
                        <span className="text-sm">{profissional.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="color-neutral-icon flex-shrink-0" />
                        <span className="text-sm">{profissional.telefone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleEdit(profissional)
                            setDialogOpen(true)
                          }}
                          className="h-9 w-9 p-0"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(profissional.id)}
                            className="h-9 w-9 p-0"
                            title="Deletar"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
