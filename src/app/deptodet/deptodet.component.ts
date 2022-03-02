import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';

@Component({
  selector: 'app-deptodet',
  templateUrl: './deptodet.component.html',
  styleUrls: ['./deptodet.component.css']
})
export class DeptodetComponent implements OnInit, OnDestroy {
// VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
confirmHeading = '';
confirmContent = "Confirmar eliminar el registro.";
confirmCanceltext = "Cancelar";
confirmOkaytext = "Eliminar";
// VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

datos: any = null;
_TITULO: string = "Departamento detalle."
_IDCLIENTE: string = "";
_IDDEPTO: string = "";
_ACCION: string = "N"

validaCaptura: FormGroup;

subscription: Subscription;


constructor(private _servicios: ServiciosService,
  private _router: Router,
  private _toastr: ToastrService,
  private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE GLOBAL.
    this._IDDEPTO = localStorage.getItem("_IDDEPTO"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDDEPTO: new FormControl({ value: "", disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      NOMDEPTO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(30)])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Departamento");
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getDeptoByID", { valor: this._IDDEPTO, idcliente: this._IDCLIENTE })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDDEPTO: datos.IDDEPTO,
            IDCLIENTE: datos.IDCLIENTE,
            NOMDEPTO: datos.NOMDEPTO
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Departamento"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });
  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updDepto";
    else
      ws = "insDepto";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Departamento");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Departamento"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delDepto", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Departamento");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Departamento"));
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
    this._router.navigate(['/deptos']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDDEPTO");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
