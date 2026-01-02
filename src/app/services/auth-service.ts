import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest } from '../model/auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }


  login(credentials: LoginRequest):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, credentials)
  };
  

    register(username: string, password: string): Observable<any> {
    const url = 'http://localhost:8080/auth/register'; 
    return this.http.post(url, { username, password });
  }
}
