import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight } from 'lucide-react';

export default function PlanosTerapeuticosAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: 'Planos Terapêuticos',
      descricao: 'Esta página centraliza o gerenciamento de planos terapêuticos para cada paciente. Um plano terapêutico é um documento que define os objetivos e metas de tratamento.',
      dicas: [
        'Plano Terapêutico é um documento clínico essencial que guia o tratamento',
        'Vincula paciente + profissional + objetivos específicos de tratamento',
        'Cada paciente pode ter múltiplos planos terapêuticos (um por profissional ou período)',
        'O plano registra o objetivo geral que se deseja alcançar',
        'A data de criação marca quando o plano foi estabelecido',
        'Planos podem ser editados conforme evolução do paciente',
        'Serve como referência para registro diário e acompanhamento'
      ],
      bestPractices: [
        ' Crie um plano claro e específico para cada paciente',
        ' Revise periodicamente se o plano ainda é adequado',
        ' Mantenha objetivos realistas e mensuráveis',
        ' Coordene planos com todos os profissionais envolvidos',
        ' Use o plano como base para registros diários'
      ]
    },
    {
      titulo: '📝 Componentes do Plano Terapêutico',
      descricao: 'Cada plano terapêutico é composto por 4 componentes principais.',
      dicas: [
        'Paciente *: Campo obrigatório',
        '  • Selecione qual paciente este plano se refere',
        '  • Mostra nome e diagnóstico do paciente',
        '  • Um paciente pode ter múltiplos planos (diferentes profissionais)',
        '',
        'Profissional *: Campo obrigatório',
        '  • Selecione o profissional responsável',
        '  • Mostra nome e especialidade do profissional',
        '  • Um plano é atribuído a um profissional específico',
        '',
        'Objetivo Geral *: Campo obrigatório (textarea)',
        '  • Descrição completa do que se quer alcançar',
        '  • Exemplo: "Melhorar coordenação motora fina e precisão de preensão"',
        '  • Seja específico e claro',
        '  • Use linguagem profissional',
        '  • Descreva o resultado esperado do tratamento',
        '',
        'Data de Criação: Campo opcional',
        '  • Data em que o plano foi criado',
        '  • Importante para histórico e evolução',
        '  • Formato: DD/MM/YYYY'
      ],
      bestPractices: [
        ' Todos os campos marcados com * são obrigatórios',
        ' Objetivo geral deve ser claro e específico',
        ' Use termos clínicos precisos no objetivo',
        ' Evite generalizações ("melhorar em tudo")',
        ' Defina objetivos que possam ser medidos/avaliados'
      ]
    },
    {
      titulo: '➕ Criando um Novo Plano Terapêutico',
      descricao: 'Para criar um novo plano, clique no botão "Novo Plano" no topo da página.',
      dicas: [
        'Clique no botão azul "Novo Plano" no canto superior direito',
        'Um diálogo (modal) abrirá com o formulário de criação',
        'Preencha todos os 4 campos:',
        '',
        '1. Selecione o PACIENTE:',
        '  • Clique no dropdown "Selecione o paciente"',
        '  • Procure pelo nome do paciente',
        '  • Selecione (mostrará nome e diagnóstico)',
        '',
        '2. Selecione o PROFISSIONAL:',
        '  • Clique no dropdown "Selecione o profissional"',
        '  • Procure pelo nome do profissional',
        '  • Selecione (mostrará nome e especialidade)',
        '',
        '3. Escreva o OBJETIVO GERAL:',
        '  • Clique na área de texto',
        '  • Descreva com clareza o objetivo do tratamento',
        '  • Seja específico e mensurável',
        '',
        '4. (Opcional) Defina a DATA DE CRIAÇÃO:',
        '  • Clique no campo de data',
        '  • Selecione a data do calendário',
        '',
        'Após preencher:',
        '  • Clique "Criar Plano" para salvar',
        '  • Receberá mensagem de sucesso',
        '  • Plano aparecerá na lista'
      ],
      bestPractices: [
        ' Preencha com cuidado antes de enviar',
        ' Objetivo geral deve descrever claramente o resultado esperado',
        ' Verifique paciente e profissional corretos',
        ' Salve a data de criação para histórico'
      ]
    },
    {
      titulo: '🔍 Buscando Planos Terapêuticos',
      descricao: 'Use o campo de busca para encontrar planos específicos rapidamente.',
      dicas: [
        'Campo de busca está localizado acima da tabela',
        'Busca em tempo real enquanto digita',
        'Procura em múltiplos campos simultaneamente:',
        '  • Nome do paciente',
        '  • Nome do profissional',
        '  • Objetivo geral do plano',
        '',
        'Exemplos de buscas úteis:',
        '  • Digitar "João" encontra planos do paciente João',
        '  • Digitar "Psicólogo" encontra planos de psicólogos',
        '  • Digitar "coordenação" encontra planos com este objetivo',
        '  • Digitar "Silva" encontra pacientes/profissionais com este sobrenome',
        '',
        'Dicas de busca:',
        '  • Busca é case-insensitive (maiúsculas = minúsculas)',
        '  • Funciona com partes do nome (não precisa ser completo)',
        '  • Procura em todas as colunas da tabela',
        '  • Limpe a busca para ver todos os planos'
      ],
      bestPractices: [
        ' Use busca para encontrar plano de paciente específico',
        ' Teste diferentes termos se não encontrar',
        ' Limpe o campo para voltar a ver todos',
        ' Use para verificar se plano já existe antes de criar'
      ]
    },
    {
      titulo: '✏️ Editando um Plano Terapêutico',
      descricao: 'Clique no ícone de lápis para editar um plano existente.',
      dicas: [
        'Cada plano na tabela tem um botão de edição (ícone de lápis)',
        'Clique nele para abrir o formulário de edição',
        'Todos os 4 campos podem ser alterados:',
        '  • Mudar o paciente associado',
        '  • Mudar o profissional responsável',
        '  • Alterar ou refinar o objetivo geral',
        '  • Atualizar a data de criação',
        '',
        'Processo de edição:',
        '  1. Clique no ícone de lápis',
        '  2. Diálogo abre com dados atuais pré-preenchidos',
        '  3. Faça as mudanças necessárias',
        '  4. Clique "Atualizar Plano" para salvar',
        '  5. Receberá confirmação de sucesso',
        '  6. Tabela será atualizada com novos dados',
        '',
        'Quando editar:',
        '  • Objetivo não foi claro o suficiente',
        '  • Paciente/profissional foi registrado errado',
        '  • Necessidade de refinar objetivo durante tratamento',
        '  • Atualizar data se necessário'
      ],
      bestPractices: [
        ' Edite logo ao descobrir erro',
        ' Revise mudanças antes de salvar',
        ' Comunique alterações importantes ao profissional',
        ' Mantenha objetivo alinhado com evolução do paciente'
      ]
    },
    {
      titulo: '🗑️ Deletando um Plano Terapêutico',
      descricao: 'Use o ícone de lixeira para remover um plano.',
      dicas: [
        'Cada plano tem um botão de exclusão (ícone de lixeira)',
        'Localizado ao lado do botão de edição',
        'Clique nele para iniciar exclusão',
        'Um aviso de confirmação aparecerá pedindo certeza',
        '',
        'Deletar é PERMANENTE:',
        '  • Não há como recuperar depois',
        '  • Todos os dados do plano serão removidos',
        '  • Registros diários associados podem ser afetados',
        '',
        'Cuidados importantes:',
        '  • Verifique que está deletando o plano CORRETO',
        '  • Leia a confirmação com cuidado',
        '  • Se for acidente, clique CANCELAR na confirmação',
        '  • Considere arquivar em vez de deletar se possível',
        '',
        'Quando deletar:',
        '  • Plano foi criado por erro (paciente/profissional errado)',
        '  • Tratamento foi completamente descontinuado',
        '  • Necessidade de limpeza de dados obsoletos'
      ],
      bestPractices: [
        ' NUNCA delete por impulso - sempre confirme',
        ' Antes de deletar, verifique dados',
        ' Se duvidoso, cancel a operação',
        ' Considere impacto nos registros diários',
        ' Documente por que está deletando'
      ]
    },
    {
      titulo: '📊 Visualizando a Tabela de Planos',
      descricao: 'Entenda cada coluna da tabela de planos terapêuticos.',
      dicas: [
        'Coluna PACIENTE:',
        '  • Nome do paciente',
        '  • Exibido com ícone de pessoa',
        '  • Nome em destaque (bold)',
        '',
        'Coluna PROFISSIONAL:',
        '  • Nome do profissional responsável',
        '  • Exibido com ícone de profissional',
        '  • Especialidade não é exibida aqui',
        '',
        'Coluna OBJETIVO GERAL:',
        '  • Descrição do objetivo terapêutico',
        '  • Texto truncado se muito longo',
        '  • Passe o mouse para ver completo (tooltip)',
        '  • Use busca se texto for muito longo',
        '',
        'Coluna DATA DE CRIAÇÃO:',
        '  • Data em formato DD/MM/YYYY',
        '  • Ajuda a rastrear quando plano foi criado',
        '  • Mostra "-" se data não foi informada',
        '',
        'Coluna AÇÕES:',
        '  • Botão de edição (lápis)',
        '  • Botão de deleção (lixeira)',
        '  • Alinhados à direita para fácil acesso'
      ],
      bestPractices: [
        ' Revise dados antes de fazer ações',
        ' Use busca para encontrar plano específico',
        ' Passe mouse sobre objetivo truncado para ler completo',
        ' Clique em ações apenas no plano CORRETO'
      ]
    },
    {
      titulo: '🔗 Relação com Outros Dados',
      descricao: 'Entenda como Planos Terapêuticos se relacionam com outras funcionalidades.',
      dicas: [
        'PACIENTES:',
        '  • Um paciente pode ter MÚLTIPLOS planos terapêuticos',
        '  • Diferentes profissionais = diferentes planos',
        '  • Ou diferentes períodos/fases de tratamento',
        '  • Um plano é para um paciente específico',
        '',
        'PROFISSIONAIS:',
        '  • Um profissional pode ter múltiplos planos',
        '  • Cada profissional trabalha com vários pacientes',
        '  • Um plano é atribuído a um profissional específico',
        '  • Registros diários são feitos pelo profissional do plano',
        '',
        'REGISTRO DIÁRIO:',
        '  • Registros diários devem referenciar um plano terapêutico',
        '  • Objetivo do plano guia o que é registrado',
        '  • Registros mostram progresso para objetivos do plano',
        '  • Plano fornece contexto para cada registro',
        '',
        'METAS TERAPÊUTICAS:',
        '  • Plano terapêutico define objetivo geral',
        '  • Metas terapêuticas são objetivos específicos dentro do plano',
        '  • Um plano pode ter múltiplas metas',
        '  • Metas são mais específicas que objetivo geral'
      ],
      bestPractices: [
        ' Crie plano ANTES de fazer registros',
        ' Alinha plano com metas estabelecidas',
        ' Revise plano periodicamente',
        ' Atualize conforme evolução do paciente',
        ' Mantenha histórico de planos anteriores'
      ]
    },
    {
      titulo: '💡 Fluxo de Trabalho Recomendado',
      descricao: 'Dicas sobre como usar Planos Terapêuticos no dia a dia.',
      dicas: [
        'Fluxo Padrão:',
        '1. Novo paciente chega → Cadastre na página Pacientes',
        '2. Assigne profissional(is) → Página de Pacientes',
        '3. Defina metas terapêuticas → Página de Metas',
        '4. Crie PLANO TERAPÊUTICO → Página atual',
        '5. Comece registros diários → Página Registro Diário',
        '6. Monitore progresso → Plano e Registros',
        '',
        'Revisão Periódica:',
        '  • Mensalmente: Revise se plano ainda é apropriado',
        '  • Verifique se objetivo está sendo alcançado',
        '  • Edite se necessário ajustes',
        '  • Comunique mudanças ao paciente/responsável',
        '',
        'Manutenção:',
        '  • Use busca para verificar planos existentes',
        '  • Delete apenas planos obsoletos',
        '  • Mantenha histórico de planos antigos se possível',
        '  • Documente por que plano foi alterado/deletado',
        '',
        'Melhorias Contínuas:',
        '  • Objetivo muito vago → Refine antes de continuar',
        '  • Paciente evoluiu rápido → Crie novo plano mais desafiador',
        '  • Paciente travado → Revise e ajuste objetivo',
        '  • Feedback de profissional → Implemente mudanças'
      ],
      bestPractices: [
        ' Sempre crie plano ANTES de começar registros',
        ' Revise e atualize plano regularmente',
        ' Mantenha alinhamento com metas terapêuticas',
        ' Comunique mudanças de plano com profissional',
        ' Use plano como guia para registros diários',
        ' Archive planos antigos em vez de deletar'
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
            Guia: Planos Terapêuticos
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como criar e gerenciar planos terapêuticos para pacientes
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
                    <strong>Dica de Busca:</strong> A busca é case-insensitive e funciona em tempo real. Use para verificar se um plano já existe antes de criar um novo.
                  </div>
                </div>
              )}

              {passoAtual === 4 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Atualizar vs Deletar:</strong> Preferir atualizar um plano em vez de deletar. Deletar remove o plano permanentemente, o que pode afetar registros diários associados.
                  </div>
                </div>
              )}

              {passoAtual === 5 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>ATENÇÃO:</strong> Deletar é permanente e não pode ser desfeito. Sempre verifique que está deletando o plano CORRETO antes de confirmar.
                  </div>
                </div>
              )}

              {passoAtual === 7 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-green-900">
                    <strong>Integração Completa:</strong> Planos Terapêuticos é o núcleo do sistema. Sempre crie o plano antes de fazer registros diários ou atribuir metas específicas.
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
