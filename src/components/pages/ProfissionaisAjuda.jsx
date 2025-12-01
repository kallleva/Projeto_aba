import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight } from 'lucide-react';

export default function ProfissionaisAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: '👥 Bem-vindo ao Cadastro de Profissionais',
      descricao: 'Esta página gerencia o cadastro de todos os profissionais que trabalham no sistema. Aqui você pode visualizar, editar e excluir profissionais.',
      dicas: [
        'Cada profissional tem um perfil completo com nome, especialidade, email e telefone',
        'A página mantém lista organizada e pesquisável de todos os profissionais',
        'Você pode visualizar informações de contato rapidamente',
        'Dados podem ser atualizados conforme necessidade',
        'Especialidades são categorizadas com cores para identificação rápida',
        'Email e telefone são informações críticas para comunicação'
      ],
      bestPractices: [
        ' Mantenha dados de contato atualizados para boa comunicação',
        ' Use especialidades descritivas e padronizadas',
        ' Revise regularmente a lista de profissionais',
        ' Guarde informações de contato importante em lugar seguro'
      ]
    },
    {
      titulo: '📝 Campos do Cadastro de Profissional',
      descricao: 'Cada profissional tem quatro campos principais de informação que devem ser preenchidos.',
      dicas: [
        'Nome *: Campo obrigatório com nome completo do profissional',
        '  • Use nome completo e profissional',
        '  • Exemplo: "João da Silva" ou "Dra. Maria Santos"',
        '',
        'Especialidade *: Campo obrigatório indicando a formação/especialização',
        '  • Exemplos: "Psicólogo", "Fonoaudiólogo", "Terapeuta Ocupacional", "Fisioterapeuta"',
        '  • Sistema categoriza automaticamente por cores (Psicologia=azul, Fonoaudiologia=verde, etc)',
        '  • Seja descritivo para identificação rápida',
        '',
        'Email *: Campo obrigatório com email de contato profissional',
        '  • Deve ser válido (formato: exemplo@dominio.com.br)',
        '  • Usado para notificações e recuperação de senha',
        '  • Mantenha atualizado para comunicação importante',
        '',
        'Telefone *: Campo obrigatório com número de contato',
        '  • Formato sugerido: (XX) XXXXX-XXXX',
        '  • Use telefone profissional ou celular principal',
        '  • Importante para contato rápido e emergências'
      ],
      bestPractices: [
        ' Todos os campos são obrigatórios (*) - não deixe em branco',
        ' Verifique email e telefone antes de salvar',
        ' Use dados profissionais, não pessoais (quando possível)',
        ' Mantenha informações atualizadas regularmente'
      ]
    },
    {
      titulo: '🔍 Buscando Profissionais',
      descricao: 'Use o campo de busca para encontrar profissionais rapidamente.',
      dicas: [
        'Campo de busca permite localizar profissionais por diversos critérios',
        'Busca em tempo real enquanto digita',
        'Procura em múltiplos campos simultaneamente:',
        '  • Nome do profissional',
        '  • Especialidade (ex: "Psicólogo")',
        '  • Email (ex: "joao@email.com")',
        '  • Telefone (ex: "(11) 99999-9999")',
        '',
        'Exemplos de buscas úteis:',
        '  • Digitar "Psic" encontra Psicólogos',
        '  • Digitar "joao" encontra profissionais com João no nome',
        '  • Digitar "fono" encontra Fonoaudiólogos',
        '  • Digitar um telefone para encontrar profissional específico'
      ],
      bestPractices: [
        ' Use buscas para encontrar rapidamente em listas grandes',
        ' Teste com partes do nome ou especialidade',
        ' Se não encontrar, tente buscar por outro campo (email ou telefone)',
        ' Limpe a busca clicando no X ou deletando o texto'
      ]
    },
    {
      titulo: '➕ Criando Novo Profissional',
      descricao: 'Para criar um novo profissional, clique no botão "Novo Profissional".',
      dicas: [
        'Clique no botão azul com ícone de + para abrir formulário',
        'Preencha todos os 4 campos obrigatórios:',
        '  1. Nome - Nome completo do profissional',
        '  2. Especialidade - Sua formação/especialização',
        '  3. Email - Email de contato válido',
        '  4. Telefone - Número para contato',
        '',
        'Após preencher tudo:',
        '  • Clique em "Cadastrar" para salvar',
        '  • Um novo profissional será criado no sistema',
        '  • Receberá mensagem de sucesso',
        '  • A lista será atualizada automaticamente'
      ],
      bestPractices: [
        ' Verifique se o profissional já existe antes de criar',
        ' Use dados completos e corretos desde o início',
        ' Coordene com o profissional antes de criar (para email/telefone)',
        ' Revise os dados antes de clicar em "Cadastrar"'
      ]
    },
    {
      titulo: '✏️ Editando um Profissional',
      descricao: 'Clique no ícone de lápis na coluna "Ações" para editar informações.',
      dicas: [
        'Para cada profissional, há um botão de edição (ícone de lápis)',
        'Clique nele para abrir o formulário de edição',
        'Todos os 4 campos podem ser alterados',
        'Faça as mudanças necessárias:',
        '  • Atualize nome se houver mudança',
        '  • Corrija especialidade se necessário',
        '  • Atualize email (importante!)',
        '  • Atualize telefone',
        '',
        'Após editar:',
        '  • Clique em "Atualizar" para salvar',
        '  • Receberá confirmação de sucesso',
        '  • A tabela mostrará dados atualizados'
      ],
      bestPractices: [
        ' Edite logo ao descobrir um erro',
        ' Comunique mudanças importantes',
        ' Verifique dados antes de atualizar',
        ' Documente por que está editando'
      ]
    },
    {
      titulo: '🗑️ Deletando um Profissional',
      descricao: 'Use o ícone de lixeira na coluna "Ações" para remover profissional.',
      dicas: [
        'O botão de delete (ícone de lixeira) está ao lado do botão de edição',
        'Clique nele para deletar o profissional',
        'Um aviso de confirmação aparece pedindo certeza',
        'Deletar é PERMANENTE:',
        '  • Não há como recuperar depois',
        '  • Todos os dados do profissional serão removidos',
        '  • Registros e histórico também serão afetados',
        '',
        'Cuidados importantes:',
        '  • Verifique se está deletando o profissional CORRETO',
        '  • Confirme a ação antes de prosseguir',
        '  • Considere se realmente precisa deletar (arquivar é mais seguro)',
        '  • Se for erro, cancele a operação'
      ],
      bestPractices: [
        ' NUNCA delete por impulso - sempre confirme',
        ' Antes de deletar, verifique dados múltiplas vezes',
        ' Se for acidente, cancele no diálogo de confirmação',
        ' Mantenha backup antes de deletar profissional importante'
      ]
    },
    {
      titulo: '🎨 Cores das Especialidades',
      descricao: 'O sistema usa cores para categorizar rapidamente as especialidades.',
      dicas: [
        'Cores automáticas baseadas no texto da especialidade:',
        '',
        'AZUL (badge-info) - Psicólogos',
        '  • Especialidade com "psicolog" no nome',
        '  • Exemplo: "Psicólogo", "Psicologia Clínica"',
        '',
        'VERDE (badge-success) - Fonoaudiólogos',
        '  • Especialidade com "fonoaudi" no nome',
        '  • Exemplo: "Fonoaudiólogo", "Fonoaudiologia"',
        '',
        'AMARELO (badge-warning) - Terapeutas',
        '  • Especialidade com "terapeuta" no nome',
        '  • Exemplo: "Terapeuta Ocupacional", "Psicoterapeuta"',
        '',
        'CINZA (badge-neutral) - Outras especialidades',
        '  • Qualquer outra que não se encaixa nas acima',
        '  • Exemplo: "Fisioterapeuta", "Médico", "Nutricionista"'
      ],
      bestPractices: [
        ' Use nomes de especialidade que acionem as categorias corretas',
        ' Cores ajudam identificação visual rápida na tabela',
        ' Se quiser cor específica, use a palavra-chave na especialidade',
        ' Seja consistente nos nomes de especialidade'
      ]
    },
    {
      titulo: '📊 Visualizando a Tabela de Profissionais',
      descricao: 'A tabela exibe todos os profissionais com suas informações principais.',
      dicas: [
        'Colunas da tabela:',
        '',
        'Nome:',
        '  • Nome completo do profissional',
        '  • Exibido em destaque (bold)',
        '',
        'Especialidade:',
        '  • Sua formação/especialização',
        '  • Mostrada com cor de categoria',
        '  • Facilita identificação visual',
        '',
        'Email:',
        '  • Endereço de email profissional',
        '  • Exibido com ícone de envelope',
        '  • Clicável (em alguns navegadores)',
        '',
        'Telefone:',
        '  • Número de contato principal',
        '  • Exibido com ícone de telefone',
        '  • Formato: (XX) XXXXX-XXXX',
        '',
        'Ações:',
        '  • Botões de edição (lápis)',
        '  • Botão de deleção (lixeira) - apenas ADMIN',
        '  • Alinhados à direita para fácil acesso'
      ],
      bestPractices: [
        ' Revise email e telefone regularmente',
        ' Use busca para encontrar profissional específico',
        ' Aproveite cores para identificação rápida',
        ' Clique em ações apenas no profissional CORRETO'
      ]
    },
    {
      titulo: '💡 Fluxo de Trabalho Recomendado',
      descricao: 'Dicas sobre como usar melhor esta página no dia a dia.',
      dicas: [
        'Fluxo Padrão:',
        '1. Acesse a página de Profissionais',
        '2. Use busca para encontrar profissional se necessário',
        '3. Revise dados periodicamente',
        '4. Crie novos profissionais quando ingressarem',
        '5. Edite se houver mudanças de dados de contato',
        '6. Delete apenas se realmente necessário',
        '',
        'Manutenção Regular:',
        '• Mantenha dados atualizados sempre',
        '• Comunique-se com profissionais sobre mudanças',
        '• Use busca para verificar dados antes de criar duplicado',
        '• Faça backup de dados importantes',
        '• Revise especialidades periodicamente para padronização',
        '',
        'Dicas Úteis:',
        '• Coordene com profissionais sobre alterações',
        '• Use email como identificador único',
        '• Comunique claramente mudanças importantes',
        '• Valide dados com colegas quando necessário'
      ],
      bestPractices: [
        ' Estabeleça rotina de atualização de dados',
        ' Mantenha backup da lista de profissionais',
        ' Use buscas para verificar duplicatas',
        ' Revise regularmente para qualidade dos dados',
        ' Comunique mudanças de forma clara e profissional'
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
            Guia: Cadastro de Profissionais
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como gerenciar profissionais no sistema
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
              {passoAtual === 2 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>Dica de Busca:</strong> A busca é case-insensitive (não diferencia maiúsculas de minúsculas) e procura em todos os campos simultaneamente. Teste diferentes palavras-chave para melhores resultados.
                  </div>
                </div>
              )}

              {passoAtual === 4 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>ATENÇÃO:</strong> Deletar é permanente e não pode ser desfeito. Sempre verifique que está deletando o profissional CORRETO antes de confirmar.
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
