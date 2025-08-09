(function(){
  // --- DATA (puedes editar textos; usa 'comillas' para resaltar trozos) ---
  const steps = [
    {
      title: "Paso 1: Instalar WinRAR",
      desc: "Ve a la página oficial de descargas, instala y abre 'WinRAR' para confirmar que quedó instalado.",
      links: [{ label: "Descargar WinRAR", href: "https://winrar.es/descargas" }]
    },
    {
      title: "Paso 2: Descargar los Archivos de Atendentes",
      desc: "Descarga los archivos de cada atendente y guárdalos en 'Descargas' sin renombrar.",
      links: []
    },
    {
      title: "Paso 3: Crear una Carpeta Nueva",
      desc: "En 'Descargas', crea una nueva carpeta llamada 'Top20'.",
      links: []
    },
    {
      title: "Paso 4: Mover los Archivos",
      desc: "Mueve todos los '.zip' descargados dentro de la carpeta 'Top20'.",
      links: []
    },
    {
      title: "Paso 5: Extraer los Archivos",
      desc: "Dentro de 'Top20', selecciona los '.zip' > clic derecho > 'WinRAR' > 'Extraer aquí'.",
      links: []
    },
    {
      title: "Paso 6: Resultado de la Extracción",
      desc: "La carpeta 'Top20' tendrá los '.zip' originales y los archivos de Excel extraídos.",
      links: []
    },
    {
      title: "Paso 7: Subir a Google Drive",
    desc: "Sube los archivos de Excel a la carpeta 'Procesamiento' en Google Drive. Después de subir los archivos, borra la carpeta llamada 'Listo' que está en ese mismo Drive (puedes verla en la captura de pantalla de este paso).",
      links: [{ label: "Carpeta de Procesamiento (Drive)", href: "https://drive.google.com/drive/folders/1y4mIhIpoTxMXZOsJ7IvTKFnNRZtwI_tG?usp=sharing" }]
    },
    {
      title: "Paso 8: Preparar la Hoja de Cálculo",
    desc: "En la hoja 'Procesar Top 20', limpia 'P1' y borra desde 'A2:B2' en 'Historial'.",
      links: []
    },
    {
      title: "Paso 9: Ejecutar el Script",
      desc: "En la hoja, ve a 'Extensiones' > 'Apps Script' y presiona 'Ejecutar'.",
      links: []
    }
  ];

  // --- DOM refs ---
  const stepTitle   = document.getElementById('stepTitle');
  const stepDesc    = document.getElementById('stepDesc');
  const stepLinks   = document.getElementById('stepLinks');
  const stepVisual  = document.getElementById('stepVisual');
  const stepImg     = document.getElementById('stepImg');
  const stepAlert   = document.getElementById('stepAlert');
  const stepIndexEl = document.getElementById('stepIndex');
  const stepTotalEl = document.getElementById('stepTotal');
  const progressBar = document.getElementById('progressBar');
  const prevStepBtn = document.getElementById('prevStep');
  const nextStepBtn = document.getElementById('nextStep');
  const startGuide  = document.getElementById('startGuide');

  stepTotalEl.textContent = steps.length;

  // --- Helpers ---
  function applyHighlight(text){
    // Solo resalta contenido entre 'comillas' cambiando el color con animación
    return text.replace(/'([^']+)'/g, "<span class='hl'>$1</span>");
  }

  function setStepImage(stepIndex){
    const imgPath = `./assets/top20/top20-paso${stepIndex+1}.png`;
    stepImg.onload = () => { stepVisual.hidden = false; };
    stepImg.onerror = () => { stepVisual.hidden = true; stepImg.removeAttribute('src'); };
    stepImg.src = imgPath;
  }

  // --- State ---
  let idx = 0;

  function renderStep(i){
    const s = steps[i];
    stepTitle.textContent = s.title;
    stepDesc.innerHTML = applyHighlight(s.desc);

    // Links
    stepLinks.innerHTML = '';
    (s.links || []).forEach(l=>{
      const a = document.createElement('a');
      a.href = l.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = l.label;
      const li = document.createElement('li'); li.appendChild(a);
      stepLinks.appendChild(li);
    });

    // Imagen del paso (si existe)
    setStepImage(i);

    // Alerta solo en paso 9 (i = 8)
    stepAlert.hidden = (i !== 8);

    // Progreso
    stepIndexEl.textContent = i+1;
    progressBar.style.width = `${Math.round(((i+1)/steps.length)*100)}%`;

    // Botones
    prevStepBtn.disabled = (i === 0);
    nextStepBtn.textContent = (i === steps.length-1) ? 'Finalizar' : 'Siguiente';
  }

  function go(i){
    idx = Math.max(0, Math.min(steps.length-1, i));
    renderStep(idx);
  }

  function next(){
    if(idx < steps.length-1) go(idx+1);
    else {
      nextStepBtn.blur();
      stepTitle.textContent = '¡Proceso completado!';
      stepDesc.innerHTML = "Has terminado todos los pasos. Si necesitas volver, usa las flechas.";
      stepLinks.innerHTML = '';
      stepVisual.hidden = true;
      stepAlert.hidden = true;
      progressBar.style.width = '100%';
    }
  }

  function prev(){ go(idx-1); }

  // --- Events ---
  startGuide.addEventListener('click', ()=> go(0));
  prevStepBtn.addEventListener('click', prev);
  nextStepBtn.addEventListener('click', next);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft')  prev();
  });

  // Init
  go(0);
})();
