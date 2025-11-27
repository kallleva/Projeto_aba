import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import ApiService from '@/lib/api'

// Função para remover formatação Markdown, mantendo negrito
const cleanMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')  // Converte **negrito** para <strong>
    .replace(/#+\s/g, '')            // Remove # cabeçalhos
    .replace(/`/g, '')               // Remove `code`
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [texto](url)
    .replace(/\n{3,}/g, '\n\n')      // Reduz múltiplas quebras de linha
}

export default function AssistenteIA({ 
  pacienteId = null, 
  compact = false, 
  contextoAdicional = null,
  relatorioPaciente = null,
  agendamentos = [],
  formatDate = null
}) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const { toast } = useToast()

  // Inicializar datas com últimos 30 dias
  useState(() => {
    const hoje = new Date()
    const trinta = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const fmt = (d) => d.toISOString().split('T')[0]
    setDataFinal(fmt(hoje))
    setDataInicial(fmt(trinta))
  }, [])

  // Filtrar dados pelo período selecionado
  const contextoFiltrado = useMemo(() => {
    let ctx = ""
    
    // Converter datas para objetos Date
    let dataInicialObj = null
    let dataFinalObj = null
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial)
      dataInicialObj.setHours(0, 0, 0, 0)
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal)
      dataFinalObj.setHours(23, 59, 59, 999)
    }

    // SEÇÃO 1: Filtrar indicadores pelo período
    if (relatorioPaciente?.respostas_calculadas_globais?.length > 0) {
      const filtrados = relatorioPaciente.respostas_calculadas_globais.filter(item => {
        const dataItem = new Date(item.data)
        const passaInicial = !dataInicialObj || dataItem >= dataInicialObj
        const passaFinal = !dataFinalObj || dataItem <= dataFinalObj
        return passaInicial && passaFinal
      })

      if (filtrados.length > 0) {
        ctx += "=== INDICADORES DO PERÍODO ===\n"
        filtrados.slice(0, 15).forEach(calc => {
          ctx += `Data: ${calc.data}\n`
          if (calc.indices && Object.keys(calc.indices).length > 0) {
            Object.entries(calc.indices).forEach(([nome, dados]) => {
              ctx += `  ${nome}: ${dados.valor}%\n`
            })
          }
        })
      } else {
        ctx += "=== INDICADORES DO PERÍODO ===\nSem dados no período selecionado.\n"
      }
    }

    // SEÇÃO 2: Evolução por Meta (apenas do período)
    if (relatorioPaciente?.evolucao_por_meta && Object.keys(relatorioPaciente.evolucao_por_meta).length > 0) {
      ctx += "\n=== EVOLUÇÃO POR META ===\n"
      Object.entries(relatorioPaciente.evolucao_por_meta).forEach(([metaId, dados]) => {
        const registrosFiltrados = dados.registros?.filter(reg => {
          const dataReg = new Date(reg.data)
          const passaInicial = !dataInicialObj || dataReg >= dataInicialObj
          const passaFinal = !dataFinalObj || dataReg <= dataFinalObj
          return passaInicial && passaFinal
        }) || []

        if (registrosFiltrados.length > 0) {
          ctx += `\nMeta: ${dados.meta_descricao}\n`
          registrosFiltrados.forEach(reg => {
            ctx += `  ${reg.data}: `
            if (reg.formulas_calculadas && reg.formulas_calculadas.length > 0) {
              ctx += reg.formulas_calculadas.map(f => `${f.pergunta_texto}=${f.valor_numerico}%`).join(", ")
            }
            ctx += "\n"
          })
        }
      })
    }

    // SEÇÃO 3: KPIs por Meta
    if (relatorioPaciente?.kpis_por_meta && Object.keys(relatorioPaciente.kpis_por_meta).length > 0) {
      ctx += "\n=== KPIs ATUAIS ===\n"
      Object.entries(relatorioPaciente.kpis_por_meta).forEach(([metaId, dados]) => {
        if (dados.kpis && Object.keys(dados.kpis).length > 0) {
          ctx += `${dados.meta_descricao}: `
          ctx += Object.entries(dados.kpis).map(([nome, valor]) => `${nome}=${valor}%`).join(", ")
          ctx += "\n"
        }
      })
    }

    // SEÇÃO 4: Atendimentos no período
    if (agendamentos?.length > 0) {
      const agendamentosFiltrados = agendamentos.filter(a => {
        const dataAg = new Date(a.data_hora)
        const passaInicial = !dataInicialObj || dataAg >= dataInicialObj
        const passaFinal = !dataFinalObj || dataAg <= dataFinalObj
        return passaInicial && passaFinal
      })

      if (agendamentosFiltrados.length > 0) {
        ctx += "\n=== ATENDIMENTOS DO PERÍODO ===\n"
        agendamentosFiltrados.slice(0, 10).forEach(a => {
          const status = a.presente ? "✓" : a.presente === false ? "✗" : "?"
          ctx += `${a.data_hora}: ${status} (${a.tipo_atendimento || 'Sem tipo'})\n`
        })
      }
    }

    return ctx
  }, [dataInicial, dataFinal, relatorioPaciente, agendamentos])

  // Para compatibilidade: usar contextoFiltrado se temos relatorioPaciente, senão usar contextoAdicional
  const contextoPassed = relatorioPaciente ? contextoFiltrado : contextoAdicional

  const ask = async () => {
    const q = question.trim()
    if (!q) return
    setLoading(true)
    try {
      const res = await ApiService.askAI(q, pacienteId, contextoPassed)
      const ans = cleanMarkdown(res?.answer || res?.resposta || '(sem resposta)')
      setHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: ans }])
      setQuestion('')
    } catch (e) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-spacing">
      <div className="section-header">
        <h3 className="section-header-title">Assistente IA</h3>
      </div>
      <p className="card-text mb-4">Faça perguntas e receba sugestões com base nos registros do período selecionado.</p>

      {/* Filtro de período se temos dados para filtrar */}
      {relatorioPaciente && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <div className="text-sm font-semibold text-gray-700">Filtrar por período:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">De:</label>
              <Input 
                type="date" 
                value={dataInicial} 
                onChange={(e) => setDataInicial(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Até:</label>
              <Input 
                type="date" 
                value={dataFinal} 
                onChange={(e) => setDataFinal(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {!compact && history.length > 0 && (
          <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto space-y-3">
            {history.map((m, idx) => (
              <div key={idx} className={`rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-100 mr-8'}`}>
                <div className={`text-xs font-semibold mb-1 ${m.role === 'user' ? 'text-blue-700' : 'text-green-700'}`}>
                  {m.role === 'user' ? '👤 Você' : '🤖 Assistente IA'}
                </div>
                <div className={`text-sm whitespace-pre-wrap ${m.role === 'user' ? 'text-blue-900' : 'text-green-900'}`}>
                  {m.role === 'user' ? m.content : <div dangerouslySetInnerHTML={{ __html: m.content }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={pacienteId ? 'Pergunte sobre este paciente...' : 'Digite sua pergunta...'}
          rows={compact ? 2 : 4}
          className="border-2 border-gray-300 rounded-lg p-3"
        />
        <div className="flex justify-end gap-2">
          <Button 
            disabled={loading || !question.trim()} 
            onClick={ask} 
            style={{ backgroundColor: '#0ea5e9', color: 'white' }}
            className="hover:opacity-90 transition-opacity"
          >
            {loading ? '⏳ Enviando...' : '💬 Perguntar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
