import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, UserCheck, UserX, AlertCircle } from 'lucide-react'
import ApiService from '@/lib/api'

const COLORS = {
  presencas: '#10b981', // green
  faltas: '#ef4444', // red
  nao_informado: '#94a3b8' // gray
}

export default function GraficoFaltas({ pacienteId }) {
  const [estatisticas, setEstatisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [periodoMeses, setPeriodoMeses] = useState(6) // últimos 6 meses

  useEffect(() => {
    loadEstatisticas()
  }, [pacienteId, periodoMeses])

  const loadEstatisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Calcular data de início (últimos N meses)
      const dataFim = new Date()
      const dataInicio = new Date()
      dataInicio.setMonth(dataInicio.getMonth() - periodoMeses)
      
      const params = new URLSearchParams({
        data_inicio: dataInicio.toISOString().split('T')[0],
        data_fim: dataFim.toISOString().split('T')[0]
      })
      
      const response = await ApiService.get(`/relatorios/paciente/${pacienteId}/faltas?${params}`)
      setEstatisticas(response)
    } catch (err) {
      console.error('Erro ao carregar estatísticas de faltas:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Presença</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Carregando dados...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Presença</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-500">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!estatisticas || estatisticas.total_agendamentos === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Presença</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <Calendar className="mr-2" />
            Nenhum agendamento encontrado no período
          </div>
        </CardContent>
      </Card>
    )
  }

  // Preparar dados para o gráfico de pizza
  const dadosPizza = [
    { name: 'Presenças', value: estatisticas.presencas, color: COLORS.presencas },
    { name: 'Faltas', value: estatisticas.faltas, color: COLORS.faltas },
    { name: 'Não Informado', value: estatisticas.nao_informado, color: COLORS.nao_informado }
  ].filter(item => item.value > 0)

  // Preparar dados para o gráfico de barras (evolução mensal)
  const dadosEvolucaoMensal = estatisticas.evolucao_mensal.map(item => ({
    mes: item.mes,
    Presenças: item.presencas,
    Faltas: item.faltas,
    'Não Informado': item.nao_informado
  }))

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">{estatisticas.total_agendamentos}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Presenças</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-3xl font-bold">{estatisticas.presencas}</div>
                <div className="text-sm text-green-600 font-medium">{estatisticas.taxa_presenca}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Faltas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <div className="text-3xl font-bold">{estatisticas.faltas}</div>
                <div className="text-sm text-red-600 font-medium">{estatisticas.taxa_falta}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Não Informado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-gray-500 mr-3" />
              <div className="text-3xl font-bold">{estatisticas.nao_informado}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pizza */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Presenças e Faltas</CardTitle>
          <CardDescription>Visão geral dos últimos {periodoMeses} meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>Histórico de presenças e faltas por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dadosEvolucaoMensal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Presenças" fill={COLORS.presencas} />
              <Bar dataKey="Faltas" fill={COLORS.faltas} />
              <Bar dataKey="Não Informado" fill={COLORS.nao_informado} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estatísticas por Profissional */}
      {estatisticas.por_profissional && estatisticas.por_profissional.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Presenças por Profissional</CardTitle>
            <CardDescription>Distribuição de presenças e faltas por profissional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estatisticas.por_profissional.map((prof) => {
                const taxaPresenca = prof.total > 0 ? ((prof.presencas / prof.total) * 100).toFixed(1) : 0
                const taxaFalta = prof.total > 0 ? ((prof.faltas / prof.total) * 100).toFixed(1) : 0
                
                return (
                  <div key={prof.profissional_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{prof.profissional_nome}</h4>
                      <span className="text-sm text-muted-foreground">{prof.total} sessões</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <div className="font-medium">{prof.presencas}</div>
                          <div className="text-xs text-green-600">{taxaPresenca}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <UserX className="h-5 w-5 text-red-500 mr-2" />
                        <div>
                          <div className="font-medium">{prof.faltas}</div>
                          <div className="text-xs text-red-600">{taxaFalta}%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${taxaPresenca}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtro de período */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[3, 6, 12].map((meses) => (
              <button
                key={meses}
                onClick={() => setPeriodoMeses(meses)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  periodoMeses === meses
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Últimos {meses} meses
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
