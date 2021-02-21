import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  rows: any[] = null;
  ticketsAbiertosRows: any[] = null;
  ticketsCerradosRows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";
  _rol: string = "";
  _idusuario: string = "";
  _TICKETSCERRADOS: number = 0;
  _TICKETSABIERTOS: number = 0;

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }


  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._idcliente = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.
    this._rol = localStorage.getItem("ROL"); // PARAMETRO GLOBAL.
    this._idusuario = localStorage.getItem("IDUSUARIO"); // PARAMETRO GLOBAL.

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

    this._servicios.wsGeneral("getTicketsList", { idcliente: this._idcliente, valor: this.valorBuscar, rol: this._rol, idusuario: this._idusuario })
      .subscribe(x => {
        this.rows = x;
        this.ticketsAbiertosRows = this.rows.filter(x => x.ESTATUS == "O" || x.ESTATUS == "A" || x.ESTATUS == "R");
        this.ticketsCerradosRows = this.rows.filter(x => x.ESTATUS == "C");

        x.forEach(element => {
          if (element.ESTATUS == "O" || element.ESTATUS == "A" || element.ESTATUS == "R")
            this._TICKETSABIERTOS++;
          if (element.ESTATUS == "C")
            this._TICKETSCERRADOS++;

          if (element.ESTATUS == "O")
            element.ESTATUS = "ABIERTO";
          if (element.ESTATUS == "A")
            element.ESTATUS = "ASIGNADO";
          if (element.ESTATUS == "C")
            element.ESTATUS = "CERRADO";
          if (element.ESTATUS == "R")
            element.ESTATUS = "RE-ABIERTO";

          if (element.IDPRIORIDAD == 1)
            element.NOMPRIORIDAD = "BAJA";
          if (element.IDPRIORIDAD == 2)
            element.NOMPRIORIDAD = "MEDIA";
          if (element.IDPRIORIDAD == 3)
            element.NOMPRIORIDAD = "ALTA";
          if (element.IDPRIORIDAD == 4)
            element.NOMPRIORIDAD = "URGENTE";
        });

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Tickets"));
  }

  editRow(ticket: any) {
    localStorage.setItem("_IDTICKET", ticket.IDTICKET);
    localStorage.setItem("_IDUSUARIO", this._idusuario);
    localStorage.setItem("_ESTATUS", ticket.ESTATUS);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/ticketflow']);
  }

  newRow() {
    localStorage.setItem("_IDTICKET", "0");
    localStorage.setItem("_IDUSUARIO", this._idusuario);
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/ticketdet']);
  }


}
