import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, X, Search, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import ApiService from '@/lib/api'

export default function RespostaMetaGrid() {
  const [respostas, setRespostas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filtros, setFiltros] = useState({
    paciente_id: '',
    profissional_id: '',
    data_inicio: '',
    data_fim: ''
  });
  
  const [respostasFiltradas, setRespostasFiltradas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const respostasPorPagina = 10;
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [respostas, filtros]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      let respostasData = [];
      let pacientesData = [];
      let profissionaisData = [];
      
      try {
        respostasData = await ApiService.getRespostasMeta();
      } catch (error) {
        console.error('Erro ao carregar respostas de meta:', error);
      }
      
      try {
        pacientesData = await ApiService.getPacientes();
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
      
      try {
        profissionaisData = await ApiService.getProfissionais();
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      }
      
      setRespostas(respostasData);
      setPacientes(pacientesData);
      setProfissionais(profissionaisData);
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...respostas];
    
    if (filtros.paciente_id) {
      filtrados = filtrados.filter(r => r.paciente_id && r.paciente_id.toString() === filtros.paciente_id);
    }
    
    if (filtros.profissional_id) {
      filtrados = filtrados.filter(r => r.profissional_id && r.profissional_id.toString() === filtros.profissional_id);
    }
    
    if (filtros.data_inicio) {
      const dataInicio = new Date(filtros.data_inicio);
      filtrados = filtrados.filter(r => new Date(r.data_sessao) >= dataInicio);
    }
    
    if (filtros.data_fim) {
      const dataFim = new Date(filtros.data_fim);
      dataFim.setHours(23, 59, 59, 999);
      filtrados = filtrados.filter(r => new Date(r.data_sessao) <= dataFim);
    }
    
    setRespostasFiltradas(filtrados);
    setPaginaAtual(1);
  };

  const indiceInicio = (paginaAtual - 1) * respostasPorPagina;
  const indiceFim = indiceInicio + respostasPorPagina;
  const respostasPaginadas = respostasFiltradas.slice(indiceInicio, indiceFim);
  const totalPaginas = Math.ceil(respostasFiltradas.length / respostasPorPagina);

  const limparFiltros = () => {
    setFiltros({
      paciente_id: '',
      profissional_id: '',
      data_inicio: '',
      data_fim: ''
    });
  };

  const handleEdit = (resposta) => {
    if (resposta && resposta.id) {
      navigate(`/resposta-meta/edit/${resposta.id}`);
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível identificar a resposta',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (respostaId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta resposta de meta?')) {
      return;
    }

    try {
      await ApiService.deleteRespostaMeta(respostaId);
      toast({
        title: 'Sucesso',
        description: 'Resposta deletada com sucesso',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao deletar resposta: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const formatData = (dataIso) => {
    if (!dataIso) return '-';
    const date = new Date(dataIso);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatHora = (horaIso) => {
    if (!horaIso) return '-';
    return horaIso.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Respostas de Metas</h1>
            <p className="page-subtitle">Registre e gerencie a execução das metas terapêuticas</p>
          </div>
          <Button 
            onClick={() => navigate('/resposta-meta/edit/novo')}
            style={{ backgroundColor: '#8b5cf6', color: 'white' }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            📋 Nova Resposta
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Search size={18} className="color-info-icon" />
          <h2 className="section-header-title">Filtros de Busca</h2>
        </div>
        <p className="card-text mb-6">Filtre as respostas por meta, paciente e data</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Paciente */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Paciente</Label>
            <div className="flex gap-2">
              <Select
                value={filtros.paciente_id || "todos"}
                onValueChange={v => setFiltros(f => ({ ...f, paciente_id: v === "todos" ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os pacientes</SelectItem>
                  {pacientes.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filtros.paciente_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, paciente_id: '' }))}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Profissional */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Profissional</Label>
            <div className="flex gap-2">
              <Select
                value={filtros.profissional_id || "todos"}
                onValueChange={v => setFiltros(f => ({ ...f, profissional_id: v === "todos" ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os profissionais</SelectItem>
                  {profissionais.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filtros.profissional_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, profissional_id: '' }))}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Data Início */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Data Início</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filtros.data_inicio}
                onChange={e => setFiltros(f => ({ ...f, data_inicio: e.target.value }))}
              />
              {filtros.data_inicio && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, data_inicio: '' }))}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Data Fim */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Data Fim</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filtros.data_fim}
                onChange={e => setFiltros(f => ({ ...f, data_fim: e.target.value }))}
              />
              {filtros.data_fim && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, data_fim: '' }))}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t" style={{borderTopColor: 'var(--color-neutral-200)'}}>
          <Button 
            variant="outline" 
            onClick={limparFiltros}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela de Respostas */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Calendar size={18} className="color-info-icon" />
          <h2 className="section-header-title">Histórico de Respostas</h2>
        </div>
        <p className="card-text mb-6">
          Visualize e gerencie todas as respostas de metas
          {respostasFiltradas.length !== respostas.length && (
            <span style={{color: 'var(--color-info-600)', fontWeight: '600'}}>
              {' '}({respostasFiltradas.length} de {respostas.length} respostas)
            </span>
          )}
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando respostas...</p>
          </div>
        ) : respostasFiltradas.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p className="font-medium">
                {respostas.length === 0 
                  ? "Nenhuma resposta de meta registrada ainda" 
                  : "Nenhuma resposta encontrada com os filtros aplicados"
                }
              </p>
              {respostas.length === 0 && (
                <p className="text-sm mt-1">Crie a primeira resposta clicando em "Nova Resposta"</p>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Sessão</th>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {respostasPaginadas.map(r => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.sessao || '-'}</td>
                    <td>{r.paciente_nome}</td>
                    <td>{r.profissional_nome}</td>
                    <td>
                      <span className="text-sm" style={{color: 'var(--color-neutral-700)'}}>
                        {formatData(r.data_sessao)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm" style={{color: 'var(--color-neutral-700)'}}>
                        {r.hr_inicio && r.hr_termino 
                          ? `${formatHora(r.hr_inicio)} - ${formatHora(r.hr_termino)}`
                          : '-'
                        }
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(r)}
                          className="h-9 w-9 p-0"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(r.id)}
                          className="h-9 w-9 p-0"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{borderTopColor: 'var(--color-neutral-200)'}}>
                <p className="text-sm" style={{color: 'var(--color-neutral-600)'}}>
                  Mostrando {indiceInicio + 1} a {Math.min(indiceFim, respostasFiltradas.length)} de {respostasFiltradas.length} respostas
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                  >
                    ← Anterior
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                      <Button
                        key={pagina}
                        variant={paginaAtual === pagina ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaginaAtual(pagina)}
                        style={paginaAtual === pagina ? { backgroundColor: 'var(--color-info-500)', color: 'white' } : {}}
                        className="h-9 w-9 p-0"
                      >
                        {pagina}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
