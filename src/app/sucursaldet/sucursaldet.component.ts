import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';

@Component({
  selector: 'app-sucursaldet',
  templateUrl: './sucursaldet.component.html',
  styleUrls: ['./sucursaldet.component.css']
})
export class SucursaldetComponent implements OnInit, OnDestroy {

  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "SUCURSAL DETALLE."
  _IDCLIENTE: string = "";
  _IDSUCURSAL: string = "";
  _ACCION: string = "N"

  validaCaptura: FormGroup;

  subscription: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDSUCURSAL = localStorage.getItem("_IDSUCURSAL"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDSUCURSAL: new FormControl({ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      NOMSUCURSAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Sucursal");
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getSucursalByID", { valor: this._IDSUCURSAL, idcliente: this._IDCLIENTE })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDSUCURSAL: datos.IDSUCURSAL,
            IDCLIENTE: datos.IDCLIENTE,
            NOMSUCURSAL: datos.NOMSUCURSAL
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucrusal"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updSucursal";
    else
      ws = "insSucursal";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Sucursal");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Sucursal"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delSucursal", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Sucursal");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Sucursal"));
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
    this._router.navigate(['/sucursales']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDSUCURSAL");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
