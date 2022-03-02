import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuSiNo:boolean = false;
  IDUSUARIO: string = "";

  classMenu: string = "";
  ROL: string = "";

  menuItems: any[] = [];
  menu: any[] = [
    { IDMENU: "dashboard", NOMBRE: "Dashboard", ICONO: "nav-icon fas fa-chart-line", ROL: "A" },
    { IDMENU: "consultas", NOMBRE: "Consultas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "A" },
    { IDMENU: "params", NOMBRE: "Parametros", ICONO: "nav-icon fas fa-cog", ROL: "A" },
    { IDMENU: "sucursales", NOMBRE: "Sucursales", ICONO: "nav-icon fas fa-store", ROL: "A" },
    { IDMENU: "deptos", NOMBRE: "Departamentos", ICONO: "nav-icon fas fa-layer-group", ROL: "A" },
    { IDMENU: "usuarios", NOMBRE: "Usuarios", ICONO: "nav-icon fas fa-users", ROL: "A" },
    { IDMENU: "temas", NOMBRE: "Temas ayuda", ICONO: "nav-icon fas fa-list-ol", ROL: "A" },
    { IDMENU: "subtemas", NOMBRE: "Sub temas ayuda", ICONO: "nav-icon fas fa-list-ol", ROL: "A" },
    { IDMENU: "slas", NOMBRE: "SLA configuración", ICONO: "nav-icon fas fa-ruler", ROL: "A" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "A" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "A" },
    { IDMENU: "dashboard", NOMBRE: "Dashboard", ICONO: "nav-icon fas fa-chart-line", ROL: "S" },
    { IDMENU: "consultas", NOMBRE: "Consultas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "S" },
    { IDMENU: "slas", NOMBRE: "SLA configuración", ICONO: "nav-icon fas fa-ruler", ROL: "S" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "S" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "S" },
    { IDMENU: "tickets", NOMBRE: "Tickets", ICONO: "nav-icon fas fa-clipboard-list", ROL: "U" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "U" }
  ];

  constructor(private _servicios: ServiciosService, private _router: Router) { }

  ngOnInit() {
    // localStorage.clear();

      let _menuSiNo = localStorage.getItem("menuSiNo");
      let _classMenu = localStorage.getItem("classMenu");
      let _menuItems = JSON.parse(localStorage.getItem("menuItems"));

      if (_menuSiNo)
        this.menuSiNo = (_menuSiNo == "true");

      if (_classMenu)
        this.classMenu = _classMenu;    

      if (_menuItems)
        this.menuItems = _menuItems;

    this._servicios.activarmenu$
      .subscribe(accion => {
        this.menuSiNo = accion;
        localStorage.setItem("menuSiNo", String(this.menuSiNo));
        if (accion) {
          this.ROL = localStorage.getItem("ROL");
          this.menuItems = this.menu.filter(x => x.ROL == this.ROL);
          localStorage.setItem("menuItems", JSON.stringify(this.menuItems));
          if (this.ROL == "A" || this.ROL == "S")
            this._router.navigate(['/dashboard']);

          if (this.ROL == "U")
            this._router.navigate(['/tickets']);

          this.classMenu = "content-wrapper";
          localStorage.setItem("classMenu", String(this.classMenu));
        } else {
          this.classMenu = "wrapper";
          localStorage.setItem("classMenu", String(this.classMenu));
        }
          

        this.IDUSUARIO = localStorage.getItem("IDUSUARIO");
      });

      console.log(this.menuSiNo);
      console.log(this.classMenu);

  }

}
