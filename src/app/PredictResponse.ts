export interface PredictResponse {

  probability: number;
  title: string;
  risk: 'BAJO' | 'MEDIO' | 'ALTO';
  reco: string;
  color: string
}
