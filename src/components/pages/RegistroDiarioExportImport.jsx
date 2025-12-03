import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/lib/api';
import * as XLSX from 'xlsx';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegistroDiarioExportImport() {
  const [modo, setModo] = useState('exportar'); // 'exportar' ou 'importar'
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [metas, setMetas] = useState([]);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [formularioSelecionado, setFormularioSelecionado] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar pacientes ao iniciar
  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const data = await ApiService.getPacientes();
      setPacientes(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar pacientes: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const carregarMetasEFormularios = async (pacienteId) => {
    try {
      setLoading(true);
      const data = await ApiService.getMetasEFormulariosPaciente(pacienteId);
      setPacienteSelecionado(data.paciente);
      setMetas(data.metas);
      setFormularios(data.formularios);
      setMetaSelecionada(null);
      setFormularioSelecionado(null);
      setPerguntas([]);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar metas e Protocolos: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarPerguntas = async (formularioId) => {
    try {
      setLoading(true);
      const formulario = formularios.find(f => f.id === parseInt(formularioId));
      setFormularioSelecionado(formulario);
      setPerguntas(formulario?.perguntas || []);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar perguntas: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportarParaExcel = () => {
    if (!formularioSelecionado || !perguntas.length) {
      toast({
        title: 'Atenção',
        description: 'Selecione um Protocolo com perguntas para exportar',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Preparar dados para o Excel
      const dados = perguntas
        .filter(p => p.tipo !== 'PERCENTUAL' && p.tipo !== 'FORMULA') // Não exportar PERCENTUAL/FORMULA
        .map(p => ({
          'ID': p.id,
          'Sigla': p.sigla || '',
          'Tipo': p.tipo,
          'Pergunta': p.texto,
          'Obrigatória': p.obrigatoria ? 'Sim' : 'Não',
          'Opções': p.tipo === 'MULTIPLA' ? (p.opcoes?.join(' | ') || '') : '',
          'Resposta': '' // Campo para o cliente preencher
        }));

      // Criar worksheet
      const ws = XLSX.utils.json_to_sheet(dados);
      
      // Estilo básico
      ws['!cols'] = [
        { wch: 8 },  // ID
        { wch: 12 }, // Sigla
        { wch: 12 }, // Tipo
        { wch: 40 }, // Pergunta
        { wch: 12 }, // Obrigatória
        { wch: 30 }, // Opções
        { wch: 30 }  // Resposta
      ];

      // Criar workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Perguntas');

      // Salvar arquivo
      const nomeArquivo = `${pacienteSelecionado?.nome || 'Paciente'}_${formularioSelecionado?.nome || 'Formulario'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);

      toast({
        title: 'Sucesso',
        description: `Excel exportado: ${nomeArquivo}`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao exportar para Excel: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const importarDoExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const dados = XLSX.utils.sheet_to_json(worksheet);

        // Validar e estruturar os dados
        const respostas = {};
        dados.forEach((linha) => {
          if (linha['ID'] && linha['Resposta']) {
            respostas[linha['ID'].toString()] = linha['Resposta'];
          }
        });

        // Preencher as respostas
        setPerguntas(perguntas.map(p => ({
          ...p,
          respostaImportada: respostas[p.id.toString()] || ''
        })));

        toast({
          title: 'Sucesso',
          description: `Importado com sucesso! ${Object.keys(respostas).length} respostas carregadas.`,
        });
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao importar Excel: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const salvarRespostasImportadas = async () => {
    if (!formularioSelecionado || !metaSelecionada) {
      toast({
        title: 'Atenção',
        description: 'Selecione meta e Protocolo',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const respostas = {};
      perguntas.forEach(p => {
        if (p.respostaImportada) {
          respostas[p.id.toString()] = p.respostaImportada;
        }
      });

      const payload = {
        meta_id: metaSelecionada.id,
        data: data, // Usar a data selecionada pelo usuário
        respostas: respostas,
        formulario_id: formularioSelecionado.id,
        observacao: 'Importado via Excel'
      };


      await ApiService.createChecklistDiario(payload);

      toast({
        title: 'Sucesso',
        description: 'Respostas salvas com sucesso!',
      });

      // Limpar Protocolo
      setPacienteSelecionado(null);
      setMetaSelecionada(null);
      setFormularioSelecionado(null);
      setPerguntas([]);
      setData(new Date().toISOString().split('T')[0]);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar respostas: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="page-title">Exportar/Importar Protocolo</div>
      <div className="page-subtitle">
        Exporte perguntas para o cliente preencher em Excel, ou importe as respostas preenchidas
      </div>

      <div className="card-spacing space-y-8">
        {/* Seleção de Modo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setModo('exportar')}
            className={`h-20 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              modo === 'exportar'
                ? 'bg-[#0ea5e9] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>Exportar para Excel</span>
          </button>
          <button
            onClick={() => setModo('importar')}
            className={`h-20 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              modo === 'importar'
                ? 'bg-[#0ea5e9] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Importar do Excel</span>
          </button>
        </div>

        {/* Seleção de Paciente, Meta, Protocolo e Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Paciente *</Label>
            <Select
              value={pacienteSelecionado ? pacienteSelecionado.id.toString() : ''}
              onValueChange={v => carregarMetasEFormularios(v)}
            >
              <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9]">
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Meta Terapêutica *</Label>
            <Select
              value={metaSelecionada ? metaSelecionada.id.toString() : ''}
              onValueChange={(v) => {
                const meta = metas.find(m => m.id === parseInt(v));
                setMetaSelecionada(meta);
              }}
              disabled={!pacienteSelecionado}
            >
              <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9] disabled:bg-gray-100 disabled:cursor-not-allowed">
                <SelectValue placeholder="Selecione a meta" />
              </SelectTrigger>
              <SelectContent>
                {metas.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.descricao.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Protocolo *</Label>
            <Select
              value={formularioSelecionado ? formularioSelecionado.id.toString() : ''}
              onValueChange={v => carregarPerguntas(v)}
              disabled={!pacienteSelecionado}
            >
              <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9] disabled:bg-gray-100 disabled:cursor-not-allowed">
                <SelectValue placeholder="Selecione o Protocolo" />
              </SelectTrigger>
              <SelectContent>
                {formularios.map(f => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Data *</Label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9]"
            />
          </div>
        </div>

        {/* EXPORTAR */}
        {modo === 'exportar' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Exportar Protocolo</h3>
            </div>
            <p className="text-sm text-gray-600">
              {perguntas.length > 0
                ? `Pronto para exportar ${perguntas.filter(p => p.tipo !== 'PERCENTUAL' && p.tipo !== 'FORMULA').length} perguntas`
                : 'Selecione um Protocolo acima para exportar'}
            </p>
            <button
              onClick={exportarParaExcel}
              disabled={!formularioSelecionado || perguntas.length === 0 || loading}
              className="w-full h-10 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Excel
            </button>
          </div>
        )}

        {/* IMPORTAR */}
        {modo === 'importar' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Importar Respostas</h3>
            </div>
            
            {/* Upload File */}
            <div className="form-group">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Selecione o arquivo Excel com respostas
              </Label>
              <Input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={importarDoExcel}
                disabled={!formularioSelecionado}
                className="h-10 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#0ea5e9] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Preview das respostas importadas */}
            {perguntas.some(p => p.respostaImportada) && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-sm text-gray-800">Respostas Carregadas:</h4>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 max-h-80 overflow-y-auto space-y-3">
                  {perguntas
                    .filter(p => p.respostaImportada)
                    .map(p => (
                      <div key={p.id} className="text-sm border-b border-gray-200 pb-3 last:border-b-0">
                        <p className="font-medium text-gray-800">{p.sigla}: {p.texto.substring(0, 50)}...</p>
                        <p className="text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {p.respostaImportada}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={salvarRespostasImportadas}
              disabled={!perguntas.some(p => p.respostaImportada) || loading}
              className="w-full h-10 bg-[#0ea5e9] text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Salvar Respostas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
