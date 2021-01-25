import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SucursaldetComponent } from './sucursaldet/sucursaldet.component';
import { SucursalesComponent } from './sucursales/sucursales.component';


const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "sucursales", component: SucursalesComponent},
  { path: "sucursaldet", component: SucursaldetComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
