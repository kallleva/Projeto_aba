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
  Mail
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
  const [loading, setLoading] = useState(true)
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'editar')
  
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    responsavel: '',
    contato: '',
    diagnostico: ''
  })

  useEffect(() => {
    if (id) {
      loadPaciente()
      loadRelatorioPaciente()
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
