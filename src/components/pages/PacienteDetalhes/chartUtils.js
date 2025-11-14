// Utilidades para processamento de dados de gráficos

export function getApexRadarData(relatorio) {
  if (!relatorio || !relatorio.respostas_calculadas_globais) {
    console.warn('Radar: relatorio ou respostas_calculadas_globais ausentes', relatorio);
    return function() {
      return { series: [], categorias: [], datas: [], perguntas: [] };
    };
  }
  
  return function(datasSelecionadas) {
    console.log('Radar: datasSelecionadas', datasSelecionadas);
    const globaisFiltrados = relatorio.respostas_calculadas_globais.filter(item => datasSelecionadas.includes(item.data));
    console.log('Radar: globaisFiltrados', globaisFiltrados);
    
    const indicadoresInfo = {};
    const indicadoresSet = new Set();
    globaisFiltrados.forEach(item => {
      Object.entries(item.indices).forEach(([key, valor]) => {
        let idPergunta;
        if (typeof valor === 'object' && valor !== null && valor.id) {
          idPergunta = valor.id;
        } else {
          idPergunta = key;
        }
        indicadoresSet.add(idPergunta);
        if (!indicadoresInfo[idPergunta]) {
          indicadoresInfo[idPergunta] = {
            id: idPergunta,
            texto: (valor && valor.texto) ? valor.texto : key,
            sigla: (valor && valor.sigla) ? valor.sigla : undefined
          };
        }
      });
    });
    
    const perguntas = Array.from(indicadoresSet).map(id => indicadoresInfo[id]);
    perguntas.sort((a, b) => (a.id > b.id ? 1 : -1));
    console.log('Radar: perguntas (indicadores)', perguntas);
    
    const categorias = perguntas.map(p => p.sigla || p.texto);
    
    const datas = globaisFiltrados.map(item => {
      let dataLabel = item.data;
      if (item.formulario_titulo) {
        dataLabel = item.formulario_titulo;
      }
      return dataLabel;
    });
    
    const series = globaisFiltrados.map((item) => {
      const valores = perguntas.map(p => {
        const indice = item.indices[p.id];
        if (indice && typeof indice === 'object' && indice.valor !== undefined && indice.valor !== null) {
          return parseFloat(indice.valor);
        } else if (indice && typeof indice === 'number') {
          return indice;
        } else if (typeof indice === 'string') {
          const val = parseFloat(indice);
          return isNaN(val) ? 0 : val;
        }
        return 0;
      });
      
      let dataLabel = item.data;
      if (item.formulario_titulo) {
        dataLabel = item.formulario_titulo;
      }
      
      return {
        name: dataLabel,
        data: valores
      };
    });
    
    console.log('Radar: series montadas', series);
    return { series, categorias, datas, perguntas };
  };
}

export function getBarChartData(relatorio, datasSelecionadas) {
  if (!relatorio || !relatorio.respostas_calculadas_globais || datasSelecionadas.length === 0) {
    return null;
  }

  const globaisFiltrados = relatorio.respostas_calculadas_globais.filter(item => datasSelecionadas.includes(item.data));
  
  const barData = [];
  const indiceNomes = new Set();

  globaisFiltrados.forEach(item => {
    Object.entries(item.indices).forEach(([key, valor]) => {
      let sigla = key;
      if (typeof valor === 'object' && valor !== null) {
        sigla = valor.sigla || valor.texto || key;
      }
      indiceNomes.add(sigla);
    });
  });

  indiceNomes.forEach(sigla => {
    const entry = { name: sigla };
    globaisFiltrados.forEach(item => {
      let dataLabel = item.data;
      if (item.formulario_titulo) {
        dataLabel = item.formulario_titulo;
      }
      
      const indiceEntry = Object.entries(item.indices).find(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          return (v.sigla || v.texto || k) === sigla;
        }
        return k === sigla;
      });
      
      if (indiceEntry) {
        const [, valor] = indiceEntry;
        if (typeof valor === 'object' && valor !== null && valor.valor !== undefined) {
          entry[dataLabel] = parseFloat(valor.valor);
        } else if (typeof valor === 'number') {
          entry[dataLabel] = valor;
        } else if (typeof valor === 'string') {
          const val = parseFloat(valor);
          entry[dataLabel] = isNaN(val) ? 0 : val;
        }
      }
    });
    barData.push(entry);
  });

  return barData;
}

export function decideChartType(series, datasSelecionadas) {
  if (datasSelecionadas.length === 0) {
    return null;
  }

  let totalIndices = 0;
  let indicesComDados = 0;
  
  if (series && series.length > 0) {
    const primeiraSerie = series[0];
    if (primeiraSerie.data && Array.isArray(primeiraSerie.data)) {
      totalIndices = primeiraSerie.data.length;
      indicesComDados = primeiraSerie.data.filter(v => typeof v === 'number' && v > 0).length;
    }
  }

  if (datasSelecionadas.length === 1 && indicesComDados === 1) {
    return 'bar';
  }

  if (datasSelecionadas.length === 1) {
    return 'radar';
  }

  if (datasSelecionadas.length >= 2 && totalIndices <= 10 && indicesComDados <= 10) {
    return 'bar';
  }

  return 'radar';
}

export function getPieChartData(relatorioPaciente, datasSelecionadas) {
  if (!relatorioPaciente || !relatorioPaciente.respostas_calculadas_globais) return null;
  if (datasSelecionadas.length === 0) return null;
  const alvo = datasSelecionadas[0];
  const item = relatorioPaciente.respostas_calculadas_globais.find(i => i.data === alvo);
  if (!item || !item.indices) return null;
  const data = [];
  Object.entries(item.indices).forEach(([key, v]) => {
    let nome = '';
    if (typeof v === 'object' && v !== null) {
      nome = v.sigla || v.texto || key;
      if (v.valor !== undefined && v.valor !== null) {
        data.push({ name: nome, value: parseFloat(v.valor) });
      }
    } else if (typeof v === 'number' || typeof v === 'string') {
      const val = parseFloat(v);
      if (!isNaN(val)) data.push({ name: key, value: val });
    }
  });
  return data.length > 0 ? data : null;
}
