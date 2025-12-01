import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight, X } from 'lucide-react';

export default function RegistroDiarioAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: '1️⃣ Selecione o Paciente',
      descricao: 'Comece escolhendo o paciente para o qual deseja registrar o acompanhamento diário.',
      dicas: [
        'Use a busca para encontrar rapidamente o paciente desejado',
        'Se o paciente não existir, crie-o antes na seção de Pacientes',
        'Ao selecionar um paciente, as metas e Protocolos disponíveis serão carregados automaticamente'
      ],
      bestPractices: [
        '✓ Sempre verifique se selecionou o paciente correto antes de prosseguir',
        '✓ Os dados do paciente serão usados como referência para todo o registro'
      ]
    },
    {
      titulo: '2️⃣ Escolha a Meta Terapêutica',
      descricao: 'Selecione a meta terapêutica associada a este registro. As metas devem ser previamente definidas no plano de tratamento do paciente.',
      dicas: [
        'As metas disponíveis dependem do paciente selecionado',
        'Cada meta possui uma descrição específica dos objetivos terapêuticos',
        'Você pode ter múltiplas metas ativas para um mesmo paciente',
        'Selecione aquela que melhor se alinha com o acompanhamento de hoje'
      ],
      bestPractices: [
        '✓ Escolha a meta que melhor reflete o foco da sessão de hoje',
        '✓ Revise periodicamente as metas para garantir relevância terapêutica'
      ]
    },
    {
      titulo: '3️⃣ Selecione o Protocolo',
      descricao: 'Escolha o protocolo ou Protocolo que será preenchido. Cada Protocolo possui um conjunto específico de perguntas e métricas.',
      dicas: [
        'Os Protocolos são templates padronizados (ex: GMFM-88, Denver, Socially Savvy)',
        'Cada Protocolo tem perguntas específicas que avaliam diferentes aspectos do progresso',
        'Perguntas marcadas com * são obrigatórias',
        'Alguns Protocolos contêm cálculos automáticos (fórmulas)',
        'Perguntas percentuais são ocultadas e calculadas automaticamente'
      ],
      bestPractices: [
        '✓ Use o Protocolo mais recente disponível para avaliação',
        '✓ Mantenha consistência no uso de Protocolos entre sessões',
        '✓ Revise o Protocolo antes de começar a preencher'
      ]
    },
    {
      titulo: '📅 Defina a Data do Registro',
      descricao: 'Indique a data da sessão ou acompanhamento. Normalmente será a data de hoje, mas você pode registrar dados anteriores se necessário.',
      dicas: [
        'Clique no campo de data para abrir o calendário',
        'A data é obrigatória para todo registro',
        'Você pode registrar datas passadas para fazer atualizações',
        'Use a data do atendimento realizado, não da data de digitação'
      ],
      bestPractices: [
        '✓ Sempre preencha a data do atendimento realizado',
        '✓ Se estiver registrando em atraso, indique a data correta da sessão',
        '✓ Isso garante precisão nas análises de progresso ao longo do tempo'
      ]
    },
    {
      titulo: '⭐ (Opcional) Atribua uma Nota',
      descricao: 'Você pode atribuir uma nota de 1 a 5 para avaliar o desempenho ou progresso geral da sessão.',
      dicas: [
        'Nota 1: Desempenho muito baixo ou dificuldades significativas',
        'Nota 2: Desempenho abaixo da expectativa',
        'Nota 3: Desempenho esperado ou dentro do esperado',
        'Nota 4: Desempenho acima do esperado',
        'Nota 5: Desempenho excelente, resultado muito positivo',
        'Este campo é opcional - deixe em branco se não for aplicável'
      ],
      bestPractices: [
        '✓ Use a nota para acompanhar tendências de progresso',
        '✓ Mantenha critérios consistentes ao atribuir notas',
        '✓ As notas podem ser úteis para gerar relatórios de progresso'
      ]
    },
    {
      titulo: '💬 (Opcional) Adicione Observações',
      descricao: 'Use este campo para documentar observações adicionais, contextualização ou anotações importantes sobre a sessão.',
      dicas: [
        'Escreva observações relevantes que complementem os dados estruturados',
        'Exemplos: "Paciente apresentou dificuldade em X", "Progresso notável em Y"',
        'Use linguagem clara e profissional',
        'Inclua contexto que possa ser útil para revisão posterior ou colegas',
        'Este campo é opcional - é um complemento aos dados das perguntas'
      ],
      bestPractices: [
        '✓ Seja conciso mas informativo nas observações',
        '✓ Registre comportamentos ou mudanças significativas',
        '✓ As observações ajudam na narrativa clínica do caso'
      ]
    },
    {
      titulo: '❓ Preenchendo as Respostas do Protocolo',
      descricao: 'Agora você preencherá cada pergunta do Protocolo selecionado. As perguntas aparecem em ordem e com instruções específicas.',
      dicas: [
        'Perguntas com * (asterisco) são obrigatórias',
        'Tipos de perguntas:',
        '  • TEXTO: Digite uma resposta livre',
        '  • NÚMERO: Digite um valor numérico',
        '  • BOOLEANO (Sim/Não): Selecione a opção apropriada',
        '  • MÚLTIPLA: Escolha uma das opções predefinidas',
        '  • FÓRMULA: Calculada automaticamente (somente leitura)',
        'Uma borda azul à esquerda indica o campo',
        'Uma borda vermelha indica campo obrigatório não preenchido',
        'Um ✓ verde indica que a pergunta já foi respondida (ao editar)'
      ],
      bestPractices: [
        '✓ Leia cuidadosamente cada pergunta antes de responder',
        '✓ Respostas numéricas devem estar nas unidades indicadas',
        '✓ Seja preciso nas respostas textuais',
        '✓ As fórmulas calculam-se automaticamente quando dependências são preenchidas'
      ]
    },
    {
      titulo: '✅ Validação e Salva',
      descricao: 'Após preencher todas as perguntas obrigatórias, você pode salvar o registro.',
      dicas: [
        'Um aviso mostrará quais perguntas obrigatórias ainda faltam responder',
        'A página rolará até o primeiro campo obrigatório não preenchido',
        'Revise todas as respostas antes de clicar em "Salvar Registro"',
        'Após salvar, você será redirecionado para a lista de registros',
        'Se houver erro ao salvar, uma mensagem de erro aparecerá'
      ],
      bestPractices: [
        '✓ Revise as respostas uma última vez antes de salvar',
        '✓ Certifique-se de que não há informações incompletas',
        '✓ Após salvar, o registro estará disponível para relatórios e análises',
        '✓ Você poderá editar o registro posteriormente se necessário'
      ]
    }
  ];

  const proximoPasso = () => {
    if (passoAtual < passos.length - 1) {
      setPassoAtual(passoAtual + 1);
    }
  };

  const passoAnterior = () => {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
    }
  };

  const irParaPasso = (index) => {
    setPassoAtual(index);
  };

  const passo = passos[passoAtual];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb size={28} className="text-blue-500" />
            Guia: Como Preencher um Registro Diário
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Siga este passo a passo para criar ou editar um registro diário corretamente
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo Principal */}
        <div className="py-6 space-y-6">
          {/* Progresso */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Passo {passoAtual + 1} de {passos.length}
            </span>
            <div className="flex gap-1">
              {passos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => irParaPasso(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === passoAtual
                      ? 'bg-blue-500 w-8'
                      : index < passoAtual
                      ? 'bg-green-500 w-2'
                      : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card do Passo */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {passo.titulo}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {passo.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dicas */}
              <div>
                <div className="flex items-center gap-2 mb-3 font-semibold text-blue-700">
                  <Info size={18} />
                  Dicas Importantes
                </div>
                <ul className="space-y-2 pl-6">
                  {passo.dicas.map((dica, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{dica}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best Practices */}
              <div>
                <div className="flex items-center gap-2 mb-3 font-semibold text-green-700">
                  <CheckCircle2 size={18} />
                  Melhores Práticas
                </div>
                <div className="space-y-2 pl-6">
                  {passo.bestPractices.map((practice, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerta se aplicável */}
              {passoAtual === 2 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>Nota importante:</strong> Escolha um Protocolo apropriado para o tipo de avaliação que você deseja realizar. Isso garante que você coleta dados padronizados e comparáveis ao longo do tempo.
                  </div>
                </div>
              )}

              {passoAtual === 6 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Dica:</strong> Perguntas de fórmula (calculadas automaticamente) não precisam ser respondidas manualmente. O sistema calcula o resultado automaticamente com base em outras respostas. Fórmulas aparecerão com um fundo azul claro indicando que são somente leitura.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Índice de Passos (Desktop) */}
          <div className="hidden md:block bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Todos os Passos:</p>
            <div className="grid grid-cols-2 gap-2">
              {passos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => irParaPasso(idx)}
                  className={`text-left text-sm p-2 rounded transition-colors ${
                    idx === passoAtual
                      ? 'bg-blue-500 text-white font-semibold'
                      : idx < passoAtual
                      ? 'bg-green-100 text-green-900'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p.titulo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={passoAnterior}
            disabled={passoAtual === 0}
          >
            ← Anterior
          </Button>

          <div className="flex gap-2">
            {passoAtual > 0 && (
              <Button
                variant="ghost"
                onClick={() => irParaPasso(0)}
              >
                Voltar ao Início
              </Button>
            )}
          </div>

          {passoAtual === passos.length - 1 ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Entendi! Fechar Guia
            </Button>
          ) : (
            <Button
              onClick={proximoPasso}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              Próximo
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
