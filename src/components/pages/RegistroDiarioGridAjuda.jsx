import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight } from 'lucide-react';

export default function RegistroDiarioGridAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: 'Registro Diário',
      descricao: 'Esta página centraliza todos os registros de acompanhamento dos pacientes. Aqui você pode visualizar, filtrar, editar e gerenciar protocolos e registros descritivos.',
      dicas: [
        'O Registro Diário é o centro de coleta de dados de acompanhamento clínico',
        'Existem dois tipos de registros: Protocolo (com perguntas estruturadas) e Descrição (texto livre)',
        'Todos os registros ficam organizados em uma tabela com filtros e paginação',
        'Você pode acessar esta página sempre que precisar consultar o histórico'
      ],
      bestPractices: [
        '✓ Regularidade: Preencha registros após cada sessão/atendimento',
        '✓ Consistência: Use sempre o mesmo protocolo para comparações no tempo',
        '✓ Documentação: Adicione observações importantes nos campos de descrição'
      ]
    },
    {
      titulo: '🔍 Entendendo a Tabela de Registros',
      descricao: 'A tabela exibe todos os seus registros com informações essenciais. Cada linha representa um registro de acompanhamento.',
      dicas: [
        'Coluna "Tipo": Mostra se é um Protocolo (verde) ou Descritivo (azul)',
        'Coluna "Paciente": Nome do paciente associado ao registro',
        'Coluna "Data": Data do acompanhamento (não é a data de digitação)',
        'Coluna "Meta": Meta terapêutica vinculada ao registro',
        'Coluna "Nota": Avaliação de 1 a 5 atribuída ao registro (se houver)',
        'Coluna "Ações": Botões para editar ou deletar o registro'
      ],
      bestPractices: [
        '✓ Revise a data do registro - sempre deve ser a data do atendimento realizado',
        '✓ A nota ajuda a rastrear tendências de progresso ao longo do tempo',
        '✓ Use as ações com cuidado - deletar é permanente'
      ]
    },
    {
      titulo: '🎯 Criando Novo Protocolo',
      descricao: 'Use o botão "Novo Protocolo" para criar um registro estruturado com perguntas predefinidas.',
      dicas: [
        'Um Protocolo é um formulário com perguntas específicas (ex: GMFM-88, Denver)',
        'Cada pergunta tem um tipo: TEXTO, NÚMERO, BOOLEANO, MÚLTIPLA ou FÓRMULA',
        'Perguntas marcadas com * são obrigatórias',
        'Fórmulas são calculadas automaticamente baseadas em outras respostas',
        'Percentuais são calculados automaticamente e não aparecem no formulário',
        'Ideal para coleta de dados padronizados que permitem comparação'
      ],
      bestPractices: [
        '✓ Use Protocolo para métricas clínicas objetivas',
        '✓ Escolha o protocolo mais apropriado para o tipo de avaliação',
        '✓ Preencha com precisão - estes dados serão usados em relatórios',
        '✓ Revise antes de salvar para evitar erros'
      ]
    },
    {
      titulo: '📝 Criando Nova Descrição',
      descricao: 'Use o botão "Nova Descrição" para criar um registro mais flexível, baseado em anotações textuais.',
      dicas: [
        'Uma Descrição é um registro livre com campos de texto aberto',
        'Ideal para observações, comportamentos, evolução e narrativa clínica',
        'Você pode adicionar notas sobre o paciente, seu progresso e contexto da sessão',
        'Menos estruturado que um Protocolo, mas mais flexível para capturar contexto',
        'Útil para complementar dados quantitativos com qualitativo'
      ],
      bestPractices: [
        '✓ Use Descrição para narrativa clínica e observações qualitativas',
        '✓ Combine Protocolo + Descrição para coleta mais completa',
        '✓ Seja específico nas observações - evite generalizações',
        '✓ Documente comportamentos, insights e mudanças significativas'
      ]
    },
    {
      titulo: '📊 Exportar/Importar Excel',
      descricao: 'Use esta funcionalidade para coletar dados remotamente ou trabalhar com arquivos Excel.',
      dicas: [
        'Exportar: Gera um arquivo Excel com perguntas do protocolo para o cliente preencher',
        'Importar: Carrega as respostas preenchidas de volta ao sistema',
        'Ideal para coleta em campo ou quando o cliente vai preencher em casa',
        'Mantém a integridade dos dados através de validação de IDs das perguntas',
        'Útil para trabalhar com estagiários ou profissionais remotos',
        'Abre uma página dedicada com todas as opções de import/export'
      ],
      bestPractices: [
        '✓ Use quando precisar coletar dados de forma offline',
        '✓ Sempre valide os dados antes de importar',
        '✓ Mantenha copias dos arquivos como backup',
        '✓ Use o mesmo protocolo para export e import'
      ]
    },
    {
      titulo: '🔎 Usando os Filtros de Busca',
      descricao: 'Os filtros permitem buscar registros específicos de forma rápida e fácil.',
      dicas: [
        'Meta Terapêutica: Filtra por meta específica ou mostra todas',
        'Data Início: Mostra apenas registros a partir desta data',
        'Data Fim: Mostra apenas registros até esta data',
        'Nota Mínima: Filtra registros com nota maior ou igual',
        'Nota Máxima: Filtra registros com nota menor ou igual',
        'Você pode combinar múltiplos filtros simultaneamente',
        'Clique no X ao lado de cada filtro para remover individualmente',
        'Clique em "Limpar Filtros" para resetar todos os filtros'
      ],
      bestPractices: [
        '✓ Use intervalo de datas para análises de período específico',
        '✓ Filtre por meta para revisar progresso em objetivo específico',
        '✓ Use nota min/max para encontrar registros com desempenho particular',
        '✓ Salve mentalmente combinações úteis para reuso frequente'
      ]
    },
    {
      titulo: '✏️ Editando um Registro',
      descricao: 'O botão de edição (lápis) permite fazer alterações em registros já criados.',
      dicas: [
        'Clique no ícone de lápis para abrir o registro para edição',
        'Se for Protocolo: Abre a tela de preenchimento de perguntas',
        'Se for Descrição: Abre a tela de edição de texto',
        'Você pode alterar qualquer campo após criação',
        'Alterações são salvas ao clicar em "Salvar"',
        'Campos já respondidos mostram um ✓ verde (em Protocolos)',
        'Ao editar, você revisita os mesmos dados para ajustes'
      ],
      bestPractices: [
        '✓ Edite logo após criação se notar erros',
        '✓ Documente por que está editando registros antigos',
        '✓ Evite edições frequentes - mantém auditoria clara',
        '✓ Para correções maiores, considere criar novo registro'
      ]
    },
    {
      titulo: '🗑️ Deletando um Registro',
      descricao: 'O botão de exclusão (lixeira) permite remover registros permanentemente.',
      dicas: [
        'Clique no ícone de lixeira para deletar o registro',
        'Um aviso de confirmação aparecerá pedindo certeza',
        'Deletar é PERMANENTE - não há como recuperar',
        'Use com cuidado - verifique antes de confirmar',
        'Considere arquivar em vez de deletar para auditoria'
      ],
      bestPractices: [
        '✓ Antes de deletar, verifique se é realmente o registro correto',
        '✓ Documente o motivo de deletar (ex: duplicado, erro de paciente)',
        '✓ Considere criar políticas de retenção para seu clínica',
        '✓ Evite deletar registros históricos importantes'
      ]
    },
    {
      titulo: '📄 Paginação',
      descricao: 'A paginação organiza registros em páginas para melhor navegação.',
      dicas: [
        'Cada página mostra até 10 registros por padrão',
        'Use botões "Anterior" e "Próxima" para navegar',
        'Clique em um número de página específico para ir direto',
        'A página atual é destacada em azul',
        'O texto mostra quantos registros estão sendo exibidos',
        'Após filtrar, volta automaticamente para a página 1'
      ],
      bestPractices: [
        '✓ Use filtros para reduzir quantidade de páginas',
        '✓ Memorize pacientes/metas frequentemente acessadas',
        '✓ Use busca para encontrar registro específico mais rápido'
      ]
    },
    {
      titulo: '💡 Fluxo de Trabalho Recomendado',
      descricao: 'Dicas sobre como usar melhor esta página no seu dia a dia.',
      dicas: [
        'Fluxo Típico:',
        '1. Abra o Registro Diário após cada sessão',
        '2. Clique em "Novo Protocolo" ou "Nova Descrição"',
        '3. Preencha com dados da sessão',
        '4. Salve o registro',
        '5. Volte a esta página para visualizar histórico',
        '',
        'Análise e Acompanhamento:',
        '• Use filtros para revisar progresso em meta específica',
        '• Compare notas ao longo do tempo (tendências)',
        '• Identifique padrões de comportamento/desempenho',
        '• Use relatórios para relatórios clínicos',
        '',
        'Manutenção:',
        '• Revise registros antigos periodicamente',
        '• Corrija erros de digitação quando encontrar',
        '• Archive ou delete registros desnecessários',
        '• Mantenha dados limpos e organizados'
      ],
      bestPractices: [
        '✓ Estabeleça rotina: Sempre preench após atendimento',
        '✓ Use nomes descritivos em observações',
        '✓ Revise dados antes de usar em relatórios',
        '✓ Faça backup periódico dos dados importantes',
        '✓ Valide dados com colegas/supervisor quando necessário'
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
            Guia: Registro Diário - Histórico e Gestão
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como visualizar, filtrar, editar e gerenciar seus registros de acompanhamento
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
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alertas contextualizados */}
              {passoAtual === 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Protocolo vs Descrição:</strong> Use Protocolo para dados estruturados (ex: escalas, avaliações padronizadas) e Descrição para notas clínicas qualitativas. Combine ambos para registro completo.
                  </div>
                </div>
              )}

              {passoAtual === 7 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>ATENÇÃO:</strong> Deletar é permanente e não pode ser desfeito. Sempre confirme que está deletando o registro correto antes de prosseguir.
                  </div>
                </div>
              )}

              {passoAtual === 5 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>Dica de Filtro:</strong> Combine múltiplos filtros (data + meta + nota) para análises mais precisas. Experimente diferentes combinações para encontrar insights sobre o progresso do paciente.
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
