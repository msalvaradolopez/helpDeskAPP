import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-paramdet',
  templateUrl: './paramdet.component.html',
  styleUrls: ['./paramdet.component.css']
})
export class ParamdetComponent implements OnInit, OnDestroy  {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "PARAMETRO DETALLE."
  _IDCLIENTE: string = "";
  _IDPARAM: string = "";
  _ACCION: string = "N"

  validaCaptura: FormGroup;

  subscription: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDPARAM = localStorage.getItem("_IDPARAM"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDPARAM: new FormControl({ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      DESCPARAM: new FormControl({ value: "", disabled: true }, [Validators.required]),
      VALOR: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Parametro");
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getParamByID", { valor: this._IDPARAM, idcliente: this._IDCLIENTE })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDPARAM: datos.IDPARAM,
            IDCLIENTE: datos.IDCLIENTE,
            DESCPARAM: datos.DESCPARAM,
            VALOR: datos.VALOR
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Parametro"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updParam";
    else
      ws = "";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Parametro");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Parametro"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, ""));
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
    this._router.navigate(['/params']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDPARAM");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
