
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, X, AlertCircle, Calendar } from 'lucide-react';

export default function RegistroDiarioGrid() {
  const [registros, setRegistros] = useState([]);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    meta_id: '',
    data_inicio: '',
    data_fim: '',
    nota_min: '',
    nota_max: ''
  });
  const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [registros, filtros]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [registrosData, metasData] = await Promise.all([
        ApiService.getChecklistsDiarios(),
        ApiService.getMetasTerapeuticas()
      ]);
      setRegistros(registrosData);
      setMetas(metasData);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registros: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...registros];
    if (filtros.meta_id) {
      filtrados = filtrados.filter(r => r.meta_id && r.meta_id.toString() === filtros.meta_id);
    }
    if (filtros.data_inicio) {
      filtrados = filtrados.filter(r => r.data && new Date(r.data) >= new Date(filtros.data_inicio));
    }
    if (filtros.data_fim) {
      filtrados = filtrados.filter(r => r.data && new Date(r.data) <= new Date(filtros.data_fim));
    }
    if (filtros.nota_min) {
      filtrados = filtrados.filter(r => r.nota >= Number(filtros.nota_min));
    }
    if (filtros.nota_max) {
      filtrados = filtrados.filter(r => r.nota <= Number(filtros.nota_max));
    }
    setRegistrosFiltrados(filtrados);
  };

  const limparFiltros = () => {
    setFiltros({
      meta_id: '',
      data_inicio: '',
      data_fim: '',
      nota_min: '',
      nota_max: ''
    });
  };

  const handleEdit = (registro) => {
    if (registro && registro.id) {
      navigate(`/registro-diario/edit/${registro.id}`);
    } else {
      navigate('/registro-diario/edit/novo');
    }
  };

  const handleDelete = async (registroId) => {
    if (!window.confirm('Tem certeza que deseja deletar este registro?')) {
      return;
    }

    try {
      await ApiService.deleteChecklistDiario(registroId);
      toast({
        title: 'Sucesso',
        description: 'Registro deletado com sucesso!',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao deletar registro: ' + error.message,
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Registro Diário</h1>
            <p className="page-subtitle">Acompanhe e gerencie todos os registros de pacientes</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => navigate('/registro-diario/export-import')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              📊 Exportar/Importar Excel
            </Button>
            <Button 
              onClick={() => navigate('/registro-diario/edit/novo')}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Search size={18} className="color-info-icon" />
          <h2 className="section-header-title">Filtros de Busca</h2>
        </div>
        <p className="card-text mb-6">Filtre os registros por meta, data e nota</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Meta */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Meta Terapêutica</Label>
            <div className="flex gap-2">
              <Select
                value={filtros.meta_id || "todos"}
                onValueChange={v => setFiltros(f => ({ ...f, meta_id: v === "todos" ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as metas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as metas</SelectItem>
                  {metas.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filtros.meta_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, meta_id: '' }))}
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

          {/* Nota Mínima */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Nota Mínima</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="5"
                value={filtros.nota_min}
                onChange={e => setFiltros(f => ({ ...f, nota_min: e.target.value }))}
                placeholder="1"
              />
              {filtros.nota_min && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, nota_min: '' }))}
                  className="h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Nota Máxima */}
          <div className="grid gap-2">
            <Label className="text-xs font-semibold">Nota Máxima</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="5"
                value={filtros.nota_max}
                onChange={e => setFiltros(f => ({ ...f, nota_max: e.target.value }))}
                placeholder="5"
              />
              {filtros.nota_max && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltros(f => ({ ...f, nota_max: '' }))}
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

      {/* Tabela de Registros */}
      <div className="card-spacing">
        <div className="section-header mb-6">
          <Calendar size={18} className="color-info-icon" />
          <h2 className="section-header-title">Histórico de Registros</h2>
        </div>
        <p className="card-text mb-6">
          Visualize e gerencie todos os registros
          {registrosFiltrados.length !== registros.length && (
            <span style={{color: 'var(--color-info-600)', fontWeight: '600'}}>
              {' '}({registrosFiltrados.length} de {registros.length} registros)
            </span>
          )}
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 mx-auto" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
            <p className="mt-4 card-text font-medium">Carregando registros...</p>
          </div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="alert alert-info">
            <AlertCircle size={18} />
            <div className="alert-content">
              <p className="font-medium">
                {registros.length === 0 
                  ? "Nenhum registro criado ainda" 
                  : "Nenhum registro encontrado com os filtros aplicados"
                }
              </p>
              {registros.length === 0 && (
                <p className="text-sm mt-1">Crie o primeiro registro clicando em "Novo Registro"</p>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data</th>
                  <th>Meta</th>
                  <th>Nota</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.map(r => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.paciente_nome || 'N/A'}</td>
                    <td>
                      <span className="text-sm" style={{color: 'var(--color-neutral-700)'}}>
                        {new Date(r.data).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td>{r.meta_descricao}</td>
                    <td>
                      {r.nota ? (
                        <span className="badge badge-info" style={{backgroundColor: 'var(--color-info-100)', color: 'var(--color-info-800)'}}>
                          ⭐ {r.nota}/5
                        </span>
                      ) : (
                        <span style={{color: 'var(--color-neutral-400)'}}>-</span>
                      )}
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
          </div>
        )}
      </div>
    </div>
  );
}