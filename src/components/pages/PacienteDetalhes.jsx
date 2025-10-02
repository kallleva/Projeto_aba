import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
  Clock
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function PacienteDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  
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
  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    responsavel: '',
    contato: '',
    diagnostico: ''
  })

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
      loadProfissionais()
      loadVinculos()
    }
  }, [id])

  const loadPaciente = async () => {
    try {
      setLoading(true)
      const pacientes = await ApiService.getPacientes()
      const pacienteEncontrado = pacientes.find(p => p.id.toString() === id)
      
      if (pacienteEncontrado) {
        setPaciente(pacienteEncontrado)
        setFormData({
          nome: pacienteEncontrado.nome,
          data_nascimento: pacienteEncontrado.data_nascimento,
          responsavel: pacienteEncontrado.responsavel,
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
      toast({
        title: 'Erro',
        description: 'Erro ao carregar paciente: ' + error.message,
        variant: 'destructive'
      })
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
        paciente_id: parseInt(id),
        criado_por: 1 // TODO: pegar do contexto de autenticação
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
      console.log('Atualizando status:', { agendamentoId, newStatus })
      await ApiService.updateStatusAgendamento(agendamentoId, newStatus)
      toast({
        title: 'Sucesso',
        description: 'Status do agendamento atualizado!'
      })
      await loadAgendamentos()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
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
      console.log('Atualizando presença:', { agendamentoId, presente })
      await ApiService.updatePresencaAgendamento(agendamentoId, presente)
      toast({
        title: 'Sucesso',
        description: 'Presença atualizada!'
      })
      await loadAgendamentos()
    } catch (error) {
      console.error('Erro ao atualizar presença:', error)
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
    switch (status) {
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
    return new Date(dateString).toLocaleDateString('pt-BR')
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando paciente...</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Paciente não encontrado</p>
        <Button onClick={() => navigate('/pacientes')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Pacientes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/pacientes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{paciente.nome}</h2>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={getDiagnosticoBadgeVariant(paciente.diagnostico)}>
                {paciente.diagnostico}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {calcularIdade(paciente.data_nascimento)}
              </span>
            </div>
          </div>
        </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Editar Informações do Paciente</CardTitle>
              <CardDescription>
                Atualize as informações pessoais do paciente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Contato</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => setFormData({...formData, contato: e.target.value})}
                      placeholder="Telefone ou email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/pacientes')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Vínculos */}
        <TabsContent value="vinculos">
          <div className="space-y-4">
            {/* Cabeçalho dos Vínculos */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Profissionais Vinculados</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie os vínculos terapêuticos de {paciente.nome}
                </p>
              </div>
              <Button 
                onClick={() => setShowVinculoForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Vínculo
              </Button>
            </div>

            {/* Formulário de Vínculo */}
            {showVinculoForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingVinculo ? 'Editar Vínculo' : 'Novo Vínculo'}
                  </CardTitle>
                  <CardDescription>
                    {editingVinculo 
                      ? 'Atualize as informações do vínculo terapêutico'
                      : 'Crie um novo vínculo entre o paciente e um profissional'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVinculoSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label htmlFor="data_inicio">Data de Início</Label>
                        <Input
                          id="data_inicio"
                          type="date"
                          value={vinculoForm.data_inicio}
                          onChange={(e) => setVinculoForm({...vinculoForm, data_inicio: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="observacoes_vinculo">Observações</Label>
                      <Input
                        id="observacoes_vinculo"
                        value={vinculoForm.observacoes}
                        onChange={(e) => setVinculoForm({...vinculoForm, observacoes: e.target.value})}
                        placeholder="Observações sobre o atendimento (opcional)"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetVinculoForm}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={saving}>
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
                </CardContent>
              </Card>
            )}

            {/* Lista de Vínculos */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Vínculos</CardTitle>
                <CardDescription>
                  Vínculos terapêuticos ativos e histórico do paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingVinculos ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando vínculos...</p>
                  </div>
                ) : vinculos.length > 0 ? (
                  <div className="space-y-4">
                    {vinculos.map((vinculo) => (
                      <div key={vinculo.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-medium text-lg">
                                {vinculo.profissional.nome}
                              </h4>
                              <Badge variant={getStatusVinculoBadgeVariant(vinculo.status)}>
                                {getStatusVinculoLabel(vinculo.status)}
                              </Badge>
                              <Badge variant="outline">
                                {vinculo.tipo_atendimento}
                              </Badge>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                              <p><strong>Especialidade:</strong> {vinculo.profissional.especialidade}</p>
                              <p><strong>Contato:</strong> {vinculo.profissional.telefone}</p>
                              <p><strong>Data de Início:</strong> {formatDate(vinculo.data_inicio)}</p>
                              {vinculo.data_fim && (
                                <p><strong>Data de Fim:</strong> {formatDate(vinculo.data_fim)}</p>
                              )}
                              <p><strong>Frequência:</strong> {vinculo.frequencia_semanal}x por semana</p>
                              <p><strong>Duração:</strong> {vinculo.duracao_sessao} minutos</p>
                              {vinculo.observacoes && (
                                <p className="md:col-span-2"><strong>Observações:</strong> {vinculo.observacoes}</p>
                              )}
                            </div>
                          </div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum vínculo encontrado para este paciente.</p>
                    <Button 
                      onClick={() => setShowVinculoForm(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Vínculo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Agenda */}
        <TabsContent value="agenda">
          <div className="space-y-4">
            {/* Cabeçalho da Agenda */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Agenda do Paciente</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie os agendamentos de {paciente.nome}
                </p>
              </div>
              <Button 
                onClick={() => setShowAgendamentoForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </div>

            {/* Formulário de Agendamento */}
            {showAgendamentoForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
                  </CardTitle>
                  <CardDescription>
                    {editingAgendamento 
                      ? 'Atualize as informações do agendamento'
                      : 'Crie um novo agendamento para o paciente'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAgendamentoSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="data_hora">Data e Hora</Label>
                        <Input
                          id="data_hora"
                          type="datetime-local"
                          value={agendamentoForm.data_hora}
                          onChange={(e) => setAgendamentoForm({...agendamentoForm, data_hora: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Input
                        id="observacoes"
                        value={agendamentoForm.observacoes}
                        onChange={(e) => setAgendamentoForm({...agendamentoForm, observacoes: e.target.value})}
                        placeholder="Observações sobre o agendamento (opcional)"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetAgendamentoForm}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={saving}>
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
                </CardContent>
              </Card>
            )}

            {/* Calendário */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calendário de Agendamentos</CardTitle>
                    <CardDescription>
                      Visualize os agendamentos por mês
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth(-1)}
                    >
                      ←
                    </Button>
                    <span className="font-medium min-w-[120px] text-center">
                      {currentDate.toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth(1)}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {/* Cabeçalho dos dias da semana */}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="p-2 text-center font-medium text-sm bg-gray-100">
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
                            <div className="text-sm font-medium mb-1">
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {agendamentosDoDia.slice(0, 2).map(agendamento => (
                                <div
                                  key={agendamento.id}
                                  className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                                  title={`${formatTime(agendamento.data_hora)} - ${agendamento.profissional?.nome}`}
                                >
                                  {formatTime(agendamento.data_hora)}
                                </div>
                              ))}
                              {agendamentosDoDia.length > 2 && (
                                <div className="text-xs text-gray-500">
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
              </CardContent>
            </Card>

            {/* Lista de Agendamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Agendamentos</CardTitle>
                <CardDescription>
                  Lista detalhada de todos os agendamentos do paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAgendamentos ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando agendamentos...</p>
                  </div>
                ) : agendamentos.length > 0 ? (
                  <div className="space-y-4">
                    {agendamentos.map((agendamento) => (
                      <div key={agendamento.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-medium">
                                {formatDateTime(agendamento.data_hora)}
                              </h4>
                              <Badge variant={getStatusBadgeVariant(agendamento.status)}>
                                {getStatusLabel(agendamento.status)}
                              </Badge>
                              <Badge variant={getPresencaBadgeVariant(agendamento.presente)}>
                                {getPresencaLabel(agendamento.presente)}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {agendamento.duracao_minutos} min
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p><strong>Profissional:</strong> {agendamento.profissional?.nome} - {agendamento.profissional?.especialidade}</p>
                              {agendamento.observacoes && (
                                <p><strong>Observações:</strong> {agendamento.observacoes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select 
                              value={agendamento.status} 
                              onValueChange={(value) => handleUpdateStatus(agendamento.id, value)}
                              disabled={updatingAgendamento === agendamento.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                                {updatingAgendamento === agendamento.id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
                                )}
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
                              value={agendamento.presente === null ? 'null' : agendamento.presente.toString()} 
                              onValueChange={(value) => {
                                const presenteValue = value === 'null' ? null : value === 'true'
                                handleUpdatePresenca(agendamento.id, presenteValue)
                              }}
                              disabled={updatingAgendamento === agendamento.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                                {updatingAgendamento === agendamento.id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2"></div>
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="null">Não informado</SelectItem>
                                <SelectItem value="true">Presente</SelectItem>
                                <SelectItem value="false">Ausente</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAgendamento(agendamento)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAgendamento(agendamento.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum agendamento encontrado para este paciente.</p>
                    <Button 
                      onClick={() => setShowAgendamentoForm(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Agendamento
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Relatório */}
        <TabsContent value="relatorio">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório do Paciente: {paciente.nome}</CardTitle>
                <CardDescription>
                  Diagnóstico: {paciente.diagnostico} | Idade: {calcularIdade(paciente.data_nascimento)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRelatorio ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando relatório...</p>
                  </div>
                ) : relatorioPaciente ? (
                  <div className="space-y-6">
                    {/* Cards de Resumo */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
                          <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{relatorioPaciente.resumo.total_metas}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{relatorioPaciente.resumo.metas_concluidas}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Média Últimos 30 Dias</CardTitle>
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{relatorioPaciente.resumo.media_notas_recentes}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Gráficos de Evolução por Meta */}
                    {Object.keys(relatorioPaciente.evolucao_por_meta).length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Evolução por Meta (Últimos 30 dias)</CardTitle>
                          <CardDescription>
                            Progresso do paciente em cada meta terapêutica
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {Object.entries(relatorioPaciente.evolucao_por_meta).map(([metaId, dados]) => (
                            <div key={metaId} className="mb-6">
                              <h4 className="font-medium mb-4 text-lg">{dados.meta_descricao}</h4>
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dados.registros}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                    dataKey="data" 
                                    tickFormatter={formatDate}
                                  />
                                  <YAxis domain={[1, 5]} />
                                  <Tooltip 
                                    labelFormatter={formatDate}
                                    formatter={(value) => [value, 'Nota']}
                                  />
                                  <Legend />
                                  <Line 
                                    type="monotone" 
                                    dataKey="nota" 
                                    stroke="#8884d8" 
                                    strokeWidth={2}
                                    dot={{ fill: '#8884d8' }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Informações Adicionais */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações do Paciente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium">Responsável</Label>
                              <p className="text-sm text-muted-foreground">{paciente.responsavel}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium">Contato</Label>
                              <p className="text-sm text-muted-foreground">{paciente.contato}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium">Data de Nascimento</Label>
                              <p className="text-sm text-muted-foreground">{formatDate(paciente.data_nascimento)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <Label className="text-sm font-medium">Registros nos Últimos 30 Dias</Label>
                              <p className="text-sm text-muted-foreground">{relatorioPaciente.resumo.registros_ultimos_30_dias}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum dado de relatório disponível para este paciente.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
