import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security/security.component';
import { PredictionComponent } from './prediction/prediction.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Si entras a / te manda a login
  { path: 'login', component: SecurityComponent },
  { path: 'prediction', component: PredictionComponent },
 
  { path: '**', redirectTo: 'login' } // Cualquier ruta rara vuelve al login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }