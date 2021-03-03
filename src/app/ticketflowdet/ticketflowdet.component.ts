import { Component, OnInit  } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';
import { DomSanitizer } from "@angular/platform-browser";


declare const moment: any;
declare var $:any;

@Component({
  selector: 'app-ticketflowdet',
  templateUrl: './ticketflowdet.component.html',
  styleUrls: ['./ticketflowdet.component.css']
})

export class TicketflowdetComponent implements OnInit {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  hdTICKETDET: any = {
    IDTICKETDET: null,
    IDTICKET: "",
    IDLCIENTE: 0,
    IDUSUARIO: "",
    DESCTICKETDET: "",
    FECHA: new Date()
  };

  _TITULO: string = "TICKET NOTA."
  _IDCLIENTE: string = "";
  _IDTICKET: string = "";
  _IDUSUARIO: string = "";
  _ACCION: string = "N"
  _ESTATUS: string = "O";
  NOTAS: any[] = null;

  subscription: Subscription;

  fechaActual: Date = new Date();

  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService,
    private sanitizer: DomSanitizer) { }


  ngOnInit(): void {

    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDTICKET = localStorage.getItem("_IDTICKET"); // VARIABLE PARAMETRO.
    this._IDUSUARIO = localStorage.getItem("_IDUSUARIO"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");
    this._ESTATUS = localStorage.getItem("_ESTATUS");

    this._TITULO = this._TITULO + " " + this._IDTICKET;

    this.hdTICKETDET.IDTICKET = this._IDTICKET;
    this.hdTICKETDET.IDUSUARIO = this._IDUSUARIO;
    this.hdTICKETDET.IDCLIENTE = this._IDCLIENTE;

    this.notasHistorial();

    $('#DESCTICKETDET').summernote()

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {

    this.hdTICKETDET.DESCTICKETDET = $("#DESCTICKETDET").val();

    console.log(this.hdTICKETDET);

    this._servicios.wsGeneral("insTicketDet", this.hdTICKETDET)
      .subscribe(resp => {
        this._toastr.success(resp, "Ticket");
        this.notasHistorial();
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
  }

  cerrarTicket() {

    let param = {
      IDTICKET: this._IDTICKET,
      IDCLIENTE: this._IDCLIENTE,
      ESTATUS: "C"
    };

    this._servicios.wsGeneral("updTICKET", param)
      .subscribe(resp => {
        this._servicios.wsGeneral("insTicketDet", this.hdTICKETDET)
          .subscribe(resp => {
            this._toastr.success(resp, "Ticket");
            this._router.navigate(['/tickets']);
          },
            error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));

      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));


  }

  reabrirTicket() {
    let param = {
      IDTICKET: this._IDTICKET,
      IDCLIENTE: this._IDCLIENTE,
      ESTATUS: "R"
    };

    this._servicios.wsGeneral("updTICKET", param)
      .subscribe(resp => {
        this._servicios.wsGeneral("insTicketDet", this.hdTICKETDET)
          .subscribe(resp => {
            this._toastr.success(resp, "Ticket");
            this._router.navigate(['/tickets']);
          },
            error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));

      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delTicket", this.hdTICKETDET)
        .subscribe(resp => {
          this._toastr.success(resp, "Ticket");
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
    }
  }

  notasHistorial() {
    this._servicios.wsGeneral("getTicketDetList", { idcliente: this._IDCLIENTE, valor: this._IDTICKET })
      .subscribe(x => {
        this.NOTAS = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Notas"));
  }

  transformaHtml(valor: string) {
    return this.sanitizer.bypassSecurityTrustHtml(valor);
  }

}
