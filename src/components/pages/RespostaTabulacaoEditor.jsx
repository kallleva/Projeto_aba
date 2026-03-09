import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import { ArrowLeft, Save, X, Plus, Minus } from 'lucide-react';

export default function RespostaTabulacaoEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tabulacoes, setTabulacoes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [tabulacaoSelecionada, setTabulacaoSelecionada] = useState(null);
  
  const [form, setForm] = useState({
    tabulacao_formulario_id: '',
    paciente_id: '',
    profissional_id: '',
    sessao: '',
    data_sessao: '',
    hr_inicio: '',
    hr_termino: '',
    itens: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = !id || id === 'novo';

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (form.tabulacao_formulario_id && tabulacoes.length > 0) {
      // Garantir conversão para número
      const tabulacaoId = parseInt(form.tabulacao_formulario_id);
      console.log('Buscando tabulação com ID:', tabulacaoId);
      const tab = tabulacoes.find(t => t.id === tabulacaoId);
      
      console.log('Tabulação encontrada:', tab);
      setTabulacaoSelecionada(tab);
      
      // Inicializar itens quando tabulação for selecionada
      if (tab && (!form.itens || form.itens.length === 0)) {
        const itens = tab.itens.map(item => ({
          item_tabulacao_id: item.id,
          topico: item.topico,
          codigo: item.codigo,
          descricao: item.descricao,
          acertos: 0,
          erros: 0,
          com_suporte: 0,
          sem_resposta: 0
        }));
        console.log('Inicializando itens:', itens);
        setForm(f => ({ ...f, itens }));
      }
    }
  }, [form.tabulacao_formulario_id, tabulacoes]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados sequencialmente para identificar qual uma falha
      let tabulacoesData = [];
      let pacientesData = [];
      let profissionaisData = [];
      
      try {
        tabulacoesData = await ApiService.getTabulacoes();
        console.log('✓ Tabulações carregadas:', tabulacoesData);
      } catch (error) {
        console.error('✗ Erro ao carregar tabulações:', error);
        throw new Error(`Erro ao carregar tabulações: ${error.message}`);
      }
      
      try {
        pacientesData = await ApiService.getPacientes();
        console.log('✓ Pacientes carregados:', pacientesData);
      } catch (error) {
        console.error('✗ Erro ao carregar pacientes:', error);
        throw new Error(`Erro ao carregar pacientes: ${error.message}`);
      }
      
      try {
        profissionaisData = await ApiService.getProfissionais();
        console.log('✓ Profissionais carregados:', profissionaisData);
      } catch (error) {
        console.error('✗ Erro ao carregar profissionais:', error);
        throw new Error(`Erro ao carregar profissionais: ${error.message}`);
      }
      
      setTabulacoes(tabulacoesData);
      setPacientes(pacientesData);
      setProfissionais(profissionaisData);
      
      // Se não é novo, carregar dados existentes
      if (!isNew) {
        try {
          console.log('Carregando resposta existente com ID:', id);
          const resposta = await ApiService.getRespostaTabulacao(id);
          console.log('✓ Resposta carregada:', resposta);
          
          setForm({
            tabulacao_formulario_id: resposta.tabulacao_formulario_id,
            paciente_id: resposta.paciente_id,
            profissional_id: resposta.profissional_id,
            sessao: resposta.sessao,
            data_sessao: resposta.data_sessao ? resposta.data_sessao.split('T')[0] : '',
            hr_inicio: resposta.hr_inicio || '',
            hr_termino: resposta.hr_termino || '',
            itens: resposta.itens
          });
          
          const tab = tabulacoesData.find(t => t.id === resposta.tabulacao_formulario_id);
          setTabulacaoSelecionada(tab);
        } catch (error) {
          console.error('✗ Erro ao carregar resposta existente:', error);
          throw new Error(`Erro ao carregar resposta: ${error.message}`);
        }
      }
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

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleItemChange = (itemIndex, field, value) => {
    const newItens = [...form.itens];
    newItens[itemIndex] = {
      ...newItens[itemIndex],
      [field]: field.includes('acertos') || field.includes('erros') || field.includes('com_suporte') || field.includes('sem_resposta') 
        ? parseInt(value) || 0 
        : value
    };
    setForm(f => ({ ...f, itens: newItens }));
  };

  const incrementCounter = (itemIndex, field) => {
    const newItens = [...form.itens];
    const currentValue = parseInt(newItens[itemIndex][field]) || 0;
    newItens[itemIndex][field] = currentValue + 1;
    setForm(f => ({ ...f, itens: newItens }));
  };

  const decrementCounter = (itemIndex, field) => {
    const newItens = [...form.itens];
    const currentValue = parseInt(newItens[itemIndex][field]) || 0;
    newItens[itemIndex][field] = Math.max(0, currentValue - 1);
    setForm(f => ({ ...f, itens: newItens }));
  };

  // Agrupar itens por tópico
  const agruparPorTopico = () => {
    const grupos = {};
    form.itens.forEach((item, index) => {
      if (!grupos[item.topico]) {
        grupos[item.topico] = [];
      }
      grupos[item.topico].push({ ...item, index });
    });
    return grupos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!form.tabulacao_formulario_id) {
      toast({
        title: 'Erro',
        description: 'Selecione uma tabulação',
        variant: 'destructive',
      });
      return;
    }
    
    if (!form.paciente_id) {
      toast({
        title: 'Erro',
        description: 'Selecione um paciente',
        variant: 'destructive',
      });
      return;
    }
    
    if (!form.profissional_id) {
      toast({
        title: 'Erro',
        description: 'Selecione um profissional',
        variant: 'destructive',
      });
      return;
    }
    
    if (!form.data_sessao) {
      toast({
        title: 'Erro',
        description: 'Selecione a data da sessão',
        variant: 'destructive',
      });
      return;
    }
    
    if (!form.itens || form.itens.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione itens de resposta',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      
      const payload = {
        ...form,
        tabulacao_formulario_id: parseInt(form.tabulacao_formulario_id),
        paciente_id: parseInt(form.paciente_id),
        profissional_id: parseInt(form.profissional_id),
        data_sessao: new Date(form.data_sessao).toISOString(),
        itens: form.itens.map(item => ({
          item_tabulacao_id: item.item_tabulacao_id,
          acertos: item.acertos,
          erros: item.erros,
          com_suporte: item.com_suporte,
          sem_resposta: item.sem_resposta
        }))
      };
      
      if (isNew) {
        await ApiService.createRespostaTabulacao(payload);
        toast({
          title: 'Sucesso',
          description: 'Resposta de tabulação criada com sucesso!',
        });
      } else {
        await ApiService.updateRespostaTabulacao(id, payload);
        toast({
          title: 'Sucesso',
          description: 'Resposta de tabulação atualizada com sucesso!',
        });
      }
      
      navigate('/resposta-tabulacao');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 mx-auto mb-4" style={{borderColor: 'var(--color-info-200)', borderTopColor: 'var(--color-info-500)'}}></div>
          <p className="text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-section">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/resposta-tabulacao')}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title">{isNew ? 'Nova Resposta de Tabulação' : 'Editar Resposta de Tabulação'}</h1>
            <p className="page-subtitle">Registre as respostas e resultados da avaliação</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Dados Básicos */}
        <div className="card-spacing">
          <div className="section-header mb-6">
            <h2 className="section-header-title">Dados Básicos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Tabulação */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Tabulação *</Label>
              <Select
                value={String(form.tabulacao_formulario_id || '')}
                onValueChange={(v) => {
                  console.log('Selecionou tabulação:', v);
                  handleFormChange('tabulacao_formulario_id', v);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione uma tabulação" />
                </SelectTrigger>
                <SelectContent>
                  {tabulacoes && tabulacoes.length > 0 ? (
                    tabulacoes.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">Nenhuma tabulação disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {isNew && <p className="text-xs text-gray-500">* Obrigatório. Não pode ser alterado após criar.</p>}
            </div>

            {/* Paciente */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Paciente *</Label>
              <Select
                value={String(form.paciente_id || '')}
                onValueChange={(v) => {
                  console.log('Selecionou paciente:', v);
                  handleFormChange('paciente_id', v);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes && pacientes.length > 0 ? (
                    pacientes.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">Nenhum paciente disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Profissional */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Profissional *</Label>
              <Select
                value={String(form.profissional_id || '')}
                onValueChange={(v) => {
                  console.log('Selecionou profissional:', v);
                  handleFormChange('profissional_id', v);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {profissionais && profissionais.length > 0 ? (
                    profissionais.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">Nenhum profissional disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sessão */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Sessão</Label>
              <Input
                type="text"
                placeholder="Ex: Sessão 1, Avaliação Inicial"
                value={form.sessao}
                onChange={e => handleFormChange('sessao', e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Data Sessão */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Data da Sessão</Label>
              <Input
                type="date"
                value={form.data_sessao}
                onChange={e => handleFormChange('data_sessao', e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Horário Início */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Horário Início</Label>
              <Input
                type="time"
                value={form.hr_inicio}
                onChange={e => handleFormChange('hr_inicio', e.target.value)}
                className="h-10"
              />
            </div>

            {/* Horário Término */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Horário Término</Label>
              <Input
                type="time"
                value={form.hr_termino}
                onChange={e => handleFormChange('hr_termino', e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Seção Itens de Resposta */}
        {tabulacaoSelecionada && form.itens.length > 0 && (
          <div className="card-spacing">
            <div className="section-header mb-6">
              <h2 className="section-header-title">Itens de Resposta</h2>
            </div>
            <p className="card-text mb-6">Para cada item, registre os resultados usando os botões + e -</p>

            <div className="space-y-6">
              {Object.entries(agruparPorTopico()).map(([topico, itens]) => (
                <div key={topico} className="border rounded-lg overflow-hidden" style={{borderColor: 'var(--color-neutral-200)'}}>
                  {/* Header do Tópico */}
                  <div className="bg-gradient-to-r p-4" style={{background: 'linear-gradient(135deg, var(--color-info-50) 0%, var(--color-info-100) 100%)'}}>
                    <h3 className="font-bold text-lg" style={{color: 'var(--color-info-900)'}}>
                      {topico}
                    </h3>
                    <p className="text-sm mt-1" style={{color: 'var(--color-info-700)'}}>
                      {itens.length} item{itens.length !== 1 ? 'ns' : ''}
                    </p>
                  </div>

                  {/* Itens do Tópico */}
                  <div className="divide-y" style={{borderColor: 'var(--color-neutral-200)'}}>
                    {itens.map((itemWrapper) => {
                      const item = form.itens[itemWrapper.index];
                      const itemIndex = itemWrapper.index;
                      
                      return (
                        <div key={itemIndex} className="p-4">
                          {/* Código e Descrição */}
                          <div className="mb-4 pb-4 border-b" style={{borderColor: 'var(--color-neutral-100)'}}>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <p className="text-xs font-medium" style={{color: 'var(--color-neutral-500)'}}>
                                  CÓDIGO
                                </p>
                                <p className="font-mono font-bold text-base" style={{color: 'var(--color-info-700)'}}>
                                  {item.codigo}
                                </p>
                              </div>
                              <span className="badge" style={{backgroundColor: 'var(--color-info-100)', color: 'var(--color-info-800)', fontSize: '11px'}}>
                                Item {itemIndex + 1}
                              </span>
                            </div>
                            {item.descricao && (
                              <div className="mt-3">
                                <p className="text-xs font-medium" style={{color: 'var(--color-neutral-500)'}}>
                                  DESCRIÇÃO
                                </p>
                                <p className="text-sm leading-relaxed mt-1" style={{color: 'var(--color-neutral-700)'}}>
                                  {item.descricao}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Contadores */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Acertos */}
                            <div className="border rounded-lg p-3" style={{borderColor: 'var(--color-success-200)', backgroundColor: 'var(--color-success-50)'}}>
                              <Label className="text-xs font-semibold block mb-2" style={{color: 'var(--color-success-900)'}}>
                                ✓ Acertos
                              </Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => decrementCounter(itemIndex, 'acertos')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-success-700)'}}>
                                  {item.acertos}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => incrementCounter(itemIndex, 'acertos')}
                                  className="h-8 w-8 p-0"
                                  style={{borderColor: 'var(--color-success-300)', color: 'var(--color-success-700)'}}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Erros */}
                            <div className="border rounded-lg p-3" style={{borderColor: 'var(--color-danger-200)', backgroundColor: 'var(--color-danger-50)'}}>
                              <Label className="text-xs font-semibold block mb-2" style={{color: 'var(--color-danger-900)'}}>
                                ✗ Erros
                              </Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => decrementCounter(itemIndex, 'erros')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-danger-700)'}}>
                                  {item.erros}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => incrementCounter(itemIndex, 'erros')}
                                  className="h-8 w-8 p-0"
                                  style={{borderColor: 'var(--color-danger-300)', color: 'var(--color-danger-700)'}}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Com Suporte */}
                            <div className="border rounded-lg p-3" style={{borderColor: 'var(--color-warning-200)', backgroundColor: 'var(--color-warning-50)'}}>
                              <Label className="text-xs font-semibold block mb-2" style={{color: 'var(--color-warning-900)'}}>
                                🤝 Com Suporte
                              </Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => decrementCounter(itemIndex, 'com_suporte')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-warning-700)'}}>
                                  {item.com_suporte}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => incrementCounter(itemIndex, 'com_suporte')}
                                  className="h-8 w-8 p-0"
                                  style={{borderColor: 'var(--color-warning-300)', color: 'var(--color-warning-700)'}}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Sem Resposta */}
                            <div className="border rounded-lg p-3" style={{borderColor: 'var(--color-neutral-200)', backgroundColor: 'var(--color-neutral-50)'}}>
                              <Label className="text-xs font-semibold block mb-2" style={{color: 'var(--color-neutral-900)'}}>
                                — Sem Resposta
                              </Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => decrementCounter(itemIndex, 'sem_resposta')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-neutral-700)'}}>
                                  {item.sem_resposta}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => incrementCounter(itemIndex, 'sem_resposta')}
                                  className="h-8 w-8 p-0"
                                  style={{borderColor: 'var(--color-neutral-300)', color: 'var(--color-neutral-700)'}}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/resposta-tabulacao')}
            className="flex items-center gap-2 h-10"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: '#10b981', color: 'white' }}
            disabled={saving}
            className="flex items-center gap-2 h-10"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar Resposta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
