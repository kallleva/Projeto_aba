import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, Edit, Trash2, Search, BarChart3, Users, AlertCircle } from 'lucide-react'
import ApiService from '@/lib/api'

export default function Pacientes() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [vinculosPorPaciente, setVinculosPorPaciente] = useState({})
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
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadPacientes()
  }, [user])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      let data = await ApiService.getPacientes()
      
      setPacientes(data)
      
      // Carregar vínculos para cada paciente
      const vinculosMap = {}
      for (const paciente of data) {
        try {
          const vinculos = await ApiService.getProfissionaisPaciente(paciente.id, true)
          vinculosMap[paciente.id] = vinculos
        } catch (error) {
          // console.warn(`Erro ao carregar vínculos do paciente ${paciente.id}:`, error)
          vinculosMap[paciente.id] = []
        }
      }
      setVinculosPorPaciente(vinculosMap)
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
    navigate(`/pacientes/${paciente.id}`)
  }

  const handleViewRelatorio = (paciente) => {
    navigate(`/pacientes/${paciente.id}?tab=relatorio`)
  }

  const handleViewVinculos = (paciente) => {
    navigate(`/pacientes/${paciente.id}?tab=vinculos`)
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

  const getDiagnosticoBadgeClass = (diagnostico) => {
    switch (diagnostico) {
      case 'TEA': return 'badge-info'
      case 'TDAH': return 'badge-warning'
      default: return 'badge-success'
    }
  }

  const filteredPacientes = pacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.responsavel.toLowerCase().includes(search.toLowerCase()) ||
    (p.diagnostico || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-section">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">Pacientes</h1>
          <p className="page-subtitle">
            {user?.tipo_usuario === 'RESPONSAVEL' 
              ? 'Meus pacientes' 
              : 'Gerencie os pacientes cadastrados no sistema'
            }
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {user?.tipo_usuario !== 'RESPONSAVEL' && (
            <DialogTrigger asChild>
              <Button onClick={resetForm} style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Paciente
              </Button>
            </DialogTrigger>
          )}
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
                <Button type="submit" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                  {editingPaciente ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card com Tabela */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Users size={18} className="color-info-icon" />
          <h2 className="section-header-title">Lista de Pacientes</h2>
        </div>

        {/* Campo de busca */}
        <div className="flex items-center gap-2 mb-6 bg-gray-50 px-3 py-2 rounded-lg" style={{ maxWidth: '300px' }}>
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            className="border-0 bg-gray-50 p-0"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ outline: 'none' }}
          />
        </div>

        {loading ? (
          <div className="center-flex py-12">
            <div className="text-lg animate-pulse text-gray-600">Carregando pacientes...</div>
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="alert alert-warning">
            <AlertCircle className="alert-icon" />
            <p className="alert-content">Nenhum paciente encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Responsável</th>
                  <th>Contato</th>
                  <th>Diagnóstico</th>
                  <th>Profissionais</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td className="font-medium">{paciente.nome}</td>
                    <td>{calcularIdade(paciente.data_nascimento)}</td>
                    <td>{paciente.responsavel}</td>
                    <td>{paciente.contato}</td>
                    <td>
                      <span className={`badge ${getDiagnosticoBadgeClass(paciente.diagnostico)}`}>
                        {paciente.diagnostico}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {vinculosPorPaciente[paciente.id]?.length > 0 ? (
                          vinculosPorPaciente[paciente.id].slice(0, 2).map((vinculo) => (
                            <span key={vinculo.id} className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              {vinculo.profissional.nome.split(' ')[0]} - {vinculo.tipo_atendimento}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Nenhum vínculo</span>
                        )}
                        {vinculosPorPaciente[paciente.id]?.length > 2 && (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            +{vinculosPorPaciente[paciente.id].length - 2} mais
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewVinculos(paciente)}
                          title="Ver Vínculos"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRelatorio(paciente)}
                          title="Ver Relatório"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        {user?.tipo_usuario !== 'RESPONSAVEL' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(paciente)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(paciente.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
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
