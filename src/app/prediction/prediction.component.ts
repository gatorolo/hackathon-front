import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../services/prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {

sistemaActivo = false;
mensajeEstado = 'SISTEMA ACTIVADO PARA SIMULACIÓN';
mensajeTarjeta = 'RESULTADOS FINALES';
hayError: boolean = false;
public showLog: boolean = false;
public historialLog: any[] = [];

audioClick = new Audio('assets/music/power-on.mp3');

audioAmbiente = new Audio('assets/music/ambient-bg.mp3');
  musicaActiva: boolean = false;

sistemaEncendido = false; 
mensajeEnergia = 'SISTEMA EN ESPERA - REQUIERE ACTIVACIÓN';

encenderSistema() {
  this.sistemaEncendido = true;
  this.mensajeEstado = 'SISTEMA ACTIVADO PARA SIMULACIÓN';
  this.activarSistema(); 
}

constructor(private predictService: PredictionService) { 
 this.audioAmbiente.loop = true;
  this.audioAmbiente.volume = 0.3;
  this.audioAmbiente.load();
    const saved = localStorage.getItem('nexus_logs');
    if (saved) {
      this.historialLog = JSON.parse(saved);
}
}
  ngOnInit(): void {
    const guardados = localStorage.getItem('nexus_logs');
  if (guardados) {
    this.historialLog = JSON.parse(guardados);
  }
  }

 toggleMusica() {
    if (this.musicaActiva) {
      this.audioAmbiente.pause();
    } else {
      this.audioAmbiente.play().catch(error => {
        console.log("El navegador bloqueó el audio inicial:", error);
      });
    }
    this.musicaActiva = !this.musicaActiva;
  }

activarSistema() {
  if (this.sistemaEncendido) {
    this.sistemaActivo = true;
     this.mensajeEstado = 'SISTEMA ACTIVADO PARA SIMULACIÓN';
  }
}

iniciarSecuenciaArranque() {
  const pasos = [
    'INICIALIZANDO NÚCLEO...',
    'CARGANDO MÓDULOS DE RED...',
    'ESTABLECIENDO PROTOCOLO SEGURO...',
    'SISTEMA ACTIVADO PARA SIMULACIÓN'
  ];

  pasos.forEach((texto, i) => {
    setTimeout(() => {
      this.mensajeEstado = texto;
    }, i * 1500); 
  });
}

toggleSistema() {
  this.sistemaEncendido = !this.sistemaEncendido; 
  this.audioClick.volume = 0.5;
  this.audioClick.play();

  if (this.sistemaEncendido) {
    this.sistemaActivo = true;
    
    this.audioAmbiente.play()
      .then(() => this.musicaActiva = true)
      .catch(error => console.warn("Audio bloqueado:", error));

    this.iniciarSecuenciaArranque(); 

  } else {
    this.sistemaActivo = false;
    this.musicaActiva = false;
    this.audioAmbiente.pause();
    this.audioAmbiente.currentTime = 0; 
    
    this.mensajeEstado = 'SISTEMA EN ESPERA - REQUIERE ACTIVACIÓN';
    

    this.resultadoVisible = false; 
    this.analizando = false;
    this.hayError = false;
    this.cliente = { name: '', tenure: 0, monthly: 0, calls: 0 };
  }
}

  analizando = false;
  resultadoVisible = false;
  nombreCapturado: string = '';

  cliente = { name: '', tenure: 0, monthly: 0, calls: 0 };
  resultado = { title: '', reco: '', probability: 0, risk: '' , color: ''};

  ejecutarPrevision() {
  this.analizando = true;
  this.resultadoVisible = false;
  this.hayError = false;
  this.nombreCapturado = this.cliente.name;
  
  const nombrePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

  if (!this.cliente.name || this.cliente.tenure <= 0 || this.cliente.monthly <= 0) {
    this.hayError = true;
    this.analizando = false;
    this.mensajeEstado = 'ERROR: LOS CAMPOS SON OBLIGATORIOS';
    return;
  }

  if (!nombrePattern.test(this.cliente.name)) {
    this.hayError = true;
    this.analizando = false;
    this.mensajeEstado = 'ERROR: EL NOMBRE DEBE CONTENER LETRAS';
    return; 
  }

  this.mensajeEstado = 'PROCESANDO DATOS DE ' + this.nombreCapturado.toUpperCase();

  this.predictService.getPrediction(this.cliente).subscribe({
  next: (res: any) => {
      this.resultado = { ...res, color: this.resultado.color};
      this.finalizarSimulacion('SISTEMA OPERATIVO - ANÁLISIS COMPLETADO');
    },
    error: (err) => {
      
      console.warn("Fallo de servidor, usando motor local de emergencia", err);
      this.calcularLogica(); 
      this.finalizarSimulacion('ACTIVO - MODO DE EMERGENCIA LOCAL');

    }
  });
}


private finalizarSimulacion(mensaje: string) {
  setTimeout(() => {
    this.analizando = false;
    this.resultadoVisible = true;
    this.mensajeEstado = mensaje;
    this.mensajeTarjeta = 'ANÁLISIS COMPLETADO';
  }, 1500); 
}

 loading = false;
  showResult = false;
  result: any = null;

verLogs() {
  if (!this.nombreCapturado) return;

  // Creamos un objeto NUEVO con los valores actuales "congelados"
  const nuevoLog = {
    nombre: this.nombreCapturado,
    prob: (this.resultado.probability * 100).toFixed(1) + '%',
    riesgo: this.resultado.risk,
    colorClass: this.resultado.color // Esto asegura que cada fila tenga su propio color
  };

  // Agregamos al array creando una nueva referencia del array para Angular
  this.historialLog = [nuevoLog, ...this.historialLog];

  // Guardar en LocalStorage
  localStorage.setItem('nexus_logs', JSON.stringify(this.historialLog));

  this.resultadoVisible = true;
}
  borrarLogs() {
    this.historialLog = [];
    localStorage.removeItem('nexus_logs');
  }

 private calcularLogica() {
    let score = 0.15;

    if (this.cliente.calls > 4) score += 0.40;
    else if (this.cliente.calls > 2) score += 0.20;

    if (this.cliente.tenure < 6) score += 0.25;
    else if (this.cliente.tenure > 24) score -= 0.10;

    if (this.cliente.monthly > 80.0) score += 0.15;

    const prob = Math.max(0, Math.min(0.99, score));
    this.resultado.probability = prob;

    if (prob > 0.7) {
      this.resultado.title = "ALTA PROBABILIDAD DE DESERCIÓN";
      this.resultado.reco = "Patrones críticos detectados. Requiere intervención inmediata.";
      this.resultado.risk = "RIESGO: CRÍTICO";
      this.resultado.color = 'red';
    } else if (prob > 0.4) {
      this.resultado.title = "ESTADO DE INCERTIDUMBRE";
      this.resultado.reco = "Comportamiento inestable. Se sugiere contacto preventivo.";
      this.resultado.risk = "RIESGO: MEDIO";
      this.resultado.color = 'yellow'; 
    } else {
      this.resultado.title = "CLIENTE FIDELIZADO";
      this.resultado.reco = "Suscripción estable. Sin anomalías detectadas.";
      this.resultado.risk = "RIESGO: BAJO";
      this.resultado.color = 'green'; 
    }
}

  getRiskClass() {
    if (this.resultado.probability > 0.7) return 'risk-high';
    if (this.resultado.probability > 0.4) return 'risk-med';
    return 'risk-low';
  }

  getRiskIcon() {
    if (this.resultado.probability > 0.7) return '❌';
    if (this.resultado.probability > 0.4) return '⚠️';
    return '✅';
  }



}
