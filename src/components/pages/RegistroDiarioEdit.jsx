import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';



export default function RegistroDiarioEdit() {
  const [formData, setFormData] = useState({
    meta_id: '',
    data: '',
    nota: '',
    observacao: '',
    respostas: {},
  });
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [metas, setMetas] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [formularioSelecionado, setFormularioSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errosObrigatorios, setErrosObrigatorios] = useState({});
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    let registroPerguntasArray = [];
    try {
      setLoading(true);
      if (id === 'novo') {
        // Cadastro novo: carrega apenas pacientes
        const pacientesData = await ApiService.getPacientes();
        setPacientes(pacientesData);
        setFormData({
          meta_id: '',
          data: '',
          nota: '',
          observacao: '',
          respostas: {},
        });
        setPacienteSelecionado(null);
        setMetas([]);
        setFormularios([]);
        setFormularioSelecionado(null);
        setPerguntas([]);
        window.__registroPerguntasArray = [];
      } else {
        // Edição: carrega registro + pacientes
        const [registro, pacientesData] = await Promise.all([
          ApiService.getChecklistDiario(id),
          ApiService.getPacientes()
        ]);
        console.log('📋 Registro carregado:', registro);
        console.log('📋 Paciente ID do registro:', registro.paciente_id);
        console.log('📋 Meta ID do registro:', registro.meta_id);
        console.log('📋 Formulario ID do registro:', registro.formulario_id);
        console.log('📋 Formulario Nome do registro:', registro.formulario_nome);
        
        setPacientes(pacientesData);
        
        // Encontrar o paciente selecionado
        const pacienteSel = pacientesData.find(p => p.id === registro.paciente_id);
        setPacienteSelecionado(pacienteSel);
        
        // Buscar metas e formulários do paciente
        let metasCarregadas = [];
        let formulariosCarregados = [];
        
        if (registro.paciente_id) {
          const metasFormulariosData = await ApiService.getMetasEFormulariosPaciente(registro.paciente_id);
          metasCarregadas = metasFormulariosData.metas;
          formulariosCarregados = metasFormulariosData.formularios;
          setMetas(metasCarregadas);
          setFormularios(formulariosCarregados);
        }
        
        // Montar respostas preenchidas
        let respostasPreenchidas = {};
        if (registro.perguntas && Array.isArray(registro.perguntas)) {
          console.log('🔄 Carregando respostas do registro...');
          registro.perguntas.forEach((pr, idx) => {
            const pergunta = pr.pergunta;
            const perguntaId = pergunta?.id;
            let respostaValor = '';
            if (pr.resposta) {
              if (pr.resposta.eh_formula || pr.resposta.eh_percentual) {
                respostaValor = pr.resposta.resposta_calculada || pr.resposta.resposta || '';
              } else {
                respostaValor = pr.resposta.resposta || '';
              }
            }
            const key = perguntaId ? perguntaId.toString() : undefined;
            if (key) {
              respostasPreenchidas[key] = respostaValor;
              if (idx < 3) {
                console.log(`  → Pergunta ID: ${key}, Resposta: ${respostaValor}, Sigla: ${pergunta?.sigla}`);
              }
            }
          });
          console.log('✅ Total de respostas carregadas:', Object.keys(respostasPreenchidas).length);
          registroPerguntasArray = registro.perguntas;
        }
        
        // Definir formData com todos os dados carregados
        setFormData({
          meta_id: registro.meta_id ? registro.meta_id.toString() : '',
          data: registro.data || '',
          nota: registro.nota ? registro.nota.toString() : '',
          observacao: registro.observacao || '',
          respostas: respostasPreenchidas,
        });
        
        // Selecionar o formulário correto
        let formSel = null;
        let perguntasSel = [];
        
        if (registro.formulario_id && formulariosCarregados.length > 0) {
          formSel = formulariosCarregados.find(f => f.id === registro.formulario_id);
          console.log('📋 Formulário selecionado:', formSel?.nome);
          perguntasSel = (formSel && formSel.perguntas) ? formSel.perguntas : [];
        }
        
        setFormularioSelecionado(formSel);
        setPerguntas(perguntasSel);
        window.__registroPerguntasArray = registroPerguntasArray;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar registro: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarPerguntas = (formularioId) => {
    if (!formularioId) {
      console.warn('⚠️ formularioId vazio');
      return;
    }
    
    const formulario = formularios.find(f => f.id === parseInt(formularioId));
    if (!formulario) {
      console.warn('⚠️ Formulário não encontrado:', formularioId);
      return;
    }
    
    console.log('📋 Carregando perguntas do formulário:', formulario.nome, 'Total:', formulario.perguntas?.length);
    setFormularioSelecionado(formulario);
    setPerguntas(formulario.perguntas || []);
    
    // Mantém respostas já preenchidas para perguntas que existem, e deixa novas em branco
    setFormData(prev => {
      const novasRespostas = {};
      if (formulario && formulario.perguntas) {
        formulario.perguntas.forEach(pergunta => {
          const key = pergunta.id.toString();
          novasRespostas[key] = prev.respostas[key] || '';
        });
      }
      return { ...prev, respostas: novasRespostas };
    });
  };

  const carregarMetasEFormularios = async (pacienteId) => {
    try {
      console.log('🔄 Carregando metas e formulários para paciente:', pacienteId);
      if (!pacienteId) {
        console.warn('⚠️ pacienteId vazio, abortando carregamento');
        return;
      }
      
      const dados = await ApiService.getMetasEFormulariosPaciente(pacienteId);
      console.log('✅ Dados carregados:', { paciente: dados.paciente?.nome, metas: dados.metas?.length, formularios: dados.formularios?.length });
      
      setPacienteSelecionado(dados.paciente);
      setMetas(dados.metas || []);
      setFormularios(dados.formularios || []);
      setFormData(prev => ({ ...prev, meta_id: '' }));
      setFormularioSelecionado(null);
      setPerguntas([]);
    } catch (error) {
      console.error('❌ Erro ao carregar metas e formulários:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar metas e formulários: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRespostaChange = (perguntaKey, valor) => {
    setFormData((prev) => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [perguntaKey]: valor,
      },
    }));
    // Limpa erro desta pergunta caso exista
    if (errosObrigatorios[perguntaKey]) {
      setErrosObrigatorios((prev) => {
        const novo = { ...prev };
        delete novo[perguntaKey];
        return novo;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Montar respostas apenas das perguntas do formulário selecionado
      const respostasPorId = {};
      if (formularioSelecionado && formularioSelecionado.perguntas) {
        formularioSelecionado.perguntas.forEach(p => {
          const keyId = p.id.toString();
          const keySigla = p.sigla;
          let valor = '';
          if (keySigla && formData.respostas[keySigla] !== undefined) {
            valor = formData.respostas[keySigla];
          } else if (formData.respostas[keyId] !== undefined) {
            valor = formData.respostas[keyId];
          }
          respostasPorId[keyId] = valor;
        });
      }
      // Validação cliente: perguntas obrigatórias não respondidas
      const erros = {};
      const faltantes = [];
      if (formularioSelecionado && formularioSelecionado.perguntas) {
        formularioSelecionado.perguntas.forEach(p => {
          if (p.obrigatoria && p.tipo !== 'FORMULA' && p.tipo !== 'PERCENTUAL') {
            const keyId = p.id.toString();
            const val = respostasPorId[keyId];
            const vazio = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
            if (vazio) {
              erros[keyId] = true;
              faltantes.push(p.texto || p.sigla || `Pergunta ${keyId}`);
            }
          }
        });
      }

      if (faltantes.length > 0) {
        setErrosObrigatorios(erros);
        const primeiroId = Object.keys(erros)[0];
        if (primeiroId) {
          setTimeout(() => {
            document.getElementById(`pergunta-${primeiroId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
        toast({
          title: 'Campos obrigatórios',
          description: `Responda todas as perguntas obrigatórias antes de salvar. Faltando: ${faltantes.slice(0, 6).join(', ')}${faltantes.length > 6 ? ` e +${faltantes.length - 6} outras` : ''}`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      } else {
        setErrosObrigatorios({});
      }
      const payload = {
        ...formData,
        meta_id: formData.meta_id ? parseInt(formData.meta_id) : null,
        nota: formData.nota ? parseInt(formData.nota) : null,
        respostas: respostasPorId,
        formulario_id: formularioSelecionado?.id
      };
      console.log('Payload enviado para o backend:', payload);
      if (id === 'novo') {
        await ApiService.createChecklistDiario(payload);
        toast({ title: 'Sucesso', description: 'Registro criado com sucesso!' });
      } else {
        await ApiService.updateChecklistDiario(id, payload);
        toast({ title: 'Sucesso', description: 'Registro atualizado com sucesso!' });
      }
      navigate('/registro-diario');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar registro: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Renderização dinâmica das perguntas do formulário, ordenadas por ordem
  const renderPerguntas = () => {
    return perguntas && perguntas.length > 0 && perguntas
      .slice()
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
      .filter((p) => p.tipo !== 'PERCENTUAL') // Esconder perguntas PERCENTUAL
      .map((p) => {
        const perguntaKey = p.id.toString();
        const respostaCarregada = formData.respostas[perguntaKey];
        if (id !== 'novo' && p.sigla) {
          console.log(`🔍 Pergunta: ${p.sigla} (ID: ${p.id}), Chave: ${perguntaKey}, Resposta: ${respostaCarregada}`);
        }
        return (
          <div key={p.id} id={`pergunta-${p.id}`} className="card-spacing border-l-4" style={{borderLeftColor: errosObrigatorios[perguntaKey] ? 'var(--color-danger-500, #ef4444)' : 'var(--color-info-500)'}}>
            <Label className="text-sm font-semibold block mb-3">
              {p.texto}
              {p.sigla && (
                <span className="ml-2 text-xs" style={{color: 'var(--color-neutral-500)'}}>
                  [{p.sigla}]
                </span>
              )}
              {p.obrigatoria && p.tipo !== 'FORMULA' && (
                <span className="text-red-500 ml-1">*</span>
              )}
              {p.tipo === 'FORMULA' && (
                <span className="text-blue-500 ml-1 text-xs font-medium">(Calculado)</span>
              )}
              {id !== 'novo' && respostaCarregada && (
                <span className="text-xs font-semibold ml-2" style={{color: 'var(--color-success-600)'}}>
                  ✓ Respondida
                </span>
              )}
            </Label>
            {errosObrigatorios[perguntaKey] && (
              <div className="text-xs font-medium text-red-600 mb-2">Esta pergunta é obrigatória.</div>
            )}

            {p.tipo === 'TEXTO' && (
              <Input
                value={formData.respostas[perguntaKey] || ''}
                onChange={e => {
                  console.log(`✏️ Alterando TEXTO ${perguntaKey} para: ${e.target.value}`);
                  handleRespostaChange(perguntaKey, e.target.value);
                }}
                required={p.obrigatoria}
                placeholder="Digite sua resposta"
                className="text-sm"
              />
            )}

            {p.tipo === 'NUMERO' && (
              <Input
                type="number"
                value={formData.respostas[perguntaKey] || ''}
                onChange={e => {
                  console.log(`✏️ Alterando NUMERO ${perguntaKey} para: ${e.target.value}`);
                  handleRespostaChange(perguntaKey, e.target.value);
                }}
                required={p.obrigatoria}
                placeholder="Digite um número"
                className="text-sm"
              />
            )}

            {p.tipo === 'BOOLEANO' && (
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`booleano-${p.id}`}
                    value="Sim"
                    checked={formData.respostas[perguntaKey] === 'Sim'}
                    onChange={() => handleRespostaChange(perguntaKey, 'Sim')}
                    required={p.obrigatoria}
                  />
                  <span className="text-sm font-medium">Sim</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`booleano-${p.id}`}
                    value="Não"
                    checked={formData.respostas[perguntaKey] === 'Não'}
                    onChange={() => handleRespostaChange(perguntaKey, 'Não')}
                  />
                  <span className="text-sm font-medium">Não</span>
                </label>
              </div>
            )}

            {p.tipo === 'MULTIPLA' && (
              <Select
                value={formData.respostas[perguntaKey] || ''}
                onValueChange={v => {
                  console.log(`✏️ Alterando MULTIPLA ${perguntaKey} para: ${v}`);
                  handleRespostaChange(perguntaKey, v);
                }}
                required={p.obrigatoria}
                disabled={!p.opcoes || p.opcoes.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={(!p.opcoes || p.opcoes.length === 0) ? 'Nenhuma opção disponível' : 'Selecione uma opção'} />
                </SelectTrigger>
                <SelectContent>
                  {p.opcoes && p.opcoes.length > 0 ? (
                    p.opcoes.map((opcao, idx) => (
                      <SelectItem key={idx} value={opcao}>{opcao}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="nenhuma-opcao" disabled>Nenhuma opção definida</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}

            {p.tipo === 'FORMULA' && (
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: 'var(--color-info-50)',
                  borderLeftColor: 'var(--color-info-500)',
                  borderColor: 'var(--color-info-200)'
                }}
              >
                <div className="text-sm mb-2" style={{color: 'var(--color-info-700)'}}>
                  <strong>Fórmula:</strong> <code className="bg-white px-2 py-1 rounded text-xs">{p.formula}</code>
                </div>
                <div className="text-lg font-bold" style={{color: 'var(--color-info-900)'}}>
                  ✓ Resultado: <span style={{color: 'var(--color-success-600)'}}>{formData.respostas[perguntaKey] || 'Aguardando cálculo...'}</span>
                </div>
              </div>
            )}
          </div>
        )
      });
  };

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
          <div>
            <h1 className="page-title">{id === 'novo' ? 'Novo Registro Diário' : 'Editar Registro Diário'}</h1>
            <p className="page-subtitle">Preencha ou edite as informações do registro diário</p>
          </div>
        </div>
      </div>

      {/* Card Principal */}
      <div className="card-spacing">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Seção 1: Seleções Principais */}
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
                  onValueChange={v => carregarMetasEFormularios(v)}
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

              {/* Formulário */}
              <div className="form-group">
                <Label className="font-semibold mb-2 block">Formulário *</Label>
                <Select
                  value={formularioSelecionado ? formularioSelecionado.id.toString() : ''}
                  onValueChange={v => carregarPerguntas(v)}
                  required
                  open={formularios.length > 0 ? undefined : false}
                  disabled={!pacienteSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!pacienteSelecionado ? "Selecione o paciente primeiro" : "Selecione o formulário"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formularios.map(f => (
                      <SelectItem key={f.id} value={f.id.toString()}>{f.nome || f.titulo || `Formulário ${f.id}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="form-group">
                <Label className="font-semibold mb-2 block">Data *</Label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={e => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>

              {/* Nota */}
              <div className="form-group">
                <Label className="font-semibold mb-2 block">Nota (1 a 5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.nota || ''}
                  onChange={e => setFormData({ ...formData, nota: e.target.value })}
                  placeholder="Digite uma nota de 1 a 5"
                />
              </div>

              {/* Observação */}
              <div className="form-group md:col-span-2">
                <Label className="font-semibold mb-2 block">Observação</Label>
                <Input
                  type="text"
                  value={formData.observacao || ''}
                  onChange={e => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Digite uma observação (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Perguntas do Formulário */}
          {perguntas.length > 0 && (
            <div className="border-t pt-8" style={{borderTopColor: 'var(--color-neutral-200)'}}>
              <div className="section-header mb-6">
                <AlertCircle size={18} className="color-success-icon" />
                <h2 className="section-header-title">Respostas - {formularioSelecionado?.nome || formularioSelecionado?.titulo}</h2>
              </div>

              <div className="space-y-4">
                {renderPerguntas()}
              </div>
            </div>
          )}

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
                  Salvar Registro
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}