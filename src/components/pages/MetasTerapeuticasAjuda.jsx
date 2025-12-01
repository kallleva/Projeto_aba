import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight } from 'lucide-react';

export default function MetasTerapeuticasAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: '🎯 Bem-vindo às Metas Terapêuticas',
      descricao: 'Esta página gerencia as metas específicas dentro de cada plano terapêutico. Metas são objetivos intermediários e mensuráveis que guiam o tratamento.',
      dicas: [
        'Meta Terapêutica é um objetivo específico dentro de um plano terapêutico',
        'Cada plano pode ter MÚLTIPLAS metas (breakdown do objetivo geral)',
        'Uma meta é mais específica e mensurável que o objetivo geral',
        'Metas têm data de início e previsão de término',
        'Metas podem ser vinculadas a formulários de avaliação',
        'Metas têm progresso calculado automaticamente baseado no tempo decorrido',
        'Metas podem estar "Em Andamento" ou "Concluídas"',
        'Vista Kanban organiza metas por status em colunas'
      ],
      bestPractices: [
        ' Crie metas DEPOIS de criar o plano terapêutico',
        ' Metas devem ser específicas, mensuráveis e realistas',
        ' Defina datas realistas de início e término',
        ' Vincule formulários relevantes para avaliação',
        ' Revise metas regularmente durante o tratamento',
        ' Marque como concluída quando atingida'
      ]
    },
    {
      titulo: '📋 Componentes da Meta Terapêutica',
      descricao: 'Cada meta é composta por 6 componentes principais.',
      dicas: [
        'Plano Terapêutico *: Campo obrigatório',
        '  • Selecione qual plano esta meta pertence',
        '  • Mostra paciente e profissional',
        '  • Uma meta vinculada a exatamente um plano',
        '  • Deve existir plano antes de criar meta',
        '',
        'Descrição *: Campo obrigatório (textarea)',
        '  • Descrição clara e específica da meta',
        '  • Exemplo: "Aumentar amplitude de movimento do ombro em 30°"',
        '  • Deve incluir resultado esperado e medida',
        '  • Seja específico para ser mensurável',
        '',
        'Data Início *: Campo obrigatório',
        '  • Quando a meta começa a ser trabalhada',
        '  • Formato: YYYY-MM-DD',
        '  • Geralmente próximo ou igual data plano',
        '  • Usado para cálculo de progresso',
        '',
        'Previsão Término *: Campo obrigatório',
        '  • Quando se espera atingir a meta',
        '  • Formato: YYYY-MM-DD',
        '  • Deve ser depois da data início',
        '  • Progresso é calculado em relação a estas datas',
        '',
        'Status *: Campo obrigatório',
        '  • "Em Andamento": Meta ativa, sendo trabalhada',
        '  • "Concluída": Meta foi atingida',
        '  • Pode mudar durante o tratamento',
        '  • Sistema exibe em colunas diferentes (Kanban)',
        '',
        'Formulários Relacionados: Opcional',
        '  • Selecione 0 ou mais formulários',
        '  • Formulários usados para avaliar progresso da meta',
        '  • Exemplo: "GMFM" para avaliar função motora',
        '  • Clique no formulário para seleção toggle'
      ],
      bestPractices: [
        ' Todos os campos com * são obrigatórios',
        ' Descrição deve ser clara e mensurável',
        ' Defina datas realistas (3-6 meses típico)',
        ' Selecione formulários que avaliam a meta',
        ' Use linguagem clínica precisa na descrição'
      ]
    },
    {
      titulo: '➕ Criando uma Nova Meta Terapêutica',
      descricao: 'Para criar uma nova meta, clique no botão "Nova Meta" no topo.',
      dicas: [
        'Clique no botão azul "Nova Meta" no canto superior direito',
        'Um diálogo abrirá com o formulário de criação',
        'Preencha os campos obrigatórios:',
        '',
        '1. Selecione o PLANO TERAPÊUTICO:',
        '  • Clique no dropdown',
        '  • Escolha o plano desejado (mostra paciente + profissional)',
        '  • Apenas um plano pode ser selecionado',
        '',
        '2. Escreva a DESCRIÇÃO:',
        '  • Clique na área de texto',
        '  • Descreva o objetivo específico',
        '  • Inclua medidas/resultados esperados',
        '  • Seja claro e mensurável',
        '',
        '3. Defina DATA INÍCIO:',
        '  • Clique no campo de data',
        '  • Selecione a data no calendário',
        '  • Quando começará a trabalhar nesta meta',
        '',
        '4. Defina PREVISÃO TÉRMINO:',
        '  • Clique no campo de data',
        '  • Deve ser DEPOIS da data início',
        '  • Quando espera-se atingir a meta',
        '',
        '5. Escolha o STATUS:',
        '  • Normalmente "Em Andamento" para metas novas',
        '  • "Concluída" para metas já realizadas',
        '',
        '6. (Opcional) Selecione FORMULÁRIOS:',
        '  • Clique nos formulários para selecionar/desselecionar',
        '  • Selecionados ficam com fundo azul',
        '  • Pode não selecionar nenhum se não houver relevante',
        '',
        'Após preencher:',
        '  • Clique "Criar Meta" para salvar',
        '  • Receberá mensagem de sucesso',
        '  • Meta aparecerá no Kanban'
      ],
      bestPractices: [
        ' Crie metas dentro de um plano existente',
        ' Descrição deve ser específica e mensurável',
        ' Datas devem ser realistas para o paciente',
        ' Vincule formulários pertinentes para avaliação'
      ]
    },
    {
      titulo: '📊 Entendendo a Vista Kanban',
      descricao: 'A página exibe metas em uma vista Kanban com duas colunas por status.',
      dicas: [
        'Estrutura Kanban:',
        '  • COLUNA 1: "Em Andamento" (amarelo)',
        '  • COLUNA 2: "Concluídas" (verde)',
        '  • Cada meta é um cartão na coluna correspondente',
        '',
        'Cada Cartão de Meta mostra:',
        '  • NOME: Paciente - Profissional (do plano)',
        '  • DESCRIÇÃO: Texto da meta',
        '  • DATAS: Data início → Data término',
        '  • PROGRESSO: Barra com percentual calculado',
        '  • FORMULÁRIOS: Badges mostrando formulários vinculados',
        '  • AÇÕES: Botões de Concluir, Editar e Deletar',
        '',
        'Cálculo de Progresso:',
        '  • Automático baseado em tempo decorrido',
        '  • Fórmula: (dias decorridos / total de dias) × 100',
        '  • Exemplo: Se meta tem 100 dias e passaram 50 dias = 50%',
        '  • Atualiza automaticamente a cada dia',
        '  • Vai de 0% até 100%',
        '',
        'Cores do Cartão:',
        '  • Borda AMARELA: Meta em andamento',
        '  • Borda VERDE: Meta concluída',
        '  • Progresso na cor correspondente ao status'
      ],
      bestPractices: [
        ' Use Kanban para visualizar metas por status',
        ' Progresso é apenas referência temporal',
        ' Revise regularmente para atualizar status',
        ' Não dependa apenas de progresso - acompanhe clinicamente'
      ]
    },
    {
      titulo: '🔍 Filtrando Metas',
      descricao: 'Use os filtros para encontrar metas específicas rapidamente.',
      dicas: [
        'Três filtros disponíveis no topo:',
        '',
        'BUSCAR (campo de texto):',
        '  • Busca em tempo real',
        '  • Procura em: plano, paciente, profissional, descrição',
        '  • Case-insensitive (maiúsculas = minúsculas)',
        '  • Exemplo: "João" encontra metas do paciente João',
        '',
        'FILTRAR POR PLANO (dropdown):',
        '  • "Todos os planos" mostra todas as metas',
        '  • Ou selecione um plano específico',
        '  • Mostra apenas metas daquele plano',
        '  • Útil para focar em um paciente/profissional',
        '',
        'FILTRAR POR STATUS (dropdown):',
        '  • "Todos os status" mostra metas em qualquer status',
        '  • "Em Andamento" mostra só metas ativas',
        '  • "Concluída" mostra só metas concluídas',
        '  • Útil para acompanhar progresso',
        '',
        'Combinando filtros:',
        '  • Pode usar múltiplos filtros ao mesmo tempo',
        '  • Exemplo: Plano=João + Status=Em Andamento',
        '  • Resultados aparecem em tempo real'
      ],
      bestPractices: [
        ' Use busca para encontrar metas por descrição',
        ' Filtre por plano para focar em paciente específico',
        ' Filtre por status para acompanhar progresso',
        ' Combine filtros para resultados mais precisos'
      ]
    },
    {
      titulo: '✏️ Editando uma Meta Terapêutica',
      descricao: 'Clique no ícone de lápis em qualquer cartão para editar.',
      dicas: [
        'Cada meta tem um botão de edição (ícone de lápis)',
        'Clique nele para abrir formulário de edição',
        'Todos os 6 campos podem ser alterados:',
        '  • Mudar plano (vinculação)',
        '  • Refinar descrição conforme necessário',
        '  • Ajustar data início se necessário',
        '  • Estender/encurtar previsão de término',
        '  • Mudar status conforme evolução',
        '  • Adicionar/remover formulários',
        '',
        'Processo de edição:',
        '  1. Clique no ícone de lápis',
        '  2. Diálogo abre com dados atuais pré-preenchidos',
        '  3. Faça as mudanças necessárias',
        '  4. Clique "Atualizar Meta" para salvar',
        '  5. Kanban será atualizado',
        '',
        'Quando editar:',
        '  • Descrição não foi clara o suficiente',
        '  • Necessidade de ajustar datas durante tratamento',
        '  • Refinar formulários de avaliação',
        '  • Mudar status manualmente se necessário',
        '  • Corrigir informações de plano',
        '',
        'Dica de Status:',
        '  • Pode usar botão "Concluir" diretamente no cartão',
        '  • Ou editar e mudar para "Concluída"',
        '  • Primeira opção é mais rápida'
      ],
      bestPractices: [
        ' Edite logo ao descobrir erro',
        ' Mantenha descrição clara e específica',
        ' Ajuste datas conforme necessário',
        ' Revise formulários regularmente'
      ]
    },
    {
      titulo: '🗑️ Deletando uma Meta Terapêutica',
      descricao: 'Use o ícone de lixeira para remover uma meta.',
      dicas: [
        'Cada cartão tem um botão de deleção (ícone de lixeira)',
        'Clique nele para iniciar exclusão',
        'Um aviso de confirmação aparecerá',
        '',
        'Deletar é PERMANENTE:',
        '  • Não há como recuperar depois',
        '  • Meta será completamente removida',
        '  • Histórico será perdido',
        '',
        'Cuidados importantes:',
        '  • Verifique que está deletando a meta CORRETA',
        '  • Leia a confirmação com cuidado',
        '  • Se for acidente, clique CANCELAR',
        '',
        'Quando deletar:',
        '  • Meta foi criada por erro (plano errado)',
        '  • Meta é duplicada',
        '  • Necessidade de limpeza de dados',
        '',
        'Alternativa a deletar:',
        '  • Considere marcar como "Concluída" em vez de deletar',
        '  • Mantém histórico do que foi feito',
        '  • Mais seguro para auditoria'
      ],
      bestPractices: [
        ' NUNCA delete sem confirmar',
        ' Antes de deletar, verifique dados',
        ' Se duvidoso, cancele a operação',
        ' Prefira marcar "Concluída" a deletar',
        ' Delete apenas metas realmente desnecessárias'
      ]
    },
    {
      titulo: '✅ Marcando Meta como Concluída',
      descricao: 'Use o botão "Concluir" para marcar meta como realizada.',
      dicas: [
        'Metas em andamento têm botão "Concluir" ()',
        'Clique nele para marcar como concluída',
        'Meta será movida para coluna de "Concluídas"',
        'Progresso ficará em 100%',
        '',
        'Processo:',
        '  1. Localize a meta em "Em Andamento"',
        '  2. Clique no botão "Concluir" (verde)',
        '  3. Meta é atualizada imediatamente',
        '  4. Aparece na coluna "Concluídas"',
        '',
        'Metas concluídas:',
        '  • Não aparecem mais em "Em Andamento"',
        '  • Aparecem na coluna "Concluídas" com bordaVerde',
        '  • Podem ser editadas se necessário',
        '  • Podem ser deletadas se erro',
        '',
        'Alternativa:',
        '  • Pode editar meta e mudar Status para "Concluída"',
        '  • Botão "Concluir" é mais rápido',
        '  • Usar edição se precisar alterar outras coisas'
      ],
      bestPractices: [
        ' Marque como concluída quando meta é atingida',
        ' Revise clinicamente antes de concluir',
        ' Não confunda progresso temporal com conclusão',
        ' Use conclusão como feedback de sucesso',
        ' Crie novas metas após conclusão se necessário'
      ]
    },
    {
      titulo: '🔗 Relação com Outros Dados',
      descricao: 'Entenda como Metas se integram com outras funcionalidades.',
      dicas: [
        'PLANOS TERAPÊUTICOS:',
        '  • Meta vinculada a exatamente um plano',
        '  • Plano deve existir antes de criar meta',
        '  • Uma meta não pode existir sem plano',
        '  • Um plano pode ter múltiplas metas',
        '  • Objetivo geral do plano = destino das metas',
        '',
        'FORMULÁRIOS:',
        '  • Meta pode ser vinculada a 0 ou mais formulários',
        '  • Formulários são usados para avaliar progresso',
        '  • Exemplo: GMFM avalia movimento em meta motora',
        '  • Exemplo: Denver avalia desenvolvimento em meta desenvolvimento',
        '  • Vinculação é apenas referência (informativa)',
        '',
        'REGISTRO DIÁRIO:',
        '  • Registros diários devem referenciar metas',
        '  • Registros mostram evolução em relação às metas',
        '  • Metas guiam o que é registrado diariamente',
        '  • Sem metas claras, registros ficam desorganizados',
        '',
        'PROGRESSO TERAPÊUTICO:',
        '  • Progresso é calculado automaticamente',
        '  • Baseia-se APENAS em tempo (data início → fim)',
        '  • Não é baseado em resultados reais',
        '  • Use como referência, não como verdade absoluta',
        '  • Progresso clínico é mais importante'
      ],
      bestPractices: [
        ' Crie plano ANTES de criar metas',
        ' Defina metas ANTES de fazer registros',
        ' Vincule formulários relevantes',
        ' Revise metas conforme evolução do paciente',
        ' Não confunda progresso temporal com progresso clínico',
        ' Use metas para estruturar o tratamento'
      ]
    },
    {
      titulo: '💡 Fluxo de Trabalho Recomendado',
      descricao: 'Workflow completo de como usar Metas Terapêuticas.',
      dicas: [
        'Fluxo Completo:',
        '1. Cadastre PACIENTE → Página Pacientes',
        '2. Crie PLANO TERAPÊUTICO → Página Planos',
        '3. Crie METAS TERAPÊUTICAS → Página atual',
        '4. Inicie REGISTROS DIÁRIOS → Página Registro',
        '5. Monitore progresso em Metas',
        '6. Marque metas como concluídas quando atingidas',
        '7. Crie novas metas conforme necessário',
        '',
        'Priorização de Metas:',
        '  • Defina 3-5 metas principais por plano',
        '  • Não crie muitas metas (fica confuso)',
        '  • Metas devem ser complementares',
        '  • Algumas podem ser independentes',
        '',
        'Revisão Periódica:',
        '  • Mensalmente: Revise progresso das metas',
        '  • Avalie se metas ainda são apropriadas',
        '  • Marque concluídas quando atingidas',
        '  • Crie novas metas se necessário',
        '  • Ajuste datas se cronograma mudou',
        '',
        'Ciclo de Vida de uma Meta:',
        '  • CRIAÇÃO: Define meta nova',
        '  • ACOMPANHAMENTO: Trabalha durante período',
        '  • REVISÃO: Avalia progresso (mensal)',
        '  • CONCLUSÃO: Marca como concluída quando atingida',
        '  • TRANSIÇÃO: Cria novas metas para próxima fase',
        '',
        'Boas Práticas:',
        '  • Use linguagem clínica precisa',
        '  • Defina metas mensuráveis',
        '  • Seja realista com prazos',
        '  • Documente tudo claramente',
        '  • Comunique metas com paciente/responsável'
      ],
      bestPractices: [
        ' Sempre crie plano antes de meta',
        ' Defina metas específicas e mensuráveis',
        ' Revise e atualize regularmente',
        ' Marque concluídas conforme progresso',
        ' Use para estruturar acompanhamento',
        ' Comunique metas claramente',
        ' Combine com registros diários',
        ' Ajuste conforme evolução do paciente'
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
            Guia: Metas Terapêuticas
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como criar e gerenciar metas específicas para seus planos terapêuticos
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
              {passoAtual === 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>Cálculo de Progresso:</strong> O progresso é automático e baseado apenas no tempo decorrido entre data início e previsão término. Não reflete progresso clínico real - use como referência apenas.
                  </div>
                </div>
              )}

              {passoAtual === 4 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Múltiplos Filtros:</strong> Você pode usar busca + filtro de plano + filtro de status simultaneamente para resultados muito precisos.
                  </div>
                </div>
              )}

              {passoAtual === 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-green-900">
                    <strong>Botão Concluir:</strong> Use o botão "Concluir" no cartão para mudar status rapidamente. É mais eficiente que editar a meta.
                  </div>
                </div>
              )}

              {passoAtual === 6 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>ATENÇÃO:</strong> Deletar é permanente. Considere marcar como "Concluída" em vez de deletar para manter histórico.
                  </div>
                </div>
              )}

              {passoAtual === 8 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                  <Lightbulb className="text-purple-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-purple-900">
                    <strong>Estrutura Completa:</strong> Metas são o elo entre Planos Terapêuticos e Registros Diários. Defina metas claras para ter registros bem organizados.
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
