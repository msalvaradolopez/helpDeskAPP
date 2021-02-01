import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-ticketdet',
  templateUrl: './ticketdet.component.html',
  styleUrls: ['./ticketdet.component.css']
})
export class TicketdetComponent implements OnInit {

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
  _ACCION: string = "N"

  validaCaptura: FormGroup;

  subscription: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDTICKET = localStorage.getItem("_IDTICKET"); // VARIABLE PARAMETRO.
    this._IDUSUARIO = localStorage.getItem("_IDUSUARIO"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDTICKET: new FormControl({ value: "", disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      IDTIPO: new FormControl("", [Validators.required]),
      IDUSUARIO: new FormControl({ value: "", disabled: true }, [Validators.required]),
      ASUNTO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      DESCTICKET: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      ESTATUS: new FormControl({ value: "A", disabled: true }, [Validators.required]),
      ASIGNADOA: new FormControl(""),
      IDPRIORIDAD: new FormControl("1", [Validators.required]),
      ORIGEN: new FormControl("1", [Validators.required]),
      FECHA: new FormControl({ value: "1", disabled: true }, [Validators.required])
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


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getTicketByID", { valor: this._IDTICKET, idcliente: this._IDCLIENTE, idusuario: this._IDUSUARIO })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDTICKET: datos.IDTICKET,
            IDCLIENTE: datos.IDCLIENTE,
            IDPRIORIDAD: datos.IDPRIORIDAD,
            IDTIPO: datos.IDTIPO,
            IDUSUARIO: datos.IDUSUARIO,
            NOMUSUARIO: datos.NOMUSUARIO,
            ASUNTO: datos.ASUNTO,
            DESCTICKET: datos.DESCTICKET,
            ESTATUS: datos.ESTATUS,
            ASIGNADOA: datos.ASIGNADOA,
            NOMASIGNADO: datos.NOMASIGNADO,
            ORIGEN: datos.ORIGEN,
            FECHA: datos.FECHA
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Ticket"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updTICKET";
    else
      ws = "insTICKET";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Tema");
        this.goBack()
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

  // validacion de campos generales.
  validaCampo(campo: string): boolean {
    return this._servicios.isValidField(this.validaCaptura, campo);
  }

  mensajeErrorCampo(campo: string): string {
    return this._servicios.getErrorMessageField(this.validaCaptura, campo);
  }

  goBack() {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this._router.navigate(['/temas']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDTICKET");
    localStorage.removeItem("_IDUSUARIO");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }


}