import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxConfirmBoxModule, NgxConfirmBoxService } from 'ngx-confirm-box';

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
    SladetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: "increasing",
      
    }),
    NgxConfirmBoxModule
  ],
  providers: [NgxConfirmBoxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
