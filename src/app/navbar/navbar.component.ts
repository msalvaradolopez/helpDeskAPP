import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // LINEAS DE PRUEBAS
  navbarBuscar: boolean = false;
  menuSiNo: boolean = true;
  buscarForm: FormGroup;
  // LINEAS DE PRUEBAS

  // NAVBAR - ACCIONES Y TITULO
  navbarAcciones: any = {
    TITULO: "",
    AGREGAR: false,
    BORRAR: false,
    GUARDAR: false,
    BUSCAR: false
  };

  constructor(private _servicios: ServiciosService) { }

  ngOnInit(): void {
    this._servicios.activarmenu$.subscribe(resp => this.menuSiNo = resp);

    this._servicios.navbarAciones$
      .subscribe(resp => {
        this.navbarAcciones.AGREGAR = resp.AGREGAR;
        this.navbarAcciones.EDITAR = resp.EDITAR;
        this.navbarAcciones.BORRAR = resp.BORRAR;
        this.navbarAcciones.GUARDAR = resp.GUARDAR;
        this.navbarAcciones.TITULO = resp.TITULO;
        this.navbarAcciones.BUSCAR = resp.BUSCAR;
      });

    this.buscarForm = new FormGroup({
      valorBuscar: new FormControl('')
    });

    this.buscarForm.get("valorBuscar").valueChanges.subscribe(data => this._servicios.buscarMat(data));
  }

  accionIcono(accion: string) {
    this._servicios.navbarRespIcono(accion);
  }

}
