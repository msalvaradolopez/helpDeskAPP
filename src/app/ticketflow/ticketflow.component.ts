import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';
declare const moment: any;


@Component({
  selector: 'app-ticketflow',
  templateUrl: './ticketflow.component.html',
  styleUrls: ['./ticketflow.component.css']
})
export class TicketflowComponent implements OnInit {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = {
    IDTICKET: "",
    IDCLIENTE: 0,
    IDPRIORIDAD: 0,
    IDTIPO: 0,
    NOMTIPO: "",
    IDUSUARIO: "",
    NOMUSUARIO: "",
    ASUNTO: "",
    DESCTICKET: "",
    ESTATUS: "",
    ASIGNADOA: "",  
    NOMASIGNADO: "",
    ORIGEN: "",
    FECHA: ""
  };
  _TITULO: string = "TICKET DETALLE."
  _IDCLIENTE: string = "";
  _IDTICKET: string = "";
  _IDUSUARIO: string = "";
  _ROL:string = "U";
  _ACCION: string = "N";

  _ASIGNADOA_AUX: string = null;
  _ASIGNADOA: string = null;

  subscription: Subscription;

  fechaActual: Date = new Date();

  estatus: any[] = [
    { IDTIPO: "O", NOMBRE: "ABIERTO" },
    { IDTIPO: "A", NOMBRE: "ASIGNADO" },
    { IDTIPO: "B", NOMBRE: "BAJA" },
    { IDTIPO: "C", NOMBRE: "CERRADO" },
    { IDTIPO: "R", NOMBRE: "RE-ABIERTO" },
  ];

  USUARIOS: any[];
  CATEGORIAS: any[];
  ASIGNADOS: any[];

  prioridades: any[] = [
    { ID: 1, NOMBRE: "BAJA" },
    { ID: 2, NOMBRE: "MADIANA" },
    { ID: 3, NOMBRE: "ALTA" },
    { ID: 4, NOMBRE: "URGENTE" }
  ];

  origenes: any[] = [
    { ID: 1, NOMBRE: "HELPDESK" },
    { ID: 2, NOMBRE: "EMAIL" },
    { ID: 3, NOMBRE: "LLAMADA" },
    { ID: 4, NOMBRE: "CHAT" }
  ];

  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDTICKET = localStorage.getItem("_IDTICKET"); // VARIABLE PARAMETRO.
    this._IDUSUARIO = localStorage.getItem("_IDUSUARIO"); // VARIABLE PARAMETRO.
    this._ROL = localStorage.getItem("ROL"); // VARIABLE GLOBAL.
    this._ACCION = localStorage.getItem("_ACCION");

    this._TITULO = this._TITULO + " " + this._IDTICKET;

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR")
            this.guardar();

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    this._servicios.wsGeneral("getUsuariosList", { idcliente: this._IDCLIENTE, valor: "0", rol: "0" })
      .subscribe(x => {
        this.USUARIOS = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Usuarios"));

    this._servicios.wsGeneral("getUsuariosList", { idcliente: this._IDCLIENTE, valor: "0", rol: "A" })
      .subscribe(x => {
        this.ASIGNADOS = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Asignados"));

    this._servicios.wsGeneral("getTiposList", { idcliente: this._IDCLIENTE, valor: "0" })
      .subscribe(x => {
        this.CATEGORIAS = x;

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Categorias"));

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

      this._servicios.wsGeneral("getTicketByID", { valor: this._IDTICKET, idcliente: this._IDCLIENTE, idusuario: this._IDUSUARIO, rol: this._ROL })
        .subscribe(datos => {

          this.datos = datos;

          this._ASIGNADOA_AUX = this.datos.ASIGNADOA;
          this._TITULO = "# [" + this.datos.IDTICKET + "] - " + this.datos.ASUNTO;

          if (datos.ESTATUS == "O")
            datos.NOMESTATUS = "ABIERTA";
          if (datos.ESTATUS == "A")
            datos.NOMESTATUS = "ASIGNADA";
          if (datos.ESTATUS == "C")
            datos.NOMESTATUS = "CERRADA";
          if (datos.ESTATUS == "R")
            datos.NOMESTATUS = "RE-ABIERTA";
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Ticket"));
    } else {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

    }


  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updTICKET";
    else
      ws = "insTICKET";

    this._ASIGNADOA = this.datos.ASIGNADOA;

    if (this._ASIGNADOA != this._ASIGNADOA_AUX){
      this.datos.ESTATUS = "A";
      this.datos.NOMESTATUS = "ASIGNADO";
    }
      

    this._servicios.wsGeneral(ws, this.datos)
      .subscribe(resp => {
        this._toastr.success(resp, "Ticket");

        if (this._ASIGNADOA != this._ASIGNADOA_AUX)
          this.insNotaEspecial("El ticket :" + this._IDTICKET + " fue asignado al usuario: " + this._ASIGNADOA);
        // this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delTicket", this.datos)
        .subscribe(resp => {
          this._toastr.success(resp, "Ticket");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
    }
  }

  // REACCIONA CUANDO SE ASIGNA EL RESPONSABLE PARA DAR SEGUIMIENTO/SOLICION.
  insNotaEspecial(nota: string) {
    let param = {
      IDTICKETDET: null,
      IDTICKET: this._IDTICKET,
      IDCLIENTE: this._IDCLIENTE,
      IDUSUARIO: this._IDUSUARIO,
      DESCTICKETDET: nota,
      FECHA: this.fechaActual
    }

    this._servicios.wsGeneral("insTicketDet", param)
      .subscribe(resp => {
        this._toastr.success(resp, "Notas");
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Notas"));
  }

  goBack() {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this._router.navigate(['/tickets']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDTICKET");
    localStorage.removeItem("_IDUSUARIO");
    localStorage.removeItem("_ESTATUS");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }
}
