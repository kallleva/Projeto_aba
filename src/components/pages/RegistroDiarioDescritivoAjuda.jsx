import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight } from 'lucide-react';

export default function RegistroDiarioDescritivoAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: ' Registro Descritivo',
      descricao: 'Esta página permite registrar observações e detalhes narrativos sobre cada sessão realizada com o paciente.',
      dicas: [
        'Registro Descritivo é um relato TEXTUAL/NARRATIVO da sessão',
        'Diferente do Protocolo que tem perguntas estruturadas',
        'Aqui você descreve livremente o que aconteceu na sessão',
        'Deve ser preenchido APÓS cada sessão realizada',
        'Vinculado a uma Meta Terapêutica específica',
        'Pode incluir múltiplos anexos (fotos, vídeos, documentos)',
        'Importante para evolução e documentação clínica',
        'Complementa os dados estruturados do Protocolo'
      ],
      bestPractices: [
        ' Faça o registro logo após a sessão (enquanto está fresco)',
        ' Seja detalhado e específico',
        ' Use linguagem clínica clara',
        ' Documente materiais, atividades e observações',
        ' Inclua progressos E dificuldades',
        ' Adicione anexos quando relevante'
      ]
    },
    {
      titulo: '👥 Selecionando o Paciente',
      descricao: 'O primeiro passo é selecionar qual paciente está fazendo o registro.',
      dicas: [
        'Campo: PACIENTE *',
        '  • Campo obrigatório',
        '  • Dropdown com lista de todos os pacientes',
        '  • Selecione o paciente para quem fez a sessão',
        '  • Lista mostra NOME do paciente',
        '',
        'Comportamento ao selecionar:',
        '  • Sistema carrega automaticamente as METAS do paciente',
        '  • Campo de Meta Terapêutica fica HABILITADO',
        '  • Se mudar paciente, reset a seleção de meta',
        '  • Pode selecionar outro paciente a qualquer momento',
        '',
        'Cuidados:',
        '  • Verifique que selecionou o paciente CORRETO',
        '  • Um registro não pode ser transferido entre pacientes',
        '  • Se errar, crie um novo registro'
      ],
      bestPractices: [
        ' Sempre selecione o paciente primeiro',
        ' Verifique o nome corretamente',
        ' Não crie registros para paciente errado'
      ]
    },
    {
      titulo: '🎯 Selecionando a Meta Terapêutica',
      descricao: 'Selecione qual meta terapêutica esta sessão está trabalhando.',
      dicas: [
        'Campo: META TERAPÊUTICA *',
        '  • Campo obrigatório',
        '  • Só funciona APÓS selecionar paciente',
        '  • Dropdown mostra metas do paciente selecionado',
        '  • Mostra descrição da meta',
        '',
        'O que significa:',
        '  • Indica qual meta este registro documenta',
        '  • Vincula o trabalho feito à meta específica',
        '  • Facilita rastreabilidade entre sessão e plano',
        '  • Mostra no Kanban de Metas quando marcado',
        '',
        'Se não aparecer meta:',
        '  • Paciente não tem metas criadas ainda',
        '  • Crie metas na página "Metas Terapêuticas" primeiro',
        '  • Volte aqui após criar as metas',
        '  • Ou selecione outro paciente com metas',
        '',
        'Seleção:',
        '  • Clique no dropdown',
        '  • Escolha a meta relevante para esta sessão',
        '  • Pode ser deixado em branco (opcional na prática)',
        '  • Sistema permite null/vazio'
      ],
      bestPractices: [
        ' Selecione a meta que trabalhou na sessão',
        ' Se fez trabalho livre, deixe vazio ou selecione genérica',
        ' Vincula registro aos objetivos terapêuticos',
        ' Facilita acompanhamento de progresso'
      ]
    },
    {
      titulo: '📅 Selecionando a Data',
      descricao: 'Defina quando a sessão foi realizada.',
      dicas: [
        'Campo: DATA *',
        '  • Campo obrigatório',
        '  • Formato: YYYY-MM-DD (ano-mês-dia)',
        '  • Clique para abrir calendário',
        '  • Ou digite manualmente a data',
        '',
        'Importante:',
        '  • Data deve ser quando a sessão FOI REALIZADA',
        '  • NÃO é quando está fazendo o registro',
        '  • Pode ser data passada se registrando atrasado',
        '  • Sistema aceita datas futuras (não recomendado)',
        '',
        'Verificações:',
        '  • A data não precisa ser hoje',
        '  • Mas idealmente não muito no passado',
        '  • Próximo de quando aconteceu a sessão',
        '',
        'Exemplo:',
        '  • Sessão aconteceu terça 28/11',
        '  • Você está registrando agora quinta 30/11',
        '  • Coloque 2024-11-28 (data da sessão)',
        '  • NÃO coloque 2024-11-30 (hoje)'
      ],
      bestPractices: [
        ' Coloque a data quando a sessão foi feita',
        ' Não confunda com data de hoje',
        ' Seja preciso com a data',
        ' Facilita cronologia do acompanhamento'
      ]
    },
    {
      titulo: '📎 Adicionando Anexos',
      descricao: 'Selecione arquivos e mídias relacionados à sessão.',
      dicas: [
        'Seção de Anexos:',
        '  • Permite adicionar fotos, vídeos, documentos',
        '  • Complementa o relato textual',
        '',
        'IMPORTANTE - Dois Cenários:',
        '',
        'CRIANDO NOVO REGISTRO:',
        '  • Anexos NÃO podem ser adicionados ANTES de salvar',
        '  • Sistema mostra mensagem azul informando',
        '  • SALVE a descrição primeiro',
        '  • DEPOIS volte e adicione anexos',
        '  • Fluxo: Criar → Salvar → Editar → Adicionar Anexos',
        '',
        'EDITANDO REGISTRO EXISTENTE:',
        '  • Anexos podem ser adicionados imediatamente',
        '  • Interface de anexos fica visível e ativa',
        '  • Clique para adicionar, remover, visualizar',
        '',
        'Tipos de Anexo Suportados:',
        '  • Imagens (JPG, PNG)',
        '  • Vídeos (MP4, MOV)',
        '  • Documentos (PDF)',
        '  • Áudio (MP3)',
        '',
        'Boas Práticas:',
        '  • Adicione fotos de exercícios realizados',
        '  • Grave vídeos curtos de demonstração',
        '  • Anexe formulários de avaliação assinados',
        '  • Inclua prescrição de exercícios'
      ],
      bestPractices: [
        ' Salve primeiro se for novo registro',
        ' Adicione anexos relevantes',
        ' Use fotos/vídeos para documentar',
        ' Mantenha arquivos em tamanho razoável',
        ' Nomeia arquivo descritivamente'
      ]
    },
    {
      titulo: '✍️ Escrevendo a Descrição da Sessão',
      descricao: 'Escreva um relato detalhado e estruturado do que aconteceu na sessão.',
      dicas: [
        'Campo: RELATO DETALHADO DA SESSÃO *',
        '  • Campo obrigatório (grande textarea)',
        '  • Mínimo recomendado: 2-3 parágrafos',
        '  • Máximo: sem limite técnico, mas seja conciso',
        '',
        'Estrutura Recomendada do Relato:',
        '  1. MATERIAIS UTILIZADOS:',
        '     - Lista de equipamentos/materiais usados',
        '     - Exemplo: "Bola suíça, bastão, colchonete"',
        '',
        '  2. ATIVIDADES REALIZADAS:',
        '     - Descreva exercícios/atividades em ordem',
        '     - Quanto tempo em cada atividade',
        '     - Séries e repetições (se aplicável)',
        '     - Progressão ou alterações feitas',
        '',
        '  3. COMPORTAMENTO DO PACIENTE:',
        '     - Como paciente respondeu',
        '     - Nível de colaboração',
        '     - Motivação observada',
        '     - Humor/estado emocional',
        '',
        '  4. DIFICULDADES ENCONTRADAS:',
        '     - Qualquer dificuldade durante sessão',
        '     - Limitações observadas',
        '     - Resistência ou problemas',
        '     - Limitações físicas/cognitivas',
        '',
        '  5. PROGRESSOS OBSERVADOS:',
        '     - Melhorias observadas',
        '     - Comparação com sessão anterior',
        '     - Novos alcances ou marcos',
        '     - Aumento de independência',
        '',
        '  6. OBSERVAÇÕES IMPORTANTES:',
        '     - Pontos relevantes não cobertos',
        '     - Recomendações para próxima sessão',
        '     - Comunicação com responsável',
        '     - Notas sobre medicação/estado físico',
        '',
        'Exemplo Completo:',
        '  "Materiais: Bola suíça 75cm, bastão 1kg, colchonete.',
        '  Atividades: Alongamento 10 min, fortalecimento 20 min (3x12 agachamentos), ',
        '  coordenação 10 min. Paciente participou com entusiasmo, sem queixa de dor.',
        '  Uma pequena dificuldade no equilíbrio durante agachamento, mas conseguiu fazer ',
        '  todas as repetições com apoio. Observou-se melhora em relação à semana passada ',
        '  na flexibilidade do ombro. Recomenda-se continuar com exercícios domiciliares.',
        '',
        'Dicas de Linguagem:',
        '  • Use linguagem clínica mas compreensível',
        '  • Seja específico (não: "bem", mas: "melhorou 30°")',
        '  • Evite julgamentos pessoais',
        '  • Foque em fatos observáveis',
        '  • Use tempo passado (fez, observou, recomendou)',
        '',
        'Contador de Caracteres:',
        '  • Exibido abaixo do campo',
        '  • Apenas informativo',
        '  • Não há limite de caracteres'
      ],
      bestPractices: [
        ' Faça o registro logo após a sessão',
        ' Siga a estrutura (materiais → atividades → comportamento → etc)',
        ' Seja específico e preciso',
        ' Documente sucessos E desafios',
        ' Use linguagem profissional',
        ' Evite abreviações demais',
        ' Permita releitura e entendimento por outro profissional'
      ]
    },
    {
      titulo: '💾 Salvando o Registro',
      descricao: 'Revise e salve o registro descritivo.',
      dicas: [
        'Antes de Salvar - Checklist:',
        '  ☐ Paciente correto selecionado?',
        '  ☐ Meta Terapêutica correto selecionada?',
        '  ☐ Data da sessão (não data de hoje)?',
        '  ☐ Descrição preenchia completamente?',
        '  ☐ Verificou ortografia/digitação?',
        '',
        'Botões de Ação:',
        '  • CANCELAR: Volta para lista sem salvar',
        '  • SALVAR DESCRIÇÃO: Salva o registro',
        '',
        'Clique em "Salvar Descrição":',
        '  1. Sistema valida campos obrigatórios',
        '  2. Mostra loading enquanto processa',
        '  3. Se houver erro, mostra mensagem',
        '  4. Se sucesso, volta para lista automaticamente',
        '',
        'Após Salvar:',
        '  • Registro aparece na lista de Registro Diário',
        '  • Pode editar novamente clicando nele',
        '  • Pode adicionar anexos se não tiver feito',
        '  • Fica associado à meta terapêutica',
        '',
        'Se houver erro:',
        '  • Leia mensagem de erro com atenção',
        '  • Corrija o campo indicado',
        '  • Salve novamente'
      ],
      bestPractices: [
        ' Sempre verifique dados antes de salvar',
        ' Não cancele se já digitou tudo (salve)',
        ' Volte para adicionar anexos após salvar',
        ' Se cometeu erro, edite o registro'
      ]
    },
    {
      titulo: '✏️ Editando um Registro Existente',
      descricao: 'Como alterar um registro descritivo já salvo.',
      dicas: [
        'Acessar Edição:',
        '  • Vá para lista de Registro Diário',
        '  • Clique no registro que quer editar',
        '  • Página abre em modo EDIÇÃO',
        '  • Campos pré-preenchidos com dados anteriores',
        '',
        'O que pode ser Alterado:',
        '  • Meta Terapêutica (pode trocar)',
        '  • Data (pode corrigir)',
        '  • Descrição (pode refinar)',
        '',
        'O que NÃO pode ser Alterado:',
        '  • Paciente (definido no ato criação)',
        '  • Tipo de Registro (descritivo vs protocolo)',
        '  • Se precisar mudar, delete e crie novo',
        '',
        'Fluxo de Edição:',
        '  1. Clique no registro na lista',
        '  2. Faça as alterações necessárias',
        '  3. Clique "Salvar Descrição" novamente',
        '  4. Sistema atualiza',
        '  5. Volta para lista',
        '',
        'Adicionando Anexos na Edição:',
        '  • Seção de anexos fica visível',
        '  • Pode adicionar novos anexos',
        '  • Pode remover anexos anteriores',
        '  • Alterações em anexos independente do relato',
        '',
        'Cuidados:',
        '  • Salve frequentemente se digitou muito',
        '  • Verifique dados antes de salvar mudança',
        '  • Se errou muito, considere deletar e recriar'
      ],
      bestPractices: [
        ' Edite logo se perceber erro',
        ' Verifique todas as mudanças antes de salvar',
        ' Adicione anexos na edição se faltou',
        ' Mantenha histórico (não delete sem motivo)'
      ]
    },
    {
      titulo: '🔗 Relação com Outras Funcionalidades',
      descricao: 'Entenda como Registro Descritivo se integra ao sistema.',
      dicas: [
        'METAS TERAPÊUTICAS:',
        '  • Cada registro vinculado a uma meta',
        '  • Registros documentam o trabalho em cada meta',
        '  • Sem meta = registro "livre" ou descritivo puro',
        '  • Metas devem existir ANTES de registrar',
        '',
        'REGISTRO DIÁRIO (lista principal):',
        '  • Página "Registro Diário" mostra todos os registros',
        '  • Descritivos e Protocolos misturados',
        '  • Pode filtrar por tipo',
        '  • Pode editar ambos de lá',
        '',
        'PROTOCOLO (alternativa):',
        '  • Alternativa ao registro descritivo',
        '  • Protocolo = perguntas estruturadas',
        '  • Descritivo = narrativa livre',
        '  • Pode usar ambos no mesmo plano',
        '',
        'PLANO TERAPÊUTICO:',
        '  • Registros estão dentro de um plano',
        '  • Plano organiza metas e registros',
        '  • Visualizar registros do plano em Planos Terapêuticos',
        '',
        'ANEXOS:',
        '  • Cada registro pode ter múltiplos anexos',
        '  • Anexos vinculados APENAS a este registro',
        '  • Não compartilham com outros registros',
        '  • Sistema suporta: imagens, vídeos, áudio, PDF'
      ],
      bestPractices: [
        ' Crie metas ANTES de registrar',
        ' Vincule registros à meta correta',
        ' Use anexos para documentar visualmente',
        ' Mantenha coerência com metas e plano',
        ' Revise na lista periodicamente'
      ]
    },
    {
      titulo: '💡 Fluxo de Trabalho Recomendado',
      descricao: 'Workflow completo do Registro Descritivo.',
      dicas: [
        'Antes da Sessão:',
        '  1. Ter paciente cadastrado',
        '  2. Ter plano terapêutico criado',
        '  3. Ter metas terapêuticas definidas',
        '  4. Ter preparado materiais/planejamento',
        '',
        'Durante a Sessão:',
        '  • Anote pontos principais',
        '  • Tire fotos/vídeos se relevante',
        '  • Observe comportamento e progresso',
        '  • Documente qualquer intercorrência',
        '',
        'Logo Após a Sessão (IMPORTANTE):',
        '  1. Acesse Registro Diário Descritivo',
        '  2. Clique em "Novo"',
        '  3. Selecione paciente',
        '  4. Selecione meta trabalhada',
        '  5. Defina data/hora da sessão',
        '  6. Escreva relato detalhado',
        '  7. Clique "Salvar"',
        '  8. Adicione anexos',
        '',
        'Regularidade Recomendada:',
        '  • 1 registro POR SESSÃO realizada',
        '  • Mínimo 1-2 sessões por semana',
        '  • Máximo depende da carga horária',
        '  • Crie logo após a sessão (não acumule)',
        '',
        'Revisão Periódica:',
        '  • Semanal: Revise registros da semana',
        '  • Mensal: Analise progressão geral',
        '  • Procure tendências e padrões',
        '  • Ajuste plano se necessário',
        '',
        'Checklist Completo:',
        '   Sesão realizada',
        '   Relato descritivo criado',
        '   Foto/vídeo anexado (se aplicável)',
        '   Meta terapêutica atualizada',
        '   Informação disponível para revisão',
        '',
        'Dicas de Produtividade:',
        '  • Use templates mentais de estrutura',
        '  • Grabe vídeos curtos como lembretes',
        '  • Tire múltiplas fotos para escolher depois',
        '  • Mantenha relatos concisos mas completos',
        '  • Revise um relato antigo como exemplo'
      ],
      bestPractices: [
        ' Faça registro IMEDIATAMENTE após sessão',
        ' Estruture relato com as 6 partes',
        ' Seja detalhado e específico',
        ' Adicione anexos relevantes',
        ' Revise regularmente para acompanhar',
        ' Use para ajustar plano terapêutico',
        ' Mantenha dados organizados e consultáveis',
        ' Compartilhe resumos com paciente/responsável quando apropriado'
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
            Guia: Registro Diário Descritivo
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como registrar relatos narrativos detalhados das sessões
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
              {/* Informações */}
              <div>
                <div className="flex items-center gap-2 mb-3 font-semibold text-blue-700">
                  <Info size={18} />
                  Informações Importantes
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
                      <span className="text-green-600 font-bold"></span>
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas contextualizados */}
              {passoAtual === 1 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Seleção de Paciente:</strong> Uma vez selecionado na criação, o paciente não pode ser mudado. Se errou de paciente, delete o registro e crie novo.
                  </div>
                </div>
              )}

              {passoAtual === 4 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>Anexos em Novo Registro:</strong> Se está criando um novo registro, salve PRIMEIRO. Depois volte e adicione anexos. Em edição, pode adicionar anexos imediatamente.
                  </div>
                </div>
              )}

              {passoAtual === 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-green-900">
                    <strong>Estrutura Recomendada:</strong> Siga a ordem: Materiais → Atividades → Comportamento → Dificuldades → Progressos → Observações. Isso torna o relato completo e fácil de revisar.
                  </div>
                </div>
              )}

              {passoAtual === 8 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Lightbulb className="text-purple-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-purple-900">
                    <strong>Momento Crítico:</strong> Faça o registro IMEDIATAMENTE após a sessão. Quanto mais perto do tempo real, mais detalhes você lembra e melhor é a qualidade do relato.
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
