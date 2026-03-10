import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Save, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import ApiService from '@/lib/api'

export default function RespostaMetaEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [planos, setPlanos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  
  const [form, setForm] = useState({
    plano_id: '',
    paciente_id: '',
    profissional_id: '',
    sessao: '',
    data_sessao: '',
    hr_inicio: '',
    hr_termino: '',
    observacoes: '',
    metas: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = !id || id === 'novo';

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (form.plano_id && planos.length > 0) {
      // Garantir conversão para número
      const planoId = parseInt(form.plano_id);
      console.log('Selecionou plano com ID:', planoId);
      
      // Não usar a lista local, buscar direto o plano detalhado
      // pois getPlanosTerapeuticos() pode não retornar as metas
      // skipInitialize = true quando estiver em modo edição (!isNew)
      loadPlanoComMetas(planoId, !isNew);
    }
  }, [form.plano_id, planos]);

  const loadPlanoComMetas = async (planoId, skipInitialize = false) => {
    try {
      console.log('Carregando plano detalhado:', planoId);
      const plano = await ApiService.getPlanoTerapeutico(planoId);
      console.log('Plano carregado:', plano);
      
      setPlanoSelecionado(plano);
      
      // Não inicializar metas se já temos dados (modo edição)
      if (skipInitialize) {
        console.log('Modo edição: não reinicializando metas');
        return;
      }
      
      // Inicializar metas com seus objetivos quando plano for selecionado (apenas para nova resposta)
      if (plano && plano.metas && plano.metas.length > 0 && (!form.metas || form.metas.length === 0)) {
        const metas = plano.metas.map(meta => ({
          meta_id: meta.id,
          meta_titulo: meta.titulo,
          titulo: meta.titulo,
          descricao: meta.descricao,
          objetivos: (meta.objetivos || []).map(objetivo => ({
            objetivo_id: objetivo.id,
            objetivo_titulo: objetivo.titulo,
            titulo: objetivo.titulo,
            descricao: objetivo.descricao,
            acertos: 0,
            erros: 0,
            com_suporte: 0,
            sem_resposta: 0
          }))
        }));
        console.log('Inicializando metas com objetivos:', metas);
        setForm(f => ({ ...f, metas }));
      } else if (!plano || !plano.metas || plano.metas.length === 0) {
        console.warn('Plano não tem metas vinculadas');
        if (!skipInitialize) {
          setForm(f => ({ ...f, metas: [] }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar plano detalhado:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar metas do plano',
        variant: 'destructive',
      });
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      let planosData = [];
      let pacientesData = [];
      let profissionaisData = [];
      
      try {
        planosData = await ApiService.getPlanosTerapeuticos();
        console.log('✓ Planos carregados:', planosData);
        setPlanos(planosData);
      } catch (error) {
        console.error('✗ Erro ao carregar planos:', error);
        toast({
          title: 'Aviso',
          description: 'Erro ao carregar planos terapêuticos',
          variant: 'destructive',
        });
      }
      
      try {
        pacientesData = await ApiService.getPacientes();
        setPacientes(pacientesData);
      } catch (error) {
        console.error('✗ Erro ao carregar pacientes:', error);
        toast({
          title: 'Aviso',
          description: 'Erro ao carregar pacientes',
          variant: 'destructive',
        });
      }
      
      try {
        profissionaisData = await ApiService.getProfissionais();
        setProfissionais(profissionaisData);
      } catch (error) {
        console.error('✗ Erro ao carregar profissionais:', error);
        toast({
          title: 'Aviso',
          description: 'Erro ao carregar profissionais',
          variant: 'destructive',
        });
      }
      
      if (!isNew) {
        try {
          const resposta = await ApiService.getRespostaMeta(id);
          setForm({
            plano_id: resposta.plano_id || '',
            paciente_id: resposta.paciente_id || '',
            profissional_id: resposta.profissional_id || '',
            sessao: resposta.sessao || '',
            data_sessao: resposta.data_sessao || '',
            hr_inicio: resposta.hr_inicio || '',
            hr_termino: resposta.hr_termino || '',
            observacoes: resposta.observacoes || '',
            metas: resposta.metas || []
          });
          
          // Buscar plano detalhado
          const plano = await ApiService.getPlanoTerapeutico(resposta.plano_id);
          setPlanoSelecionado(plano);
        } catch (error) {
          console.error('Erro ao carregar resposta:', error);
          toast({
            title: 'Erro',
            description: 'Erro ao carregar resposta de meta',
            variant: 'destructive',
          });
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

  const handleMetaChange = (metaIndex, objetivoIndex, field, value) => {
    const newMetas = [...form.metas];
    newMetas[metaIndex].objetivos[objetivoIndex] = {
      ...newMetas[metaIndex].objetivos[objetivoIndex],
      [field]: field.includes('acertos') || field.includes('erros') || field.includes('com_suporte') || field.includes('sem_resposta') 
        ? parseInt(value) || 0 
        : value
    };
    setForm(f => ({ ...f, metas: newMetas }));
  };

  const incrementCounter = (metaIndex, objetivoIndex, field) => {
    const newMetas = [...form.metas];
    const currentValue = parseInt(newMetas[metaIndex].objetivos[objetivoIndex][field]) || 0;
    newMetas[metaIndex].objetivos[objetivoIndex][field] = currentValue + 1;
    setForm(f => ({ ...f, metas: newMetas }));
  };

  const decrementCounter = (metaIndex, objetivoIndex, field) => {
    const newMetas = [...form.metas];
    const currentValue = parseInt(newMetas[metaIndex].objetivos[objetivoIndex][field]) || 0;
    newMetas[metaIndex].objetivos[objetivoIndex][field] = Math.max(0, currentValue - 1);
    setForm(f => ({ ...f, metas: newMetas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!form.plano_id) {
      toast({
        title: 'Erro',
        description: 'Selecione um plano terapêutico',
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

    if (!form.metas || form.metas.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione metas para registrar a resposta',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      
      const payload = {
        plano_id: parseInt(form.plano_id),
        paciente_id: parseInt(form.paciente_id),
        profissional_id: parseInt(form.profissional_id),
        sessao: form.sessao,
        data_sessao: form.data_sessao,
        hr_inicio: form.hr_inicio || null,
        hr_termino: form.hr_termino || null,
        metas: form.metas.map(meta => ({
          meta_id: meta.meta_id,
          meta_titulo: meta.meta_titulo,
          objetivos: (meta.objetivos || []).map(objetivo => ({
            objetivo_id: objetivo.objetivo_id,
            objetivo_titulo: objetivo.objetivo_titulo,
            acertos: objetivo.acertos,
            erros: objetivo.erros,
            com_suporte: objetivo.com_suporte,
            sem_resposta: objetivo.sem_resposta
          }))
        }))
      };
      
      if (isNew) {
        await ApiService.createRespostaMeta(payload);
        toast({
          title: 'Sucesso',
          description: 'Resposta de meta criada com sucesso!',
        });
      } else {
        await ApiService.updateRespostaMeta(id, payload);
        toast({
          title: 'Sucesso',
          description: 'Resposta de meta atualizada com sucesso!',
        });
      }
      
      navigate('/resposta-meta');
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
            onClick={() => navigate('/resposta-meta')}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title">{isNew ? 'Nova Resposta de Meta' : 'Editar Resposta de Meta'}</h1>
            <p className="page-subtitle">Registre a execução de uma meta terapêutica</p>
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
            {/* Plano Terapêutico */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Plano Terapêutico *</Label>
              <Select
                value={String(form.plano_id || '')}
                onValueChange={(v) => {
                  console.log('Selecionou plano:', v);
                  handleFormChange('plano_id', v);
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {planos && planos.length > 0 ? (
                    planos.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.paciente_nome} - {p.profissional_nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="">Nenhum plano disponível</SelectItem>
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
                onValueChange={(v) => handleFormChange('paciente_id', v)}
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
                onValueChange={(v) => handleFormChange('profissional_id', v)}
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
              <Label className="font-semibold mb-2 block">Nome da Sessão</Label>
              <Input
                type="text"
                value={form.sessao}
                onChange={e => handleFormChange('sessao', e.target.value)}
                placeholder="Ex: Sessão 1, Revisão mensal"
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Data Sessão */}
            <div className="grid gap-2">
              <Label className="font-semibold mb-2 block">Data da Sessão *</Label>
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

        {/* Seção Metas e Respostas */}
        {(form.plano_id && form.metas && form.metas.length > 0) && (
          <div className="card-spacing">
            <div className="section-header mb-6">
              <h2 className="section-header-title">Resposta de Metas</h2>
            </div>
            <p className="card-text mb-6">Para cada objetivo, registre os resultados usando os botões + e -</p>

            <div className="space-y-6">
              {form.metas.map((meta, metaIndex) => (
                <div key={metaIndex} className="border rounded-lg overflow-hidden" style={{borderColor: 'var(--color-neutral-200)'}}>
                  {/* Header da Meta */}
                  <div className="bg-gradient-to-r p-4" style={{background: 'linear-gradient(135deg, var(--color-info-50) 0%, var(--color-info-100) 100%)'}}>
                    <h3 className="font-bold text-lg" style={{color: 'var(--color-info-900)'}}>
                      {meta.titulo}
                    </h3>
                    {meta.descricao && (
                      <p className="text-sm mt-2" style={{color: 'var(--color-info-700)'}}>
                        {meta.descricao}
                      </p>
                    )}
                  </div>

                  {/* Objetivos dentro da Meta */}
                  <div className="p-4">
                    {meta.objetivos && meta.objetivos.length > 0 ? (
                      <div className="space-y-4">
                        {meta.objetivos.map((objetivo, objetivoIndex) => (
                          <div key={objetivoIndex} className="border rounded-lg p-4" style={{borderColor: 'var(--color-neutral-300)'}}>
                            {/* Header do Objetivo */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-base mb-1">
                                {objetivo.titulo}
                              </h4>
                              {objetivo.descricao && (
                                <p className="text-sm text-gray-600">
                                  {objetivo.descricao}
                                </p>
                              )}
                            </div>

                            {/* Contadores do Objetivo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                                    onClick={() => decrementCounter(metaIndex, objetivoIndex, 'acertos')}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-success-700)'}}>
                                    {objetivo.acertos}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => incrementCounter(metaIndex, objetivoIndex, 'acertos')}
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
                                    onClick={() => decrementCounter(metaIndex, objetivoIndex, 'erros')}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-danger-700)'}}>
                                    {objetivo.erros}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => incrementCounter(metaIndex, objetivoIndex, 'erros')}
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
                                    onClick={() => decrementCounter(metaIndex, objetivoIndex, 'com_suporte')}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-warning-700)'}}>
                                    {objetivo.com_suporte}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => incrementCounter(metaIndex, objetivoIndex, 'com_suporte')}
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
                                    onClick={() => decrementCounter(metaIndex, objetivoIndex, 'sem_resposta')}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-2xl font-bold flex-1 text-center" style={{color: 'var(--color-neutral-700)'}}>
                                    {objetivo.sem_resposta}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => incrementCounter(metaIndex, objetivoIndex, 'sem_resposta')}
                                    className="h-8 w-8 p-0"
                                    style={{borderColor: 'var(--color-neutral-300)', color: 'var(--color-neutral-700)'}}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Esta meta não tem objetivos vinculados</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção Observações */}
        <div className="card-spacing">
          <div className="section-header mb-6">
            <h2 className="section-header-title">Observações</h2>
          </div>
          <p className="card-text mb-6">Registre observações e comentários sobre a execução das metas</p>

          <div className="grid gap-2">
            <Label className="font-semibold mb-2 block">Observações</Label>
            <Textarea
              value={form.observacoes}
              onChange={e => handleFormChange('observacoes', e.target.value)}
              placeholder="Descreva como foi a execução das metas, dificuldades encontradas, etc."
              className="min-h-32"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/resposta-meta')}
            className="flex items-center gap-2 h-10"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{ backgroundColor: '#8b5cf6', color: 'white' }}
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
