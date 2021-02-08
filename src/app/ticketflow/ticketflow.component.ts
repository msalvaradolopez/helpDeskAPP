import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  datos: any = null;
  _TITULO: string = "TICKET DETALLE."
  _IDCLIENTE: string = "";
  _IDTICKET: string = "";
  _IDUSUARIO: string = "";
  _ACCION: string = "N";

  _ASIGNADOA_AUX: string = null;

  validaCaptura: FormGroup;

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

  origen: any[] = [
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
    this._ACCION = localStorage.getItem("_ACCION");

    this._TITULO = this._TITULO + " " + this._IDTICKET;

    this.validaCaptura = new FormGroup({
      IDTICKET: new FormControl({ value: this._IDTICKET, disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      IDTIPO: new FormControl({ value: "", disabled: true }, [Validators.required]),
      IDUSUARIO: new FormControl({ value: this._IDUSUARIO, disabled: true }, [Validators.required]),
      ASUNTO: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      DESCTICKET: new FormControl({ value: "", disabled: true }, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      ESTATUS: new FormControl({ value: "O", disabled: true }, [Validators.required]),
      ASIGNADOA: new FormControl(null),
      IDPRIORIDAD: new FormControl("1", [Validators.required]),
      ORIGEN: new FormControl("1", [Validators.required]),
      FECHA: new FormControl({ value: moment(this.fechaActual).format("DD/MM/YYYY"), disabled: true }, [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Tema");
          else
            this.guardar();
        }

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
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getTicketByID", { valor: this._IDTICKET, idcliente: this._IDCLIENTE, idusuario: this._IDUSUARIO })
        .subscribe(datos => {
          this._ASIGNADOA_AUX = datos.ASIGNADOA;

          this.validaCaptura.setValue({
            IDTICKET: datos.IDTICKET,
            IDCLIENTE: datos.IDCLIENTE,
            IDPRIORIDAD: datos.IDPRIORIDAD,
            IDTIPO: datos.IDTIPO,
            IDUSUARIO: datos.IDUSUARIO,
            ASUNTO: datos.ASUNTO,
            DESCTICKET: datos.DESCTICKET,
            ESTATUS: datos.ESTATUS,
            ASIGNADOA: datos.ASIGNADOA,
            ORIGEN: datos.ORIGEN,
            FECHA: moment(datos.FECHA).format("DD/MM/YYYY")

          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Ticket"),
          () => this.validaCaptura.markAllAsTouched());
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

    let asignadoa = this.validaCaptura.controls['ASIGNADOA'].value;
    if (asignadoa != this._ASIGNADOA_AUX)
      this.validaCaptura.patchValue({
        ESTATUS: "A"
      });

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Ticket");

        if (asignadoa != this._ASIGNADOA_AUX)
          this.insNotaEspecial("El ticket :" + this._IDTICKET + " fue asignado al usuario: " + asignadoa);

        // this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delTicket", this.validaCaptura.getRawValue())
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
      FECHA: moment(this.fechaActual).format("DD/MM/YYYY")
    }

    this._servicios.wsGeneral("insTicketDet", param)
      .subscribe(resp => {
        this._toastr.success(resp, "Notas");
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Notas"));
  }

  // validacion de campos generales.
  validaCampo(campo: string): boolean {
    return this._servicios.isValidField(this.validaCaptura, campo);
  }

  mensajeErrorCampo(campo: string): string {
    return this._servicios.getErrorMessageField(this.validaCaptura, campo);
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
