import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  rows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }


  ngOnInit(): void {

    this._servicios.validaSesion();

    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._idcliente = sessionStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.

    this._servicios.buscarMat$
      .subscribe(resp => {
        this.valorBuscar = resp;
        this.getRows();
      });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "AGREGAR")
          this.newRow();
      });

    this.getRows();
  }

  getRows() {

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    this._servicios.wsGeneral("getUsuariosList", { idcliente: this._idcliente, valor: this.valorBuscar, rol: "0" })
      .subscribe(x => {
        this.rows = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Usuarios"));
  }

  editRow(idusuario: string) {
    sessionStorage.setItem("_IDUSUARIO", idusuario);
    sessionStorage.setItem("_ACCION", "E");
    this._router.navigate(['/usuariodet']);
  }

  newRow() {
    sessionStorage.setItem("_IDUSUARIO", "0");
    sessionStorage.setItem("_ACCION", "N");
    this._router.navigate(['/usuariodet']);
  }

}
