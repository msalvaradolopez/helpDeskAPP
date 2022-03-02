import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subtemas',
  templateUrl: './subtemas.component.html',
  styleUrls: ['./subtemas.component.css']
})
export class SubtemasComponent implements OnInit {
  rows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";
  TEMASLIST: any[];
  idTemaAyuda: string = "null";

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._idcliente = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.
    this.idTemaAyuda = localStorage.getItem("_IDTIPO"); // VARIABLE PARAMETRO.

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

    this._servicios.wsGeneral("getTiposList", { idcliente: this._idcliente, valor: "0" })
      .subscribe(x => {
        this.TEMASLIST = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Temas de ayuda"));

    this.getRows();
  }

  getRows() {

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

      this._servicios.wsGeneral("getSubTemasList", { idcliente: this._idcliente, valor: this.valorBuscar, idTema: this.idTemaAyuda })
      .subscribe(x => {
        this.rows = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sub temas de ayuda"));
  }

  editRow(idtipodet: string) {
    localStorage.setItem("_IDTIPO", this.idTemaAyuda);
    localStorage.setItem("_IDTIPODET", idtipodet);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/subtemadet']);
  }

  newRow() {
    localStorage.setItem("_IDTIPODET", "0");
    localStorage.setItem("_IDTIPO", this.idTemaAyuda);
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/subtemadet']);
  }

  cambioTemaAyuda(idTemaAyuda: string) {
    this.idTemaAyuda = idTemaAyuda;
    this.rows = null;
    this.getRows();
  }
}