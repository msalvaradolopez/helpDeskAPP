import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from './servicios.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'helpDeskAPP';

  menuSiNo:boolean = false;
  IDUSUARIO: string = "MSALVARADO";

  classMenu: string = "";
  ROL: string = "";

  menuItems: any[] = [];
  menu: any[] = [
    { IDMENU: "dashboard", NOMBRE: "Dashboard", ICONO: "nav-icon fas fa-chart-line", ROL: "A" },
    { IDMENU: "params", NOMBRE: "Parametros", ICONO: "nav-icon fas fa-cog", ROL: "A" },
    { IDMENU: "sucursales", NOMBRE: "Sucursales", ICONO: "nav-icon fas fa-store", ROL: "A" },
    { IDMENU: "deptos", NOMBRE: "Departamentos", ICONO: "nav-icon fas fa-layer-group", ROL: "A" },
    { IDMENU: "usuarios", NOMBRE: "Usuarios", ICONO: "nav-icon fas fa-users", ROL: "A" },
    { IDMENU: "temas", NOMBRE: "Temas soporte", ICONO: "nav-icon fas fa-list-ol", ROL: "A" },
    { IDMENU: "slas", NOMBRE: "SLA configuración", ICONO: "nav-icon fas fa-ruler", ROL: "A" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "A" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "A" },
    { IDMENU: "dashboard", NOMBRE: "Dashboard", ICONO: "nav-icon fas fa-chart-line", ROL: "S" },
    { IDMENU: "slas", NOMBRE: "SLA configuración", ICONO: "nav-icon fas fa-ruler", ROL: "S" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "S" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "S" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "U" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "U" }
  ];

  constructor(private _servicios: ServiciosService, private _router: Router) { }

  ngOnInit() {
    localStorage.clear();

    this._servicios.activarmenu$
      .subscribe(accion => {
        this.menuSiNo = accion;
        if (accion) {
          this.ROL = localStorage.getItem("ROL");
          this.menuItems = this.menu.filter(x => x.ROL == this.ROL);
          if (this.ROL == "A" || this.ROL == "S")
            this._router.navigate(['/dashboard']);

          if (this.ROL == "U")
            this._router.navigate(['/tickets']);

          this.classMenu = "content-wrapper";
        } else
          this.classMenu = "wrapper";

        this.IDUSUARIO = localStorage.getItem("IDUSUARIO");
      });

  }
}
