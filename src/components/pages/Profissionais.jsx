import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit, Trash2, Mail, Phone, Search, Users, AlertCircle, HelpCircle } from 'lucide-react'
import ApiService from '@/lib/api'
import ProfissionaisAjuda from './ProfissionaisAjuda'

export default function Profissionais() {
  const { user } = useAuth()
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [ajudaOpen, setAjudaOpen] = useState(false)
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div>
            <h1 className="page-title text-2xl md:text-3xl">Profissionais</h1>
            <p className="page-subtitle text-sm md:text-base">
              {isProfissional 
                ? 'Meus dados profissionais'
                : 'Gerencie os profissionais cadastrados no sistema'
              }
            </p>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
            <Button 
              onClick={() => setAjudaOpen(true)}
              variant="outline"
              className="flex items-center justify-center gap-2 text-xs md:text-sm w-full sm:w-auto"
            >
              <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
              Ajuda
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => {
                  resetForm()
                  setDialogOpen(true)
                }}
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                className="flex items-center justify-center gap-2 text-xs md:text-sm w-full sm:w-auto"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
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
                className="flex items-center justify-center gap-2 text-xs md:text-sm w-full sm:w-auto"
              >
                <Edit className="h-3 w-3 md:h-4 md:w-4" />
                Editar Meus Dados
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Único para Edição/Criação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-full max-h-screen md:max-h-fit overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              {editingProfissional ? 'Editar Profissional' : 'Novo Profissional'}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              {editingProfissional 
                ? 'Edite as informações do profissional abaixo.'
                : 'Preencha as informações do novo profissional abaixo.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-3 md:gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome" className="text-xs md:text-sm">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="text-xs md:text-sm"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="especialidade" className="text-xs md:text-sm">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                  placeholder="Ex: Psicólogo, Fonoaudiólogo, Terapeuta Ocupacional"
                  className="text-xs md:text-sm"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="text-xs md:text-sm"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone" className="text-xs md:text-sm">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                  className="text-xs md:text-sm"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="text-xs md:text-sm">
                Cancelar
              </Button>
              <Button 
                type="submit"
                style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                className="text-xs md:text-sm"
              >
                {editingProfissional ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Card Principal - Lista de Profissionais */}
      <div className="card-spacing">
        <div className="section-header mb-4 md:mb-6">
          <Users size={18} className="color-info-icon" />
          <h2 className="section-header-title text-lg md:text-xl">
            {isProfissional ? 'Meu Perfil' : 'Lista de Profissionais'}
          </h2>
        </div>
        <p className="card-text mb-4 md:mb-6 text-sm md:text-base">
          {isProfissional 
            ? 'Visualize suas informações profissionais'
            : 'Visualize e gerencie todos os profissionais cadastrados'
          }
        </p>

        {/* Campo de busca - apenas para ADMIN */}
        {isAdmin && (
          <div className="mb-4 md:mb-6 flex items-center gap-2 md:gap-3 w-full md:max-w-md">
            <Search size={16} className="color-neutral-icon flex-shrink-0" />
            <Input
              className="flex-1 text-xs md:text-sm"
              placeholder="Buscar profissional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Tabela ou Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium text-xs md:text-sm">Carregando profissionais...</p>
          </div>
        ) : profissionaisFiltrados.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p className="font-medium text-sm">Nenhum profissional encontrado</p>
              {search && isAdmin && <p className="text-xs mt-1">Tente ajustar seus critérios de busca</p>}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="table w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left">Nome</th>
                  <th className="text-left hidden sm:table-cell">Especialidade</th>
                  <th className="text-left hidden lg:table-cell">Email</th>
                  <th className="text-left hidden md:table-cell">Telefone</th>
                  <th className="text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {profissionaisFiltrados.map((profissional) => (
                  <tr key={profissional.id} className="border-b hover:bg-gray-50">
                    <td className="font-semibold py-2 md:py-3">
                      <div>
                        <div className="text-xs md:text-sm">{profissional.nome}</div>
                        <div className="sm:hidden text-xs text-gray-600 mt-1">{profissional.especialidade}</div>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 hidden sm:table-cell">
                      <span className={`badge text-xs ${getEspecialidadeBadgeVariant(profissional.especialidade)}`}>
                        {profissional.especialidade}
                      </span>
                    </td>
                    <td className="py-2 md:py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="color-neutral-icon flex-shrink-0 hidden md:block" />
                        <span className="text-xs md:text-sm truncate">{profissional.email}</span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="color-neutral-icon flex-shrink-0 hidden md:block" />
                        <span className="text-xs md:text-sm">{profissional.telefone}</span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleEdit(profissional)
                            setDialogOpen(true)
                          }}
                          className="h-8 w-8 md:h-9 md:w-9 p-0"
                          title="Editar"
                        >
                          <Edit size={14} className="md:w-4 md:h-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(profissional.id)}
                            className="h-8 w-8 md:h-9 md:w-9 p-0"
                            title="Deletar"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
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

      <ProfissionaisAjuda open={ajudaOpen} onOpenChange={setAjudaOpen} />
    </div>
  )
}
