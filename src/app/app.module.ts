import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxConfirmBoxModule, NgxConfirmBoxService } from 'ngx-confirm-box';
import { NgxSummernoteModule } from 'ngx-summernote';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { SucursaldetComponent } from './sucursaldet/sucursaldet.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DeptosComponent } from './deptos/deptos.component';
import { DeptodetComponent } from './deptodet/deptodet.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariodetComponent } from './usuariodet/usuariodet.component';
import { TemasComponent } from './temas/temas.component';
import { TemadetComponent } from './temadet/temadet.component';
import { SlasComponent } from './slas/slas.component';
import { SladetComponent } from './sladet/sladet.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketdetComponent } from './ticketdet/ticketdet.component';
import { TicketflowComponent } from './ticketflow/ticketflow.component';
import { TicketflowdetComponent } from './ticketflowdet/ticketflowdet.component';
import { ParamsComponent } from './params/params.component';
import { ParamdetComponent } from './paramdet/paramdet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { SubtemasComponent } from './subtemas/subtemas.component';
import { SubtemadetComponent } from './subtemadet/subtemadet.component';
import { MenuComponent } from './menu/menu.component';
import { SucursalesmasterComponent } from './sucursalesmaster/sucursalesmaster.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SucursalesComponent,
    SucursaldetComponent,
    NavbarComponent,
    DeptosComponent,
    DeptodetComponent,
    UsuariosComponent,
    UsuariodetComponent,
    TemasComponent,
    TemadetComponent,
    SlasComponent,
    SladetComponent,
    TicketsComponent,
    TicketdetComponent,
    TicketflowComponent,
    TicketflowdetComponent,
    ParamsComponent,
    ParamdetComponent,
    DashboardComponent,
    ConsultasComponent,
    SubtemasComponent,
    SubtemadetComponent,
    MenuComponent,
    SucursalesmasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: "increasing",
      
    }),
    NgxConfirmBoxModule,
    NgxSummernoteModule
  ],
  providers: [NgxConfirmBoxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
