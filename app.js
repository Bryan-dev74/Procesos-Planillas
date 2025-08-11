(function(){
  let currentProcess = 'top20';

  // Guías disponibles
  const guides = {
    top20: [
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
        desc: "Sube los archivos de Excel a la carpeta 'Procesamiento' en Google Drive. Después de subir los archivos, borra la carpeta llamada 'Listo' que está en ese mismo Drive.",
        links: [{ label: "Carpeta de Procesamiento (Drive)", href: "https://drive.google.com/drive/folders/1y4mIhIpoTxMXZOsJ7IvTKFnNRZtwI_tG?usp=sharing" }]
      },
      {
        title: "Paso 8: Preparar la Hoja de Cálculo",
        desc: "En la hoja 'Procesar Top 20', limpia 'P1' y borra desde 'A2:B2' tambien los datos en la 'Historial'.",
        links: []
      },
      {
        title: "Paso 9: Ejecutar el Script",
        desc: "En la hoja, ve a 'Extensiones' > 'Apps Script' y presiona 'Ejecutar'.",
        links: []
      }
    ],
    online30m: [
      {
        title: "Paso 1: Instalar Python",
        desc: "Descarga e instala Python 3.x. Durante la instalación es 'IMPORTANTE' marcar la opción 'Add Python to PATH'.",
        links: [{ label: "Descargar Python", href: "https://www.python.org/downloads/" }],
        img: "online30m-paso1.png"
      },
      {
        title: "Paso 2: Descargar el Programa",
        desc: "Descarga y descomprime la carpeta 'Online' donde desees guardarla en tu computadora.",
        links: [{ label: "Descargar Online +30minutos", href: "download/Online 30minutos.rar" }],
        img: ["online30m-paso2.png", "online30m-paso2b.png"]
      },
      {
        title: "Paso 3: Instalación Simple (Recomendado)",
        desc: "Haz doble clic en el archivo 'instalar.bat'. Esto instalará las dependencias y creará un acceso directo llamado 'Recordatorio Online' en tu escritorio.",
        links: [],
        img: ["online30m-paso3.png", "online30m-paso3b.png"]
      },
      {
        title: "Paso 4: Ejecutar el Programa",
        desc: "Haz doble clic en el acceso directo creado. El programa mostrará un icono 🕒 en la bandeja del sistema (junto al reloj) y mostrará recordatorios cada 30 minutos. si ves este 'icono' significa que ya 'funciona' ",
        links: [],
        img: "online30m-paso4.png"
      },
      {
        title: "Paso 5: Verificar Funcionamiento",
        desc: "El programa muestra ventanas de recordatorio cada 30 minutos exactos (:00 y :30) y mantiene un registro de todas las notificaciones en el archivo 'online_log.txt'.",
        links: [],
        img: ["online30m-paso5.png", "online30m-paso5b.png"]
      }
    ]
  };

  // Animación de escritura
  window.addEventListener('DOMContentLoaded', function() {
    const typeText = document.getElementById('typeText');
    const fullText = 'Procesos Planilla';
    let typeIdx = 0;
    let typing = true;

    function typeWriter(){
      if(!typeText) return;
      if(typing){
        if(typeIdx <= fullText.length){
          typeText.textContent = fullText.slice(0, typeIdx);
          typeIdx++;
          setTimeout(typeWriter, 90);
        }else{
          typing = false;
          setTimeout(typeWriter, 1200);
        }
      }else{
        if(typeIdx > 0){
          typeIdx--;
          typeText.textContent = fullText.slice(0, typeIdx);
          setTimeout(typeWriter, 40);
        }else{
          typing = true;
          setTimeout(typeWriter, 600);
        }
      }
    }
    typeWriter();
    
    // Setup process switching
    const processList = document.getElementById('processList');
    processList.addEventListener('click', function(e) {
      const processItem = e.target.closest('[data-process]');
      if(!processItem || processItem.classList.contains('disabled')) return;
      
      // Update active state
      processList.querySelectorAll('[data-process]').forEach(item => item.classList.remove('active'));
      processItem.classList.add('active');
      
      // Switch process
      currentProcess = processItem.dataset.process;
      currentStep = -1;
      updateProcessTitle();
      updateUI();
    });
  });

  function updateProcessTitle() {
    const titles = {
      top20: 'Procesar archivos Top20',
      online30m: 'Instalar Online +30minutos'
    };
    document.getElementById('processTitle').textContent = titles[currentProcess] || '';
  }

  // DOM refs
  const stepTitle = document.getElementById('stepTitle');
  const stepDesc = document.getElementById('stepDesc');
  const stepLinks = document.getElementById('stepLinks');
  const stepVisual = document.getElementById('stepVisual');
  const stepImg = document.getElementById('stepImg');
  const stepAlert = document.getElementById('stepAlert');
  const stepIndexEl = document.getElementById('stepIndex');
  const stepTotalEl = document.getElementById('stepTotal');
  const progressBar = document.getElementById('progressBar');
  const prevStepBtn = document.getElementById('prevStep');
  const nextStepBtn = document.getElementById('nextStep');
  const startGuide = document.getElementById('startGuide');
  const stepper = document.getElementById('stepper');

  let currentStep = -1;

  // UI update
  function updateUI(){
    const steps = guides[currentProcess];
    if(!steps) return;
    
    stepTotalEl.textContent = steps.length;
    
    if(currentStep === -1) {
      stepper.hidden = true;
      document.querySelector('.intro-card').hidden = false;
      return;
    }

    stepper.hidden = false;
    document.querySelector('.intro-card').hidden = true;

    const step = steps[currentStep];
    stepTitle.textContent = step.title;
    stepDesc.innerHTML = step.desc.replace(/'([^']+)'/g, "<span class='hl'>$1</span>");
    
    // Links
    stepLinks.innerHTML = step.links.map(link => 
      `<li><a href="${link.href}" target="_blank">${link.label}</a></li>`
    ).join('');
    
    // Image(s)
    if(step.img) {
      if(Array.isArray(step.img)) {
        stepVisual.innerHTML = step.img.map(imgName => `<img src="assets/online30m/${imgName}" alt="Captura del paso" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 0 40px #000;margin-bottom:10px;">`).join("");
      } else {
        stepImg.src = `assets/online30m/${step.img}`;
        stepVisual.innerHTML = stepImg.outerHTML;
      }
      stepVisual.hidden = false;
    } else {
      stepVisual.hidden = true;
    }
    
    // Alert (only step 9 of top20)
    stepAlert.hidden = !(currentProcess === 'top20' && currentStep === 8);
    
    // Navigation state
    stepIndexEl.textContent = currentStep + 1;
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    prevStepBtn.disabled = currentStep === 0;
    nextStepBtn.disabled = currentStep === steps.length - 1;
    nextStepBtn.textContent = currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente';
  }

  // Navigation
  prevStepBtn.addEventListener('click', () => {
    if(currentStep > 0) {
      currentStep--;
      updateUI();
    }
  });

  nextStepBtn.addEventListener('click', () => {
    const steps = guides[currentProcess];
    if(currentStep < steps.length - 1) {
      currentStep++;
      updateUI();
    } else {
      currentStep = -1;
      updateUI();
    }
  });

  startGuide.addEventListener('click', () => {
    currentStep = 0;
    updateUI();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if(currentStep === -1) return;
    if(e.key === 'ArrowLeft') prevStepBtn.click();
    if(e.key === 'ArrowRight') nextStepBtn.click();
  });

  // Initialize UI
  updateUI();
})();
