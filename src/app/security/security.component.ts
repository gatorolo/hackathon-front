import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth-service';
import { AuthResponse, LoginRequest } from '../model/auth-models';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  isRegister = false;
  authForm! : FormGroup;
  loginForm!: FormGroup;
  showPassword = false;
  showDisclaimer = false;

  isMusicPlaying: boolean = false;
  private ambientMusic = new Audio('assets/music/ambient-bg.mp3'); 
  isLoading: boolean = true;

  constructor(private fb: FormBuilder,private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['admin', [Validators.required]]
    });

    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.ambientMusic.loop = true;
    this.ambientMusic.volume = 0.2; 
    this.preloadBackground('assets/tu-fondo-pesado.jpg');
  }

    togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

 toggleDisclaimer(): void {
    this.showDisclaimer = !this.showDisclaimer;

}
  preloadBackground(url: string) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    };
    img.onerror = () => {
      this.isLoading = false; 
    };
  }

login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();

    Swal.fire({
      title: 'Campos Incompletos',
      text: 'Por favor, ingresa tu usuario y contraseña para acceder al sistema.',
      icon: 'warning',
      background: '#E3E0D1',
      confirmButtonColor: '#EAB308',
      confirmButtonText: 'Entendido'
    });
    
    return;
  }

  const loginData: LoginRequest = {
    username: this.loginForm.value.username.trim(),
    password: this.loginForm.value.password.trim()
  };

  this.authService.login(loginData).subscribe({
    next: (response: AuthResponse) => {
       console.log("¡Acceso Total concedido por el Back-end!");
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      this.router.navigate(['/prediction']);
    },
    error: (err) => {
      this.mostrarAlertaError();
    }
    
  });
}

onSubmit() {
  if (this.authForm.invalid) return;
  const { username, password } = this.authForm.value;

  if (this.isRegister) {
    this.authService.register(username, password).subscribe({
      next: () => {
        Swal.fire({
          title: 'ACCESO CREADO',
          text: `Bienvenido al sistema, ${username}.`,
          icon: 'success',
          background: '#0f172a',
          color: '#22d3ee',  
          confirmButtonColor: '#0891b2',
          timer: 3000
        });
        this.isRegister = false;
      },
      error: (err) => {
        Swal.fire({
          title: 'ERROR DE SISTEMA',
          text: 'No se pudo sincronizar con la base de datos.',
          icon: 'error',
          background: '#1e293b'
        });
      }
    });
  }
}
  
  mostrarAlertaError() {
  Swal.fire({
    title: '¿El password es correcto?',
    text: 'Revisá también si el usuario es correcto',
    icon: 'error',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#dc2626', 
    background: '#fff',
    color: '#1f2937'
  });
}
}