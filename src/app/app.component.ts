import { Component } from '@angular/core';
import { PredictResponse } from './PredictResponse';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  customer = {
    nombre: 'Juan Pérez',
    tenure: 12,
    monthly: 70,
    calls: 1
  };

  loading = false;
  showResult = false;
  result: PredictResponse | null = null;

  simularPrediccion() {
    this.loading = true;
    this.showResult = false;

    setTimeout(() => {
      const prob = this.calcularLogicaLocal();
      this.result = this.procesarResultado(prob);
      
      this.loading = false;
      this.showResult = true;
    }, 800);
  }

  private calcularLogicaLocal(): number {
    let score = 0.15;
    if (this.customer.calls > 4) score += 0.4;
    else if (this.customer.calls > 2) score += 0.2;

    if (this.customer.tenure < 6) score += 0.25;
    else if (this.customer.tenure > 24) score -= 0.1;

    if (this.customer.monthly > 80.0) score += 0.15;

    return Math.max(0, Math.min(0.99, score));
  }

  private procesarResultado(prob: number): PredictResponse {
    if (prob > 0.7) {
      return {
        probability: prob,
        title: 'Va a cancelar',
        reco: 'Riesgo crítico detectado.',
        risk: 'ALTO',
        color: 'red'
      };
    } else if (prob > 0.4) {
      return {
        probability: prob,
        title: 'En duda',
        reco: 'Riesgo moderado detectado.',
        risk: 'MEDIO',
        color: 'yellow'
      };
    } else {
      return {
        probability: prob,
        title: 'Cliente Estable',
        reco: 'El cliente está satisfecho con el servicio actual.',
        risk: 'BAJO',
        color: 'green'
      };
    }
  }
}
