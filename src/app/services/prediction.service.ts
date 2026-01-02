import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PredictRequest } from '../PredictRequest';
import { PredictResponse } from '../PredictResponse';


@Injectable({
  providedIn: 'root'
})
export class PredictionService {


  private api = 'http://localhost:8080/predict';

  constructor(private http : HttpClient) { }

  getPrediction(data: PredictRequest): Observable<PredictResponse> {
    return this.http.post<PredictResponse>(this.api, data);
  }
}
