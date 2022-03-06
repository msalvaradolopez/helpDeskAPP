import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';

import { Param } from '../param';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  valorBuscar: string = "";
  _IDCLIENTE: string = "";
  _IDUSUARIO: string = "";

  INDICADORES: any = {
    TOTAL: 0,
    SINASIGNAR: 0,
    ATRASADOS: 0,
    REABIERTOS: 0
  };

  rows: any[] = null;
  filtrosSucursal: any[] = null;
  filtrosTema: any[] = null;
  ticketsRows: any[] = null;
  grupoSucRows: any[] = null;
  grupoTemasRows: any[] = null;
  filtroSucursales: any[] = null;
  filtroTemas: any[] = null;

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false, GUARDARNUEVO: false  });

    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.
    this._IDUSUARIO = localStorage.getItem("IDUSUARIO"); // PARAMETRO GLOBAL.

    this._servicios.wsGeneral("getFiltroSucursales", { idcliente: this._IDCLIENTE, valor: "0" })
      .subscribe(x => {
        this.filtroSucursales = x;
        this.filtroSucursales.forEach(item => {
          item.ROWSELECT = true;
        });

        this._servicios.wsGeneral("getFiltroTemas", { idcliente: this._IDCLIENTE, valor: "0" })
          .subscribe(x => {
            this.filtroTemas = x;
            this.filtroTemas.forEach(item => {
              item.ROWSELECT = true;
            });
            this.getRows();
          }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Filtros Temas"));
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Filtros Sucursales"));
  }

  getRows() {
    let _param: Param = {
      idcliente: this._IDCLIENTE,
      valor: "0",
      sucursales: [],
      temas: []
    };

    this.filtroSucursales.forEach(x => {
      if(x.ROWSELECT) 
        _param.sucursales.push(x.IDSUCURSAL);
    });

    this.filtroTemas.forEach(x => {
      if(x.ROWSELECT) 
        _param.temas.push(x.IDTIPO);
    });

    this._servicios.wsGeneral("getDashBoardIndicadores", _param)
      .subscribe(x => {
        this.INDICADORES = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "IndicadorByboxes"));

    this._servicios.wsGeneral("getTicketsDashBoard", _param)
      .subscribe(x => {
        this.ticketsRows = x;
        this.ticketsRows.forEach(x => {
          if (x.ESTATUS == "O")
            x.ESTATUS = "ABIERTO";
          if (x.ESTATUS == "A")
            x.ESTATUS = "ASIGNADO";
          if (x.ESTATUS == "C")
            x.ESTATUS = "CERRADO";
          if (x.ESTATUS == "R")
            x.ESTATUS = "RE-ABIERTO";
        });
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Tickes tabla"));

      // getGrupoSucursales
    this._servicios.wsGeneral("ticketsBySucTemaList", _param)
      .subscribe(x => {
        this.grupoSucRows = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "IndicadorByGrupoSuc"));

    this._servicios.wsGeneral("ticketsByTemaSucList", _param)
      .subscribe(x => {
        this.grupoTemasRows = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "IndicadorByGrupoTemas"));

  }

  editRow(ticket: any) {
    localStorage.setItem("_IDTICKET", ticket.IDTICKET);
    localStorage.setItem("_IDUSUARIO", this._IDUSUARIO);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/ticketflow']);
  }

}