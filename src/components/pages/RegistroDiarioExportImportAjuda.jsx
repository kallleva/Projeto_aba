import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Lightbulb, ChevronRight, FileText, Download, Upload } from 'lucide-react';

export default function RegistroDiarioExportImportAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0);

  const passos = [
    {
      titulo: '📊 Entendendo Export/Import de Protocolos',
      descricao: 'Este sistema permite exportar protocolos em Excel para que clientes ou profissionais preencham remotamente, e depois importar as respostas de volta ao sistema.',
      dicas: [
        'Use quando precisar coletar dados de pacientes fora do sistema (consultórios remotos, sessões externas)',
        'Ideal para compartilhar protocolos com estagiários ou auxiliares de forma estruturada',
        'Mantém a integridade dos dados através de validação de ID das perguntas',
        'O arquivo Excel serve como intermediário para coleta de dados offline'
      ],
      bestPractices: [
        '✓ Use esta funcionalidade para coleta de dados em campo ou por profissionais autônomos',
        '✓ Sempre mantenha uma cópia do arquivo Excel original antes de importar',
        '✓ Verifique os dados antes de importar para evitar inconsistências'
      ]
    },
    {
      titulo: '🎯 Preparando para Exportar',
      descricao: 'Antes de exportar um protocolo, você precisa selecionar o paciente, meta terapêutica, protocolo específico e a data do acompanhamento.',
      dicas: [
        'Paciente: Selecione o paciente para o qual está coletando dados',
        'Meta Terapêutica: Escolha a meta associada a este protocolo',
        'Protocolo (Formulário): Selecione o protocolo específico (ex: GMFM-88, Denver, Socially Savvy)',
        'Data: Indique a data do acompanhamento que será registrado',
        'Após selecionar o protocolo, o sistema carrega todas as perguntas automaticamente',
        'Perguntas de tipo PERCENTUAL e FÓRMULA são excluídas do Excel (calculadas automaticamente)',
        'Apenas perguntas respondíveis aparecem no Excel para preenchimento'
      ],
      bestPractices: [
        '✓ Verifique se o protocolo correto foi selecionado antes de exportar',
        '✓ A data é importante para manter histórico de quando os dados foram coletados',
        '✓ Sempre valide os dados do paciente e meta antes de enviar o arquivo'
      ]
    },
    {
      titulo: '⬇️ Exportando o Protocolo para Excel',
      descricao: 'O arquivo Excel exportado contém todas as perguntas do protocolo em formato estruturado, pronto para preenchimento.',
      dicas: [
        'O arquivo gerado contém as colunas: ID, Sigla, Tipo, Pergunta, Obrigatória, Opções, Resposta',
        'A coluna "Resposta" é onde o cliente/profissional preencherá as respostas',
        'Para perguntas MÚLTIPLA, as opções aparecem separadas por | (pipe)',
        'Nunca altere as colunas ID, Sigla, Tipo, Pergunta - apenas preencha "Resposta"',
        'O nome do arquivo segue o padrão: NomePaciente_NomeFormulario_Data.xlsx',
        'Distribua este arquivo para preenchimento offline ou envie por email'
      ],
      bestPractices: [
        '✓ Não modifique as colunas de estrutura, apenas a coluna "Resposta"',
        '✓ Instruções claras devem ser dadas a quem vai preencher o Excel',
        '✓ Mantenha uma cópia do arquivo original em seus registros',
        '✓ Para perguntas MÚLTIPLA, certifique-se que o preenchimento segue exatamente uma das opções fornecidas'
      ]
    },
    {
      titulo: '📝 Preenchendo o Excel no Cliente/Profissional',
      descricao: 'A pessoa que receberá o Excel preenchará a coluna "Resposta" para cada pergunta segundo o tipo indicado.',
      dicas: [
        'Tipos de resposta por tipo de pergunta:',
        '  • TEXTO: Escrever texto livre na coluna Resposta',
        '  • NÚMERO: Escrever um número (sem unidades) na coluna Resposta',
        '  • BOOLEANO: Escrever "Sim" ou "Não" exatamente',
        '  • MÚLTIPLA: Escrever EXATAMENTE uma das opções listadas na coluna Opções',
        'Se uma pergunta for Obrigatória = "Sim", ela DEVE ser preenchida',
        'Se uma pergunta for Obrigatória = "Não", pode deixar em branco',
        'Não adicione linhas ou remova linhas do Excel',
        'Não altere o ID de nenhuma pergunta'
      ],
      bestPractices: [
        '✓ Crie um documento com instruções para quem vai preencher o Excel',
        '✓ Forneça exemplos de respostas esperadas para cada tipo',
        '✓ Para MÚLTIPLA, deixe visível quais são as opções válidas',
        '✓ Valide os dados antes de enviar de volta para importação'
      ]
    },
    {
      titulo: '⬆️ Importando Respostas do Excel',
      descricao: 'Após receber o arquivo preenchido, você selecionará o mesmo paciente, meta e protocolo para importar as respostas.',
      dicas: [
        'Selecione exatamente o MESMO paciente, meta e protocolo que foi exportado',
        'Clique em "Importar do Excel" para mudar o modo',
        'Selecione o arquivo Excel preenchido no campo "Selecione o arquivo Excel com respostas"',
        'O sistema carregará automaticamente as respostas do arquivo',
        'Uma seção "Respostas Carregadas" mostrará um preview das respostas encontradas',
        'Valide se todas as respostas esperadas foram carregadas',
        'Se alguma resposta estiver ausente ou incorreta, peça para refazer o preenchimento',
        'Apenas depois de validar, clique em "Salvar Respostas"'
      ],
      bestPractices: [
        '✓ IMPORTANTE: Sempre use o mesmo paciente, meta e protocolo que foi exportado',
        '✓ Revise o preview das respostas carregadas antes de salvar',
        '✓ Se faltar alguma resposta obrigatória, o arquivo precisa ser revisado',
        '✓ Manter rastreabilidade: guarde ambos os arquivos (original exportado e preenchido)'
      ]
    },
    {
      titulo: '🔍 Validação Automática ao Importar',
      descricao: 'O sistema realiza validações importantes ao importar para garantir integridade dos dados.',
      dicas: [
        'O sistema valida o ID de cada pergunta para garantir correspondência',
        'Só importa respostas que têm ID válido e presente no protocolo',
        'Respostas em branco são ignoradas na importação',
        'O sistema NÃO valida o conteúdo da resposta (tipo NÚMERO, MÚLTIPLA, etc)',
        'Você é responsável por validar que as respostas estão corretas ANTES de importar',
        'O preview mostra todas as respostas que serão importadas',
        'Se ver algo errado no preview, cancele e peça correção do arquivo'
      ],
      bestPractices: [
        '✓ Sempre revise o preview das respostas carregadas',
        '✓ Verifique manualmente que as respostas fazem sentido clinicamente',
        '✓ Se houver dúvida sobre uma resposta, retorne ao cliente/profissional',
        '✓ Não confie apenas na validação automática - a responsabilidade é sua'
      ]
    },
    {
      titulo: '✅ Salvando Respostas Importadas',
      descricao: 'Após validar o preview das respostas, você salva o registro no sistema. As respostas ficarão vinculadas ao paciente, meta e data especificados.',
      dicas: [
        'O botão "Salvar Respostas" só aparece depois que pelo menos uma resposta é carregada',
        'Ao clicar, todas as respostas carregadas serão salvas como um novo registro',
        'Uma observação padrão "Importado via Excel" será adicionada automaticamente',
        'O registro será criado com a data que você selecionou no campo "Data"',
        'Após salvar com sucesso, você pode:',
        '  • Exportar outro protocolo para novo preenchimento',
        '  • Importar respostas de outro cliente',
        '  • Visualizar o registro criado na lista de Registros Diários'
      ],
      bestPractices: [
        '✓ Após salvar, o sistema confirma o sucesso com uma notificação',
        '✓ Você pode editar o registro depois se precisar fazer correções',
        '✓ Mantenha os arquivos Excel como backup dos dados importados',
        '✓ Considere documentar qual profissional/cliente preencheu cada protocolo'
      ]
    },
    {
      titulo: '💡 Fluxo Completo e Dicas Finais',
      descricao: 'Resumo do fluxo de trabalho completo e melhores práticas para usar Export/Import eficientemente.',
      dicas: [
        'Fluxo de Trabalho Completo:',
        '1. Selecione Paciente → Meta → Protocolo → Data',
        '2. Clique "Baixar Excel" para exportar',
        '3. Envie o arquivo para cliente/profissional',
        '4. Receba o arquivo preenchido',
        '5. Selecione "Importar do Excel" e reselecione Paciente → Meta → Protocolo',
        '6. Carregue o arquivo preenchido',
        '7. Valide o preview das respostas',
        '8. Clique "Salvar Respostas"',
        '',
        'Casos de Uso Recomendados:',
        '• Coleta de dados em consultórios remotos ou home office',
        '• Preenchimento por estagiários sob supervisão',
        '• Distribuição de protocolos para múltiplos profissionais',
        '• Backup de dados em formato Excel',
        '',
        'Limitações e Restrições:',
        '• Perguntas FÓRMULA não podem ser respondidas (somente leitura)',
        '• Perguntas PERCENTUAL não aparecem no Excel (calculadas)',
        '• Não é possível importar para editar um registro existente (cria novo)',
        '• Sempre use o MESMO protocolo para exportar e importar'
      ],
      bestPractices: [
        '✓ Estabeleça padrões claros com sua equipe sobre como usar esta funcionalidade',
        '✓ Documente instruções para clientes que vão preencher protocolos remotamente',
        '✓ Use nomes de arquivo descritivos para facilitar rastreamento',
        '✓ Mantenha backup dos arquivos Excel preenchidos',
        '✓ Revise regularmente os registros importados para garantir qualidade',
        '✓ Esta ferramenta é poderosa para escala, mas requer validação manual'
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
            Guia: Exportar e Importar Protocolos em Excel
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Aprenda como usar Export/Import para coletar dados remotamente de forma segura e estruturada
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
              {passoAtual === 4 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-amber-900">
                    <strong>CRÍTICO:</strong> Use EXATAMENTE o mesmo paciente, meta e protocolo que foi exportado. Se usar combinações diferentes, os IDs das perguntas podem não corresponder corretamente.
                  </div>
                </div>
              )}

              {passoAtual === 5 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>IMPORTANTE:</strong> O sistema valida apenas IDs. Você é responsável por validar que as respostas fazem sentido clinicamente e estão nos formatos corretos. Sempre revise o preview antes de salvar.
                  </div>
                </div>
              )}

              {passoAtual === 3 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-900">
                    <strong>Dica de Segurança:</strong> Instrua quem vai preencher o Excel para: (1) Não adicionar/remover linhas, (2) Não alterar IDs ou outras colunas, (3) Preencher apenas a coluna "Resposta", (4) Respeitar os tipos de dados indicados.
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
