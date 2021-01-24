import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'helpDeskAPP';

  menuSiNo:boolean = true;
  IDUSUARIO: string = "MSALVARADO";

  classMenu: string = "";
  ROL: string = "";

  menuItems: any[] = [];
  menu: any[] = [
    { IDMENU: "sucursales", NOMBRE: "Sucursales", ICONO: "nav-icon fas fa-store", ROL: "A" },
    { IDMENU: "deptos", NOMBRE: "Departamentos", ICONO: "nav-icon fas fa-layer-group", ROL: "A" },
    { IDMENU: "usuarios", NOMBRE: "Usuarios", ICONO: "nav-icon fas fa-users", ROL: "A" },
    { IDMENU: "temas", NOMBRE: "Temas soporte", ICONO: "nav-icon fas fa-list-ol", ROL: "A" },
    { IDMENU: "reglas", NOMBRE: "SLA configuración", ICONO: "nav-icon fas fa-ruler", ROL: "A" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "A" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "A" },
  ];

  ngOnInit() {
    localStorage.clear();
    this.menuItems = this.menu.filter(x => x.ROL == "A");
  }
}
