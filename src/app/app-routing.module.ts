import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultasComponent } from './consultas/consultas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeptodetComponent } from './deptodet/deptodet.component';
import { DeptosComponent } from './deptos/deptos.component';
import { LoginComponent } from './login/login.component';
import { ParamdetComponent } from './paramdet/paramdet.component';
import { ParamsComponent } from './params/params.component';
import { SladetComponent } from './sladet/sladet.component';
import { SlasComponent } from './slas/slas.component';
import { SubtemadetComponent } from './subtemadet/subtemadet.component';
import { SubtemasComponent } from './subtemas/subtemas.component';
import { SucursaldetComponent } from './sucursaldet/sucursaldet.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { TemadetComponent } from './temadet/temadet.component';
import { TemasComponent } from './temas/temas.component';
import { TicketdetComponent } from './ticketdet/ticketdet.component';
import { TicketflowComponent } from './ticketflow/ticketflow.component';
import { TicketflowdetComponent } from './ticketflowdet/ticketflowdet.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UsuariodetComponent } from './usuariodet/usuariodet.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "sucursales", component: SucursalesComponent },
  { path: "sucursaldet", component: SucursaldetComponent },
  { path: "deptos", component: DeptosComponent },
  { path: "deptodet", component: DeptodetComponent },
  { path: "usuarios", component: UsuariosComponent },
  { path: "usuariodet", component: UsuariodetComponent },
  { path: "temas", component: TemasComponent },
  { path: "temadet", component: TemadetComponent },
  { path: "slas", component: SlasComponent },
  { path: "sladet", component: SladetComponent },
  { path: "tickets", component: TicketsComponent },
  { path: "ticketdet", component: TicketdetComponent },
  {
    path: "ticketflow", component: TicketflowComponent, children: [
      { path: 'ticketflowdet', component: TicketflowdetComponent }
    ]
  },
  { path: "params", component: ParamsComponent },
  { path: "paramdet", component: ParamdetComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "consultas", component: ConsultasComponent },
  { path: "subtemas", component: SubtemasComponent },
  { path: "subtemadet", component: SubtemadetComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
