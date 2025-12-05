import { useState, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  FileText, 
  Download, 
  Calendar,
  AlertCircle,
  Loader,
  Sparkles,
  Copy
} from 'lucide-react'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'

export default function RelatorioGerador({ paciente, relatorioPaciente, agendamentos, formatDate }) {
  const { toast } = useToast()
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [relatorioGerado, setRelatorioGerado] = useState(null)
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [exportandoPDF, setExportandoPDF] = useState(false)
  const [exportandoWord, setExportandoWord] = useState(false)
  const relatorioRef = useRef(null)

  // Converter markdown para JSX (processa **texto** em <strong>)
  const parseMarkdown = (texto) => {
    if (!texto) return null
    
    const partes = texto.split(/(\*\*.*?\*\*)/g)
    
    return partes.map((parte, idx) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return <strong key={idx}>{parte.slice(2, -2)}</strong>
      }
      return <span key={idx}>{parte}</span>
    })
  }

  // Extrair dados filtrados do relatório (mesma lógica que PacienteRelatorio)
  const dadosFiltrados = useMemo(() => {
    if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) {
      return null
    }

    // Conversão correta de datas com horas
    let dataInicialObj = null
    let dataFinalObj = null
    
    if (dataInicial) {
      dataInicialObj = new Date(dataInicial)
      dataInicialObj.setHours(0, 0, 0, 0) // Início do dia (00:00:00)
    }
    
    if (dataFinal) {
      dataFinalObj = new Date(dataFinal)
      dataFinalObj.setHours(23, 59, 59, 999) // Fim do dia (23:59:59)
    }

    // Filtrar respostas APENAS aquelas que tem formulário vinculado (mesma lógica de PacienteRelatorio)
    const respostasNoPeriodo = relatorioPaciente.respostas_calculadas_globais.filter(item => {
      if (!item.data) return false
      
      const itemData = new Date(item.data)
      const passaDataInicial = !dataInicialObj || itemData >= dataInicialObj
      const passaDataFinal = !dataFinalObj || itemData <= dataFinalObj
      
      // ⚠️ IMPORTANTE: Verificar se tem formulário vinculado (item.indices com formulario_id)
      let temFormulario = false
      if (item.indices && typeof item.indices === 'object') {
        for (const v of Object.values(item.indices)) {
          if (v && typeof v === 'object' && v.formulario_id) {
            temFormulario = true
            break
          }
        }
      }
      
      return passaDataInicial && passaDataFinal && temFormulario
    })

    if (respostasNoPeriodo.length === 0) {
      return null
    }

    // Extrair indicadores únicos (protocolos/metas) com siglas do indices
    const indicadores = new Map()

    respostasNoPeriodo.forEach((resp, idx) => {
      // Extrair diretamente de indices (é um objeto com as siglas)
      if (resp.indices && typeof resp.indices === 'object') {
        Object.entries(resp.indices).forEach(([key, valor]) => {
          let sigla = key
          let valorNumerico = 0
          
          // Se valor é objeto com propriedades (caso estruturado)
          if (typeof valor === 'object' && valor !== null) {
            sigla = valor.sigla || key
            valorNumerico = parseFloat(valor.valor) || 0
          } else if (typeof valor === 'number' || typeof valor === 'string') {
            // Valor simples
            valorNumerico = parseFloat(valor) || 0
          }
          
          if (!indicadores.has(sigla)) {
            indicadores.set(sigla, [])
          }
          
          indicadores.get(sigla).push({
            data: resp.data,
            valor: valorNumerico
          })
        })
      }
    })

    // Calcular evolução por indicador
    const indicadoresAnalise = Array.from(indicadores.entries()).map(([sigla, dados]) => {
      const valores = dados.map(d => d.valor).filter(v => v > 0)
      if (valores.length === 0) return null

      const valorInicial = valores[0]
      const valorFinal = valores[valores.length - 1]
      const media = valores.reduce((a, b) => a + b, 0) / valores.length
      const evolucaoPercent = valorInicial > 0 ? ((valorFinal - valorInicial) / valorInicial * 100).toFixed(0) : 0

      return {
        sigla,
        valorInicial: valorInicial.toFixed(0),
        valorFinal: valorFinal.toFixed(0),
        media: media.toFixed(0),
        evolucaoPercent: parseInt(evolucaoPercent),
        sessoes: dados.length,
        status: evolucaoPercent > 0 ? 'evolução' : evolucaoPercent < 0 ? 'regressão' : 'estável'
      }
    }).filter(Boolean)

    // Filtrar agendamentos por período (usar array passado como prop)
    const agendamentosNoPeriodo = (agendamentos || []).filter(agend => {
      if (!agend.data_hora) return false
      const agendData = new Date(agend.data_hora)
      const passaInicio = !dataInicialObj || agendData >= dataInicialObj
      const passaFim = !dataFinalObj || agendData <= dataFinalObj
      return passaInicio && passaFim
    })

    const presencas = agendamentosNoPeriodo.filter(a => a.presente === true).length
    const faltas = agendamentosNoPeriodo.filter(a => a.presente === false).length
    const ausencias = agendamentosNoPeriodo.filter(a => a.presente === null || a.presente === undefined).length
    const totalSessoes = agendamentosNoPeriodo.length

    return {
      totalSessoes,
      presencas,
      faltas,
      ausencias,
      indicadores: indicadoresAnalise,
      melhorIndicador: indicadoresAnalise.sort((a, b) => b.evolucaoPercent - a.evolucaoPercent)[0],
      piourIndicador: indicadoresAnalise.sort((a, b) => a.evolucaoPercent - b.evolucaoPercent)[0]
    }
  }, [relatorioPaciente, agendamentos, dataInicial, dataFinal])

  // Validar período selecionado
  const validarPeriodo = () => {
    if (!dataInicial || !dataFinal) {
      toast({
        title: "Erro",
        description: "Selecione data inicial e final",
        variant: "destructive"
      })
      return false
    }

    const inicio = new Date(dataInicial)
    const fim = new Date(dataFinal)

    if (inicio > fim) {
      toast({
        title: "Erro",
        description: "Data inicial não pode ser posterior à data final",
        variant: "destructive"
      })
      return false
    }

    if (!dadosFiltrados) {
      toast({
        title: "Aviso",
        description: "Nenhum dado encontrado no período selecionado. Verifique as datas e tente novamente.",
        variant: "destructive"
      })
      return false
    }

    if (!dadosFiltrados.indicadores || dadosFiltrados.indicadores.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhum indicador/protocolo encontrado no período. Verifique se há dados de sessões registrados.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  // Gerar relatório com dados reais e IA
  const handleGerarRelatorio = async () => {
    if (!validarPeriodo()) return

    setLoadingRelatorio(true)
    try {
      const { melhorIndicador, piourIndicador, indicadores } = dadosFiltrados

      // Preparar dados para enviar à IA
      const indicadoresEvolucao = indicadores
        .filter(ind => ind.evolucaoPercent > 0)
        .map(ind => `${ind.sigla} (${ind.valorInicial}% → ${ind.valorFinal}%)`)
        .join(', ')

      const indicadoresDesafio = indicadores
        .filter(ind => ind.evolucaoPercent <= 0)
        .map(ind => `${ind.sigla} (${ind.valorFinal}%)`)
        .join(', ')

      // Construir prompt para IA baseado no modelo
      const promptIA = `
Você é um profissional clínico especializado em análise de comportamento aplicada (ABA). 

Gere um relatório clínico narrativo seguindo rigorosamente este padrão:

**DADOS DO PACIENTE:**
- Paciente: ${paciente.nome}
- Período: de ${dataInicial} a ${dataFinal}
- Total de sessões: ${dadosFiltrados.totalSessoes}
- Presenças: ${dadosFiltrados.presencas} | Faltas: ${dadosFiltrados.faltas}

**PROGRAMAS/INDICADORES ANALISADOS:**
${indicadores.map(ind => `- ${ind.sigla}: ${ind.valorInicial}% → ${ind.valorFinal}% (evolução: ${ind.evolucaoPercent > 0 ? '+' : ''}${ind.evolucaoPercent}%, ${ind.sessoes} sessões)`).join('\n')}

**INSTRUÇÕES PARA O TEXTO:**

1. **INTRODUÇÃO**: Descreva de forma contínua e narrativa as evoluções durante o período. Sempre compare primeira e última sessão citando percentuais. Mencione quais programas evoluíram (${indicadoresEvolucao || 'nenhum'}).

2. **EVOLUÇÃO E PROGRESSO**: Descreva como o paciente apresentou progressos, mencionando redução de ajudas, aumento de acertos independentes e diminuição de erros. Deixe claro o impacto em autonomia, autorregulação, atenção conjunta ou comunicação.

3. **DESAFIOS IDENTIFICADOS**: Destaque os programas com dificuldade (${indicadoresDesafio || 'nenhum'}), explicando o que isso representa para o desempenho. Mencione inconsistências ou falta de implementação se houver.

4. **PRIORIDADES TERAPÊUTICAS**: Aponte quais programas precisam ser mantidos, reforçados ou ajustados, justificando pela importância funcional e proximidade do critério de aprendizagem.

5. **RECOMENDAÇÕES PARA FAMÍLIA**: Sugira formas naturais de generalizar as habilidades (seguir objetos, praticar rotinas, reforçar respostas imediatamente, criar situações simples do dia a dia).

6. **CONCLUSÃO**: Reforce se o paciente demonstrou percurso positivo e se as habilidades estão se consolidando. Enfatize importância da colaboração equipe-família para manutenção e generalização.

Mantenha tom clínico, linguagem profissional e estrutura narrativa contínua (não use listas no corpo do texto).
      `.trim()

      // Chamar API da IA
      const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://auroraclin.com.br/api').replace(/\/$/, '')
      
      const respostaIA = await fetch(`${API_BASE_URL}/ai/gerar-relatorio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          prompt: promptIA,
          modelo: 'gemini-2.5-flash'
        })
      })

      if (!respostaIA.ok) {
        throw new Error('Erro ao chamar API de IA')
      }

      const dadosIA = await respostaIA.json()
      const textoAnalise = dadosIA.conteudo || dadosIA.texto || 'Análise não disponível'

      const relatorio = {
        paciente: paciente.nome,
        periodo: `${dataInicial} a ${dataFinal}`,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        
        resumo: {
          totalSessoes: dadosFiltrados.totalSessoes,
          presencas: dadosFiltrados.presencas,
          faltas: dadosFiltrados.faltas,
          ausencias: dadosFiltrados.ausencias,
          mediaMeta: (dadosFiltrados.indicadores.reduce((a, b) => a + parseInt(b.valorFinal), 0) / Math.max(dadosFiltrados.indicadores.length, 1)).toFixed(0)
        },
        
        analiseQualitativa: {
          narrativa: textoAnalise,
          principaisEvolucoes: indicadores
            .filter(ind => ind.evolucaoPercent > 0)
            .slice(0, 2)
            .map(ind => `${ind.sigla}: evolução de ${ind.valorInicial}% para ${ind.valorFinal}% (${ind.evolucaoPercent > 0 ? '+' : ''}${ind.evolucaoPercent}%)`)
            .join('\n') || 'Sem evoluções positivas significativas no período.',
          desafios: indicadores
            .filter(ind => ind.evolucaoPercent <= 0)
            .slice(0, 2)
            .map(ind => `${ind.sigla}: mantém ${ind.valorFinal}% (necessita de reforço)`)
            .join('\n') || 'Desenvolvimento estável em todos os indicadores.',
          priorizacaoObjetivos: melhorIndicador 
            ? `Continuar reforçando ${melhorIndicador.sigla} (melhor desempenho). ${piourIndicador ? `Aumentar foco em ${piourIndicador.sigla} que necessita melhora.` : ''}`
            : 'Manter acompanhamento contínuo de todos os objetivos.'
        },
        
        recomendacoes: {
          familia: `Manutenção de estratégias efetivas. Total de ${dadosFiltrados.presencas} sessões realizadas com ${dadosFiltrados.totalSessoes > 0 ? ((dadosFiltrados.presencas / dadosFiltrados.totalSessoes * 100).toFixed(0)) : 0}% de presença.`,
          consideracoesFinais: `Período analisado: ${dadosFiltrados.totalSessoes} sessões. Evolução geral: ${indicadores.filter(i => i.evolucaoPercent > 0).length} de ${indicadores.length} metas com progresso.`
        },
        
        indicadores: dadosFiltrados.indicadores
      }

      setRelatorioGerado(relatorio)
      
      toast({
        title: "Sucesso",
        description: "Relatório gerado com análise de IA!"
      })
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar relatório com IA",
        variant: "destructive"
      })
    } finally {
      setLoadingRelatorio(false)
    }
  }

  // Exportar para PDF (texto simples)
  const handleExportarPDF = async () => {
    if (!relatorioGerado) {
      toast({
        title: "Erro",
        description: "Gere um relatório primeiro",
        variant: "destructive"
      })
      return
    }

    setExportandoPDF(true)
    try {
      const pdf = new jsPDF()
      let yPosition = 15

      const addTitle = (text) => {
        pdf.setFontSize(16)
        pdf.setFont(undefined, 'bold')
        pdf.text(text, 15, yPosition)
        yPosition += 12
      }

      const addSubtitle = (text) => {
        pdf.setFontSize(12)
        pdf.setFont(undefined, 'bold')
        pdf.text(text, 15, yPosition)
        yPosition += 8
      }

      const addBoldText = (text, fontSize = 10) => {
        pdf.setFontSize(fontSize)
        pdf.setFont(undefined, 'bold')
        const lines = pdf.splitTextToSize(text, 180)
        lines.forEach(line => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 15
          }
          pdf.text(line, 15, yPosition)
          yPosition += 5
        })
      }

      const addText = (text, fontSize = 10) => {
        pdf.setFontSize(fontSize)
        pdf.setFont(undefined, 'normal')
        const lines = pdf.splitTextToSize(text, 180)
        lines.forEach(line => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 15
          }
          pdf.text(line, 15, yPosition)
          yPosition += 5
        })
      }

      const addSpacing = (amount = 5) => {
        yPosition += amount
      }

      // Cabeçalho
      addTitle('RELATÓRIO CLÍNICO')
      pdf.setDrawColor(100, 150, 200)
      pdf.line(15, yPosition - 4, 195, yPosition - 4)
      addSpacing(8)

      // Informações do paciente
      pdf.setFontSize(10)
      pdf.setFont(undefined, 'normal')
      pdf.text(`Paciente: ${relatorioGerado.paciente}`, 15, yPosition)
      yPosition += 5
      pdf.text(`Período: ${relatorioGerado.periodo}`, 15, yPosition)
      yPosition += 5
      pdf.text(`Data de Geração: ${relatorioGerado.dataGeracao}`, 15, yPosition)
      yPosition += 10

      // Resumo Executivo
      addSubtitle('RESUMO EXECUTIVO')
      addBoldText(`• Sessões realizadas: ${relatorioGerado.resumo.totalSessoes}`, 10)
      addBoldText(`• Presenças: ${relatorioGerado.resumo.presencas}`, 10)
      addBoldText(`• Faltas: ${relatorioGerado.resumo.faltas}`, 10)
      addBoldText(`• Média geral de metas: ${relatorioGerado.resumo.mediaMeta}%`, 10)
      addSpacing(5)

      // Análise do Período
      addSubtitle('ANÁLISE DO PERÍODO')
      const narrativa = relatorioGerado.analiseQualitativa.narrativa?.replace(/\*\*/g, '') || ''
      addText(narrativa, 10)
      addSpacing(5)

      // Principais Evoluções
      addSubtitle('PRINCIPAIS EVOLUÇÕES')
      addBoldText(relatorioGerado.analiseQualitativa.principaisEvolucoes, 10)
      addSpacing(5)

      // Pontos de Atenção
      addSubtitle('PONTOS DE ATENÇÃO')
      addBoldText(relatorioGerado.analiseQualitativa.desafios, 10)
      addSpacing(5)

      // Priorização
      addSubtitle('PRIORIZAÇÃO')
      addText(relatorioGerado.analiseQualitativa.priorizacaoObjetivos, 10)
      addSpacing(8)

      // Recomendações
      addSubtitle('RECOMENDAÇÕES')
      addBoldText('Para a Família:', 10)
      addText(relatorioGerado.recomendacoes.familia, 10)
      addSpacing(3)
      addBoldText('Observações Finais:', 10)
      addText(relatorioGerado.recomendacoes.consideracoesFinais, 10)

      pdf.save(`Relatorio_${paciente.nome}_${new Date().toISOString().slice(0, 10)}.pdf`)
      
      toast({
        title: "Sucesso",
        description: "Relatório exportado para PDF!"
      })
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      toast({
        title: "Erro",
        description: "Erro ao exportar para PDF",
        variant: "destructive"
      })
    } finally {
      setExportandoPDF(false)
    }
  }

  // Exportar para Word
  const handleExportarWord = async () => {
    if (!relatorioGerado) {
      toast({
        title: "Erro",
        description: "Gere um relatório primeiro",
        variant: "destructive"
      })
      return
    }

    setExportandoWord(true)
    try {
      const paragrafos = [
        new Paragraph({
          text: 'RELATÓRIO CLÍNICO',
          heading: HeadingLevel.HEADING_1,
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Paciente: ${relatorioGerado.paciente}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Período: ${relatorioGerado.periodo}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Data de Geração: ${relatorioGerado.dataGeracao}`,
          spacing: { after: 400 }
        }),

        // Resumo
        new Paragraph({
          text: 'RESUMO EXECUTIVO',
          heading: HeadingLevel.HEADING_2,
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Sessões realizadas: ${relatorioGerado.resumo.totalSessoes}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Presenças: ${relatorioGerado.resumo.presencas}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Faltas: ${relatorioGerado.resumo.faltas}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Média geral de metas: ${relatorioGerado.resumo.mediaMeta}%`,
          spacing: { after: 400 }
        }),

        // Análise
        new Paragraph({
          text: 'ANÁLISE DO PERÍODO',
          heading: HeadingLevel.HEADING_2,
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: relatorioGerado.analiseQualitativa.narrativa?.replace(/\*\*/g, '') || 'Análise não disponível',
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: 'PRINCIPAIS EVOLUÇÕES',
          heading: HeadingLevel.HEADING_3,
          bold: true,
          spacing: { after: 150 }
        }),
        new Paragraph({
          text: relatorioGerado.analiseQualitativa.principaisEvolucoes,
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: 'PONTOS DE ATENÇÃO',
          heading: HeadingLevel.HEADING_3,
          bold: true,
          spacing: { after: 150 }
        }),
        new Paragraph({
          text: relatorioGerado.analiseQualitativa.desafios,
          spacing: { after: 400 }
        }),

        new Paragraph({
          text: 'PRIORIZAÇÃO',
          heading: HeadingLevel.HEADING_3,
          bold: true,
          spacing: { after: 150 }
        }),
        new Paragraph({
          text: relatorioGerado.analiseQualitativa.priorizacaoObjetivos,
          spacing: { after: 400 }
        }),

        // Recomendações
        new Paragraph({
          text: 'RECOMENDAÇÕES',
          heading: HeadingLevel.HEADING_2,
          bold: true,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'Para a Família:',
          bold: true,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: relatorioGerado.recomendacoes.familia,
          spacing: { after: 300 }
        }),
        new Paragraph({
          text: 'Observações Finais:',
          bold: true,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: relatorioGerado.recomendacoes.consideracoesFinais,
          spacing: { after: 100 }
        })
      ]

      const doc = new Document({
        sections: [{
          children: paragrafos
        }]
      })

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Relatorio_${paciente.nome}_${new Date().toISOString().slice(0, 10)}.docx`)
        toast({
          title: "Sucesso",
          description: "Relatório exportado para Word!"
        })
      })
    } catch (error) {
      console.error('Erro ao exportar Word:', error)
      toast({
        title: "Erro",
        description: "Erro ao exportar para Word",
        variant: "destructive"
      })
    } finally {
      setExportandoWord(false)
    }
  }

  // Copiar relatório
  const handleCopiarRelatorio = () => {
    if (!relatorioGerado) return

    const indicadoresText = relatorioGerado.indicadores
      ?.map(ind => `${ind.sigla}: ${ind.valorInicial}% → ${ind.valorFinal}% (${ind.evolucaoPercent > 0 ? '+' : ''}${ind.evolucaoPercent}%)`)
      .join('\n') || ''

    const texto = `
RELATÓRIO CLÍNICO - ${paciente.nome}
Período: ${relatorioGerado.periodo}
Data de Geração: ${relatorioGerado.dataGeracao}

RESUMO
Sessões: ${relatorioGerado.resumo.totalSessoes} | Presenças: ${relatorioGerado.resumo.presencas} | Faltas: ${relatorioGerado.resumo.faltas}
Média de Metas: ${relatorioGerado.resumo.mediaMeta}%

PROTOCOLOS/METAS
${indicadoresText}

ANÁLISE DO PERÍODO
Evoluções: ${relatorioGerado.analiseQualitativa.principaisEvolucoes}

Pontos de Atenção: ${relatorioGerado.analiseQualitativa.desafios}

Priorização: ${relatorioGerado.analiseQualitativa.priorizacaoObjetivos}

RECOMENDAÇÕES
Família: ${relatorioGerado.recomendacoes.familia}

Observações: ${relatorioGerado.recomendacoes.consideracoesFinais}
    `.trim()

    navigator.clipboard.writeText(texto)
    toast({
      title: "Copiado!",
      description: "Relatório copiado para a área de transferência"
    })
  }

  return (
    <div className="card-spacing space-y-6">
      <div className="section-header">
        <FileText size={18} className="color-info-icon" />
        <h2 className="section-header-title">Gerador de Relatórios Clínicos</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">ℹ️ Relatórios Personalizados:</span> Gere relatórios clínicos completos e profissionais baseados nos dados do período selecionado. A IA analisará os gráficos, percentuais e evolução para criar um relatório narrativo de qualidade.
        </p>
      </div>

      {/* Seleção de Período */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Selecione o Período</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-group">
            <Label htmlFor="dataInicialRelatorio" className="text-sm font-semibold text-gray-700 mb-2 block">
              Data Inicial
            </Label>
            <Input
              id="dataInicialRelatorio"
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="h-10 bg-white border border-gray-300 rounded-lg"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="dataFinalRelatorio" className="text-sm font-semibold text-gray-700 mb-2 block">
              Data Final
            </Label>
            <Input
              id="dataFinalRelatorio"
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="h-10 bg-white border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <Button
          onClick={handleGerarRelatorio}
          disabled={loadingRelatorio}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {loadingRelatorio ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Relatório com IA
            </>
          )}
        </Button>
      </div>

      {/* Relatório Gerado */}
      {relatorioGerado && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6" ref={relatorioRef}>
          {/* Cabeçalho */}
          <div className="border-b-2 border-gray-200 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">RELATÓRIO CLÍNICO</h1>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Paciente:</strong> {relatorioGerado.paciente}</p>
                <p><strong>Período:</strong> {relatorioGerado.periodo}</p>
              </div>
              <div className="text-right">
                <p><strong>Data de Geração:</strong> {relatorioGerado.dataGeracao}</p>
              </div>
            </div>
          </div>

          {/* Resumo Executivo */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo Executivo</h2>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Sessões</p>
                <p className="text-2xl font-bold text-blue-600">{relatorioGerado.resumo.totalSessoes}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Presenças</p>
                <p className="text-2xl font-bold text-green-600">{relatorioGerado.resumo.presencas}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600">Faltas</p>
                <p className="text-2xl font-bold text-red-600">{relatorioGerado.resumo.faltas}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-gray-600">Média Metas</p>
                <p className="text-2xl font-bold text-amber-600">{relatorioGerado.resumo.mediaMeta}%</p>
              </div>
            </div>
          </div>

          {/* Indicadores/Protocolos em Grid */}
          {relatorioGerado.indicadores && relatorioGerado.indicadores.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Protocolos/Metas Acompanhadas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {relatorioGerado.indicadores.map((ind, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-2.5 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="mb-2">
                      <p className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2">{ind.sigla}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ind.sessoes} sess.</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs text-gray-600">Evol.</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                          ind.evolucaoPercent > 0 ? 'bg-green-100 text-green-700' : 
                          ind.evolucaoPercent < 0 ? 'bg-red-100 text-red-700' : 
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {ind.evolucaoPercent > 0 ? '+' : ''}{ind.evolucaoPercent}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white bg-opacity-60 px-1.5 py-0.5 rounded text-xs gap-1">
                        <span className="text-gray-600 text-xs">{ind.valorInicial}%</span>
                        <span className="text-gray-400 text-xs">→</span>
                        <span className="font-semibold text-gray-900 text-xs">{ind.valorFinal}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Análise Qualitativa Compacta - Narrativa da IA */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Análise do Período</h2>
            
            <div className="bg-white border-l-4 border-blue-500 p-4 rounded-lg mb-4 leading-relaxed text-gray-700 text-sm">
              {relatorioGerado.analiseQualitativa.narrativa ? (
                <p className="whitespace-pre-wrap">
                  {parseMarkdown(relatorioGerado.analiseQualitativa.narrativa)}
                </p>
              ) : (
                <p className="text-gray-600 italic">Análise em carregamento...</p>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Principais Evoluções</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {relatorioGerado.analiseQualitativa.principaisEvolucoes}
                </p>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Pontos de Atenção</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {relatorioGerado.analiseQualitativa.desafios}
                </p>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Priorização</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {relatorioGerado.analiseQualitativa.priorizacaoObjetivos}
                </p>
              </div>
            </div>
          </div>

          {/* Recomendações Compactas */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recomendações</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Para a Família</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {relatorioGerado.recomendacoes.familia}
                </p>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Observações Finais</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {relatorioGerado.recomendacoes.consideracoesFinais}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="border-t-2 border-gray-200 pt-6 flex flex-wrap gap-3">
            <Button
              onClick={handleExportarPDF}
              disabled={exportandoPDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              {exportandoPDF ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Exportando PDF...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Exportar PDF
                </>
              )}
            </Button>

            <Button
              onClick={handleExportarWord}
              disabled={exportandoWord}
              variant="outline"
              className="flex items-center gap-2"
            >
              {exportandoWord ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Exportando Word...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Exportar Word
                </>
              )}
            </Button>

            <Button
              onClick={handleCopiarRelatorio}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy size={18} />
              Copiar Texto
            </Button>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {!relatorioGerado && !loadingRelatorio && (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Nenhum relatório gerado ainda</p>
          <p className="text-sm text-gray-500">
            Selecione um período e clique em "Gerar Relatório com IA" para começar
          </p>
        </div>
      )}
    </div>
  )
}
