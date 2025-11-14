import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ApexCharts from 'react-apexcharts';
import { BarChart3, Target, TrendingUp, User, Phone, Calendar, AlertCircle, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Monta dados para o radar ApexCharts a partir de respostas_calculadas_globais do backend
function getApexRadarData(relatorio) {
  if (!relatorio || !relatorio.respostas_calculadas_globais) {
    console.warn('Radar: relatorio ou respostas_calculadas_globais ausentes', relatorio);
    return function() {
      return { series: [], categorias: [], datas: [], perguntas: [] };
    };
  }
  
  return function(datasSelecionadas) {
    console.log('Radar: datasSelecionadas', datasSelecionadas);
    const globaisFiltrados = relatorio.respostas_calculadas_globais.filter(item => datasSelecionadas.includes(item.data));
    console.log('Radar: globaisFiltrados', globaisFiltrados);
    
    const indicadoresInfo = {};
    const indicadoresSet = new Set();
    globaisFiltrados.forEach(item => {
      Object.entries(item.indices).forEach(([key, valor]) => {
        let idPergunta;
        if (typeof valor === 'object' && valor !== null && valor.id) {
          idPergunta = valor.id;
        } else {
          idPergunta = key;
        }
        indicadoresSet.add(idPergunta);
        if (!indicadoresInfo[idPergunta]) {
          indicadoresInfo[idPergunta] = {
            id: idPergunta,
            texto: (valor && valor.texto) ? valor.texto : key,
            sigla: (valor && valor.sigla) ? valor.sigla : undefined
          };
        }
      });
    });
    
    const perguntas = Array.from(indicadoresSet).map(id => indicadoresInfo[id]);
    perguntas.sort((a, b) => (a.id > b.id ? 1 : -1));
    console.log('Radar: perguntas (indicadores)', perguntas);
    
    const categorias = perguntas.map(p => p.sigla || p.texto);
    
    const datas = globaisFiltrados.map(item => {
      let formularioId = null;
      for (const v of Object.values(item.indices)) {
        if (v && typeof v === 'object' && v.formulario_id) {
          formularioId = v.formulario_id;
          break;
        }
      }
      return formularioId ? `${item.data} (Formulário ${formularioId})` : item.data;
    });
    
    const series = globaisFiltrados.map((item) => {
      let formularioId = null;
      for (const v of Object.values(item.indices)) {
        if (v && typeof v === 'object' && v.formulario_id) {
          formularioId = v.formulario_id;
          break;
        }
      }
      const serieData = perguntas.map(p => {
        if (item && item.indices) {
          if (item.indices.hasOwnProperty(p.id)) {
            const v = item.indices[p.id];
            if (typeof v === 'object' && v !== null && v.valor !== undefined) {
              return parseFloat(v.valor);
            } else if (typeof v === 'number' || typeof v === 'string') {
              return v !== null && v !== undefined ? parseFloat(v) : 0;
            }
          } else if (item.indices.hasOwnProperty(p.texto)) {
            const v = item.indices[p.texto];
            return v !== null && v !== undefined ? parseFloat(v) : 0;
          }
        }
        return 0;
      });
      return {
        name: formularioId ? `${item.data} (Formulário ${formularioId})` : item.data,
        data: serieData
      };
    });
    
    console.log('Radar: series montadas', series);
    return { series, categorias, datas, perguntas };
  };
}

// Função para determinar o tipo de gráfico e montar dados para barras (comparação simples)
function getBarChartData(relatorio, datasSelecionadas) {
  if (!relatorio || !relatorio.respostas_calculadas_globais || datasSelecionadas.length === 0) {
    return null;
  }

  const globaisFiltrados = relatorio.respostas_calculadas_globais.filter(item => datasSelecionadas.includes(item.data));
  
  // Montar um array de objetos para o gráfico de barras
  // Cada ponto representa um índice/percentual
  const barData = [];
  const indiceNomes = new Set();

  globaisFiltrados.forEach(item => {
    Object.entries(item.indices).forEach(([key, valor]) => {
      let sigla = '';
      if (typeof valor === 'object' && valor !== null && valor.sigla) {
        sigla = valor.sigla;
      } else {
        sigla = key;
      }
      indiceNomes.add(sigla);
    });
  });

  // Criar entry por índice
  indiceNomes.forEach(sigla => {
    const entry = { name: sigla };
    globaisFiltrados.forEach(item => {
      let dataLabel = new Date(item.data).toLocaleDateString('pt-BR');
      let valor = 0;
      Object.entries(item.indices).forEach(([key, v]) => {
        let itemSigla = '';
        if (typeof v === 'object' && v !== null && v.sigla) {
          itemSigla = v.sigla;
        } else {
          itemSigla = key;
        }
        if (itemSigla === sigla && typeof v === 'object' && v.valor !== undefined) {
          valor = parseFloat(v.valor);
        }
      });
      entry[dataLabel] = valor;
    });
    barData.push(entry);
  });

  return barData;
}

// Função para decidir qual gráfico mostrar
function decideChartType(series, datasSelecionadas) {
  // Se nenhuma sessão, não mostrar nada
  if (datasSelecionadas.length === 0) {
    return null;
  }

  // Contar quantos índices tem dados > 0
  let totalIndices = 0;
  let indicesComDados = 0;
  
  if (series && series.length > 0) {
    const primeiraSerie = series[0];
    if (primeiraSerie.data && Array.isArray(primeiraSerie.data)) {
      totalIndices = primeiraSerie.data.length;
      indicesComDados = primeiraSerie.data.filter(v => typeof v === 'number' && v > 0).length;
    }
  }

  // Se 1 sessão com 1 índice, usar barras (comparação simples)
  if (datasSelecionadas.length === 1 && indicesComDados === 1) {
    return 'bar';
  }

  // Se 1 sessão com múltiplos índices, usar radar
  if (datasSelecionadas.length === 1) {
    return 'radar';
  }

  // Se 2+ sessões com poucos índices (≤ 10), usar barras
  if (datasSelecionadas.length >= 2 && totalIndices <= 10 && indicesComDados <= 10) {
    return 'bar';
  }

  // Caso contrário, radar
  return 'radar';
}

export default function PacienteDetalhes() {
  const { id } = useParams();
  
  // Props que será carregado do backend
  const [paciente, setPaciente] = useState(null);
  const [relatorioPaciente, setRelatorioPaciente] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingRelatorio, setLoadingRelatorio] = useState(true);
  
  // Props helpers (utilitários)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const dt = new Date(dateStr);
      if (!isNaN(dt)) return dt.toLocaleDateString('pt-BR');
    } catch {}
    return dateStr;
  };
  
  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'N/A';
    try {
      const nasc = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const mes = hoje.getMonth() - nasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return idade;
    } catch {
      return 'N/A';
    }
  };

  // Carregar dados do backend quando o ID mudar
  useEffect(() => {
    if (!id) return;
    
    const carregarDados = async () => {
      setLoadingRelatorio(true);
      try {
        // Aqui você vai integrar com ApiService
        // Por enquanto, apenas reseta o estado
        setPaciente(null);
        setRelatorioPaciente(null);
        setAgendamentos([]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingRelatorio(false);
      }
    };
    
    carregarDados();
  }, [id]);

  // Estados locais do componente
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);
  const [refreshGrafico, setRefreshGrafico] = useState(0);
  const [selectedCharts, setSelectedCharts] = useState([]); // ['radar','bar','line','pie'] – vazio = automático

  // Calcular data padrão (últimos 30 dias)
  React.useEffect(() => {
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

  // Debug: verificar estrutura do relatorioPaciente
  React.useEffect(() => {
    console.log('=== PacienteRelatorio Debug ===');
    console.log('relatorioPaciente completo:', JSON.stringify(relatorioPaciente, null, 2));
    if (relatorioPaciente) {
      console.log('Keys do relatorioPaciente:', Object.keys(relatorioPaciente));
      console.log('respostas_calculadas_globais:', relatorioPaciente.respostas_calculadas_globais);
      console.log('Tipo de respostas_calculadas_globais:', Array.isArray(relatorioPaciente.respostas_calculadas_globais) ? 'array' : typeof relatorioPaciente.respostas_calculadas_globais);
      if (Array.isArray(relatorioPaciente.respostas_calculadas_globais)) {
        console.log('Tamanho do array:', relatorioPaciente.respostas_calculadas_globais.length);
        console.log('Primeiros elementos:', relatorioPaciente.respostas_calculadas_globais.slice(0, 2));
      }
    }
    console.log('=== Fim Debug ===');
  }, [relatorioPaciente]);

  const getRadarData = getApexRadarData(relatorioPaciente);
  
  // Construir lista de datas com melhor debug
  const todasDatas = React.useMemo(() => {
    if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) {
      console.warn('Aviso: relatorioPaciente ou respostas_calculadas_globais ausentes');
      return [];
    }

    // Filtrar por intervalo de datas com conversão correta
    let dataInicialObj = null;
    let dataFinalObj = null;
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial);
      dataInicialObj.setHours(0, 0, 0, 0); // Início do dia (00:00:00)
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal);
      dataFinalObj.setHours(23, 59, 59, 999); // Fim do dia (23:59:59)
    }

    const datas = relatorioPaciente.respostas_calculadas_globais
      .filter(item => {
        const dataItem = new Date(item.data);
        const passaDataInicial = !dataInicialObj || dataItem >= dataInicialObj;
        const passaDataFinal = !dataFinalObj || dataItem <= dataFinalObj;
        return passaDataInicial && passaDataFinal;
      })
      .map((item, idx) => {
        let nomeFormulario = null;
        for (const v of Object.values(item.indices)) {
          if (v && typeof v === 'object' && v.formulario_nome && v.valor !== undefined && v.valor !== null) {
            nomeFormulario = v.formulario_nome;
            break;
          }
        }
        const label = nomeFormulario ? `${formatDate(item.data)} - ${nomeFormulario}` : formatDate(item.data);
        console.log(`Data ${idx}:`, { value: item.data, label });
        return {
          value: item.data,
          label
        };
      });

    console.log('todasDatas montadas:', datas);
    return datas;
  }, [relatorioPaciente, formatDate, dataInicial, dataFinal]);

  // Limpar seleção quando o intervalo de datas muda (para evitar inconsistências)
  React.useEffect(() => {
    setDatasSelecionadas([]);
  }, [dataInicial, dataFinal]);

  const { series, categorias, datas, perguntas } = getRadarData(datasSelecionadas);

  // Memoized computation do tipo de gráfico (APÓS series estar definido)
  const chartType = React.useMemo(() => {
    if (datasSelecionadas.length === 0) return null;
    return decideChartType(series, datasSelecionadas);
  }, [datasSelecionadas, series]);

  const barChartData = React.useMemo(() => {
    if (selectedCharts.length === 0 && chartType !== 'bar') return null;
    return getBarChartData(relatorioPaciente, datasSelecionadas);
  }, [chartType, datasSelecionadas, relatorioPaciente, selectedCharts]);

  // Pie chart data para uma data selecionada (usa a primeira seleção caso haja várias)
  const pieChartData = React.useMemo(() => {
    if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) return null;
    if (selectedCharts.length > 0 && !selectedCharts.includes('pie')) return null;
    if (datasSelecionadas.length === 0) return null;
    const alvo = datasSelecionadas[0];
    const item = relatorioPaciente.respostas_calculadas_globais.find(i => i.data === alvo);
    if (!item || !item.indices) return null;
    const data = [];
    Object.entries(item.indices).forEach(([key, v]) => {
      let nome = '';
      if (typeof v === 'object' && v !== null) {
        nome = v.sigla || v.texto || key;
        if (v.valor !== undefined && v.valor !== null) {
          data.push({ name: nome, value: parseFloat(v.valor) });
        }
      } else if (typeof v === 'number' || typeof v === 'string') {
        const val = parseFloat(v);
        if (!isNaN(val)) data.push({ name: key, value: val });
      }
    });
    return data.length > 0 ? data : null;
  }, [relatorioPaciente, datasSelecionadas, selectedCharts]);

  const chartPalette = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16"]; 

  const chartsToShow = React.useMemo(() => {
    // Sem seleção manual: usar automático
    if (selectedCharts.length === 0) {
      return chartType ? [chartType] : [];
    }
    return selectedCharts;
  }, [selectedCharts, chartType]);

  const toggleChart = (type) => {
    setSelectedCharts((prev) => {
      if (prev.includes(type)) {
        const next = prev.filter(t => t !== type);
        return next;
      }
      return [...prev, type];
    });
  };

  const handleToggleData = (dataValue) => {
    if (datasSelecionadas.includes(dataValue)) {
      setDatasSelecionadas(datasSelecionadas.filter(d => d !== dataValue));
    } else {
      setDatasSelecionadas([...datasSelecionadas, dataValue]);
    }
  };

  const formatDataLabel = d => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toLocaleDateString('pt-BR');
    } catch {}
    return d;
  };

  const seriesFiltradas = series;

  // Calcular dados de comparecimento/faltas por data
  const presencaData = React.useMemo(() => {
    if (!agendamentos || !Array.isArray(agendamentos) || agendamentos.length === 0) {
      console.warn('presencaData: Nenhum agendamento disponível');
      return [];
    }

    // Filtrar por intervalo de datas com conversão correta
    let dataInicialObj = null;
    let dataFinalObj = null;
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial);
      dataInicialObj.setHours(0, 0, 0, 0); // Início do dia (00:00:00)
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal);
      dataFinalObj.setHours(23, 59, 59, 999); // Fim do dia (23:59:59)
    }

    const mapa = {};

    // Processar cada agendamento
    agendamentos.forEach(agend => {
      if (!agend.data_hora) return; // pular se não tiver data_hora
      
      const dataItem = new Date(agend.data_hora);
      const passaDataInicial = !dataInicialObj || dataItem >= dataInicialObj;
      const passaDataFinal = !dataFinalObj || dataItem <= dataFinalObj;
      
      if (passaDataInicial && passaDataFinal) {
        const chave = agend.data_hora.split('T')[0]; // pegar só a data (YYYY-MM-DD)
        if (!mapa[chave]) {
          mapa[chave] = { data: formatDate(chave), presencas: 0, faltas: 0, ausencias: 0 };
        }
        
        // Contar por presença/status - prioridade: presente > status
        if (agend.presente === true) {
          mapa[chave].presencas += 1;
        } else if (agend.presente === false) {
          mapa[chave].faltas += 1;
        } else if (agend.status === 'CANCELADO' || agend.status === 'AUSÊNCIA') {
          mapa[chave].ausencias += 1;
        } else {
          // Se não tem status claro, não contar (agendado mas sem resultado)
          // ou pode contar como ausência se preferir
        }
      }
    });

    // Ordenar por data e retornar como array
    const resultado = Object.values(mapa)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
    
    console.log('presencaData calculado:', resultado);
    console.log('Filtro aplicado - Inicial:', dataInicial, 'Final:', dataFinal);
    return resultado;
  }, [agendamentos, formatDate, dataInicial, dataFinal, refreshGrafico]);

  // Guard: se paciente ou relatorioPaciente faltam, mostrar erro ou carregamento
  if (!paciente) {
    return (
      <div className="page-section">
        <div className="alert alert-warning">
          <AlertCircle className="alert-icon" />
          <p className="alert-content">Erro: Dados do paciente não foram carregados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Relatório: {paciente.nome}</h1>
        <p className="page-subtitle">
          Diagnóstico: {paciente.diagnostico} | Idade: {calcularIdade(paciente.data_nascimento)}
        </p>
      </div>

      {/* Filtro de Data */}
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

      {loadingRelatorio ? (
        <div className="center-flex py-12">
          <div className="text-lg animate-pulse text-gray-600">Carregando relatório...</div>
        </div>
      ) : !relatorioPaciente ? (
        <div className="alert alert-warning">
          <AlertCircle className="alert-icon" />
          <p className="alert-content">Nenhum dado de relatório disponível para este paciente. Não há sessões registradas ou dados de avaliação.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="card-grid mb-8">
            <div className="stat-card color-info">
              <div className="stat-card-icon" style={{ backgroundColor: '#bae6fd' }}>
                <Target size={24} style={{ color: '#0ea5e9' }} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-label">Total de Metas</div>
                <div className="stat-card-value">{relatorioPaciente.resumo.total_metas}</div>
              </div>
            </div>

            <div className="stat-card color-success">
              <div className="stat-card-icon" style={{ backgroundColor: '#d1fae5' }}>
                <TrendingUp size={24} style={{ color: '#22c55e' }} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-label">Metas Concluídas</div>
                <div className="stat-card-value">{relatorioPaciente.resumo.metas_concluidas}</div>
              </div>
            </div>

            <div className="stat-card color-warning">
              <div className="stat-card-icon" style={{ backgroundColor: '#fef3c7' }}>
                <BarChart3 size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-label">Média Últimos 30 Dias</div>
                <div className="stat-card-value">{relatorioPaciente.resumo.media_notas_recentes}</div>
              </div>
            </div>
          </div>

          {/* Gráficos de Evolução por Meta */}
          {relatorioPaciente && relatorioPaciente.evolucao_por_meta && Object.keys(relatorioPaciente.evolucao_por_meta).length > 0 && (
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

          {/* Gráfico de Comparecimento/Faltas */}
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
                      if (name === 'presencas') return [value, '✅ Presenças'];
                      if (name === 'faltas') return [value, '❌ Faltas'];
                      if (name === 'ausencias') return [value, '⏭️ Ausências'];
                      return [value, name];
                    }}
                  />
                  <RechartsLegend 
                    formatter={(value) => {
                      if (value === 'presencas') return '✅ Presenças';
                      if (value === 'faltas') return '❌ Faltas';
                      if (value === 'ausencias') return '⏭️ Ausências/Cancelado';
                      return value;
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

          {/* Gráfico Radar com filtro de datas */}
          {relatorioPaciente && (
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

                  {/* Barras */}
                  {datasSelecionadas.length > 0 && chartsToShow.includes('bar') && barChartData && barChartData.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-700">
                          <strong>📊 Modo de visualização:</strong> Barras para comparar {datasSelecionadas.length} sessão(ões)
                        </p>
                      </div>
                      <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={barChartData} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={120} 
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis 
                            label={{ value: 'Valor (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                            tick={{ fontSize: 11 }}
                          />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            formatter={(value) => [value, 'Valor']}
                          />
                          <RechartsLegend wrapperStyle={{ fontSize: '12px' }} />
                          {Object.keys(barChartData[0] || {})
                            .filter(key => key !== 'name')
                            .map((dataKey, idx) => (
                              <Bar key={dataKey} dataKey={dataKey} fill={chartPalette[idx % chartPalette.length]} />
                            ))
                          }
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Linhas (usa o mesmo dataset de barras) */}
                  {datasSelecionadas.length > 0 && chartsToShow.includes('line') && barChartData && barChartData.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-emerald-700">
                          <strong>📈 Modo de visualização:</strong> Linhas para comparar {datasSelecionadas.length} sessão(ões)
                        </p>
                      </div>
                      <ResponsiveContainer width="100%" height={450}>
                        <LineChart data={barChartData} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={120} 
                            interval={0}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis 
                            label={{ value: 'Valor (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                            tick={{ fontSize: 11 }}
                          />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            formatter={(value) => [value, 'Valor']}
                          />
                          <RechartsLegend wrapperStyle={{ fontSize: '12px' }} />
                          {Object.keys(barChartData[0] || {})
                            .filter(key => key !== 'name')
                            .map((dataKey, idx) => (
                              <Line key={dataKey} type="monotone" dataKey={dataKey} stroke={chartPalette[idx % chartPalette.length]} strokeWidth={2} dot={{ r: 3 }} />
                            ))
                          }
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Pizza (usa apenas a primeira data selecionada) */}
                  {datasSelecionadas.length > 0 && chartsToShow.includes('pie') && pieChartData && (
                    <div className="space-y-4">
                      {datasSelecionadas.length > 1 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-700">Pizza mostra apenas a primeira sessão selecionada: <strong>{formatDate(datasSelecionadas[0])}</strong></p>
                        </div>
                      )}
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie 
                            data={pieChartData} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={110}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={{ stroke: '#666', strokeWidth: 1 }}
                            style={{ fontSize: '11px' }}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartPalette[index % chartPalette.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{ fontSize: '12px' }}
                          />
                          <RechartsLegend wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Radar */}
                  {datasSelecionadas.length > 0 && chartsToShow.includes('radar') && seriesFiltradas.length > 0 && categorias.length > 0 && (
                    <>
                      {datasSelecionadas.length > 1 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-purple-700">
                            <strong>🎯 Modo de visualização:</strong> Radar para comparar {datasSelecionadas.length} sessão(ões) com múltiplos índices
                          </p>
                        </div>
                      )}
                      {!seriesFiltradas.some(s => s.data.filter(v => typeof v === 'number' && v > 0).length > 1) && (
                        <div className="alert alert-warning mb-4">
                          <AlertCircle className="alert-icon" />
                          <p className="alert-content">O radar pode não ser representativo pois há poucos índices preenchidos por data.</p>
                        </div>
                      )}
                      <div style={{ width: '100%', minHeight: 550, position: 'relative', overflow: 'visible' }}>
                        <ApexCharts
                          options={{
                            chart: { type: 'radar', toolbar: { show: true }, animations: { enabled: true }, sparkline: { enabled: false } },
                            stroke: { width: 2 },
                            fill: { opacity: 0.2 },
                            colors: chartPalette,
                            markers: { size: 8 },
                            dataLabels: { enabled: true, offsetY: 12, style: { fontSize: '14px', fontWeight: 600 } },
                            legend: { show: true, position: 'bottom', fontSize: '14px', fontFamily: 'inherit', offsetY: 10 },
                            xaxis: { categories: categorias, labels: { style: { fontSize: '13px', fontWeight: 500 } } },
                            yaxis: { min: 0, max: 100, tickAmount: 5, labels: { formatter: val => `${val}`, style: { fontSize: '12px' } } },
                            tooltip: { enabled: true, y: { formatter: val => `${val}` } },
                            grid: { show: true, strokeDashArray: 4, padding: { top: 20, bottom: 20, left: 20, right: 20 } },
                            plotOptions: {
                              radar: {
                                size: 200,
                                polygons: {
                                  connectorColors: '#e0e0e0',
                                  strokeColors: '#e0e0e0',
                                  fill: [ '#f8fafc', '#fff' ]
                                }
                              }
                            },
                            responsive: [ { breakpoint: 600, options: { chart: { width: '100%' }, legend: { fontSize: '12px' } } } ]
                          }}
                          series={seriesFiltradas}
                          type="radar"
                          height={550}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Informações do Paciente */}
          <div className="card-spacing animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <User size={18} className="color-info-icon" />
              <h2 className="section-header-title">Informações do Paciente</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <User size={18} className="color-info-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <div className="label">Responsável</div>
                  <p className="card-text">{paciente.responsavel}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Phone size={18} className="color-info-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <div className="label">Contato</div>
                  <p className="card-text">{paciente.contato}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Calendar size={18} className="color-info-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <div className="label">Data de Nascimento</div>
                  <p className="card-text">{paciente.data_nascimento}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <BarChart3 size={18} className="color-info-icon" style={{ marginTop: '0.25rem' }} />
                <div>
                  <div className="label">Registros (Últimos 30 Dias)</div>
                  <p className="card-text">{relatorioPaciente.resumo.registros_ultimos_30_dias}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
