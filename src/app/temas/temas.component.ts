import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css']
})
export class TemasComponent implements OnInit {
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

    this._servicios.wsGeneral("getTiposList", { idcliente: this._idcliente, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Temas"));
  }

  editRow(idtipo: string) {
    localStorage.setItem("_IDTIPO", idtipo);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/temadet']);
  }

  newRow() {
    localStorage.setItem("_IDTIPO", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/temadet']);
  }
}
