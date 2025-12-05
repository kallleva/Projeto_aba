import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCallback } from 'react';
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

const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulse-soft {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
    }
  }
  @keyframes countUp {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  @keyframes blink {
    0%, 49% {
      border-right-color: rgba(6, 182, 212, 1);
    }
    50%, 100% {
      border-right-color: transparent;
    }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes revealBg {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
  .animate-slideInUp {
    animation: slideInUp 0.6s ease-out;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-glow {
    animation: glow 2s infinite;
  }
  .animate-countUp {
    animation: countUp 0.6s ease-out;
  }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out;
  }
  .stat-reveal {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  .stat-reveal.visible {
    animation: scaleIn 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState([false, false, false, false]);
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const textVariations = [
    'Visível e Mensurável',
    'Claro e Objetiva',
    'Profissional e Confiável',
    'Simples e Poderosa'
  ];
  const [sectionsVisible, setSectionsVisible] = useState({
    features: false,
    benefits: false,
    protocols: false,
    testimonials: false,
    painpoints: false,
    usecases: false
  });
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [roiData, setRoiData] = useState({
    pacientes: 10,
    horaValor: 100,
    horasEconomizadas: 75,
    faturamentoExtra: 7500,
    roiMes: 150
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Show stats immediately on page load with staggered animation
    setTimeout(() => {
      setStatsVisible([true, true, true, true]);
    }, 1200);
  }, []);

  useEffect(() => {
    // Typing and retyping effect for subtitle variations
    let currentIndex = 0;
    const currentText = textVariations[textIndex];
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setDisplayedText(currentText.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Pause before switching to next text
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % textVariations.length);
        }, 2000);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [textIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionType = entry.target.getAttribute('data-section');
            if (sectionType) {
              setSectionsVisible(prev => ({
                ...prev,
                [sectionType]: true
              }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const allElements = document.querySelectorAll('[data-section]');
    allElements.forEach(el => observer.observe(el));

    return () => allElements.forEach(el => observer.unobserve(el));
  }, []);

  const features = [
    {
      icon: <Users className="w-12 h-12 text-cyan-600" />,
      title: "Gestão de Equipe",
      description: "Controle completo de profissionais, agendas, vínculos terapêuticos e distribuição de pacientes. Saiba exatamente quem está atendendo quem e quando."
    },
    {
      icon: <Brain className="w-12 h-12 text-teal-600" />,
      title: "Múltiplos Protocolos ABA",
      description: "DTT, NET, ESDM, PRT, VB e protocolos personalizados. Trabalhe com a metodologia que você domina, adaptada às necessidades de cada criança."
    },
    {
      icon: <FileText className="w-12 h-12 text-sky-600" />,
      title: "Documentação Completa",
      description: "Registros de sessões com texto livre ou estruturado, anexos de fotos/vídeos, evolução diária documentada. Tudo organizado e acessível."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-cyan-500" />,
      title: "Análise Quantitativa Automática",
      description: "Sistema calcula automaticamente percentuais de acerto, taxa de independência, evolução temporal e gera todos os gráficos sem trabalho manual."
    },
    {
      icon: <Target className="w-12 h-12 text-teal-500" />,
      title: "Metas e Planos Terapêuticos",
      description: "Defina objetivos mensuráveis, acompanhe status de cada meta, vincule atividades aos objetivos e demonstre progresso com dados concretos."
    },
    {
      icon: <Shield className="w-12 h-12 text-sky-500" />,
      title: "Controle Empresarial",
      description: "Multitenancy para clínicas com múltiplas unidades, controle de acesso por perfil, segurança de dados e conformidade com privacidade médica."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-cyan-600" />,
      title: "70% Menos Tempo",
      number: "70%",
      text: "Reduza drasticamente o tempo gasto com relatórios e documentação. O que levava horas, agora leva minutos."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-teal-600" />,
      title: "100% Mensurável",
      number: "100%",
      text: "Todas as intervenções convertidas em dados quantitativos. Progresso visível em números e gráficos."
    },
    {
      icon: <Heart className="w-8 h-8 text-sky-600" />,
      title: "95% de Satisfação",
      number: "95%",
      text: "Pais e responsáveis mais satisfeitos ao visualizarem claramente a evolução dos seus filhos."
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-500" />,
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

  const calcularROI = (pacientes, hora) => {
    const horasPorPaciente = 7.5;
    const horasReduzidas = 0.33;
    const horasEconomizadas = (horasPorPaciente - horasReduzidas) * pacientes;
    const faturamentoExtra = horasEconomizadas * hora;
    const custoMensalAuroraClin = pacientes * 49.9;
    let roi = ((faturamentoExtra - custoMensalAuroraClin) / custoMensalAuroraClin * 100);
    
    // Limita ROI a 300% para evitar números irrealistas
    roi = Math.min(roi, 300);
    
    setRoiData({
      pacientes,
      horaValor: hora,
      horasEconomizadas: Math.round(horasEconomizadas),
      faturamentoExtra: Math.round(faturamentoExtra),
      roiMes: Math.round(roi)
    });
  };

  const faqItems = [
    {
      pergunta: "Quanto tempo leva para aprender?",
      resposta: "Onboarding em 30 minutos. Muitos usuários criam o primeiro relatório no mesmo dia."
    },
    {
      pergunta: "E se a automação errar?",
      resposta: "Nunca inventamos dados. Apenas organizamos o que você registrou. Você sempre revisa antes de enviar."
    },
    {
      pergunta: "Posso customizar para meus pacientes?",
      resposta: "100% personalizável. Adapte protocolos e templates conforme sua necessidade."
    },
    {
      pergunta: "Os dados são seguros?",
      resposta: "Criptografia bancária, backup automático e conformidade LGPD. Seus dados mais protegidos que em planilhas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{animationStyles}</style>
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-cyan-500" />
              <span className="text-2xl font-bold text-cyan-700">
                AuroraClin
              </span>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <div className="mb-4">Transforme Dados em Evolução</div>
            <div className="h-32 md:h-40 lg:h-48 flex items-center justify-center">
              <span className="text-cyan-600">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
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
              className="bg-cyan-600 hover:bg-cyan-700 text-lg px-8 py-6 h-auto"
            >
              Começar Agora Grátis
              <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto border-2 border-cyan-300 hover:bg-cyan-50 text-cyan-700"
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <div 
              data-stat="0"
              className={`stat-reveal ${statsVisible[0] ? 'visible' : ''} bg-gradient-to-br from-white to-cyan-50 p-4 rounded-2xl border-2 border-cyan-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-cyan-400 hover:-translate-y-2 group cursor-default relative overflow-hidden`}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400 mb-2 group-hover:animate-countUp transition-all duration-300">2<span className="text-2xl">+</span></div>
                <div className="text-gray-700 font-semibold text-sm group-hover:text-cyan-700 transition-colors">Anos em Desenvolvimento</div>
              </div>
            </div>
            <div 
              data-stat="1"
              className={`stat-reveal ${statsVisible[1] ? 'visible' : ''} bg-gradient-to-br from-white to-teal-50 p-4 rounded-2xl border-2 border-teal-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-teal-400 hover:-translate-y-2 group cursor-default relative overflow-hidden`}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 mb-2 group-hover:animate-countUp transition-all duration-300">100<span className="text-2xl">%</span></div>
                <div className="text-gray-700 font-semibold text-sm group-hover:text-teal-700 transition-colors">Customizável</div>
              </div>
            </div>
            <div 
              data-stat="2"
              className={`stat-reveal ${statsVisible[2] ? 'visible' : ''} bg-gradient-to-br from-white to-sky-50 p-4 rounded-2xl border-2 border-sky-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-sky-400 hover:-translate-y-2 group cursor-default relative overflow-hidden`}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400 mb-2 group-hover:animate-countUp transition-all duration-300">0<span className="text-2xl">$</span></div>
                <div className="text-gray-700 font-semibold text-sm group-hover:text-sky-700 transition-colors">Implementação</div>
              </div>
            </div>
            <div 
              data-stat="3"
              className={`stat-reveal ${statsVisible[3] ? 'visible' : ''} bg-gradient-to-br from-white to-cyan-50 p-4 rounded-2xl border-2 border-cyan-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-cyan-400 hover:-translate-y-2 group cursor-default relative overflow-hidden`}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400 mb-2 group-hover:animate-countUp transition-all duration-300">24h<span className="text-2xl">*</span></div>
                <div className="text-gray-700 font-semibold text-sm group-hover:text-cyan-700 transition-colors">Suporte em Português</div>
              </div>
            </div>
            <div 
              className={`stat-reveal ${statsVisible[3] ? 'visible' : ''} bg-gradient-to-br from-white to-amber-50 p-4 rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-amber-400 hover:-translate-y-2 group cursor-default relative overflow-hidden`}
            >
              <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 mb-2 group-hover:animate-countUp transition-all duration-300">💻</div>
                <div className="text-gray-700 font-semibold text-sm group-hover:text-amber-700 transition-colors">Desktop Otimizado</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Visualization Section - MOVED UP */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-cyan-100 rounded-full">
              <span className="text-sm font-semibold text-cyan-700">✨ Veja o Sistema em Ação</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Análises que Realmente Fazem Sentido
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seus dados transformados em gráficos claros que impressionam pais e orientam suas decisões terapêuticas
            </p>
          </div>

          {/* Screenshots com Parallax - First one */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-100 rounded-full mb-3">
                    <span className="text-xs font-semibold text-blue-700">📊 Análise Visual</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Performance em Gráficos</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Veja em tempo real como seu paciente está evoluindo. Cada barra representa uma vitória, cada aumento mostra o progresso tangível.</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 group-hover:bg-blue-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Comparação entre períodos</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Identifique semanas com melhor desempenho</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 group-hover:bg-blue-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Habilidades em foco</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Saiba exatamente quais áreas estão avançando</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 group-hover:bg-blue-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Exportação profissional</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Gráficos prontos para relatórios e apresentações</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div 
                className="rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-200 transition-all duration-500 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 group cursor-pointer"
                style={{
                  transform: `translateY(${Math.max(-scrollY * 0.15, -60)}px)`,
                }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-12 flex items-center px-6 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 group-hover:animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 group-hover:animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <img 
                  src="/grafico-barra.jpeg" 
                  alt="Gráfico de Barras de Performance" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent my-20"></div>

          {/* Screenshots com Parallax - Second one */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div 
                className="rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-200 transition-all duration-500 hover:shadow-2xl hover:border-teal-400 hover:-translate-y-2 group cursor-pointer"
                style={{
                  transform: `translateY(${Math.max(-scrollY * 0.2, -80)}px)`,
                }}
              >
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 h-12 flex items-center px-6 group-hover:from-teal-700 group-hover:to-blue-700 transition-all duration-300">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 group-hover:animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 group-hover:animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <img 
                  src="/grafico-radar.png" 
                  alt="Gráfico Radar Multidimensional" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div>
              <div className="space-y-8">
                <div>
                  <div className="inline-block px-3 py-1 bg-teal-100 rounded-full mb-3">
                    <span className="text-xs font-semibold text-teal-700">🎯 Visão Completa</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Desenvolvimento Multidimensional</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Um único gráfico mostra todas as dimensões do desenvolvimento. Comunicação, motricidade, social, cognitivo - tudo integrado.</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-teal-50 hover:border-l-4 hover:border-l-teal-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mt-1 group-hover:bg-teal-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Múltiplas dimensões</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Veja o desenvolvimento integral do paciente</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-teal-50 hover:border-l-4 hover:border-l-teal-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mt-1 group-hover:bg-teal-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Fácil interpretação</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Mesmo pais sem conhecimento técnico entendem</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 hover:bg-teal-50 hover:border-l-4 hover:border-l-teal-500 hover:translate-x-2 cursor-default group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mt-1 group-hover:bg-teal-600 group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">Benchmarks inclusos</p>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700">Compare com metas e padrões de desenvolvimento</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-section="painpoints">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Desafios Comuns em Clínicas
            </h2>
            <p className="text-lg text-gray-600">
              Se você reconhece algum desses, o AuroraClin é para você
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className={`stat-reveal ${sectionsVisible.painpoints ? 'visible' : ''} bg-gray-50 p-6 rounded-lg border-l-4 border-cyan-500 hover:bg-gray-100 transition-colors`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-gray-800">{point}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-700 font-semibold">
              ✓ O AuroraClin resolve todos esses problemas
            </p>
          </div>
        </div>
      </section>

      {/* ABA Protocols Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-section="protocols">
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
            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '0ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-cyan-700 group-hover:shadow-lg transition-all duration-300">
                  DTT
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Discrete Trial Training</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Registre tentativas discretas, taxa de acertos, prompts utilizados e tempo de resposta. 
                Ideal para ensino estruturado de habilidades específicas.
              </p>
            </div>

            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '150ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-teal-700 group-hover:shadow-lg transition-all duration-300">
                  NET
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Natural Environment Teaching</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Documente intervenções em ambiente natural, registre oportunidades de ensino incidental 
                e generalizações de habilidades em contextos reais.
              </p>
            </div>

            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-sky-200 hover:border-sky-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-sky-700 group-hover:shadow-lg transition-all duration-300">
                  ESDM
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-700 transition-colors">Early Start Denver Model</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Acompanhe objetivos de desenvolvimento em múltiplas áreas, registre atividades lúdicas 
                e monitore engajamento social durante as sessões.
              </p>
            </div>

            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '450ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-cyan-600 group-hover:shadow-lg transition-all duration-300">
                  PRT
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Pivotal Response Treatment</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Foque em comportamentos-chave como motivação, iniciação e responsividade. 
                Registre oportunidades múltiplas e reforços naturais.
              </p>
            </div>

            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '600ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-teal-600 group-hover:shadow-lg transition-all duration-300">
                  VB
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Verbal Behavior</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Trabalhe com operantes verbais (mando, tato, intraverbal, ecoico). 
                Organize objetivos por função da linguagem e contexto comunicativo.
              </p>
            </div>

            <div className={`stat-reveal ${sectionsVisible.protocols ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-sky-200 hover:border-sky-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '750ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-sky-600 group-hover:shadow-lg transition-all duration-300">
                  Custom
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-700 transition-colors">Protocolos Personalizados</h3>
              </div>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors">
                Crie seus próprios protocolos adaptados às necessidades específicas de cada paciente. 
                Total flexibilidade para sua abordagem terapêutica.
              </p>
            </div>
          </div>

          <div className="bg-teal-600 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">📊 Todos com Análise de Dados Integrada</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Independente do protocolo escolhido, todos os dados são automaticamente convertidos em 
              gráficos, percentuais e relatórios visuais. Sem trabalho manual, sem planilhas complexas.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" data-section="features">
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
                className={`stat-reveal ${sectionsVisible.features ? 'visible' : ''} bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-100 hover:border-cyan-300 group cursor-default overflow-hidden relative`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 to-cyan-50" data-section="benefits">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por Que Escolher o AuroraClin?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className={`stat-reveal ${sectionsVisible.benefits ? 'visible' : ''} bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-cyan-200`} style={{ animationDelay: `${index * 140}ms` }}>
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-full">
                    {benefit.icon}
                  </div>
                </div>
                <div className="text-5xl font-black text-center mb-3 text-cyan-600">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" data-section="usecases">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Para Qualquer Contexto Terapêutico
            </h2>
            <p className="text-lg text-gray-600">
              Seja qual for seu modelo de trabalho, o AuroraClin se adapta
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className={`stat-reveal ${sectionsVisible.usecases ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-default relative overflow-hidden`}
              style={{ animationDelay: '0ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:bg-cyan-200 transition-all duration-300">
                <span className="text-4xl">🏥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-700 transition-colors">Clínicas ABA</h3>
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                Gerencie múltiplos terapeutas, pacientes e protocolos em uma única plataforma. Relatórios consolidados e visão gerencial completa da sua operação.
              </p>
            </div>

            <div 
              className={`stat-reveal ${sectionsVisible.usecases ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-default relative overflow-hidden`}
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:bg-teal-200 transition-all duration-300">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors">Terapeutas Autônomos</h3>
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                Organize seus atendimentos, crie protocolos personalizados e impressione os pais com relatórios profissionais que demonstram sua expertise.
              </p>
            </div>

            <div 
              className={`stat-reveal ${sectionsVisible.usecases ? 'visible' : ''} bg-white p-8 rounded-3xl border-2 border-sky-200 hover:border-sky-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-default relative overflow-hidden`}
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:bg-sky-200 transition-all duration-300">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-sky-700 transition-colors">Centros Multidisciplinares</h3>
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                Coordene psicólogos, fonoaudiólogos e terapeutas ocupacionais com segurança. Integração perfeita entre diferentes áreas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Três Etapas Simples
            </h2>
            <p className="text-lg text-gray-600">
              De seus registros diários a relatórios profissionais em minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Registre</h3>
              <p className="text-gray-700 leading-relaxed">
                Documente sessões, comportamentos e evoluções diariamente. Sistema flexível para qualquer protocolo.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analisa</h3>
              <p className="text-gray-700 leading-relaxed">
                Sistema organiza dados, calcula percentuais e identifica padrões automaticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compartilhe</h3>
              <p className="text-gray-700 leading-relaxed">
                Gere relatórios visuais em segundos. Gráficos que demonstram evolução real dos pacientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quanto Você Vai Economizar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra quanto tempo e dinheiro você deixa na mesa todos os meses sem automação
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border-2 border-cyan-200 p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantos pacientes você atende?</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={roiData.pacientes}
                    className="flex-1 h-3 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    onChange={(e) => calcularROI(parseInt(e.target.value), roiData.horaValor)}
                  />
                  <span className="text-2xl font-bold text-cyan-600 min-w-12">{roiData.pacientes}</span>
                  <span className="text-gray-600">pacientes</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sua hora vale quanto?</label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">R$</span>
                  <input 
                    type="number" 
                    min="0" 
                    value={roiData.horaValor}
                    className="flex-1 px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    onChange={(e) => calcularROI(roiData.pacientes, parseInt(e.target.value) || 0)}
                  />
                  <span className="text-gray-600">/hora</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl border-2 border-cyan-200">
                <p className="text-sm text-gray-600 mb-2">Horas economizadas/mês</p>
                <p className="text-4xl font-black text-cyan-600">{roiData.horasEconomizadas}h</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl border-2 border-teal-200">
                <p className="text-sm text-gray-600 mb-2">Faturamento potencial extra</p>
                <p className="text-4xl font-black text-teal-600">R$ {(roiData.faturamentoExtra / 1000).toFixed(1)}k</p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-2xl border-2 border-sky-200">
                <p className="text-sm text-gray-600 mb-2">ROI em 1 mês</p>
                <p className="text-4xl font-black text-sky-600">+{roiData.roiMes}%</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              *Cálculo baseado em 7.5h de trabalho em relatórios por paciente/mês, reduzido para 20 minutos com AuroraClin
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Suas Dúvidas Respondidas
            </h2>
            <p className="text-lg text-gray-600">
              Respostas honestas para as preocupações reais de profissionais ABA
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 ${
                  expandedFaq === index
                    ? 'border-cyan-400 bg-cyan-50 shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-cyan-300'
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                  className="w-full text-left p-5 flex items-center justify-between group"
                >
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">
                    {item.pergunta}
                  </h3>
                  <span className={`text-lg text-gray-500 transition-transform duration-300 flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-0 border-t border-cyan-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.resposta}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sua Realidade Antes e Depois
            </h2>
            <p className="text-lg text-gray-600">
              Veja a transformação que nossos primeiros usuários experimentaram
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Antes */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-red-700 mb-2">❌ ANTES</h3>
                <p className="text-sm text-red-600">(Sem AuroraClin)</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">7-8 horas por paciente</p>
                    <p className="text-sm text-gray-600">Criando relatórios manualmente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">Dados desorganizados</p>
                    <p className="text-sm text-gray-600">Planilhas, anotações soltas, emails</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">Pais confusos</p>
                    <p className="text-sm text-gray-600">Difícil demonstrar progresso tangível</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">Erros frequentes</p>
                    <p className="text-sm text-gray-600">Falhas de digitação, cálculos incorretos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">Sem análises profundas</p>
                    <p className="text-sm text-gray-600">Impossível rastrear padrões e evolução</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-1">×</span>
                  <div>
                    <p className="font-semibold text-gray-900">Noites de trabalho extra</p>
                    <p className="text-sm text-gray-600">Levando trabalho para casa</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Depois */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-green-700 mb-2">✅ DEPOIS</h3>
                <p className="text-sm text-green-600">(Com AuroraClin)</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">20 minutos por paciente</p>
                    <p className="text-sm text-gray-600">Relatórios profissionais gerados automaticamente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Tudo centralizado</p>
                    <p className="text-sm text-gray-600">Um único lugar para todos os dados</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Pais entusiasmados</p>
                    <p className="text-sm text-gray-600">Gráficos visuais que demonstram evolução clara</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Zero erros</p>
                    <p className="text-sm text-gray-600">Cálculos sempre precisos e formatação perfeita</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Insights profundos</p>
                    <p className="text-sm text-gray-600">Identifique padrões e planeje melhor</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Tempo para viver</p>
                    <p className="text-sm text-gray-600">Recupere 75+ horas mensais para descanso</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              A diferença entre trabalhar <strong>com</strong> tecnologia e trabalhar <strong>contra</strong> a burocracia
            </p>
            <Button 
              size="lg" 
              onClick={() => setMostrarRegistro(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-lg px-8 py-6 h-auto"
            >
              Experimente a Diferença Agora
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" data-section="testimonials">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Profissionais Confiam no AuroraClin
            </h2>
            <p className="text-lg text-gray-600">
              Clínicas e terapeutas de todo o Brasil já transformaram seus resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`stat-reveal ${sectionsVisible.testimonials ? 'visible' : ''} bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:border-cyan-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '0ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-4 group-hover:animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl group-hover:text-yellow-500 transition-colors">★</span>
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed group-hover:text-gray-900 transition-colors font-medium">
                  "Mudou totalmente a forma como apresentamos progresso aos pais. Agora conseguem visualizar claramente cada avanço em gráficos simples e objetivos."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-cyan-700 transition-colors">Profissional de ABA</p>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Clínica especializada</p>
                </div>
              </div>
            </div>

            <div className={`stat-reveal ${sectionsVisible.testimonials ? 'visible' : ''} bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:border-teal-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-4 group-hover:animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl group-hover:text-yellow-500 transition-colors">★</span>
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed group-hover:text-gray-900 transition-colors font-medium">
                  "Como terapeuta autônomo, o AuroraClin me permitiu entregar relatórios tão profissionais quanto os de grandes clínicas. Meus clientes ficam impressionados."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">Terapeuta Independente</p>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Consultório privado</p>
                </div>
              </div>
            </div>

            <div className={`stat-reveal ${sectionsVisible.testimonials ? 'visible' : ''} bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:border-sky-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden`} style={{ animationDelay: '400ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-4 group-hover:animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl group-hover:text-yellow-500 transition-colors">★</span>
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed group-hover:text-gray-900 transition-colors font-medium">
                  "Economizamos dezenas de horas por mês que gastávamos com relatórios. Agora nossos terapeutas focam no que realmente importa: o paciente."
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-sky-700 transition-colors">Gestor de Clínica</p>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">Centro multidisciplinar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plano Simples e Justo
            </h2>
            <p className="text-lg text-gray-600">
              Um único plano que cresce com sua clínica. Sem surpresas.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-10 md:p-12 rounded-2xl shadow-xl border-2 border-cyan-300 max-w-md w-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Profissional</h3>
                <p className="text-gray-600 mb-6">Para clínicas e terapeutas</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-cyan-600">R$ 49</span>
                  <span className="text-lg text-gray-600">,90/mês</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Prontuário digital completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Planos terapêuticos ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Gráficos e relatórios automáticos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Agenda integrada com lembretes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Suporte por email e chat</span>
                </li>
              </ul>

              <Button 
                onClick={() => setMostrarRegistro(true)}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg py-6"
              >
                Começar Teste Gratuito
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              14 dias de teste grátis • Sem cartão de crédito • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comece Agora. Sem Risco.
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95">
            Teste grátis por 14 dias. Nenhuma informação de pagamento necessária.
          </p>
          
          <Button 
            size="lg"
            onClick={() => setMostrarRegistro(true)}
            className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-10 py-7 h-auto font-bold"
          >
            Começar Teste Gratuito
            <ArrowRight className="ml-2" />
          </Button>

          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Acesso completo ao sistema</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Suporte disponível</span>
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
            <Sun className="w-6 h-6 text-cyan-400" />
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
