/**
 * SISTEMA DE INFERENCIA DIFUSA TIPO MAMDANI (100% Client-Side en JS Puro)
 * ODS 1: Fin de la Pobreza - Clasificación Socioeconómica Multidimensional
 * Compatible con Cloudflare Pages / Vercel / GitHub Pages
 */

// =============================================================================
// 1. FUNCIONES MATEMÁTICAS DE MEMBRESÍA
// =============================================================================

function trimf(x, a, b, c) {
  if (x <= a || x >= c) return 0.0;
  if (x === b) return 1.0;
  if (x > a && x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

function trapmf(x, a, b, c, d) {
  if (x <= a && a !== b) return 0.0;
  if (x >= d && c !== d) return 0.0;
  if (x >= b && x <= c) return 1.0;
  if (x > a && x < b) return (b === a) ? 1.0 : (x - a) / (b - a);
  if (x > c && x < d) return (d === c) ? 1.0 : (d - x) / (d - c);
  if (a === b && x <= a) return 1.0;
  if (c === d && x >= d) return 1.0;
  return 0.0;
}

// =============================================================================
// 2. DEFINICIÓN DE CONJUNTOS DIFUSOS Y UNIVERSOS
// =============================================================================

const MF = {
  gasto: {
    Critico: (x) => trapmf(x, 0, 0, 50, 75),
    Vulnerable: (x) => trimf(x, 55, 85, 115),
    Suficiente: (x) => trapmf(x, 95, 130, 250, 250)
  },
  carencia: {
    Bajo: (x) => trapmf(x, 0, 0, 1.5, 3.0),
    Moderado: (x) => trimf(x, 2.0, 4.0, 6.0),
    Severo: (x) => trapmf(x, 5.0, 7.0, 9.0, 9.0)
  },
  dep: {
    Baja: (x) => trapmf(x, 0.0, 0.0, 0.4, 0.7),
    Media: (x) => trimf(x, 0.5, 0.9, 1.3),
    Alta: (x) => trapmf(x, 1.1, 1.6, 3.0, 3.0)
  },
  salida: {
    Baja: (y) => trapmf(y, 0, 0, 15, 30),
    Media: (y) => trimf(y, 20, 37.5, 55),
    Alta: (y) => trimf(y, 45, 62.5, 80),
    Urgente: (y) => trapmf(y, 70, 85, 100, 100)
  }
};

// 27 Reglas Difusas de Mamdani (R01 a R27)
const REGLAS = [
  // Gasto Crítico
  { id: 'R01', g: 'Critico', c: 'Severo', d: 'Alta', out: 'Urgente' },
  { id: 'R02', g: 'Critico', c: 'Severo', d: 'Media', out: 'Urgente' },
  { id: 'R03', g: 'Critico', c: 'Severo', d: 'Baja', out: 'Urgente' },
  { id: 'R04', g: 'Critico', c: 'Moderado', d: 'Alta', out: 'Urgente' },
  { id: 'R05', g: 'Critico', c: 'Moderado', d: 'Media', out: 'Alta' },
  { id: 'R06', g: 'Critico', c: 'Moderado', d: 'Baja', out: 'Alta' },
  { id: 'R07', g: 'Critico', c: 'Bajo', d: 'Alta', out: 'Alta' },
  { id: 'R08', g: 'Critico', c: 'Bajo', d: 'Media', out: 'Alta' },
  { id: 'R09', g: 'Critico', c: 'Bajo', d: 'Baja', out: 'Media' },

  // Gasto Vulnerable
  { id: 'R10', g: 'Vulnerable', c: 'Severo', d: 'Alta', out: 'Urgente' },
  { id: 'R11', g: 'Vulnerable', c: 'Severo', d: 'Media', out: 'Alta' },
  { id: 'R12', g: 'Vulnerable', c: 'Severo', d: 'Baja', out: 'Alta' },
  { id: 'R13', g: 'Vulnerable', c: 'Moderado', d: 'Alta', out: 'Alta' },
  { id: 'R14', g: 'Vulnerable', c: 'Moderado', d: 'Media', out: 'Media' },
  { id: 'R15', g: 'Vulnerable', c: 'Moderado', d: 'Baja', out: 'Media' },
  { id: 'R16', g: 'Vulnerable', c: 'Bajo', d: 'Alta', out: 'Media' },
  { id: 'R17', g: 'Vulnerable', c: 'Bajo', d: 'Media', out: 'Media' },
  { id: 'R18', g: 'Vulnerable', c: 'Bajo', d: 'Baja', out: 'Baja' },

  // Gasto Suficiente
  { id: 'R19', g: 'Suficiente', c: 'Severo', d: 'Alta', out: 'Alta' },
  { id: 'R20', g: 'Suficiente', c: 'Severo', d: 'Media', out: 'Media' },
  { id: 'R21', g: 'Suficiente', c: 'Severo', d: 'Baja', out: 'Media' },
  { id: 'R22', g: 'Suficiente', c: 'Moderado', d: 'Alta', out: 'Media' },
  { id: 'R23', g: 'Suficiente', c: 'Moderado', d: 'Media', out: 'Baja' },
  { id: 'R24', g: 'Suficiente', c: 'Moderado', d: 'Baja', out: 'Baja' },
  { id: 'R25', g: 'Suficiente', c: 'Bajo', d: 'Alta', out: 'Baja' },
  { id: 'R26', g: 'Suficiente', c: 'Bajo', d: 'Media', out: 'Baja' },
  { id: 'R27', g: 'Suficiente', c: 'Bajo', d: 'Baja', out: 'Baja' }
];

// Presets de los 4 Casos ENAHO
const CASOS = {
  1: {
    gasto: 61.3,
    carencia: 8.0,
    dep: 1.5,
    gastoSol: 210.16,
    lpeSol: 222.11,
    lptSol: 342.91,
    menores: 3,
    mayores: 0,
    activos: 2,
    clips: "Pobreza Extrema (Alerta: Atención Prioritaria)",
    checks: { piso: true, hacinamiento: true, luz: true, agua: true, saneamiento: true, combustible: true, internet: false }
  },
  2: {
    gasto: 76.9,
    carencia: 5.0,
    dep: 0.5,
    gastoSol: 329.61,
    lpeSol: 252.83,
    lptSol: 428.60,
    menores: 2,
    mayores: 0,
    activos: 4,
    clips: "Pobreza No Extrema (Monitoreo)",
    checks: { piso: false, hacinamiento: false, luz: true, agua: false, saneamiento: true, combustible: true, internet: false }
  },
  3: {
    gasto: 214.8,
    carencia: 0.0,
    dep: 1.0,
    gastoSol: 1220.26,
    lpeSol: 307.24,
    lptSol: 568.01,
    menores: 0,
    mayores: 2,
    activos: 2,
    clips: "No Pobre",
    checks: { piso: false, hacinamiento: false, luz: false, agua: false, saneamiento: false, combustible: false, internet: false }
  },
  4: {
    gasto: 178.9,
    carencia: 7.0,
    dep: 1.5,
    gastoSol: 668.36,
    lpeSol: 215.29,
    lptSol: 373.46,
    menores: 3,
    mayores: 0,
    activos: 2,
    clips: "No Pobre (Alerta: Riesgo de Exclusión Social)",
    checks: { piso: true, hacinamiento: true, luz: false, agua: true, saneamiento: true, combustible: true, internet: true }
  }
};

// =============================================================================
// 3. MOTOR DE INFERENCIA DIFUSA MAMDANI
// =============================================================================

function ejecutarInferencia(rGasto, icvs, td) {
  // 1. Fusificación
  const muG = {
    Critico: MF.gasto.Critico(rGasto),
    Vulnerable: MF.gasto.Vulnerable(rGasto),
    Suficiente: MF.gasto.Suficiente(rGasto)
  };

  const muC = {
    Bajo: MF.carencia.Bajo(icvs),
    Moderado: MF.carencia.Moderado(icvs),
    Severo: MF.carencia.Severo(icvs)
  };

  const muD = {
    Baja: MF.dep.Baja(td),
    Media: MF.dep.Media(td),
    Alta: MF.dep.Alta(td)
  };

  // 2. Disparo de Reglas (T-Norma Min)
  const activas = [];
  const N_POINTS = 500;
  const U_SALIDA = [];
  const muAgg = new Array(N_POINTS).fill(0.0);

  for (let i = 0; i < N_POINTS; i++) {
    U_SALIDA.push((i / (N_POINTS - 1)) * 100);
  }

  REGLAS.forEach((regla) => {
    const alpha = Math.min(muG[regla.g], muC[regla.c], muD[regla.d]);
    if (alpha > 0.0001) {
      activas.push({ ...regla, alpha });

      // 3. Implicación (Min) & 4. Agregación (Max)
      for (let i = 0; i < N_POINTS; i++) {
        const y = U_SALIDA[i];
        const muConseq = MF.salida[regla.out](y);
        const truncado = Math.min(alpha, muConseq);
        if (truncado > muAgg[i]) {
          muAgg[i] = truncado;
        }
      }
    }
  });

  // 5. Desfuzificación (Centroide / COG)
  let sumProd = 0;
  let sumArea = 0;
  for (let i = 0; i < N_POINTS; i++) {
    sumProd += U_SALIDA[i] * muAgg[i];
    sumArea += muAgg[i];
  }

  const cog = (sumArea === 0) ? 50.0 : (sumProd / sumArea);

  // Clasificación directa sobre el Centroide Matemático (COG en [0, 100])
  let categoria = "";
  let badgeClass = "";
  let politica = "";

  if (cog < 25.0) {
    categoria = "Baja (No Prioritario)";
    badgeClass = "badge-baja";
    politica = "Hogar económicamente estable y sin privaciones estructurales. <strong>No requiere asignación de subsidios directos</strong>; continúa en monitoreo censal preventivo regular.";
  } else if (cog < 50.0) {
    categoria = "Media (Monitoreo Preventivo)";
    badgeClass = "badge-media";
    politica = "Hogar en zona de vulnerabilidad socioeconómica. Se sugiere inclusión en <strong>becas educativas (Beca 18), seguro integral de salud (SIS)</strong> y programas de inserción laboral formal.";
  } else if (cog < 75.0) {
    categoria = "Alta (Atención Prioritaria)";
    badgeClass = "badge-alta";
    politica = "Hogar en pobreza multidimensional crítica. Asignación inmediata al <strong>Programa Juntos, Contigo</strong> o <strong>Pensión 65</strong>, y focalización para mejoramiento de vivienda básica.";
  } else {
    categoria = "Urgente (Pobreza Extrema)";
    badgeClass = "badge-urgente";
    politica = "Estado de indigencia y riesgo sanitario inminente. <strong>Atención prioritaria del Estado</strong>: Bono Alimentario de Emergencia, dotación de agua potable mediante camiones cisterna y subsidio energético.";
  }

  return {
    ivs: cog, // Centroide matemático puro
    cogRaw: cog,
    categoria,
    badgeClass,
    politica,
    muG,
    muC,
    muD,
    activas,
    muAgg,
    U_SALIDA
  };
}

// =============================================================================
// 4. GENERACIÓN DE GRÁFICAS VECTORIALES (SVG)
// =============================================================================

function dibujarMiniChart(svgId, dominio, funciones, valorActual, colorLínea) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const w = 360;
  const h = 80;
  const pad = { top: 10, right: 12, bottom: 20, left: 12 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const [xMin, xMax] = dominio;
  const scaleX = (x) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const scaleY = (y) => pad.top + (1 - y) * plotH;

  let paths = '';

  // Dibujar curvas de membresía
  Object.keys(funciones).forEach((tag) => {
    const fn = funciones[tag];
    let d = '';
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = fn(x);
      const px = scaleX(x).toFixed(1);
      const py = scaleY(y).toFixed(1);
      d += (i === 0) ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    paths += `<path d="${d}" fill="none" stroke="${colorLínea[tag]}" stroke-width="1.8" opacity="0.85" />`;
  });

  // Línea vertical del valor actual
  const curX = scaleX(Math.max(xMin, Math.min(xMax, valorActual))).toFixed(1);
  const vLine = `
    <line x1="${curX}" y1="${pad.top}" x2="${curX}" y2="${h - pad.bottom}" stroke="#0f172a" stroke-width="2" stroke-dasharray="3,2" />
    <circle cx="${curX}" cy="${scaleY(0.5)}" r="3.5" fill="#059669" />
  `;

  // Eje base
  const axis = `<line x1="${pad.left}" y1="${h - pad.bottom}" x2="${w - pad.right}" y2="${h - pad.bottom}" stroke="#cbd5e1" stroke-width="1.5" />`;

  svg.innerHTML = axis + paths + vLine;
}

function dibujarChartSalida(svgId, U_SALIDA, muAgg, centroidVal) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const w = 520;
  const h = 180;
  const pad = { top: 15, right: 20, bottom: 25, left: 20 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const scaleX = (x) => pad.left + (x / 100) * plotW;
  const scaleY = (y) => pad.top + (1 - y) * plotH;

  // 1. Curvas de referencia en trazos punteados (colores contrastados en blanco)
  const refColors = {
    Baja: '#2563eb',
    Media: '#059669',
    Alta: '#d97706',
    Urgente: '#dc2626'
  };

  let refPaths = '';
  Object.keys(MF.salida).forEach((tag) => {
    const fn = MF.salida[tag];
    let d = '';
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const y = fn(x);
      const px = scaleX(x).toFixed(1);
      const py = scaleY(y).toFixed(1);
      d += (i === 0) ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }
    refPaths += `<path d="${d}" fill="none" stroke="${refColors[tag]}" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.45" />`;
  });

  // 2. Área agregada muAgg
  let areaD = `M ${scaleX(0).toFixed(1)} ${scaleY(0).toFixed(1)}`;
  for (let i = 0; i < U_SALIDA.length; i++) {
    const px = scaleX(U_SALIDA[i]).toFixed(1);
    const py = scaleY(muAgg[i]).toFixed(1);
    areaD += ` L ${px} ${py}`;
  }
  areaD += ` L ${scaleX(100).toFixed(1)} ${scaleY(0).toFixed(1)} Z`;

  const aggFill = `
    <defs>
      <linearGradient id="aggGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35" />
        <stop offset="35%" stop-color="#059669" stop-opacity="0.35" />
        <stop offset="65%" stop-color="#d97706" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#dc2626" stop-opacity="0.35" />
      </linearGradient>
    </defs>
    <path d="${areaD}" fill="url(#aggGrad)" stroke="#0f172a" stroke-width="1.8" />
  `;

  // 3. Línea vertical del Centroide
  const cX = scaleX(centroidVal).toFixed(1);
  const cogMarker = `
    <line x1="${cX}" y1="${pad.top}" x2="${cX}" y2="${h - pad.bottom}" stroke="#0f172a" stroke-width="2.5" />
    <polygon points="${cX - 5},${pad.top} ${Number(cX) + 5},${pad.top} ${cX},${pad.top + 8}" fill="#0f172a" />
    <text x="${Math.min(w - 75, Math.max(25, Number(cX) - 20))}" y="${pad.top + 20}" fill="#0f172a" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">COG: ${centroidVal.toFixed(1)}%</text>
  `;

  // Eje X
  const axis = `<line x1="${pad.left}" y1="${h - pad.bottom}" x2="${w - pad.right}" y2="${h - pad.bottom}" stroke="#cbd5e1" stroke-width="1.5" />`;

  svg.innerHTML = axis + refPaths + aggFill + cogMarker;
}

// =============================================================================
// 5. CONTROLADOR PRINCIPAL Y EVENTOS DEL DOM
// =============================================================================
// MOTOR DE INFERENCIA DEL SISTEMA EXPERTO (CLIPS - REGLAS RÍGIDAS)
// Basado fielmente en cse_sistema_experto.clp (3 Capas, Forward Chaining)
// =============================================================================

let casoSeleccionadoActual = 1;

function evaluarSistemaExperto(rGasto, icvs, td, casoActual) {
  // CAPA 1: Derivación de hechos (Salience 100)
  const caso = CASOS[casoActual] || CASOS[1];
  let gastoSol = caso.gastoSol;
  let lpeSol = caso.lpeSol;
  let lptSol = caso.lptSol;

  if (typeof document !== 'undefined') {
    const inpG = document.getElementById('calc-inp-gasto');
    const inpL = document.getElementById('calc-inp-lpt');
    if (inpG && inpL && inpG.value && inpL.value) {
      gastoSol = parseFloat(inpG.value) || gastoSol;
      lptSol = parseFloat(inpL.value) || lptSol;
      lpeSol = caso.lpeSol || (lptSol * 0.6477);
    }
  }

  let tramo = "";
  let tramoRegla = "";
  let tramoLabel = "";

  if (gastoSol < lpeSol) {
    tramo = "bajo-lpe";
    tramoRegla = "R01";
    tramoLabel = `Bajo LPE (S/ ${gastoSol.toFixed(2)} < S/ ${lpeSol.toFixed(2)})`;
  } else if (gastoSol < lptSol) {
    tramo = "entre";
    tramoRegla = "R02";
    tramoLabel = `Entre LPE y LPT (S/ ${gastoSol.toFixed(2)})`;
  } else {
    tramo = "sobre";
    tramoRegla = "R03";
    tramoLabel = `Sobre LPT (S/ ${gastoSol.toFixed(2)} ≥ S/ ${lptSol.toFixed(2)})`;
  }

  // Tasa de dependencia
  let depAtr = "";
  let depRegla = "";
  let depLabel = "";
  if (td > 1.0) {
    depAtr = "alta";
    depRegla = "R04";
    depLabel = `Alta (TD = ${td.toFixed(2)} > 1.0)`;
  } else if (td > 0.5) {
    depAtr = "media";
    depRegla = "R05";
    depLabel = `Media (0.5 < TD = ${td.toFixed(2)} ≤ 1.0)`;
  } else {
    depAtr = "baja";
    depRegla = "R06";
    depLabel = `Baja (TD = ${td.toFixed(2)} ≤ 0.5)`;
  }

  // CAPA 2: Privaciones y vulnerabilidad (Salience 50 / 45)
  const privScore = Math.round(icvs);
  let vulAtr = "";
  let vulRegla = "";
  if (privScore <= 2) {
    vulAtr = "baja";
    vulRegla = "R25";
  } else if (privScore <= 5) {
    vulAtr = "media";
    vulRegla = "R26";
  } else {
    vulAtr = "alta";
    vulRegla = "R27";
  }

  // CAPA 3: Dictamen oficial y alertas (Salience 40 a 10)
  let dictamen = "";
  let dictamenRegla = "";
  if (tramo === "bajo-lpe") {
    dictamen = "Pobreza Extrema";
    dictamenRegla = "R21";
  } else if (tramo === "entre") {
    dictamen = "Pobreza No Extrema";
    dictamenRegla = "R22";
  } else {
    dictamen = "No Pobre";
    dictamenRegla = "R23";
  }

  // Alertas sociales del sistema experto
  let alerta = "Sin alerta";
  let alertaRegla = "";
  let policyExpert = "";

  if (dictamen === "Pobreza Extrema" && vulAtr === "alta") {
    alerta = "Atención Prioritaria (R28)";
    alertaRegla = "R28";
    policyExpert = "Hogar en pobreza extrema multidimensional. Focalizado con prioridad 100% para Bono Alimentario y Programa Juntos.";
  } else if (dictamen === "Pobreza No Extrema" && vulAtr === "alta") {
    alerta = "Seguimiento Recomendado (R29)";
    alertaRegla = "R29";
    policyExpert = "Hogar vulnerable en riesgo social. Focalizado para afiliación al Seguro Integral de Salud (SIS) y mejoramiento habitacional.";
  } else if (dictamen === "No Pobre" && vulAtr === "alta") {
    alerta = "Alerta R30: Posible Exclusión Social (Paradoja Multidimensional)";
    alertaRegla = "R30";
    policyExpert = "<strong>Efecto Acantilado detectado:</strong> Catalogado como 'No Pobre' por gasto monetario, pero vive en piso de tierra sin servicios. El sistema experto emite la Alerta R30 para revisión especial.";
  } else {
    if (dictamen === "No Pobre") {
      alerta = "Hogar Estable";
      policyExpert = "Hogar por encima de la línea de pobreza y con servicios consolidados. No requiere asignación de subsidios directos.";
    } else {
      alerta = "Monitoreo Regular";
      policyExpert = "Hogar en seguimiento censal preventivo regular.";
    }
  }

  // Lista de hechos assertados para el inspector de Memoria de Trabajo
  const facts = [
    `(hogar (id HOGAR-0${casoActual}) (area ${casoActual === 1 ? 'rural' : 'urbano'}) (gasto-pc S/${(rGasto * 3.73).toFixed(2)}) (icvs ${privScore}))`,
    `(hecho (hogar HOGAR-0${casoActual}) (atributo tramo) (valor ${tramo}) (regla ${tramoRegla}))`,
    `(hecho (hogar HOGAR-0${casoActual}) (atributo dependencia) (valor ${depAtr}) (regla ${depRegla}))`,
    `(hecho (hogar HOGAR-0${casoActual}) (atributo puntaje-privaciones) (valor ${privScore}) (regla R24))`,
    `(hecho (hogar HOGAR-0${casoActual}) (atributo vulnerabilidad) (valor ${vulAtr}) (regla ${vulRegla}))`,
    `(hecho (hogar HOGAR-0${casoActual}) (atributo dictamen) (valor ${dictamen.toLowerCase().replace(/ /g, '-')}) (regla ${dictamenRegla}))`
  ];
  if (alertaRegla) {
    facts.push(`(hecho (hogar HOGAR-0${casoActual}) (atributo alerta) (valor ${alertaRegla.toLowerCase()}) (regla ${alertaRegla}))`);
  }

  return {
    dictamen,
    dictamenRegla,
    tramo,
    tramoRegla,
    tramoLabel,
    depAtr,
    depRegla,
    depLabel,
    privScore,
    vulAtr,
    alerta,
    policyExpert,
    facts
  };
}

function actualizarInferencia() {
  const rGasto = parseFloat(document.getElementById('slider-gasto').value);
  const icvs = parseFloat(document.getElementById('slider-carencia').value);
  const td = parseFloat(document.getElementById('slider-dep').value);

  // Actualizar badges numéricos de inputs
  document.getElementById('badge-gasto-val').textContent = `${rGasto.toFixed(1)}%`;
  document.getElementById('badge-carencia-val').textContent = `${icvs.toFixed(1)} pts`;
  document.getElementById('badge-dep-val').textContent = td.toFixed(2);

  // 1. Ejecutar el motor difuso Mamdani
  const res = ejecutarInferencia(rGasto, icvs, td);

  // 2. Ejecutar el motor simbólico del Sistema Experto (CLIPS)
  const expRes = evaluarSistemaExperto(rGasto, icvs, td, casoSeleccionadoActual);

  // Dibujar gráficas vectoriales de inmediato
  dibujarMiniChart('svg-gasto', [0, 250], MF.gasto, rGasto, { Critico: '#ef4444', Vulnerable: '#f59e0b', Suficiente: '#10b981' });
  dibujarMiniChart('svg-carencia', [0, 9], MF.carencia, icvs, { Bajo: '#10b981', Moderado: '#f59e0b', Severo: '#ef4444' });
  dibujarMiniChart('svg-dep', [0, 3], MF.dep, td, { Baja: '#10b981', Media: '#f59e0b', Alta: '#ef4444' });
  dibujarChartSalida('svg-salida', res.U_SALIDA, res.muAgg, res.cogRaw);

  // Actualizar tags de membresía difusa
  actualizarTags('tags-gasto', res.muG);
  actualizarTags('tags-carencia', res.muC);
  actualizarTags('tags-dep', res.muD);

  // Actualizar métricas del hero banner / tarjeta dual difusa y del simulador
  const ivsValEl = document.getElementById('out-ivs-val');
  if (ivsValEl) ivsValEl.textContent = `${res.ivs.toFixed(1)}%`;
  const simIvsValEl = document.getElementById('sim-ivs-val');
  if (simIvsValEl) simIvsValEl.textContent = `${res.ivs.toFixed(1)}%`;

  const cogRawEl = document.getElementById('out-cog-raw');
  if (cogRawEl) cogRawEl.textContent = `${res.cogRaw.toFixed(1)}%`;
  const simCogRawEl = document.getElementById('sim-cog-raw');
  if (simCogRawEl) simCogRawEl.textContent = `${res.cogRaw.toFixed(1)}%`;
  
  const catBadge = document.getElementById('out-category-badge');
  if (catBadge) {
    catBadge.textContent = res.categoria;
    catBadge.className = `category-badge ${res.badgeClass}`;
  }
  const simCatBadge = document.getElementById('sim-category-badge');
  if (simCatBadge) {
    simCatBadge.textContent = res.categoria;
    simCatBadge.className = `category-badge ${res.badgeClass}`;
  }

  const policyEl = document.getElementById('out-policy-text');
  if (policyEl) policyEl.innerHTML = res.politica;
  const simPolicyEl = document.getElementById('sim-policy-text');
  if (simPolicyEl) simPolicyEl.innerHTML = res.politica;

  // Actualizar detalles difusos en la tarjeta dual
  const fuzzyGastoEl = document.getElementById('fuzzy-eval-gasto');
  if (fuzzyGastoEl) {
    const gKeys = Object.keys(res.muG).filter(k => res.muG[k] > 0.01).map(k => `${k}: ${res.muG[k].toFixed(2)}`).join(' | ');
    fuzzyGastoEl.textContent = gKeys || 'Fuera de rango';
  }

  const fuzzyCarenciaEl = document.getElementById('fuzzy-eval-carencia');
  if (fuzzyCarenciaEl) {
    const cKeys = Object.keys(res.muC).filter(k => res.muC[k] > 0.01).map(k => `${k}: ${res.muC[k].toFixed(2)}`).join(' | ');
    fuzzyCarenciaEl.textContent = cKeys || '0 carencias';
  }

  const fuzzyDepEl = document.getElementById('fuzzy-eval-dep');
  if (fuzzyDepEl) {
    const dKeys = Object.keys(res.muD).filter(k => res.muD[k] > 0.01).map(k => `${k}: ${res.muD[k].toFixed(2)}`).join(' | ');
    fuzzyDepEl.textContent = dKeys || 'Baja: 1.00';
  }

  const fuzzyRulesEl = document.getElementById('fuzzy-eval-rules');
  if (fuzzyRulesEl) {
    fuzzyRulesEl.textContent = `${res.activas.length} reglas activas (\u03B1 > 0)`;
  }

  // Actualizar detalles del Sistema Experto (CLIPS) en la tarjeta dual
  const compClipsEl = document.getElementById('comp-clips-val');
  if (compClipsEl) compClipsEl.textContent = `${expRes.dictamen}`;

  const expTramoEl = document.getElementById('exp-fact-tramo');
  if (expTramoEl) expTramoEl.textContent = expRes.tramoLabel;

  const expDepEl = document.getElementById('exp-fact-dep');
  if (expDepEl) expDepEl.textContent = expRes.depLabel;

  const expPrivEl = document.getElementById('exp-fact-priv');
  if (expPrivEl) expPrivEl.textContent = `${expRes.privScore} / 9 pts (Vuln: ${expRes.vulAtr.toUpperCase()})`;

  const expAlertaEl = document.getElementById('exp-fact-alerta');
  if (expAlertaEl) expAlertaEl.textContent = expRes.alerta;

  const expPolicyEl = document.getElementById('exp-policy-text');
  if (expPolicyEl) expPolicyEl.innerHTML = expRes.policyExpert;

  // Actualizar Working Memory Terminal en la vista dedicada view-experto
  const wmTerminal = document.getElementById('expert-wm-facts');
  if (wmTerminal) {
    wmTerminal.innerHTML = expRes.facts.map(f => `<div class="fact-line">&rarr; ${f}</div>`).join('');
  }

  // Comparativa difusa y barra de progreso continuo
  const compEl = document.getElementById('comp-fuzzy-val');
  if (compEl) compEl.textContent = `IVS (Centroide): ${res.ivs.toFixed(1)}% • ${res.categoria}`;
  const progressFill = document.getElementById('comp-ivs-progress-fill');
  if (progressFill) {
    progressFill.style.width = `${Math.min(100, Math.max(0, res.ivs)).toFixed(1)}%`;
  }
  const simProgressFill = document.getElementById('sim-ivs-progress-fill');
  if (simProgressFill) {
    simProgressFill.style.width = `${Math.min(100, Math.max(0, res.ivs)).toFixed(1)}%`;
  }

  // Actualizar pipeline visual del Sistema Experto
  actualizarPipelineExperto(expRes);

  // Actualizar tabla de reglas disparadas
  actualizarTablaReglas(res.activas);

  // Actualizar contadores y badges
  const navRulesPill = document.getElementById('nav-active-rules-pill');
  if (navRulesPill) navRulesPill.textContent = `${res.activas.length} Activas`;

  const rulesActivePill = document.getElementById('rules-active-count-pill');
  if (rulesActivePill) rulesActivePill.textContent = `${res.activas.length} activas`;

  const activeCountEl = document.getElementById('sidebar-active-rules-count');
  if (activeCountEl) activeCountEl.textContent = res.activas.length;
  const chipCountEl = document.getElementById('chip-activas-count');
  if (chipCountEl) chipCountEl.textContent = res.activas.length;

  renderizarReglasSidebar(res.activas);
  actualizarInformeAuditoria(res, expRes, rGasto, icvs, td);
}

function actualizarPipelineExperto(expRes) {
  const activas = new Set();
  if (expRes.tramoRegla) activas.add(expRes.tramoRegla);
  if (expRes.depRegla) activas.add(expRes.depRegla);
  if (expRes.vulRegla) activas.add(expRes.vulRegla);
  if (expRes.dictamenRegla) activas.add(expRes.dictamenRegla);
  if (expRes.alertaRegla) activas.add(expRes.alertaRegla);
  activas.add('R24');

  const chkLuz = document.getElementById('chk-luz');
  if (chkLuz && chkLuz.checked) activas.add('R12');
  const chkAgua = document.getElementById('chk-agua');
  if (chkAgua && chkAgua.checked) activas.add('R15');
  const chkSaneamiento = document.getElementById('chk-saneamiento');
  if (chkSaneamiento && chkSaneamiento.checked) activas.add('R16');
  const chkHac = document.getElementById('chk-hacinamiento');
  const chkPiso = document.getElementById('chk-piso');
  if (chkHac && chkHac.checked) {
    activas.add('R07');
    if (chkPiso && chkPiso.checked) activas.add('R09');
  } else {
    activas.add('R08');
  }
  const menores = parseInt(document.getElementById('calc-inp-menores')?.value || 0);
  if (menores > 0 && expRes.privScore >= 5) {
    activas.add('R19');
  }

  document.querySelectorAll('.rule-chip').forEach(chip => {
    const rId = chip.getAttribute('data-rule');
    if (activas.has(rId)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function actualizarTags(containerId, muObj) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tags = container.querySelectorAll('.mf-tag');
  tags.forEach((tagEl) => {
    const key = tagEl.getAttribute('data-tag');
    const val = muObj[key] || 0.0;
    tagEl.innerHTML = `${key}: <strong>${val.toFixed(2)}</strong>`;
    if (val > 0.05) {
      tagEl.classList.add('active');
    } else {
      tagEl.classList.remove('active');
    }
  });
}

function actualizarTablaReglas(activas) {
  const tbody = document.getElementById('rules-tbody');
  const countPill = document.getElementById('rules-count-pill');
  if (countPill) countPill.textContent = `${activas.length} Reglas Activas`;
  if (!tbody) return;

  tbody.innerHTML = '';

  activas.sort((a, b) => b.alpha - a.alpha);

  activas.forEach((r) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="rule-id">${r.id}</td>
      <td>IF (Gasto: <strong>${r.g}</strong> & ICVS: <strong>${r.c}</strong> & TD: <strong>${r.d}</strong>)</td>
      <td>THEN IVS: <strong>${r.out}</strong></td>
      <td class="rule-alpha">&alpha; = ${r.alpha.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function cargarCaso(num) {
  casoSeleccionadoActual = num;
  const caso = CASOS[num];
  if (!caso) return;

  // Actualizar estado activo en los botones de presets del hero y barra sticky
  document.querySelectorAll('.preset-card').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === num);
  });
  document.querySelectorAll('.sticky-case-pill').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === num);
  });

  // Ajustar valores de los sliders
  document.getElementById('slider-gasto').value = caso.gasto;
  document.getElementById('slider-carencia').value = caso.carencia;
  document.getElementById('slider-dep').value = caso.dep;

  // Sincronizar inputs de la calculadora monetaria
  if (caso.gastoSol && document.getElementById('calc-inp-gasto')) {
    document.getElementById('calc-inp-gasto').value = caso.gastoSol;
    document.getElementById('calc-inp-lpt').value = caso.lptSol;
    document.getElementById('calc-gasto-formula').innerHTML = 
      `Ratio: (S/ ${caso.gastoSol.toFixed(2)} &divide; S/ ${caso.lptSol.toFixed(2)}) &times; 100% = <strong>${caso.gasto.toFixed(1)}%</strong>`;
  }

  // Sincronizar inputs de la calculadora demográfica
  if (document.getElementById('calc-inp-menores')) {
    document.getElementById('calc-inp-menores').value = caso.menores;
    document.getElementById('calc-inp-mayores').value = caso.mayores;
    document.getElementById('calc-inp-activos').value = caso.activos;
    document.getElementById('calc-dep-formula').innerHTML = 
      `Cálculo: (${caso.menores} menores + ${caso.mayores} mayores) &divide; ${caso.activos} activos = <strong>${caso.dep.toFixed(2)} dependientes por activo</strong>`;
  }

  // Ajustar checkboxes si existen
  if (caso.checks) {
    document.getElementById('chk-piso').checked = caso.checks.piso || false;
    document.getElementById('chk-hacinamiento').checked = caso.checks.hacinamiento || false;
    document.getElementById('chk-luz').checked = caso.checks.luz || false;
    document.getElementById('chk-agua').checked = caso.checks.agua || false;
    document.getElementById('chk-saneamiento').checked = caso.checks.saneamiento || false;
    document.getElementById('chk-combustible').checked = caso.checks.combustible || false;
    document.getElementById('chk-internet').checked = caso.checks.internet || false;
  }

  // Dictamen S. Experto en el cuadro comparativo
  const clipsEl = document.getElementById('comp-clips-val');
  if (clipsEl) clipsEl.textContent = caso.clips;

  actualizarInferencia();
}

function calcularIcvsDesdeChecks() {
  let total = 0;
  if (document.getElementById('chk-piso').checked) total += 1.0;
  if (document.getElementById('chk-hacinamiento').checked) total += 1.0;
  if (document.getElementById('chk-luz').checked) total += 3.0;
  if (document.getElementById('chk-agua').checked) total += 1.0;
  if (document.getElementById('chk-saneamiento').checked) total += 1.0;
  if (document.getElementById('chk-combustible').checked) total += 1.0;
  if (document.getElementById('chk-internet').checked) total += 1.0;

  document.getElementById('slider-carencia').value = Math.min(9.0, total);
  actualizarInferencia();
}

// Calculadora Monetaria: Gasto pc / LPT
function calcularGastoDesdeSoles() {
  const g = parseFloat(document.getElementById('calc-inp-gasto').value) || 0;
  const lpt = parseFloat(document.getElementById('calc-inp-lpt').value) || 1;
  const ratio = (g / lpt) * 100;
  const ratioClamped = Math.max(0, Math.min(250, ratio));

  document.getElementById('slider-gasto').value = ratioClamped.toFixed(1);
  document.getElementById('calc-gasto-formula').innerHTML = 
    `Ratio: (S/ ${g.toFixed(2)} &divide; S/ ${lpt.toFixed(2)}) &times; 100% = <strong>${ratio.toFixed(1)}%</strong>`;
  actualizarInferencia();
}

// Calculadora Demográfica: (Menores + Mayores) / Activos
function calcularDesdePersonas() {
  const m15 = parseInt(document.getElementById('calc-inp-menores').value) || 0;
  const m60 = parseInt(document.getElementById('calc-inp-mayores').value) || 0;
  const act = Math.max(1, parseInt(document.getElementById('calc-inp-activos').value) || 1);
  
  const depRatio = (m15 + m60) / act;
  const depClamped = Math.max(0, Math.min(3.0, depRatio));

  document.getElementById('slider-dep').value = depClamped.toFixed(2);
  document.getElementById('calc-dep-formula').innerHTML = 
    `Cálculo: (${m15} menores + ${m60} mayores) &divide; ${act} activos = <strong>${depRatio.toFixed(2)} dependientes por activo</strong>`;
  actualizarInferencia();
}

// =============================================================================
// 6. NAVEGACIÓN Y DESPLAZAMIENTO SUAVE ENTRE SECCIONES DE LA LANDING PAGE
// =============================================================================

function navegarA(target) {
  const map = {
    'inicio': 'hero',
    'comparativa': 'comparativa',
    'experto': 'sistema-experto',
    'difuso': 'sistema-difuso',
    'herramientas': 'auditoria',
    'auditoria': 'auditoria'
  };

  const id = map[target] || target;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function inicializarNavegacionScroll() {
  const navLinks = document.querySelectorAll('.navbar-menu .nav-link');
  const sections = document.querySelectorAll('header.hero-section, section.landing-section');
  const stickyCasesBar = document.getElementById('sticky-cases-bar');

  window.addEventListener('scroll', () => {
    let currentId = 'hero';
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Controlar visibilidad de la barra flotante de los 4 casos
    if (stickyCasesBar) {
      if (scrollY > 380) {
        stickyCasesBar.classList.add('is-visible');
      } else {
        stickyCasesBar.classList.remove('is-visible');
      }
    }

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      if (link.getAttribute('data-target') === currentId || link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}


let sidebarFiltroCategoria = 'TODAS';
let sidebarUltimasActivas = [];

function filtrarChip(cat) {
  sidebarFiltroCategoria = cat;
  document.querySelectorAll('.filter-chips .chip').forEach((c) => c.classList.remove('active'));

  const btnMap = {
    'TODAS': 'chip-todas',
    'ACTIVAS': 'chip-activas',
    'Urgente': 'chip-urgente',
    'Alta': 'chip-alta',
    'Media': 'chip-media',
    'Baja': 'chip-baja'
  };
  const targetId = btnMap[cat];
  if (targetId && document.getElementById(targetId)) {
    document.getElementById(targetId).classList.add('active');
  }

  renderizarReglasSidebar(sidebarUltimasActivas);
}

function filtrarReglasSidebar() {
  renderizarReglasSidebar(sidebarUltimasActivas);
}

function renderizarReglasSidebar(activas) {
  sidebarUltimasActivas = activas || [];
  const listEl = document.getElementById('sidebar-rules-list');
  if (!listEl) return;

  const searchTxt = (document.getElementById('filter-rules-search')?.value || '').toLowerCase();
  const activeMap = {};
  sidebarUltimasActivas.forEach((a) => {
    activeMap[a.id] = a.alpha;
  });

  listEl.innerHTML = '';

  REGLAS.forEach((r) => {
    const isAct = (activeMap[r.id] !== undefined && activeMap[r.id] > 0.0001);
    const alpha = isAct ? activeMap[r.id] : 0.0;

    // Filtro por Chip
    if (sidebarFiltroCategoria === 'ACTIVAS' && !isAct) return;
    if (sidebarFiltroCategoria !== 'TODAS' && sidebarFiltroCategoria !== 'ACTIVAS' && r.out !== sidebarFiltroCategoria) return;

    // Filtro por texto de búsqueda
    const itemStr = `${r.id} ${r.g} ${r.c} ${r.d} ${r.out}`.toLowerCase();
    if (searchTxt && !itemStr.includes(searchTxt)) return;

    const div = document.createElement('div');
    div.className = `sidebar-rule-item ${isAct ? 'is-active' : ''}`;
    div.innerHTML = `
      <div class="s-rule-head">
        <span class="s-rule-id">${r.id}</span>
        <span class="s-rule-strength">${isAct ? `&alpha; = ${alpha.toFixed(3)} (ACTIVA)` : 'Inactiva (0.0)'}</span>
      </div>
      <div class="s-rule-ant">
        IF (Gasto: <strong>${r.g}</strong> &bull; ICVS: <strong>${r.c}</strong> &bull; TD: <strong>${r.d}</strong>)
      </div>
      <div class="s-rule-cons">
        &rarr; THEN Vulnerabilidad: <strong>${r.out}</strong>
      </div>
    `;
    listEl.appendChild(div);
  });
}

function actualizarInformeAuditoria(res, expRes, rGasto, icvs, td) {
  const preview = document.getElementById('audit-text-preview');
  if (!preview) return;

  const lines = [
    "====================================================================",
    " SISTEMAS INTELIGENTES: OBSERVATORIO SOCIOECONÓMICO ODS 1",
    " Informe Técnico de Inferencia Dual: Sistema Experto & Lógica Difusa",
    "====================================================================",
    `FECHA DE EMISIÓN : ${new Date().toLocaleString()}`,
    `HOGAR EVALUADO   : Caso 0${casoSeleccionadoActual} (Muestra ENAHO / SISFOH)`,
    "--------------------------------------------------------------------",
    "VARIABLES DE ENTRADA REGISTRADAS:",
    `  1. Ratio Cobertura Canasta (R_Gasto) : ${rGasto.toFixed(1)}%`,
    `  2. Carencias Vivienda/Servicios(ICVS): ${icvs.toFixed(1)} / 9 puntos`,
    `  3. Tasa de Dependencia Familiar (TD) : ${td.toFixed(2)} dep/activo`,
    "--------------------------------------------------------------------",
    "PARADIGMA 1: MOTOR DEL SISTEMA EXPERTO (REGLAS DE PRODUCCIÓN DETERMINISTAS)",
    `  DICTAMEN OFICIAL CSE                 : ${expRes ? expRes.dictamen : 'Pobreza Extrema'}`,
    `  TRAMO MONETARIO (Capa 1)             : ${expRes ? expRes.tramoLabel : 'Bajo LPE'}`,
    `  PUNTAJE PRIVACIONES (Capa 2)         : ${expRes ? expRes.privScore : 8} pts (Vuln: ${expRes ? expRes.vulAtr.toUpperCase() : 'ALTA'})`,
    `  ALERTA DE GESTIÓN (Capa 3)           : ${expRes ? expRes.alerta : 'R28'}`,
    `  POLÍTICA RÍGIDA ASIGNADA             : ${expRes ? expRes.policyExpert.replace(/<[^>]*>?/gm, '') : ''}`,
    "--------------------------------------------------------------------",
    "PARADIGMA 2: SISTEMA DE INFERENCIA DIFUSA (MAMDANI / LÓGICA CONTINUA)",
    `  ÍNDICE DE VULNERABILIDAD SOCIAL (IVS): ${res.ivs.toFixed(2)}% (Centroide COG)`,
    `  CATEGORÍA DE PRIORIZACIÓN            : ${res.categoria}`,
    `  REGLAS MAMDANI DISPARADAS            : ${res.activas.length} activas`,
    ...res.activas.map((a) => 
      `    [${a.id}] IF (Gasto:${a.g}, ICVS:${a.c}, TD:${a.d}) => THEN ${a.out.padEnd(8)} | alpha = ${a.alpha.toFixed(4)}`
    ),
    `  POLÍTICA GRADUAL ASIGNADA            : ${res.politica.replace(/<[^>]*>?/gm, '')}`,
    "====================================================================",
    "CONCLUSIÓN DEL OBSERVATORIO:",
    expRes && expRes.dictamen === "No Pobre" && res.ivs >= 50.0 
      ? "  [PARADOJA MULTIDIMENSIONAL / EFECTO ACANTILADO DETECTADO]:\n  El Sistema Experto excluye al hogar por superar por centavos la línea monetaria,\n  mientras que el Sistema Difuso detecta su vulnerabilidad estructural y le otorga protección social."
      : "  Ambos sistemas convergen de forma consistente en el diagnóstico del hogar.",
    "===================================================================="
  ];

  preview.textContent = lines.join("\n");
}

function copiarInforme() {
  const preview = document.getElementById('audit-text-preview');
  const statusEl = document.getElementById('audit-copy-status');
  if (!preview) return;

  navigator.clipboard.writeText(preview.textContent).then(() => {
    if (statusEl) {
      statusEl.textContent = "¡Copiado al portapapeles!";
      setTimeout(() => { statusEl.textContent = ""; }, 3000);
    }
  });
}

// Inicialización automática al cargar la página
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    cargarCaso(1);
    inicializarNavegacionScroll();
  });
}

