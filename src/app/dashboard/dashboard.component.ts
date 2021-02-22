import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  valorBuscar: string = "";
  _IDCLIENTE: string = "";

  INDICADORES:any = {
    TOTAL: 0,
    SINASIGNAR: 0,
    ATRASADOS: 0,
    REABIERTOS:0
  };

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.

    this.getRows();
  }

  getRows() {

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    this._servicios.wsGeneral("getDashBoardIndicadores", { idcliente: this._IDCLIENTE, valor: this.valorBuscar })
      .subscribe(x => {
        this.INDICADORES = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "DashBoard"));
  }


}
