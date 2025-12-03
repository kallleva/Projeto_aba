import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import ApiService from '@/lib/api'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Relatorios() {
  const [loading, setLoading] = useState(true)
  const [dadosDashboard, setDadosDashboard] = useState(null)
  const [evolucaoMeta, setEvolucaoMeta] = useState(null)
  const [relatorioPaciente, setRelatorioPaciente] = useState(null)
  const [relatorioProfissional, setRelatorioProfissional] = useState(null)
  const [relatorioPeriodo, setRelatorioPeriodo] = useState(null)
  const [formulasMeta, setFormulasMeta] = useState(null)
  const [evolucaoFormula, setEvolucaoFormula] = useState(null)
  
  // Estados para filtros
  const [metasDisponiveis, setMetasDisponiveis] = useState([])
  const [pacientesDisponiveis, setPacientesDisponiveis] = useState([])
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState([])
  
  const [filtros, setFiltros] = useState({
    metaId: '',
    pacienteId: '',
    profissionalId: '',
    dataInicio: '',
    dataFim: '',
    periodoInicio: '',
    periodoFim: '',
    formulaMetaId: '',
    formulaDataInicio: '',
    formulaDataFim: '',
    perguntaId: '',
    evolucaoDataInicio: '',
    evolucaoDataFim: ''
  })
  
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadInitialData()
  }, [user])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [dashboardData, metasData, pacientesData, profissionaisData] = await Promise.all([
        ApiService.getDadosDashboard(),
        ApiService.getMetasTerapeuticas(),
        ApiService.getPacientes(),
        ApiService.getProfissionais()
      ])
      
      // Se for responsável, filtrar apenas seus pacientes
      let pacientesFiltered = pacientesData
      if (user?.tipo_usuario === 'RESPONSAVEL') {
        pacientesFiltered = pacientesData.filter(p => p.responsavel_usuario?.id === user.id)
      }
      
      setDadosDashboard(dashboardData)
      setMetasDisponiveis(metasData)
      setPacientesDisponiveis(pacientesFiltered)
      setProfissionaisDisponiveis(profissionaisData)
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

  const handleBuscarEvolucaoMeta = async () => {
    if (!filtros.metaId) {
      toast({
        title: 'Atenção',
        description: 'Selecione uma meta para visualizar a evolução',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getEvolucaoMeta(
        filtros.metaId,
        filtros.dataInicio,
        filtros.dataFim
      )
      setEvolucaoMeta(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar evolução da meta: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const handleBuscarRelatorioPaciente = async () => {
    if (!filtros.pacienteId) {
      toast({
        title: 'Atenção',
        description: 'Selecione um paciente para gerar o relatório',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getRelatorioPaciente(filtros.pacienteId)
      setRelatorioPaciente(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar relatório do paciente: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const handleBuscarRelatorioProfissional = async () => {
    if (!filtros.profissionalId) {
      toast({
        title: 'Atenção',
        description: 'Selecione um profissional para gerar o relatório',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getRelatorioProfissional(filtros.profissionalId)
      setRelatorioProfissional(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar relatório do profissional: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const handleBuscarRelatorioPeriodo = async () => {
    if (!filtros.periodoInicio || !filtros.periodoFim) {
      toast({
        title: 'Atenção',
        description: 'Selecione o período para gerar o relatório',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getRelatorioPeriodo(
        filtros.periodoInicio,
        filtros.periodoFim
      )
      setRelatorioPeriodo(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar relatório do período: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const handleBuscarFormulasMeta = async () => {
    if (!filtros.formulaMetaId) {
      toast({
        title: 'Atenção',
        description: 'Selecione uma meta para visualizar as fórmulas',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getFormulasMeta(
        filtros.formulaMetaId,
        filtros.formulaDataInicio,
        filtros.formulaDataFim
      )
      setFormulasMeta(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar fórmulas da meta: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const handleBuscarEvolucaoFormula = async () => {
    if (!filtros.perguntaId) {
      toast({
        title: 'Atenção',
        description: 'Selecione uma pergunta para visualizar a evolução da fórmula',
        variant: 'destructive'
      })
      return
    }

    try {
      const data = await ApiService.getEvolucaoFormula(
        filtros.perguntaId,
        filtros.evolucaoDataInicio,
        filtros.evolucaoDataFim
      )
      setEvolucaoFormula(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao buscar evolução da fórmula: ' + error.message,
        variant: 'destructive'
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const [ano, mes, dia] = dateString.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">
          Visualize relatórios e gráficos de progresso
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução de Meta</TabsTrigger>
          <TabsTrigger value="paciente">Relatório de Paciente</TabsTrigger>
          <TabsTrigger value="profissional">Relatório de Profissional</TabsTrigger>
          <TabsTrigger value="periodo">Relatório por Período</TabsTrigger>
          <TabsTrigger value="formulas">Fórmulas por Meta</TabsTrigger>
          <TabsTrigger value="evolucao-formula">Evolução de Fórmula</TabsTrigger>
        </TabsList>

        {/* Dashboard Geral */}
        <TabsContent value="dashboard" className="space-y-4">
          {dadosDashboard && (
            <>
              {/* Cards de resumo */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dadosDashboard.resumo.total_pacientes}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dadosDashboard.resumo.total_profissionais}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dadosDashboard.resumo.total_metas_ativas}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Registros Hoje</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dadosDashboard.resumo.registros_hoje}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Distribuição por Diagnóstico */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Diagnóstico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dadosDashboard.distribuicao_diagnosticos}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ diagnostico, count }) => `${diagnostico}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {dadosDashboard.distribuicao_diagnosticos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Status das Metas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status das Metas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dadosDashboard.distribuicao_metas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Evolução de Meta */}
        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Evolução de Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Meta</Label>
                  <Select 
                    value={filtros.metaId} 
                    onValueChange={(value) => setFiltros({...filtros, metaId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a meta" />
                    </SelectTrigger>
                    <SelectContent>
                      {metasDisponiveis.map((meta) => (
                        <SelectItem key={meta.id} value={meta.id.toString()}>
                          {meta.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarEvolucaoMeta} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {evolucaoMeta && (
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Meta</CardTitle>
                <CardDescription>
                  Progresso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{evolucaoMeta.estatisticas.total_registros}</div>
                    <div className="text-sm text-muted-foreground">Total de Registros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{evolucaoMeta.estatisticas.nota_media}</div>
                    <div className="text-sm text-muted-foreground">Nota Média</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{evolucaoMeta.estatisticas.nota_maxima}</div>
                    <div className="text-sm text-muted-foreground">Nota Máxima</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{evolucaoMeta.estatisticas.nota_minima}</div>
                    <div className="text-sm text-muted-foreground">Nota Mínima</div>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={evolucaoMeta.evolucao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="data" 
                      tickFormatter={formatDate}
                    />
                    <YAxis domain={[1, 5]} />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={(value, name) => {
                        if (name === 'nota') return [value, 'Nota']
                        return [value, name]
                      }}
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

                {/* Exibir fórmulas calculadas se disponíveis */}
                {evolucaoMeta.evolucao.some(item => item.formulas_calculadas && item.formulas_calculadas.length > 0) && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Fórmulas Calculadas</h4>
                    {evolucaoMeta.evolucao.map((item, index) => (
                      item.formulas_calculadas && item.formulas_calculadas.length > 0 && (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">
                            {formatDate(item.data)}
                          </div>
                          <div className="grid gap-2">
                            {item.formulas_calculadas.map((formula, formulaIndex) => (
                              <div key={formulaIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div>
                                  <div className="font-medium">{formula.pergunta_texto}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Fórmula: {formula.formula}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg">{formula.valor_calculado}</div>
                                  {formula.valor_numerico && (
                                    <div className="text-sm text-muted-foreground">
                                      Valor: {formula.valor_numerico}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatório de Paciente */}
        <TabsContent value="paciente" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Relatório de Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select 
                    value={filtros.pacienteId} 
                    onValueChange={(value) => setFiltros({...filtros, pacienteId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientesDisponiveis.map((paciente) => (
                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                          {paciente.nome} - {paciente.diagnostico}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarRelatorioPaciente} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {relatorioPaciente && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Paciente: {relatorioPaciente.paciente.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPaciente.resumo.total_metas}</div>
                      <div className="text-sm text-muted-foreground">Total de Metas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPaciente.resumo.metas_concluidas}</div>
                      <div className="text-sm text-muted-foreground">Metas Concluídas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPaciente.resumo.media_notas_recentes}</div>
                      <div className="text-sm text-muted-foreground">Média Últimos 30 Dias</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {Object.keys(relatorioPaciente.evolucao_por_meta).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução por Meta (Últimos 30 dias)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(relatorioPaciente.evolucao_por_meta).map(([metaId, dados]) => (
                      <div key={metaId} className="mb-6">
                        <h4 className="font-medium mb-2">{dados.meta_descricao}</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={dados.registros}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="data" tickFormatter={formatDate} />
                            <YAxis domain={[1, 5]} />
                            <Tooltip labelFormatter={formatDate} />
                            <Line type="monotone" dataKey="nota" stroke="#8884d8" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Relatório de Profissional */}
        <TabsContent value="profissional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Relatório de Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Profissional</Label>
                  <Select 
                    value={filtros.profissionalId} 
                    onValueChange={(value) => setFiltros({...filtros, profissionalId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionaisDisponiveis.map((profissional) => (
                        <SelectItem key={profissional.id} value={profissional.id.toString()}>
                          {profissional.nome} - {profissional.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarRelatorioProfissional} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {relatorioProfissional && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Profissional: {relatorioProfissional.profissional.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioProfissional.resumo.total_pacientes}</div>
                      <div className="text-sm text-muted-foreground">Pacientes Atendidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioProfissional.resumo.total_planos}</div>
                      <div className="text-sm text-muted-foreground">Planos Criados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioProfissional.resumo.total_metas}</div>
                      <div className="text-sm text-muted-foreground">Total de Metas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioProfissional.resumo.taxa_conclusao}%</div>
                      <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {relatorioProfissional.distribuicao_diagnosticos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Pacientes por Diagnóstico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={relatorioProfissional.distribuicao_diagnosticos}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ diagnostico, count }) => `${diagnostico}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {relatorioProfissional.distribuicao_diagnosticos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Relatório por Período */}
        <TabsContent value="periodo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Relatório por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={filtros.periodoInicio}
                    onChange={(e) => setFiltros({...filtros, periodoInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={filtros.periodoFim}
                    onChange={(e) => setFiltros({...filtros, periodoFim: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarRelatorioPeriodo} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {relatorioPeriodo && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Relatório do Período: {formatDate(relatorioPeriodo.periodo.data_inicio)} - {formatDate(relatorioPeriodo.periodo.data_fim)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPeriodo.estatisticas.total_registros}</div>
                      <div className="text-sm text-muted-foreground">Total de Registros</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPeriodo.estatisticas.media_geral}</div>
                      <div className="text-sm text-muted-foreground">Média Geral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPeriodo.estatisticas.nota_maxima}</div>
                      <div className="text-sm text-muted-foreground">Nota Máxima</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{relatorioPeriodo.estatisticas.nota_minima}</div>
                      <div className="text-sm text-muted-foreground">Nota Mínima</div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={relatorioPeriodo.evolucao_diaria}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={formatDate}
                        formatter={(value, name) => [
                          name === 'media_notas' ? value : value,
                          name === 'media_notas' ? 'Média de Notas' : 'Total de Registros'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="media_notas" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Média de Notas"
                      />
                      <Bar 
                        dataKey="total_registros" 
                        fill="#82ca9d"
                        name="Total de Registros"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Fórmulas por Meta */}
        <TabsContent value="formulas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Fórmulas por Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Meta</Label>
                  <Select 
                    value={filtros.formulaMetaId} 
                    onValueChange={(value) => setFiltros({...filtros, formulaMetaId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a meta" />
                    </SelectTrigger>
                    <SelectContent>
                      {metasDisponiveis.map((meta) => (
                        <SelectItem key={meta.id} value={meta.id.toString()}>
                          {meta.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={filtros.formulaDataInicio}
                    onChange={(e) => setFiltros({...filtros, formulaDataInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={filtros.formulaDataFim}
                    onChange={(e) => setFiltros({...filtros, formulaDataFim: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarFormulasMeta} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Buscar Fórmulas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {formulasMeta && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fórmulas da Meta: {formulasMeta.meta_descricao}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formulasMeta.estatisticas_formulas.total_formulas}</div>
                      <div className="text-sm text-muted-foreground">Total de Fórmulas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formulasMeta.estatisticas_formulas.formulas_com_dados}</div>
                      <div className="text-sm text-muted-foreground">Fórmulas com Dados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formulasMeta.total_checklists}</div>
                      <div className="text-sm text-muted-foreground">Total de Checklists</div>
                    </div>
                  </div>

                  {formulasMeta.formulas_calculadas.map((formula, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">{formula.pergunta_texto}</h4>
                          <p className="text-sm text-muted-foreground">Fórmula: {formula.formula}</p>
                        </div>
                        <Badge variant="secondary">
                          {formula.valores_calculados.length} registros
                        </Badge>
                      </div>

                      {formula.valores_calculados.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium">Valores Calculados:</h5>
                          <div className="grid gap-2">
                            {formula.valores_calculados.map((valor, valorIndex) => (
                              <div key={valorIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div className="text-sm">
                                  <div className="font-medium">{formatDate(valor.data)}</div>
                                  <div className="text-muted-foreground">Checklist #{valor.checklist_id}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg">{valor.valor_calculado}</div>
                                  {valor.valor_numerico && (
                                    <div className="text-sm text-muted-foreground">
                                      Valor: {valor.valor_numerico}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Evolução de Fórmula Específica */}
        <TabsContent value="evolucao-formula" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros para Evolução de Fórmula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>ID da Pergunta</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 5"
                    value={filtros.perguntaId}
                    onChange={(e) => setFiltros({...filtros, perguntaId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={filtros.evolucaoDataInicio}
                    onChange={(e) => setFiltros({...filtros, evolucaoDataInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={filtros.evolucaoDataFim}
                    onChange={(e) => setFiltros({...filtros, evolucaoDataFim: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleBuscarEvolucaoFormula} className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Buscar Evolução
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {evolucaoFormula && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução da Fórmula: {evolucaoFormula.pergunta.texto}</CardTitle>
                  <CardDescription>
                    Fórmula: {evolucaoFormula.pergunta.formula}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{evolucaoFormula.estatisticas.total_registros}</div>
                      <div className="text-sm text-muted-foreground">Total de Registros</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{evolucaoFormula.estatisticas.media}</div>
                      <div className="text-sm text-muted-foreground">Média</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{evolucaoFormula.estatisticas.maximo}</div>
                      <div className="text-sm text-muted-foreground">Máximo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{evolucaoFormula.estatisticas.minimo}</div>
                      <div className="text-sm text-muted-foreground">Mínimo</div>
                    </div>
                  </div>

                  {evolucaoFormula.evolucao.length > 0 && (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={evolucaoFormula.evolucao}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="data" 
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={formatDate}
                          formatter={(value) => [value, 'Valor Calculado']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="valor_numerico" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={{ fill: '#8884d8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Histórico de Valores</h4>
                    <div className="space-y-2">
                      {evolucaoFormula.evolucao.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{formatDate(item.data)}</div>
                            <div className="text-sm text-muted-foreground">
                              Meta: {item.meta_descricao} | Checklist #{item.checklist_id}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{item.valor_calculado}</div>
                            {item.valor_numerico && (
                              <div className="text-sm text-muted-foreground">
                                Valor: {item.valor_numerico}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

