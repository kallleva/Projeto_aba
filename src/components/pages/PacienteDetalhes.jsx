import PacienteRelatorio from './PacienteRelatorio';
import AssistenteIA from '@/components/ai/AssistenteIA'
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Save, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users,
  Calendar,
  User,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  List,
  HelpCircle
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts'
import ApiService from '@/lib/api'
import { Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import PacienteDetalhesAjuda from './PacienteDetalhesAjuda'

export default function PacienteDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const isAdmin = user?.tipo_usuario === 'ADMIN'
  const isProfissional = user?.tipo_usuario === 'PROFISSIONAL'
  const isResponsavel = user?.tipo_usuario === 'RESPONSAVEL'
  const canManageVinculos = isAdmin
  const canModifyAgenda = isAdmin || isProfissional
  
  const [paciente, setPaciente] = useState(null)
  const [relatorioPaciente, setRelatorioPaciente] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [vinculos, setVinculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false)
  const [loadingVinculos, setLoadingVinculos] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'editar')
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false)
  const [editingAgendamento, setEditingAgendamento] = useState(null)
  const [showVinculoForm, setShowVinculoForm] = useState(false)
  const [editingVinculo, setEditingVinculo] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [agendamentosPorDia, setAgendamentosPorDia] = useState({})
  const [updatingAgendamento, setUpdatingAgendamento] = useState(null)
  const [ajudaOpen, setAjudaOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    responsavel: '',
    contato: '',
    diagnostico: ''
  })

  // seleção de usuário responsável
  const [showResponsavelModal, setShowResponsavelModal] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [usuariosQuery, setUsuariosQuery] = useState('')
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [selectedResponsavel, setSelectedResponsavel] = useState(null)

  const [agendamentoForm, setAgendamentoForm] = useState({
    data_hora: '',
    duracao_minutos: 60,
    observacoes: '',
    status: 'AGENDADO',
    presente: null,
    profissional_id: ''
  })

  const [vinculoForm, setVinculoForm] = useState({
    profissional_id: '',
    tipo_atendimento: '',
    data_inicio: new Date().toISOString().split('T')[0],
    frequencia_semanal: 2,
    duracao_sessao: 45,
    observacoes: ''
  })

  useEffect(() => {
    if (id) {
      loadPaciente()
      loadRelatorioPaciente()
      loadAgendamentos()
      if (canManageVinculos || isProfissional) {
        // Apenas ADMIN/PROFISSIONAL podem carregar lista completa de profissionais
        loadProfissionais()
      }
      loadVinculos()
    }
  }, [id, canManageVinculos, isProfissional])

  const loadPaciente = async () => {
    try {
      setLoading(true)
      const pacienteEncontrado = await ApiService.getPaciente(id)

      if (pacienteEncontrado) {
        setPaciente(pacienteEncontrado)
        setSelectedResponsavel(pacienteEncontrado.responsavel_usuario || null)
        setFormData({
          nome: pacienteEncontrado.nome,
          data_nascimento: pacienteEncontrado.data_nascimento,
          responsavel: pacienteEncontrado.responsavel || (pacienteEncontrado.responsavel_usuario ? pacienteEncontrado.responsavel_usuario.nome : ''),
          contato: pacienteEncontrado.contato,
          diagnostico: pacienteEncontrado.diagnostico
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Paciente não encontrado',
          variant: 'destructive'
        })
        navigate('/pacientes')
      }
    } catch (error) {
      // Verificar se é erro 403 (Acesso Negado)
      if (error.status === 403) {
        toast({
          title: 'Acesso Negado',
          description: 'Você não tem permissão para acessar este paciente',
          variant: 'destructive'
        })
        navigate('/pacientes')
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao carregar paciente: ' + error.message,
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const loadRelatorioPaciente = async () => {
    try {
      setLoadingRelatorio(true)
      const data = await ApiService.getRelatorioPaciente(id)
      setRelatorioPaciente(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar relatório do paciente: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoadingRelatorio(false)
    }
  }

  const loadAgendamentos = async () => {
    try {
      setLoadingAgendamentos(true)
      const data = await ApiService.getAgendamentos({ paciente_id: id })
      setAgendamentos(data)
      
      // Organizar agendamentos por dia para o calendário
      const agendamentosPorDiaObj = {}
      data.forEach(agendamento => {
        const dataAgendamento = new Date(agendamento.data_hora)
        const chaveData = dataAgendamento.toISOString().split('T')[0]
        if (!agendamentosPorDiaObj[chaveData]) {
          agendamentosPorDiaObj[chaveData] = []
        }
        agendamentosPorDiaObj[chaveData].push(agendamento)
      })
      setAgendamentosPorDia(agendamentosPorDiaObj)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar agendamentos: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoadingAgendamentos(false)
    }
  }

  const loadProfissionais = async () => {
    try {
      const data = await ApiService.getProfissionais()
      setProfissionais(data)
    } catch (error) {
      // Se for 403 (Acesso negado), apenas silencie para perfis sem permissão
      if (error?.status === 403 || /acesso negado/i.test(error?.message || '')) {
        // console.warn('🔒 Sem permissão para listar profissionais. Ignorando no cliente.')
        setProfissionais([])
        return
      }
      toast({
        title: 'Erro',
        description: 'Erro ao carregar profissionais: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const loadVinculos = async () => {
    try {
      setLoadingVinculos(true)
      const data = await ApiService.getProfissionaisPaciente(id)
      setVinculos(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar vínculos: ' + error.message,
        variant: 'destructive'
      })
    } finally {
      setLoadingVinculos(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await ApiService.updatePaciente(id, formData)
      toast({
        title: 'Sucesso',
        description: 'Paciente atualizado com sucesso!'
      })
      // Recarregar dados do paciente
      await loadPaciente()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAgendamentoSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const agendamentoData = {
        ...agendamentoForm,
        paciente_id: parseInt(id)
      }

      if (editingAgendamento) {
        await ApiService.updateAgendamento(editingAgendamento.id, agendamentoData)
        toast({
          title: 'Sucesso',
          description: 'Agendamento atualizado com sucesso!'
        })
      } else {
        await ApiService.createAgendamento(agendamentoData)
        toast({
          title: 'Sucesso',
          description: 'Agendamento criado com sucesso!'
        })
      }

      // Recarregar agendamentos e resetar formulário
      await loadAgendamentos()
      resetAgendamentoForm()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const resetAgendamentoForm = () => {
    setAgendamentoForm({
      data_hora: '',
      duracao_minutos: 60,
      observacoes: '',
      status: 'AGENDADO',
      presente: null,
      profissional_id: ''
    })
    setShowAgendamentoForm(false)
    setEditingAgendamento(null)
  }

  const handleVinculoSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const vinculoData = {
        ...vinculoForm,
        paciente_id: parseInt(id)
        // criado_por agora é obtido do token no backend
      }

      if (editingVinculo) {
        await ApiService.updateVinculo(editingVinculo.id, vinculoData)
        toast({
          title: 'Sucesso',
          description: 'Vínculo atualizado com sucesso!'
        })
      } else {
        await ApiService.createVinculo(vinculoData)
        toast({
          title: 'Sucesso',
          description: 'Vínculo criado com sucesso!'
        })
      }

      // Recarregar vínculos e resetar formulário
      await loadVinculos()
      resetVinculoForm()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const resetVinculoForm = () => {
    setVinculoForm({
      profissional_id: '',
      tipo_atendimento: '',
      data_inicio: new Date().toISOString().split('T')[0],
      frequencia_semanal: 2,
      duracao_sessao: 45,
      observacoes: ''
    })
    setShowVinculoForm(false)
    setEditingVinculo(null)
  }

  const handleEditVinculo = (vinculo) => {
    setEditingVinculo(vinculo)
    setVinculoForm({
      profissional_id: vinculo.profissional.id.toString(),
      tipo_atendimento: vinculo.tipo_atendimento,
      data_inicio: vinculo.data_inicio,
      frequencia_semanal: vinculo.frequencia_semanal,
      duracao_sessao: vinculo.duracao_sessao,
      observacoes: vinculo.observacoes || ''
    })
    setShowVinculoForm(true)
  }

  const handleDeleteVinculo = async (vinculoId) => {
    if (window.confirm('Tem certeza que deseja excluir este vínculo?')) {
      try {
        await ApiService.deleteVinculo(vinculoId)
        toast({
          title: 'Sucesso',
          description: 'Vínculo excluído com sucesso!'
        })
        await loadVinculos()
      } catch (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  const handleUpdateStatusVinculo = async (vinculoId, action) => {
    try {
      let actionFunction
      let successMessage

      switch (action) {
        case 'ativar':
          actionFunction = () => ApiService.ativarVinculo(vinculoId)
          successMessage = 'Vínculo ativado com sucesso!'
          break
        case 'suspender':
          actionFunction = () => ApiService.suspenderVinculo(vinculoId)
          successMessage = 'Vínculo suspenso com sucesso!'
          break
        case 'inativar':
          actionFunction = () => ApiService.inativarVinculo(vinculoId)
          successMessage = 'Vínculo inativado com sucesso!'
          break
        default:
          throw new Error('Ação inválida')
      }

      await actionFunction()
      toast({
        title: 'Sucesso',
        description: successMessage
      })
      await loadVinculos()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const handleEditAgendamento = (agendamento) => {
    setEditingAgendamento(agendamento)
    setAgendamentoForm({
      data_hora: agendamento.data_hora.slice(0, 16), // Remove seconds for datetime-local
      duracao_minutos: agendamento.duracao_minutos,
      observacoes: agendamento.observacoes || '',
      status: agendamento.status,
      presente: agendamento.presente,
      profissional_id: agendamento.profissional_id.toString()
    })
    setShowAgendamentoForm(true)
  }

  const handleDeleteAgendamento = async (agendamentoId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await ApiService.deleteAgendamento(agendamentoId)
        toast({
          title: 'Sucesso',
          description: 'Agendamento excluído com sucesso!'
        })
        await loadAgendamentos()
      } catch (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  const handleUpdateStatus = async (agendamentoId, newStatus) => {
    try {
      setUpdatingAgendamento(agendamentoId)
      // console.log('📊 Atualizando status:', { agendamentoId, newStatus, tipo: typeof newStatus })
      
      const resultado = await ApiService.updateStatusAgendamento(agendamentoId, newStatus)
      // console.log('✅ Status atualizado com sucesso:', resultado)
      
      const statusLabel = {
        'AGENDADO': 'Agendado',
        'CONFIRMADO': 'Confirmado', 
        'REALIZADO': 'Realizado',
        'CANCELADO': 'Cancelado',
        'FALTOU': 'Faltou'
      }[newStatus] || newStatus
      
      toast({
        title: 'Sucesso',
        description: `Status atualizado para: ${statusLabel}`
      })
      
      // Recarregar agendamentos para atualizar a UI
      await loadAgendamentos()
      // console.log('📊 Agendamentos recarregados')
    } catch (error) {
      // console.error('❌ Erro ao atualizar status:', error)
      toast({
        title: 'Erro',
        description: `Erro ao atualizar status: ${error.message}`,
        variant: 'destructive'
      })
    } finally {
      setUpdatingAgendamento(null)
    }
  }

  const handleUpdatePresenca = async (agendamentoId, presente) => {
    try {
      setUpdatingAgendamento(agendamentoId)
      // console.log('📋 Atualizando presença:', { agendamentoId, presente, tipo: typeof presente })
      
      const resultado = await ApiService.updatePresencaAgendamento(agendamentoId, presente)
      // console.log('✅ Presença atualizada com sucesso:', resultado)
      
      toast({
        title: 'Sucesso',
        description: `Presença atualizada para: ${presente === true ? 'Presente' : presente === false ? 'Ausente' : 'Não informado'}`
      })
      
      // Recarregar agendamentos para atualizar a UI
      await loadAgendamentos()
      // console.log('📊 Agendamentos recarregados')
    } catch (error) {
      // console.error('❌ Erro ao atualizar presença:', error)
      toast({
        title: 'Erro',
        description: `Erro ao atualizar presença: ${error.message}`,
        variant: 'destructive'
      })
    } finally {
      setUpdatingAgendamento(null)
    }
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

  const getDiagnosticoBadgeClass = (diagnostico) => {
    switch (diagnostico) {
      case 'TEA': return 'badge-info'
      case 'TDAH': return 'badge-warning'
      default: return 'badge-success'
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'AGENDADO': return 'outline'
      case 'CONFIRMADO': return 'default'
      case 'REALIZADO': return 'secondary'
      case 'CANCELADO': return 'destructive'
      case 'FALTOU': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'Não definido'
    const statusUpper = status.toUpperCase()
    switch (statusUpper) {
      case 'AGENDADO': return 'Agendado'
      case 'CONFIRMADO': return 'Confirmado'
      case 'REALIZADO': return 'Realizado'
      case 'CANCELADO': return 'Cancelado'
      case 'FALTOU': return 'Faltou'
      default: return status
    }
  }

  const getPresencaLabel = (presente) => {
    if (presente === true) return 'Presente'
    if (presente === false) return 'Ausente'
    return 'Não informado'
  }

  const getPresencaBadgeVariant = (presente) => {
    if (presente === true) return 'default'
    if (presente === false) return 'destructive'
    return 'outline'
  }

  const getStatusVinculoBadgeVariant = (status) => {
    switch (status) {
      case 'ATIVO': return 'default'
      case 'INATIVO': return 'secondary'
      case 'SUSPENSO': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusVinculoLabel = (status) => {
    switch (status) {
      case 'ATIVO': return 'Ativo'
      case 'INATIVO': return 'Inativo'
      case 'SUSPENSO': return 'Suspenso'
      default: return status
    }
  }

  const tiposAtendimento = [
    'Terapia ABA',
    'Psicologia',
    'Fonoaudiologia',
    'Terapia Ocupacional',
    'Fisioterapia',
    'Psicopedagogia',
    'Outro'
  ]

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const [ano, mes, dia] = dateString.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getAgendamentosDoDia = (date) => {
    if (!date) return []
    // Validar se a data pertence ao mês selecionado
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      return []
    }
    const chaveData = date.toISOString().split('T')[0]
    return agendamentosPorDia[chaveData] || []
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getDayClassName = (date, agendamentosDoDia) => {
    if (!date) return 'p-2 h-24 border border-gray-200 bg-gray-50'
    
    // Validar se pertence ao mês selecionado
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      return 'p-2 h-24 border border-gray-200 bg-gray-100 opacity-30'
    }
    
    const baseClass = 'p-2 h-24 border border-gray-200 cursor-pointer hover:bg-gray-50'
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return `${baseClass} bg-blue-50 border-blue-300`
    }
    
    if (agendamentosDoDia.length > 0) {
      return `${baseClass} bg-green-50 border-green-300`
    }
    
    return baseClass
  }

  if (loading) {
    return (
      <div className="center-flex py-12">
        <div className="text-lg animate-pulse text-gray-600">Carregando paciente...</div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="alert alert-warning">
        <AlertCircle className="alert-icon" />
        <div className="alert-content">
          <p>Paciente não encontrado</p>
          <Button onClick={() => navigate('/pacientes')} className="mt-2" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Pacientes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/pacientes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-title">{paciente.nome}</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAjudaOpen(true)}
            className="flex items-center gap-2"
            title="Ajuda"
          >
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </Button>
        </div>
        <p className="page-subtitle">
          <span className={`badge ${getDiagnosticoBadgeClass(paciente.diagnostico)}`}>
            {paciente.diagnostico}
          </span>
          <span className="ml-4">Idade: {calcularIdade(paciente.data_nascimento)}</span>
        </p>
      </div>

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="editar" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Editar Informações
          </TabsTrigger>
          <TabsTrigger value="vinculos" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Profissionais Vinculados
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="relatorio" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatório e Gráficos
          </TabsTrigger>
        </TabsList>

        {/* Aba de Edição */}
        <TabsContent value="editar">
          <div className="card-spacing">
            <div className="section-header mb-6">
              <User size={18} className="color-info-icon" />
              <h2 className="section-header-title">Editar Informações do Paciente</h2>
            </div>
            <p className="card-text mb-6">Atualize as informações pessoais do paciente</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-group">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="responsavel"
                      value={selectedResponsavel ? `${selectedResponsavel.nome} (${selectedResponsavel.email})` : formData.responsavel}
                      readOnly
                      className="bg-white"
                    />
                    <button type="button" className="h-9 px-3 rounded-md bg-white border border-gray-200 hover:bg-gray-50" onClick={() => setShowResponsavelModal(true)}>
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <Label htmlFor="contato">Contato</Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => setFormData({...formData, contato: e.target.value})}
                    placeholder="Telefone ou email"
                    required
                  />
                </div>
                <div className="form-group">
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

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/pacientes')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Aba de Vínculos */}
        <TabsContent value="vinculos">
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-header-title">Profissionais Vinculados</h2>
                <p className="card-text">Gerencie os vínculos terapêuticos de {paciente.nome}</p>
              </div>
              {canManageVinculos && (
                <Button 
                  onClick={() => setShowVinculoForm(true)}
                  style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Vínculo
                </Button>
              )}
            </div>

            {/* Formulário de Vínculo */}
            {showVinculoForm && canManageVinculos && (
              <div className="card-spacing animate-fade-in">
                <div className="section-header mb-6">
                  <Edit size={18} className="color-info-icon" />
                  <h3 className="section-header-title">
                    {editingVinculo ? 'Editar Vínculo' : 'Novo Vínculo'}
                  </h3>
                </div>
                <p className="card-text mb-6">
                  {editingVinculo 
                    ? 'Atualize as informações do vínculo terapêutico'
                    : 'Crie um novo vínculo entre o paciente e um profissional'
                  }
                </p>
                
                <form onSubmit={handleVinculoSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-group">
                      <Label htmlFor="profissional_id">Profissional</Label>
                      <Select 
                        value={vinculoForm.profissional_id} 
                        onValueChange={(value) => setVinculoForm({...vinculoForm, profissional_id: value})}
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
                    <div className="form-group">
                      <Label htmlFor="tipo_atendimento">Tipo de Atendimento</Label>
                      <Select 
                        value={vinculoForm.tipo_atendimento} 
                        onValueChange={(value) => setVinculoForm({...vinculoForm, tipo_atendimento: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposAtendimento.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label htmlFor="data_inicio">Data de Início</Label>
                      <Input
                        id="data_inicio"
                        type="date"
                        value={vinculoForm.data_inicio}
                        onChange={(e) => setVinculoForm({...vinculoForm, data_inicio: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="frequencia_semanal">Frequência Semanal</Label>
                      <Input
                        id="frequencia_semanal"
                        type="number"
                        min="1"
                        max="7"
                        value={vinculoForm.frequencia_semanal}
                        onChange={(e) => setVinculoForm({...vinculoForm, frequencia_semanal: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="duracao_sessao">Duração da Sessão (min)</Label>
                      <Input
                        id="duracao_sessao"
                        type="number"
                        min="15"
                        max="180"
                        step="15"
                        value={vinculoForm.duracao_sessao}
                        onChange={(e) => setVinculoForm({...vinculoForm, duracao_sessao: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="observacoes_vinculo">Observações</Label>
                    <Input
                      id="observacoes_vinculo"
                      value={vinculoForm.observacoes}
                      onChange={(e) => setVinculoForm({...vinculoForm, observacoes: e.target.value})}
                      placeholder="Observações sobre o atendimento (opcional)"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetVinculoForm}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving} style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingVinculo ? 'Atualizar' : 'Criar'} Vínculo
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de Vínculos */}
            <div className="card-spacing">
              <div className="section-header mb-6">
                <Users size={18} className="color-info-icon" />
                <h3 className="section-header-title">Vínculos Terapêuticos</h3>
              </div>
              <p className="card-text mb-6">Vínculos ativos e histórico do paciente</p>
              
              {loadingVinculos ? (
                <div className="center-flex py-12">
                  <div className="text-lg animate-pulse text-gray-600">Carregando vínculos...</div>
                </div>
              ) : (() => {
                const vinculosAtivos = vinculos.filter(v => v.status !== 'INATIVO')
                const vinculosInativos = vinculos.filter(v => v.status === 'INATIVO')
                
                return (
                  <>
                    {/* Seção de Vínculos Ativos/Suspensos */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-base mb-4 text-gray-700">Vínculos Ativos</h4>
                      {vinculosAtivos.length > 0 ? (
                        <div className="space-y-4">
                          {vinculosAtivos.map((vinculo) => (
                            <div key={vinculo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <h4 className="font-medium text-lg">{vinculo.profissional.nome}</h4>
                                    <span className={`badge badge-${vinculo.status === 'ATIVO' ? 'success' : vinculo.status === 'SUSPENSO' ? 'warning' : 'neutral'}`}>
                                      {getStatusVinculoLabel(vinculo.status)}
                                    </span>
                                    <span className="badge badge-info">{vinculo.tipo_atendimento}</span>
                                  </div>
                                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                                    <p className="card-text"><strong>Especialidade:</strong> {vinculo.profissional.especialidade}</p>
                                    <p className="card-text"><strong>Contato:</strong> {vinculo.profissional.telefone}</p>
                                    <p className="card-text"><strong>Início:</strong> {formatDate(vinculo.data_inicio)}</p>
                                    {vinculo.data_fim && (
                                      <p className="card-text"><strong>Fim:</strong> {formatDate(vinculo.data_fim)}</p>
                                    )}
                                    <p className="card-text"><strong>Frequência:</strong> {vinculo.frequencia_semanal}x/semana</p>
                                    <p className="card-text"><strong>Duração:</strong> {vinculo.duracao_sessao} min</p>
                                    {vinculo.observacoes && (
                                      <p className="card-text md:col-span-2"><strong>Obs:</strong> {vinculo.observacoes}</p>
                                    )}
                                  </div>
                                </div>
                                {canManageVinculos && (
                                  <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditVinculo(vinculo)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    {vinculo.status === 'ATIVO' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleUpdateStatusVinculo(vinculo.id, 'suspender')}
                                        >
                                          Suspender
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleUpdateStatusVinculo(vinculo.id, 'inativar')}
                                        >
                                          Inativar
                                        </Button>
                                      </>
                                    )}
                                    {vinculo.status === 'SUSPENSO' && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatusVinculo(vinculo.id, 'ativar')}
                                      >
                                        Ativar
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteVinculo(vinculo.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          <Users className="alert-icon" />
                          <div className="alert-content">
                            <p>Nenhum vínculo ativo ou suspenso para este paciente.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seção de Histórico de Vínculos Inativos */}
                    {vinculosInativos.length > 0 && (
                      <div className="border-t pt-8">
                        <h4 className="font-semibold text-base mb-4 text-gray-700 flex items-center gap-2">
                          <span className="text-gray-400">📋</span>
                          Histórico - Profissionais Inativos
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">Profissionais que deixaram de atender este paciente</p>
                        <div className="space-y-4">
                          {vinculosInativos.map((vinculo) => (
                            <div key={vinculo.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-sm transition-shadow opacity-75">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <h4 className="font-medium text-lg text-gray-600">{vinculo.profissional.nome}</h4>
                                    <span className="badge badge-neutral">
                                      {getStatusVinculoLabel(vinculo.status)}
                                    </span>
                                    <span className="badge badge-info text-xs">{vinculo.tipo_atendimento}</span>
                                  </div>
                                  <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600">
                                    <p className="card-text"><strong>Especialidade:</strong> {vinculo.profissional.especialidade}</p>
                                    <p className="card-text"><strong>Contato:</strong> {vinculo.profissional.telefone}</p>
                                    <p className="card-text"><strong>Início:</strong> {formatDate(vinculo.data_inicio)}</p>
                                    {vinculo.data_fim && (
                                      <p className="card-text"><strong>Fim:</strong> {formatDate(vinculo.data_fim)}</p>
                                    )}
                                    <p className="card-text"><strong>Frequência:</strong> {vinculo.frequencia_semanal}x/semana</p>
                                    <p className="card-text"><strong>Duração:</strong> {vinculo.duracao_sessao} min</p>
                                    {vinculo.observacoes && (
                                      <p className="card-text md:col-span-2"><strong>Obs:</strong> {vinculo.observacoes}</p>
                                    )}
                                  </div>
                                </div>
                                {canManageVinculos && (
                                  <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUpdateStatusVinculo(vinculo.id, 'ativar')}
                                    >
                                      Reativar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteVinculo(vinculo.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nenhum vínculo */}
                    {vinculosAtivos.length === 0 && vinculosInativos.length === 0 && (
                      <div className="alert alert-info">
                        <Users className="alert-icon" />
                        <div className="alert-content">
                          <p>Nenhum vínculo encontrado para este paciente.</p>
                          {canManageVinculos && (
                            <Button 
                              onClick={() => setShowVinculoForm(true)}
                              className="mt-3"
                              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Primeiro Vínculo
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </TabsContent>

        {/* Aba de Agenda */}
        <TabsContent value="agenda">
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-header-title">Agenda do Paciente</h2>
                <p className="card-text">Gerencie os agendamentos de {paciente.nome}</p>
              </div>
              {canModifyAgenda && (
                <Button 
                  onClick={() => setShowAgendamentoForm(true)}
                  style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              )}
            </div>

            {/* Formulário de Agendamento */}
            {showAgendamentoForm && canModifyAgenda && (
              <div className="card-spacing animate-fade-in">
                <div className="section-header mb-6">
                  <Calendar size={18} className="color-info-icon" />
                  <h3 className="section-header-title">
                    {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
                  </h3>
                </div>
                <p className="card-text mb-6">
                  {editingAgendamento 
                    ? 'Atualize as informações do agendamento'
                    : 'Crie um novo agendamento para o paciente'
                  }
                </p>
                
                <form onSubmit={handleAgendamentoSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="form-group">
                      <Label htmlFor="data_hora">Data e Hora</Label>
                      <Input
                        id="data_hora"
                        type="datetime-local"
                        value={agendamentoForm.data_hora}
                        onChange={(e) => setAgendamentoForm({...agendamentoForm, data_hora: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="duracao_minutos">Duração (minutos)</Label>
                      <Input
                        id="duracao_minutos"
                        type="number"
                        min="15"
                        max="480"
                        step="15"
                        value={agendamentoForm.duracao_minutos}
                        onChange={(e) => setAgendamentoForm({...agendamentoForm, duracao_minutos: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="profissional_id">Profissional</Label>
                          <Select 
                        value={agendamentoForm.profissional_id} 
                        onValueChange={(value) => setAgendamentoForm({...agendamentoForm, profissional_id: value})}
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
                    <div className="form-group">
                      <Label htmlFor="status">Status</Label>
                          <Select 
                        value={agendamentoForm.status} 
                        onValueChange={(value) => setAgendamentoForm({...agendamentoForm, status: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AGENDADO">Agendado</SelectItem>
                          <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                          <SelectItem value="REALIZADO">Realizado</SelectItem>
                          <SelectItem value="CANCELADO">Cancelado</SelectItem>
                          <SelectItem value="FALTOU">Faltou</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label htmlFor="presente">Presença</Label>
                      <Select 
                        value={agendamentoForm.presente === null ? 'null' : agendamentoForm.presente.toString()} 
                        onValueChange={(value) => {
                          const presenteValue = value === 'null' ? null : value === 'true'
                          setAgendamentoForm({...agendamentoForm, presente: presenteValue})
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a presença" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">Não informado</SelectItem>
                          <SelectItem value="true">Presente</SelectItem>
                          <SelectItem value="false">Ausente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-group">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Input
                      id="observacoes"
                      value={agendamentoForm.observacoes}
                      onChange={(e) => setAgendamentoForm({...agendamentoForm, observacoes: e.target.value})}
                      placeholder="Observações sobre o agendamento (opcional)"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetAgendamentoForm}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving} style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingAgendamento ? 'Atualizar' : 'Criar'} Agendamento
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Calendário */}
            <div className="card-spacing">
              <div className="section-header">
                <Calendar size={18} className="color-info-icon" />
                <h3 className="section-header-title">Calendário de Agendamentos</h3>
              </div>
              <p className="card-text mb-6">Visualize os agendamentos por mês</p>
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{borderColor: 'var(--color-neutral-200)'}}>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="h-8 w-8 p-0"
                  >
                    ←
                  </Button>
                  <span className="font-semibold min-w-[140px] text-center" style={{color: 'var(--color-neutral-900)'}}>
                    {currentDate.toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric' 
                    }).charAt(0).toUpperCase() + currentDate.toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric' 
                    }).slice(1)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="h-8 w-8 p-0"
                  >
                    →
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {/* Cabeçalho dos dias da semana */}
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-xs rounded-lg" style={{backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)'}}>
                    {day}
                  </div>
                ))}
                
                {/* Dias do calendário */}
                {getDaysInMonth(currentDate).map((date, index) => {
                  const agendamentosDoDia = getAgendamentosDoDia(date)
                  return (
                    <div key={index} className={getDayClassName(date, agendamentosDoDia)}>
                      {date && (
                        <>
                          <div className="text-sm font-semibold mb-2" style={{color: 'var(--color-neutral-900)'}}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {agendamentosDoDia.slice(0, 2).map(agendamento => (
                              <div
                                key={agendamento.id}
                                className="text-xs p-2 rounded font-medium truncate" 
                                style={{backgroundColor: 'var(--color-info-100)', color: 'var(--color-info-900)'}}
                                title={`${formatTime(agendamento.data_hora)} - ${agendamento.profissional?.nome}`}
                              >
                                {formatTime(agendamento.data_hora)}
                              </div>
                            ))}
                            {agendamentosDoDia.length > 2 && (
                              <div className="text-xs font-medium" style={{color: 'var(--color-neutral-600)'}}>
                                +{agendamentosDoDia.length - 2} mais
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lista de Agendamentos */}
            <div className="card-spacing">
              <div className="section-header">
                <List size={18} className="color-info-icon" />
                <h3 className="section-header-title">Lista de Agendamentos - {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).slice(1)}</h3>
              </div>
              <p className="card-text mb-6">Agendamentos do mês selecionado</p>

              {loadingAgendamentos ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
                  <p className="mt-4 card-text font-medium">Carregando agendamentos...</p>
                </div>
              ) : (() => {
                // Filtrar agendamentos apenas do mês/ano selecionado
                const agendamentosMes = agendamentos.filter(agend => {
                  const dataAgend = new Date(agend.data_hora)
                  return dataAgend.getMonth() === currentDate.getMonth() && 
                         dataAgend.getFullYear() === currentDate.getFullYear()
                })
                return agendamentosMes.length > 0 ? (
                <div className="space-y-3">
                  {agendamentosMes.map((agendamento) => (
                    <div 
                      key={agendamento.id} 
                      className="border rounded-lg p-4 hover:bg-opacity-50 transition-all"
                      style={{borderColor: 'var(--color-neutral-200)', backgroundColor: 'rgba(15, 165, 233, 0.02)'}}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-64">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h4 className="font-semibold text-sm" style={{color: 'var(--color-neutral-900)'}}>
                              {formatDateTime(agendamento.data_hora)}
                            </h4>
                            <span className={`badge badge-sm ${
                              (agendamento.status || '').toUpperCase() === 'REALIZADO' ? 'badge-success' :
                              (agendamento.status || '').toUpperCase() === 'CANCELADO' ? 'badge-error' :
                              (agendamento.status || '').toUpperCase() === 'CONFIRMADO' ? 'badge-info' :
                              (agendamento.status || '').toUpperCase() === 'FALTOU' ? 'badge-warning' :
                              'badge-neutral'
                            }`}>
                              {getStatusLabel(agendamento.status)}
                            </span>
                            <span className={`badge badge-sm ${
                              agendamento.presente === true ? 'badge-success' :
                              agendamento.presente === false ? 'badge-error' :
                              'badge-neutral'
                            }`}>
                              {getPresencaLabel(agendamento.presente)}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium" style={{color: 'var(--color-neutral-600)'}}>
                              <Clock size={14} />
                              {agendamento.duracao_minutos} min
                            </div>
                          </div>
                          <div className="text-sm space-y-1" style={{color: 'var(--color-neutral-700)'}}>
                            <p><strong>Profissional:</strong> {agendamento.profissional?.nome} - {agendamento.profissional?.especialidade}</p>
                            {agendamento.observacoes && (
                              <p><strong>Observações:</strong> {agendamento.observacoes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Select 
                            key={`status-${agendamento.id}-${agendamento.status}`}
                            value={(agendamento.status || 'AGENDADO').toUpperCase()}
                            defaultValue={(agendamento.status || 'AGENDADO').toUpperCase()}
                            onValueChange={(value) => {
                              // console.log('📝 Mudando status de', agendamento.status, 'para', value)
                              handleUpdateStatus(agendamento.id, value)
                            }}
                            disabled={!canModifyAgenda || updatingAgendamento === agendamento.id}
                          >
                            <SelectTrigger className="w-32 h-9 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AGENDADO">Agendado</SelectItem>
                              <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                              <SelectItem value="REALIZADO">Realizado</SelectItem>
                              <SelectItem value="CANCELADO">Cancelado</SelectItem>
                              <SelectItem value="FALTOU">Faltou</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select 
                            key={`presenca-${agendamento.id}-${agendamento.presente}`}
                            value={agendamento.presente === null ? 'null' : agendamento.presente.toString()}
                            defaultValue={agendamento.presente === null ? 'null' : agendamento.presente.toString()}
                            onValueChange={(value) => {
                              // console.log('📝 Mudando presença de', agendamento.presente, 'para', value)
                              const presenteValue = value === 'null' ? null : value === 'true'
                              handleUpdatePresenca(agendamento.id, presenteValue)
                            }}
                            disabled={!canModifyAgenda || updatingAgendamento === agendamento.id}
                          >
                            <SelectTrigger className="w-32 h-9 text-xs">
                              <SelectValue placeholder="Presença" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="null">Não informado</SelectItem>
                              <SelectItem value="true">Presente</SelectItem>
                              <SelectItem value="false">Ausente</SelectItem>
                            </SelectContent>
                          </Select>
                          {canModifyAgenda && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAgendamento(agendamento)}
                            className="h-9 w-9 p-0"
                          >
                            <Edit size={16} />
                          </Button>
                          )}
                          {canModifyAgenda && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAgendamento(agendamento.id)}
                            className="h-9 w-9 p-0"
                          >
                            <Trash2 size={16} />
                          </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">
                  <AlertCircle size={18} />
                  <div className="alert-content">
                    <p className="font-medium mb-2">Nenhum agendamento encontrado</p>
                    <p className="text-sm mb-3">Nenhum agendamento registrado para {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.</p>
                    {canModifyAgenda && (
                      <Button 
                        onClick={() => setShowAgendamentoForm(true)}
                        size="sm"
                        style={{ backgroundColor: '#0ea5e9', color: 'white' }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Agendamento
                      </Button>
                    )}
                  </div>
                </div>
              )
              })()}
            </div>
          </div>
        </TabsContent>

        {/* Aba de Relatório */}
        <TabsContent value="relatorio">
          <PacienteRelatorio
            paciente={paciente}
            relatorioPaciente={relatorioPaciente}
            agendamentos={agendamentos}
            loadingRelatorio={loadingRelatorio}
            formatDate={formatDate}
            calcularIdade={calcularIdade}
          />
          <div className="mt-6">
            <AssistenteIA 
              pacienteId={paciente?.id} 
              relatorioPaciente={relatorioPaciente}
              agendamentos={agendamentos}
              formatDate={formatDate}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Seleção de Responsável */}
      {showResponsavelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Selecionar Responsável</h2>
              <p className="text-sm text-gray-600 mt-1">Busque e selecione um usuário para atribuir como responsável</p>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Busque por nome ou email..."
                  value={usuariosQuery}
                  onChange={(e) => setUsuariosQuery(e.target.value)}
                  className="flex-1"
                />
                <button
                  onClick={async () => {
                    if (usuariosQuery.trim()) {
                      try {
                        setLoadingUsuarios(true)
                        const results = await ApiService.getUsuarios(usuariosQuery)
                        setUsuarios(results)
                      } catch (error) {
                        toast({
                          title: 'Erro',
                          description: 'Erro ao buscar usuários: ' + error.message,
                          variant: 'destructive'
                        })
                      } finally {
                        setLoadingUsuarios(false)
                      }
                    }
                  }}
                  className="h-10 px-4 bg-[#0ea5e9] text-white rounded-lg hover:bg-blue-600"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingUsuarios ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : usuarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
              ) : (
                usuarios.map((u) => (
                  <button
                    key={u.id}
                    onClick={async () => {
                      try {
                        await ApiService.assignUsuarioToPaciente(u.id, id)
                        setSelectedResponsavel(u)
                        setFormData({...formData, responsavel: u.nome})
                        setShowResponsavelModal(false)
                        setUsuarios([])
                        setUsuariosQuery('')
                        toast({
                          title: 'Sucesso',
                          description: `${u.nome} foi atribuído como responsável`
                        })
                      } catch (error) {
                        toast({
                          title: 'Erro',
                          description: 'Erro ao atribuir responsável: ' + error.message,
                          variant: 'destructive'
                        })
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{u.nome}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                    <div className="text-xs text-gray-500">Tipo: {u.tipo_usuario}</div>
                  </button>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowResponsavelModal(false)
                  setUsuarios([])
                  setUsuariosQuery('')
                }}
                className="h-9 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <PacienteDetalhesAjuda open={ajudaOpen} onOpenChange={setAjudaOpen} />
    </div>
  )
}