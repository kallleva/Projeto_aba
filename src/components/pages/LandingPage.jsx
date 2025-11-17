import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  LineChart,
  Sun
} from 'lucide-react';
import RegistroPublico from '@/components/RegistroPublico';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Gestão de Equipe",
      description: "Controle completo de profissionais, agendas, vínculos terapêuticos e distribuição de pacientes. Saiba exatamente quem está atendendo quem e quando."
    },
    {
      icon: <Brain className="w-12 h-12 text-green-600" />,
      title: "Múltiplos Protocolos ABA",
      description: "DTT, NET, ESDM, PRT, VB e protocolos personalizados. Trabalhe com a metodologia que você domina, adaptada às necessidades de cada criança."
    },
    {
      icon: <FileText className="w-12 h-12 text-purple-600" />,
      title: "Documentação Completa",
      description: "Registros de sessões com texto livre ou estruturado, anexos de fotos/vídeos, evolução diária documentada. Tudo organizado e acessível."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-orange-600" />,
      title: "Análise Quantitativa Automática",
      description: "Sistema calcula automaticamente percentuais de acerto, taxa de independência, evolução temporal e gera todos os gráficos sem trabalho manual."
    },
    {
      icon: <Target className="w-12 h-12 text-pink-600" />,
      title: "Metas e Planos Terapêuticos",
      description: "Defina objetivos mensuráveis, acompanhe status de cada meta, vincule atividades aos objetivos e demonstre progresso com dados concretos."
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-600" />,
      title: "Controle Empresarial",
      description: "Multitenancy para clínicas com múltiplas unidades, controle de acesso por perfil, segurança de dados e conformidade com privacidade médica."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "70% Menos Tempo",
      number: "70%",
      text: "Reduza drasticamente o tempo gasto com relatórios e documentação. O que levava horas, agora leva minutos."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "100% Mensurável",
      number: "100%",
      text: "Todas as intervenções convertidas em dados quantitativos. Progresso visível em números e gráficos."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "95% de Satisfação",
      number: "95%",
      text: "Pais e responsáveis mais satisfeitos ao visualizarem claramente a evolução dos seus filhos."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "3x Mais Rápido",
      number: "3x",
      text: "Decisões clínicas mais rápidas e assertivas com dados organizados e acessíveis instantaneamente."
    }
  ];

  const painPoints = [
    "📋 Dificuldade em demonstrar a evolução real dos pacientes para os pais?",
    "⏰ Muito tempo perdido criando relatórios manualmente?",
    "📊 Falta de dados organizados para avaliar o progresso terapêutico?",
    "👨‍👩‍👧 Pais questionando os resultados do tratamento?",
    "📝 Documentação desorganizada e difícil de acessar?",
    "🤯 Gestão caótica de múltiplos pacientes e profissionais?"
  ];

  const useCases = [
    {
      title: "Para Clínicas ABA",
      description: "Gerencie múltiplos terapeutas, pacientes e protocolos em uma única plataforma. Relatórios consolidados e visão gerencial completa.",
      color: "blue"
    },
    {
      title: "Para Terapeutas Autônomos",
      description: "Organize seus atendimentos, crie protocolos personalizados e impressione os pais com relatórios profissionais e visuais.",
      color: "green"
    },
    {
      title: "Para Centros Multidisciplinares",
      description: "Coordene diferentes profissionais (psicólogos, fonoaudiólogos, terapeutas ocupacionais) com segurança e eficiência.",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AuroraClin
              </span>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Sistema de Gestão Terapêutica ABA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme Dados em
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Evolução Visível </span>
            e Mensurável
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            O sistema completo de gestão terapêutica ABA que converte seus registros diários em 
            <strong> gráficos interativos e relatórios profissionais</strong>, demonstrando de forma 
            clara e científica o progresso real de cada paciente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => setMostrarRegistro(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
            >
              Começar Agora Grátis
              <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto border-2"
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200">
              <div className="text-5xl md:text-6xl font-black text-blue-600 mb-3">95<span className="text-3xl">%</span></div>
              <div className="text-gray-700 font-semibold text-lg">Satisfação dos Pais</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200">
              <div className="text-5xl md:text-6xl font-black text-green-600 mb-3">70<span className="text-3xl">%</span></div>
              <div className="text-gray-700 font-semibold text-lg">Economia de Tempo</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200">
              <div className="text-5xl md:text-6xl font-black text-purple-600 mb-3">500<span className="text-3xl">+</span></div>
              <div className="text-gray-700 font-semibold text-lg">Clínicas Ativas</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200">
              <div className="text-5xl md:text-6xl font-black text-orange-600 mb-3">10k<span className="text-3xl">+</span></div>
              <div className="text-gray-700 font-semibold text-lg">Pacientes Atendidos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sua Clínica Enfrenta Esses Desafios?
            </h2>
            <p className="text-xl text-gray-600">
              Não se preocupe, você não está sozinho. Milhares de clínicas passam por isso diariamente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow"
              >
                <p className="text-lg text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-xl font-semibold">
              <CheckCircle2 className="w-6 h-6" />
              O AuroraClin Resolve Todos Esses Problemas!
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dados Quantitativos de Forma Simples e Didática
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformamos registros terapêuticos em visualizações que qualquer pessoa entende. 
              Não precisa ser expert em análise de dados para ver o progresso acontecendo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Gráficos de Radar Inteligentes</h3>
              <p className="text-lg text-gray-700 mb-4">
                Visualize instantaneamente em quais áreas o paciente está progredindo melhor e onde precisa 
                de mais atenção. Cada eixo representa uma habilidade trabalhada.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>Comparação temporal:</strong> Veja a evolução mês a mês ou sessão a sessão</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>Múltiplas áreas:</strong> Habilidades sociais, comunicação, autonomia, acadêmicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700"><strong>Cores intuitivas:</strong> Verde = domínio, amarelo = em progresso, vermelho = precisa trabalhar</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Radar Chart Example */}
                <g transform="translate(200, 200)">
                  {/* Grid circles */}
                  <circle cx="0" cy="0" r="150" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  <circle cx="0" cy="0" r="120" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  <circle cx="0" cy="0" r="90" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  <circle cx="0" cy="0" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Axes */}
                  <line x1="0" y1="0" x2="0" y2="-150" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="0" x2="130" y2="-75" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="0" x2="130" y2="75" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="0" x2="0" y2="150" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="0" x2="-130" y2="75" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="0" x2="-130" y2="-75" stroke="#9ca3af" strokeWidth="1" />
                  
                  {/* Data polygon - Previous (lighter) */}
                  <polygon 
                    points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" 
                    fill="#93c5fd" 
                    fillOpacity="0.3" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Data polygon - Current (solid) */}
                  <polygon 
                    points="0,-135 117,-68 104,68 0,120 -104,68 -117,-68" 
                    fill="#34d399" 
                    fillOpacity="0.4" 
                    stroke="#10b981" 
                    strokeWidth="3"
                  />
                  
                  {/* Labels */}
                  <text x="0" y="-165" textAnchor="middle" className="text-xs font-semibold" fill="#1f2937">Comunicação</text>
                  <text x="145" y="-75" textAnchor="start" className="text-xs font-semibold" fill="#1f2937">Social</text>
                  <text x="145" y="85" textAnchor="start" className="text-xs font-semibold" fill="#1f2937">Autonomia</text>
                  <text x="0" y="175" textAnchor="middle" className="text-xs font-semibold" fill="#1f2937">Acadêmico</text>
                  <text x="-145" y="85" textAnchor="end" className="text-xs font-semibold" fill="#1f2937">Motora</text>
                  <text x="-145" y="-75" textAnchor="end" className="text-xs font-semibold" fill="#1f2937">Linguagem</text>
                </g>
                
                {/* Legend */}
                <g transform="translate(50, 370)">
                  <rect x="0" y="0" width="15" height="3" fill="#3b82f6" />
                  <text x="20" y="5" className="text-xs" fill="#6b7280">Janeiro 2025</text>
                  <rect x="120" y="0" width="15" height="3" fill="#10b981" />
                  <text x="140" y="5" className="text-xs" fill="#6b7280">Março 2025</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Gráficos de Barras</h4>
              </div>
              <p className="text-gray-600 text-center">
                Compare desempenho entre diferentes sessões e identifique tendências de melhora ou dificuldade.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <LineChart className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Linhas de Evolução</h4>
              </div>
              <p className="text-gray-600 text-center">
                Acompanhe a progressão ao longo do tempo com linhas de tendência claras e objetivas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Percentuais de Acerto</h4>
              </div>
              <p className="text-gray-600 text-center">
                Calcule automaticamente taxas de sucesso, independência e generalização de habilidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABA Protocols Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compatível com os Principais Protocolos ABA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trabalhe com os métodos que você já conhece e confia. O AuroraClin se adapta à sua metodologia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  DTT
                </div>
                <h3 className="text-xl font-bold text-gray-900">Discrete Trial Training</h3>
              </div>
              <p className="text-gray-700">
                Registre tentativas discretas, taxa de acertos, prompts utilizados e tempo de resposta. 
                Ideal para ensino estruturado de habilidades específicas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  NET
                </div>
                <h3 className="text-xl font-bold text-gray-900">Natural Environment Teaching</h3>
              </div>
              <p className="text-gray-700">
                Documente intervenções em ambiente natural, registre oportunidades de ensino incidental 
                e generalizações de habilidades em contextos reais.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  ESDM
                </div>
                <h3 className="text-xl font-bold text-gray-900">Early Start Denver Model</h3>
              </div>
              <p className="text-gray-700">
                Acompanhe objetivos de desenvolvimento em múltiplas áreas, registre atividades lúdicas 
                e monitore engajamento social durante as sessões.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-orange-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  PRT
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pivotal Response Treatment</h3>
              </div>
              <p className="text-gray-700">
                Foque em comportamentos-chave como motivação, iniciação e responsividade. 
                Registre oportunidades múltiplas e reforços naturais.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl border-2 border-pink-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  VB
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verbal Behavior</h3>
              </div>
              <p className="text-gray-700">
                Trabalhe com operantes verbais (mando, tato, intraverbal, ecoico). 
                Organize objetivos por função da linguagem e contexto comunicativo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border-2 border-indigo-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  Custom
                </div>
                <h3 className="text-xl font-bold text-gray-900">Protocolos Personalizados</h3>
              </div>
              <p className="text-gray-700">
                Crie seus próprios protocolos adaptados às necessidades específicas de cada paciente. 
                Total flexibilidade para sua abordagem terapêutica.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">📊 Todos com Análise de Dados Integrada</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Independente do protocolo escolhido, todos os dados são automaticamente convertidos em 
              gráficos, percentuais e relatórios visuais. Sem trabalho manual, sem planilhas complexas.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Gestão Completa da Sua Clínica
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Muito além de relatórios: controle total do seu negócio terapêutico
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por Que Escolher o AuroraClin?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full">
                    {benefit.icon}
                  </div>
                </div>
                <div className="text-5xl font-black text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {benefit.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">{benefit.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfeito Para Sua Realidade
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-${useCase.color}-50 to-${useCase.color}-100 p-8 rounded-2xl border-2 border-${useCase.color}-200`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-700 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como Funciona?
            </h2>
            <p className="text-xl text-gray-600">Simples, rápido e eficiente em 3 passos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Registre as Sessões</h3>
              <p className="text-gray-600">
                Durante ou após cada atendimento, registre as atividades, comportamentos e progressos. 
                Anexe fotos e vídeos para documentação completa.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sistema Analisa Automaticamente</h3>
              <p className="text-gray-600">
                Nossa inteligência organiza todos os dados, calcula percentuais de evolução e 
                identifica padrões de progresso em cada área trabalhada.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compartilhe com os Pais</h3>
              <p className="text-gray-600">
                Gere relatórios visuais lindos em segundos. Gráficos coloridos e fáceis de entender 
                que mostram exatamente onde a criança evoluiu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "O AuroraClin transformou nossa clínica. Os pais agora veem claramente a evolução 
                e ficam muito mais satisfeitos. Economizamos horas semanais!"
              </p>
              <p className="font-semibold text-gray-900">Dra. Maria Silva</p>
              <p className="text-sm text-gray-600">Clínica Crescer - SP</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Finalmente consigo demonstrar de forma profissional todo o trabalho que fazemos. 
                Os relatórios são lindos e os gráficos falam por si só."
              </p>
              <p className="font-semibold text-gray-900">João Santos</p>
              <p className="text-sm text-gray-600">Terapeuta ABA - RJ</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "A melhor decisão que tomamos para nossa clínica. Gestão simples, 
                relatórios impecáveis e pais sempre informados."
              </p>
              <p className="font-semibold text-gray-900">Ana Paula Costa</p>
              <p className="text-sm text-gray-600">Centro Terapêutico Vida - MG</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Transformar Sua Clínica?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Junte-se a centenas de clínicas que já impressionam os pais com relatórios profissionais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              onClick={() => setMostrarRegistro(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
            >
              Começar Teste Gratuito
              <ArrowRight className="ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Configuração em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Registro */}
      {mostrarRegistro && (
        <RegistroPublico onClose={() => setMostrarRegistro(false)} />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="w-6 h-6 text-orange-400" />
            <span className="text-2xl font-bold">AuroraClin</span>
          </div>
          <p className="text-gray-400 mb-6">
            Sistema de Gestão Terapêutica ABA - Transformando dados em evolução visível
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <button className="hover:text-white transition-colors">Sobre</button>
            <button className="hover:text-white transition-colors">Recursos</button>
            <button className="hover:text-white transition-colors">Preços</button>
            <button className="hover:text-white transition-colors">Contato</button>
            <button className="hover:text-white transition-colors">Suporte</button>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
            © 2025 AuroraClin. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
