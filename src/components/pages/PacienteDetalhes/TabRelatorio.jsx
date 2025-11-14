import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ApexCharts from 'react-apexcharts';
import { BarChart3, Target, TrendingUp, AlertCircle, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getApexRadarData, getBarChartData, decideChartType, getPieChartData } from './chartUtils';

export default function TabRelatorio({ paciente, relatorioPaciente, agendamentos, loadingRelatorio }) {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);
  const [refreshGrafico, setRefreshGrafico] = useState(0);
  const [selectedCharts, setSelectedCharts] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (!isNaN(dt)) return dt.toLocaleDateString('pt-BR');
    } catch {}
    return dateStr;
  };

  // Calcular data padrão (últimos 30 dias)
  useEffect(() => {
    const hoje = new Date();
    const trinta = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const formatarData = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    };
    
    setDataFinal(formatarData(hoje));
    setDataInicial(formatarData(trinta));
  }, []);

  const getRadarData = getApexRadarData(relatorioPaciente);
  
  const todasDatas = useMemo(() => {
    if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) {
      console.log('Aviso: relatorioPaciente ou respostas_calculadas_globais ausentes');
      return [];
    }

    let dataInicialObj = null;
    let dataFinalObj = null;
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial);
      dataInicialObj.setHours(0, 0, 0, 0);
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal);
      dataFinalObj.setHours(23, 59, 59, 999);
    }

    const datas = relatorioPaciente.respostas_calculadas_globais
      .filter(item => {
        if (!item.data) return false;
        const itemDate = new Date(item.data);
        if (dataInicialObj && itemDate < dataInicialObj) return false;
        if (dataFinalObj && itemDate > dataFinalObj) return false;
        return true;
      })
      .map((item, idx) => {
        let label = formatDate(item.data);
        if (item.formulario_titulo) {
          label = `${item.formulario_titulo} (${formatDate(item.data)})`;
        }
        return {
          value: item.data,
          label: label,
          ...item
        };
      });

    console.log('todasDatas montadas:', datas);
    return datas;
  }, [relatorioPaciente, formatDate, dataInicial, dataFinal]);

  useEffect(() => {
    setDatasSelecionadas([]);
  }, [dataInicial, dataFinal]);

  const { series, categorias, datas, perguntas } = getRadarData(datasSelecionadas);

  const chartType = useMemo(() => {
    if (datasSelecionadas.length === 0) return null;
    return decideChartType(series, datasSelecionadas);
  }, [datasSelecionadas, series]);

  const barChartData = useMemo(() => {
    if (selectedCharts.length === 0 && chartType !== 'bar') return null;
    return getBarChartData(relatorioPaciente, datasSelecionadas);
  }, [chartType, datasSelecionadas, relatorioPaciente, selectedCharts]);

  const pieChartData = useMemo(() => {
    if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) return null;
    if (selectedCharts.length > 0 && !selectedCharts.includes('pie')) return null;
    if (datasSelecionadas.length === 0) return null;
    return getPieChartData(relatorioPaciente, datasSelecionadas);
  }, [relatorioPaciente, datasSelecionadas, selectedCharts]);

  const chartPalette = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16"]; 

  const chartsToShow = useMemo(() => {
    if (selectedCharts.length === 0) {
      return chartType ? [chartType] : [];
    }
    return selectedCharts;
  }, [selectedCharts, chartType]);

  const toggleChart = (type) => {
    setSelectedCharts(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleToggleData = (dataValue) => {
    setDatasSelecionadas(prev => {
      if (prev.includes(dataValue)) {
        return prev.filter(d => d !== dataValue);
      } else {
        return [...prev, dataValue];
      }
    });
  };

  const seriesFiltradas = series;

  const presencaData = useMemo(() => {
    if (!agendamentos || !Array.isArray(agendamentos) || agendamentos.length === 0) {
      console.warn('presencaData: Nenhum agendamento disponível');
      return [];
    }

    let dataInicialObj = null;
    let dataFinalObj = null;
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial);
      dataInicialObj.setHours(0, 0, 0, 0);
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal);
      dataFinalObj.setHours(23, 59, 59, 999);
    }

    const mapa = {};

    agendamentos.forEach(ag => {
      if (!ag.data_hora) return;
      
      const agendaDate = new Date(ag.data_hora);
      if (dataInicialObj && agendaDate < dataInicialObj) return;
      if (dataFinalObj && agendaDate > dataFinalObj) return;
      
      const dataKey = formatDate(ag.data_hora);
      if (!mapa[dataKey]) {
        mapa[dataKey] = { data: dataKey, presencas: 0, faltas: 0, ausencias: 0 };
      }
      
      if (ag.presente === true) {
        mapa[dataKey].presencas += 1;
      } else if (ag.presente === false) {
        mapa[dataKey].faltas += 1;
      } else if (ag.status === 'CANCELADO' || ag.status === 'AUSENTE') {
        mapa[dataKey].ausencias += 1;
      }
    });

    const resultado = Object.values(mapa)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
    
    console.log('presencaData calculado:', resultado);
    console.log('Filtro aplicado - Inicial:', dataInicial, 'Final:', dataFinal);
    return resultado;
  }, [agendamentos, formatDate, dataInicial, dataFinal, refreshGrafico]);

  if (loadingRelatorio) {
    return (
      <div className="center-flex py-12">
        <div className="text-lg animate-pulse text-gray-600">Carregando relatório...</div>
      </div>
    );
  }

  if (!relatorioPaciente) {
    return (
      <div className="alert alert-warning">
        <AlertCircle className="alert-icon" />
        <p className="alert-content">Nenhum dado de relatório disponível para este paciente. Não há sessões registradas ou dados de avaliação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <div className="card-spacing mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="section-header-title">Filtro de Período</h3>
        </div>
        <p className="card-text mb-4">Selecione o intervalo de datas para visualizar os dados</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <Label htmlFor="dataInicial" className="text-sm font-semibold text-gray-700 mb-2 block">
              Data Inicial
            </Label>
            <Input
              id="dataInicial"
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9]"
            />
          </div>
          
          <div className="form-group">
            <Label htmlFor="dataFinal" className="text-sm font-semibold text-gray-700 mb-2 block">
              Data Final
            </Label>
            <Input
              id="dataFinal"
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9]"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-600">📊 Registros encontrados:</span> {todasDatas.length} sessão(ões) no período
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="card-grid mb-8">
        <div className="stat-card color-info">
          <div className="stat-card-icon" style={{ backgroundColor: '#bae6fd' }}>
            <Target size={24} style={{ color: '#0ea5e9' }} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Total de Metas</div>
            <div className="stat-card-value">{relatorioPaciente.resumo?.total_metas || 0}</div>
          </div>
        </div>

        <div className="stat-card color-success">
          <div className="stat-card-icon" style={{ backgroundColor: '#d1fae5' }}>
            <TrendingUp size={24} style={{ color: '#22c55e' }} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Metas Concluídas</div>
            <div className="stat-card-value">{relatorioPaciente.resumo?.metas_concluidas || 0}</div>
          </div>
        </div>

        <div className="stat-card color-warning">
          <div className="stat-card-icon" style={{ backgroundColor: '#fef3c7' }}>
            <BarChart3 size={24} style={{ color: '#f59e0b' }} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Média Últimos 30 Dias</div>
            <div className="stat-card-value">{relatorioPaciente.resumo?.media_notas_recentes || 0}</div>
          </div>
        </div>
      </div>

      {/* Evolução por Meta */}
      {relatorioPaciente?.evolucao_por_meta && Object.keys(relatorioPaciente.evolucao_por_meta).length > 0 && (
        <div className="card-spacing animate-fade-in">
          <div className="section-header">
            <TrendingUp size={18} className="color-info-icon" />
            <h2 className="section-header-title">Evolução por Meta (Últimos 30 dias)</h2>
          </div>
          <p className="card-text mb-6">Progresso do paciente em cada meta terapêutica</p>
          
          {Object.entries(relatorioPaciente.evolucao_por_meta).map(([metaId, dados]) => (
            <div key={metaId} className="mb-6">
              <h4 className="card-title">{dados.meta_descricao}</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dados.registros}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="data" 
                    tickFormatter={formatDate}
                  />
                  <YAxis domain={[1, 5]} />
                  <RechartsTooltip 
                    labelFormatter={formatDate}
                    formatter={(value) => [value, 'Nota']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <RechartsLegend />
                  <Line 
                    type="monotone" 
                    dataKey="nota" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}

      {/* Comparecimento vs Faltas */}
      {presencaData && presencaData.length > 0 && (
        <div className="card-spacing animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="section-header">
                <TrendingUp size={18} className="color-info-icon" />
                <h2 className="section-header-title">Comparecimento vs Faltas/Ausências</h2>
              </div>
              <p className="card-text">Período: {dataInicial && dataFinal ? `${dataInicial} a ${dataFinal}` : 'Últimos 30 dias'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">{presencaData.length} dia(s) com dados</span>
              <button 
                onClick={() => setRefreshGrafico(prev => prev + 1)}
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                title="Atualizar gráfico com o período selecionado"
              >
                <RefreshCw size={16} />
                <span className="text-sm font-medium">Atualizar</span>
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={presencaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="data"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value, name) => {
                  const labels = { presencas: 'Presenças', faltas: 'Faltas', ausencias: 'Ausências' };
                  return [value, labels[name] || name];
                }}
              />
              <RechartsLegend 
                formatter={(value) => {
                  const labels = { presencas: 'Presenças', faltas: 'Faltas', ausencias: 'Ausências' };
                  return labels[value] || value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="presencas" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                name="Presenças"
              />
              <Line 
                type="monotone" 
                dataKey="faltas" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Faltas"
              />
              <Line 
                type="monotone" 
                dataKey="ausencias" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Ausências/Cancelado"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Visualização de Percentuais/Fórmulas */}
      <div className="card-spacing animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="section-header">
          <BarChart3 size={18} className="color-info-icon" />
          <h2 className="section-header-title">Visualização de Percentuais/Fórmulas</h2>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <p className="card-text">Cada eixo representa um índice calculado. Compare até 3 sessões (datas).</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-700 mr-2">Tipos de gráfico:</span>
            <Button type="button" variant={chartsToShow.includes('radar') ? 'default' : 'outline'} size="sm" onClick={() => toggleChart('radar')}>
              Radar
            </Button>
            <Button type="button" variant={chartsToShow.includes('bar') ? 'default' : 'outline'} size="sm" onClick={() => toggleChart('bar')}>
              Barras
            </Button>
            <Button type="button" variant={chartsToShow.includes('line') ? 'default' : 'outline'} size="sm" onClick={() => toggleChart('line')}>
              Linhas
            </Button>
            <Button type="button" variant={chartsToShow.includes('pie') ? 'default' : 'outline'} size="sm" onClick={() => toggleChart('pie')}>
              Pizza
            </Button>
            {selectedCharts.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedCharts([])} title="Voltar para seleção automática">
                Automático
              </Button>
            )}
          </div>
        </div>
        
        {todasDatas.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle className="alert-icon" />
            <p className="alert-content">Nenhuma sessão com dados de percentuais/fórmulas encontrada no período selecionado.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="label mb-3 block font-semibold text-gray-700">Selecione as sessões para comparar:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                {todasDatas.map(({ value, label }) => (
                  <label key={value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: datasSelecionadas.includes(value) ? '#bae6fd' : 'white',
                    borderColor: datasSelecionadas.includes(value) ? '#0ea5e9' : '#e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      checked={datasSelecionadas.includes(value)}
                      onChange={() => handleToggleData(value)}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                <strong>{datasSelecionadas.length}</strong> sessão(ões) selecionada(s) de <strong>{todasDatas.length}</strong>
              </p>
            </div>

            {datasSelecionadas.length === 0 && (
              <div className="alert alert-info mt-4">
                <AlertCircle className="alert-icon" />
                <p className="alert-content">Selecione pelo menos uma sessão para visualizar o gráfico.</p>
              </div>
            )}

            {/* Gráficos vão aqui - Barras, Linhas, Pizza, Radar */}
            {/* (Continuação na próxima parte devido ao tamanho) */}
          </>
        )}
      </div>
    </div>
  );
}
