import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Users, Calendar, User, BarChart3, Info, AlertCircle, CheckCircle2, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PacienteDetalhesAjuda({ open, onOpenChange }) {
  const [passoAtual, setPassoAtual] = useState(0)

  const passos = [
    {
      icone: HelpCircle,
      titulo: 'Visão Geral',
      descricao: 'Esta tela centraliza tudo do paciente: dados básicos, vínculos com profissionais, agenda e relatórios.',
      dicas: [
        'A navegação é por abas: Editar, Vínculos, Agenda e Relatório',
        'As ações disponíveis dependem do seu perfil (ADMIN, PROFISSIONAL, RESPONSÁVEL)',
        'A barra superior mostra diagnóstico e idade calculada automaticamente',
      ],
      bestPractices: [
        ' Revise o nome e diagnóstico antes de operar',
        ' Use a aba correta para cada ação (dados, vínculos, agenda, análise)',
      ],
      alertas: [
        'Algumas ações podem ser restritas pelo backend. Se você ver Acesso Negado (403), contate o administrador.',
      ],
    },
    {
      icone: User,
      titulo: 'Editar Informações',
      descricao: 'Atualize dados básicos do paciente e atribua um usuário responsável (quando aplicável).',
      dicas: [
        'Campos: Nome, Data de Nascimento, Responsável (usuário), Contato e Diagnóstico',
        'Botão de busca do Responsável abre um modal para localizar usuários por nome/email',
        'Ao escolher um usuário no modal, ele é atribuído como responsável do paciente',
      ],
      bestPractices: [
        ' Mantenha contato e diagnóstico atualizados',
        ' Atribua o responsável correto para acesso ao prontuário do paciente',
      ],
      alertas: [
        'Salvar alterações aplica validações; erros retornam mensagem detalhada',
        'Permissões de edição podem variar por perfil; o backend valida o acesso',
      ],
    },
    {
      icone: Users,
      titulo: 'Profissionais Vinculados',
      descricao: 'Crie e gerencie vínculos terapêuticos entre o paciente e profissionais.',
      dicas: [
        'Disponível apenas para ADMIN (criar/editar/ativar/suspender/inativar/excluir)',
        'Campos do vínculo: Profissional, Tipo de Atendimento, Data de Início, Frequência, Duração e Observações',
        'Status do vínculo: ATIVO, SUSPENSO, INATIVO (histórico). Reative quando necessário',
      ],
      bestPractices: [
        ' Mantenha apenas vínculos atuais como ATIVO',
        ' Use SUSPENSO para pausas temporárias e INATIVO para encerramentos',
        ' Documente observações relevantes (ex.: objetivos, combinação de horários)',
      ],
      alertas: [
        'Ao excluir um vínculo, confirme a ação — ela é destrutiva',
      ],
    },
    {
      icone: Calendar,
      titulo: 'Agenda do Paciente',
      descricao: 'Crie, edite e acompanhe agendamentos por calendário mensal e lista do mês.',
      dicas: [
        'Disponível para ADMIN e PROFISSIONAL',
        'Campos do agendamento: Data/Hora, Duração, Profissional, Status, Presença e Observações',
        'Status: AGENDADO, CONFIRMADO, REALIZADO, CANCELADO, FALTOU',
        'Presença: Não informado, Presente, Ausente — pode ser alterada na lista',
        'Edição rápida na lista: mude Status/Presença sem abrir o formulário',
      ],
      bestPractices: [
        ' Confirme agendamentos com antecedência e registre presença após a sessão',
        ' Use observações para combinar logística e notas curtas',
      ],
      alertas: [
        'Exclusões são permanentes e requerem confirmação',
      ],
    },
    {
      icone: BarChart3,
      titulo: 'Relatório e IA',
      descricao: 'Acompanhe indicadores do paciente e utilize o Assistente IA para insights.',
      dicas: [
        'O relatório agrega informações cadastrais e de atendimentos do paciente',
        'O Assistente IA pode resumir, explicar e propor sugestões com base nos dados',
      ],
      bestPractices: [
        ' Revise dados antes de gerar análises para evitar conclusões enviesadas',
      ],
      alertas: [
        'A IA é um apoio: a decisão clínica é sempre humana',
      ],
    },
  ]

  const passo = passos[passoAtual]

  const irPara = (idx) => setPassoAtual(idx)
  const proximo = () => setPassoAtual((p) => Math.min(p + 1, passos.length - 1))
  const anterior = () => setPassoAtual((p) => Math.max(p - 1, 0))

  const Icone = passo.icone

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Ajuda — Paciente: Detalhes</DialogTitle>
          <DialogDescription>
            Guia rápido e prático para operar esta tela com segurança.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {passos.map((p, i) => (
              <button
                key={p.titulo}
                onClick={() => irPara(i)}
                className={`text-xs px-2.5 py-1.5 rounded border ${i === passoAtual ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700'} hover:bg-gray-50`}
              >
                {i + 1}. {p.titulo}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Icone className="h-5 w-5" />
                <CardTitle className="text-lg">{passo.titulo}</CardTitle>
              </div>
              <CardDescription className="pt-2">{passo.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passo.alertas?.length > 0 && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900 flex gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    {passo.alertas.map((a, idx) => (
                      <p key={idx}>{a}</p>
                    ))}
                  </div>
                </div>
              )}

              {passo.dicas?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gray-800">
                    <Info className="h-4 w-4" />
                    <span className="font-medium">Como usar</span>
                  </div>
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    {passo.dicas.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {passo.bestPractices?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gray-800">
                    <Lightbulb className="h-4 w-4" />
                    <span className="font-medium">Boas práticas</span>
                  </div>
                  <ul className="ml-1 space-y-1 text-sm text-gray-700">
                    {passo.bestPractices.map((bp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="px-6 pb-6 flex items-center justify-between">
          <Button variant="outline" onClick={anterior} disabled={passoAtual === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <div className="flex items-center gap-2">
            {passos.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i === passoAtual ? 'bg-blue-600' : 'bg-gray-300'}`} />
            ))}
          </div>
          {passoAtual === passos.length - 1 ? (
            <Button onClick={() => onOpenChange(false)} className="gap-2" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
              Fechar
            </Button>
          ) : (
            <Button onClick={proximo} className="gap-2" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
