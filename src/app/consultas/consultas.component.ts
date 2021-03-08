import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';

import { Param } from '../param';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  valorBuscar: string = "";
  _IDCLIENTE: string = "";
  _IDUSUARIO: string = "";


  porcBySuc: any[] = null;
  porcByTema: any[] = null;
  filtrosSucursal: any[] = null;
  filtrosTema: any[] = null;
  filtroSucursales: any[] = null;
  filtroTemas: any[] = null;
  ticketsRows: any[] = null;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });

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
      if (x.ROWSELECT)
        _param.sucursales.push(x.IDSUCURSAL);
    });

    this.filtroTemas.forEach(x => {
      if (x.ROWSELECT)
        _param.temas.push(x.IDTIPO);
    });

    this._servicios.wsGeneral("porcBySuc", _param)
      .subscribe(x => {
        this.porcBySuc = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "porcBySuc"));

    this._servicios.wsGeneral("porcByTema", _param)
      .subscribe(x => {
        this.porcByTema = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "porcByTema"));

    this._servicios.wsGeneral("getTicketsByDashBoard", _param)
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
  }

  editRow(ticket: any) {
    localStorage.setItem("_IDTICKET", ticket.IDTICKET);
    localStorage.setItem("_IDUSUARIO", this._IDUSUARIO);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/ticketflow']);
  }
}
