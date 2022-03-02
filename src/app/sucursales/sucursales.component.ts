import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {
  rows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._idcliente = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.

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

    this._servicios.wsGeneral("getSucursalesList", { idcliente: this._idcliente, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucursal"));
  }

  editRow(idSucursal: string) {
    localStorage.setItem("_IDSUCURSAL", idSucursal);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/sucursaldet']);
  }

  newRow() {
    localStorage.setItem("_IDSUCURSAL", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/sucursaldet']);
  }

}
