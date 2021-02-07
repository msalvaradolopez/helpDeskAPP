import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';
declare const moment: any;


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
  

  datos: any = null;
  _TITULO: string = "TICKET NOTA."
  _IDCLIENTE: string = "";
  _IDTICKET: string = "";
  _IDUSUARIO: string = "";
  _ACCION: string = "N"

  validaNota: FormGroup;

  subscription: Subscription;

  fechaActual: Date = new Date();

  constructor(private _servicios: ServiciosService,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }


  ngOnInit(): void {

    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDTICKET = localStorage.getItem("_IDTICKET"); // VARIABLE PARAMETRO.
    this._IDUSUARIO = localStorage.getItem("_IDUSUARIO"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaNota = new FormGroup({
      IDTICKETDET: new FormControl({ value: null, disabled: true }, [Validators.required]),
      IDTICKET: new FormControl({ value: this._IDTICKET, disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      IDUSUARIO: new FormControl({ value: this._IDUSUARIO, disabled: true }, [Validators.required]),
      DESCTICKETDET: new FormControl({ value: "", disabled: false }, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      FECHA: new FormControl({ value: moment(this.fechaActual).format("DD/MM/YYYY"), disabled: true }, [Validators.required])
    });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    this._servicios.wsGeneral("insTicketDet", this.validaNota.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Ticket");
        this.resetTheForm();
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
  }

  resetTheForm(): void {
    this.validaNota.controls['DESCTICKETDET'].reset()
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delTicket", this.validaNota.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Ticket");
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Ticket"));
    }
  }

  // validacion de campos generales.
  validaCampo(campo: string): boolean {
    return this._servicios.isValidField(this.validaNota, campo);
  }

  mensajeErrorCampo(campo: string): string {
    return this._servicios.getErrorMessageField(this.validaNota, campo);
  }


}
