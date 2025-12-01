import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, FileText, Paperclip, HelpCircle } from 'lucide-react';
import AnexosChecklist from '@/components/AnexosChecklist';
import RegistroDiarioDescritivoAjuda from './RegistroDiarioDescritivoAjuda';

export default function RegistroDiarioDescritivo() {
  const [formData, setFormData] = useState({
    meta_id: '',
    data: '',
    observacao: '',
  });
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ajudaOpen, setAjudaOpen] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (id === 'novo') {
        const pacientesData = await ApiService.getPacientes();
        setPacientes(pacientesData);
        setFormData({
          meta_id: '',
          data: '',
          observacao: '',
        });
        setPacienteSelecionado(null);
        setMetas([]);
      } else {
        const [registro, pacientesData] = await Promise.all([
          ApiService.getChecklistDiario(id),
          ApiService.getPacientes()
        ]);
        
        setPacientes(pacientesData);
        const pacienteSel = pacientesData.find(p => p.id === registro.paciente_id);
        setPacienteSelecionado(pacienteSel);
        
        if (registro.paciente_id) {
          const metasFormulariosData = await ApiService.getMetasEFormulariosPaciente(registro.paciente_id);
          setMetas(metasFormulariosData.metas);
        }
        
        setFormData({
          meta_id: registro.meta_id ? registro.meta_id.toString() : '',
          data: registro.data || '',
          observacao: registro.observacao || '',
        });
      }
    } catch (error) {
      // console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registro: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarMetas = async (pacienteId) => {
    try {
      if (!pacienteId) return;
      
      const dados = await ApiService.getMetasEFormulariosPaciente(pacienteId);
      setPacienteSelecionado(dados.paciente);
      setMetas(dados.metas || []);
      setFormData(prev => ({ ...prev, meta_id: '' }));
    } catch (error) {
      // console.error('Erro ao carregar metas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar metas: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.observacao || formData.observacao.trim() === '') {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, preencha a descrição da sessão.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        meta_id: formData.meta_id ? parseInt(formData.meta_id) : null,
        nota: null,
        respostas: {}, // Registro descritivo não tem respostas de Protocolo
        formulario_id: null // Não tem Protocolo vinculado
      };

      if (id === 'novo') {
        await ApiService.createChecklistDiario(payload);
        toast({ title: 'Sucesso', description: 'Descrição da sessão criada com sucesso!' });
      } else {
        await ApiService.updateChecklistDiario(id, payload);
        toast({ title: 'Sucesso', description: 'Descrição da sessão atualizada com sucesso!' });
      }
      navigate('/registro-diario');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar descrição: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl border border-gray-100">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-500 border-r-blue-400 absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800 mb-1">Carregando registro</p>
            <p className="text-sm text-gray-500">Aguarde um momento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="page-section mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/registro-diario')}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft size={16} />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="page-title">
                <FileText className="inline mr-2" size={24} />
                {id === 'novo' ? 'Nova Descrição de Sessão' : 'Editar Descrição de Sessão'}
              </h1>
              <Button
                onClick={() => setAjudaOpen(true)}
                variant="outline"
                size="icon"
                className="h-10 w-10"
                title="Abrir guia de ajuda"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
            <p className="page-subtitle">Registre observações e detalhes sobre a sessão realizada</p>
          </div>
        </div>
      </div>

      {/* Card Principal */}
      <div className="card-spacing">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <div>
            <div className="section-header mb-6">
              <AlertCircle size={18} className="color-info-icon" />
              <h2 className="section-header-title">Informações Básicas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paciente */}
              <div className="form-group">
                <Label className="font-semibold mb-2 block">Paciente *</Label>
                <Select
                  value={pacienteSelecionado ? pacienteSelecionado.id.toString() : ''}
                  onValueChange={v => carregarMetas(v)}
                  required
                  open={pacientes.length > 0 ? undefined : false}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Meta */}
              <div className="form-group">
                <Label className="font-semibold mb-2 block">Meta Terapêutica *</Label>
                <Select
                  value={formData.meta_id ? formData.meta_id.toString() : ''}
                  onValueChange={v => setFormData({ ...formData, meta_id: v })}
                  required
                  open={metas.length > 0 ? undefined : false}
                  disabled={!pacienteSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!pacienteSelecionado ? "Selecione o paciente primeiro" : "Selecione a meta"} />
                  </SelectTrigger>
                  <SelectContent>
                    {metas.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.descricao || `Meta ${m.id}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="form-group md:col-span-2">
                <Label className="font-semibold mb-2 block">Data *</Label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={e => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div className="border-t pt-8" style={{borderTopColor: 'var(--color-neutral-200)'}}>
            <div className="section-header mb-6">
              <Paperclip size={18} className="color-info-icon" />
              <h2 className="section-header-title">Anexos</h2>
            </div>
            <p className="card-text mb-6">
              {id === 'novo' 
                ? 'Você poderá adicionar anexos após salvar a descrição da sessão.'
                : 'Adicione fotos, vídeos, documentos ou outros arquivos relacionados a esta sessão.'
              }
            </p>
            {id !== 'novo' && <AnexosChecklist checklistId={id} />}
            {id === 'novo' && (
              <div className="alert alert-info">
                <AlertCircle className="alert-icon" />
                <p className="alert-content">Salve a descrição primeiro para poder adicionar anexos.</p>
              </div>
            )}
          </div>

          {/* Descrição da Sessão */}
          <div className="border-t pt-8" style={{borderTopColor: 'var(--color-neutral-200)'}}>
            <div className="section-header mb-6">
              <FileText size={18} className="color-success-icon" />
              <h2 className="section-header-title">Descrição da Sessão</h2>
            </div>
            <p className="card-text mb-6">
              Descreva como foi a sessão, materiais utilizados, observações importantes, progressos ou dificuldades do paciente.
            </p>

            <div className="form-group">
              <Label className="font-semibold mb-3 block text-base">Relato Detalhado da Sessão *</Label>
              <textarea
                value={formData.observacao || ''}
                onChange={e => setFormData({ ...formData, observacao: e.target.value })}
                rows={15}
                required
                placeholder="Digite aqui o relato detalhado da sessão...&#10;&#10;Exemplo:&#10;- Materiais utilizados: ...&#10;- Atividades realizadas: ...&#10;- Comportamento do paciente: ...&#10;- Dificuldades encontradas: ...&#10;- Progressos observados: ...&#10;- Observações importantes: ..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm leading-relaxed"
                style={{
                  borderColor: 'var(--color-neutral-300)',
                  fontFamily: 'inherit'
                }}
              />
              <p className="text-xs mt-2" style={{color: 'var(--color-neutral-500)'}}>
                {formData.observacao?.length || 0} caracteres
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 pt-6 border-t" style={{borderTopColor: 'var(--color-neutral-200)'}}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/registro-diario')} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: '#0ea5e9', color: 'white' }}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar Descrição
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <RegistroDiarioDescritivoAjuda open={ajudaOpen} onOpenChange={setAjudaOpen} />
    </div>
  );
}
