import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  _TITULO: string = "Sucursal detalle."
  _IDCLIENTE: string = "";
  _IDSUCURSAL: string = "";
  _ACCION: string = "N"

  validaCaptura: FormGroup | undefined;

  subscription: Subscription;
  subScrVentanaAccion: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this._servicios.validaSesion();

    this._IDCLIENTE = sessionStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._ACCION = sessionStorage.getItem("_ACCION");

    this.creaFormulario();

    /*
    this.validaCaptura = new FormGroup({
      IDSUCURSAL: new FormControl({ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      NOMSUCURSAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)])
    });
    */

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR" || resp == "GUARDARNUEVO") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Sucursal");
          else
            this.guardar(resp);
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

        if (resp == "REGRESAR")
          this.goBack();

      });

    this.subScrVentanaAccion = this._servicios.ventanaMaster$
    .subscribe(resp =>
      {
        if (!resp) {
          this._IDSUCURSAL = sessionStorage.getItem("_IDSUCURSAL"); // VARIABLE PARAMETRO.
          this._ACCION = sessionStorage.getItem("_ACCION");

          this.validaCaptura.reset();
          this.validaCaptura.patchValue({IDCLIENTE: this._IDCLIENTE});

          if (this._ACCION == "E") {
            // ICONOS DE NAVBAR (GUARDAR/SALIR, GUARDAR/NUEVO, BORRAR)
            //this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false, GUARDARNUEVO: true});
            this.validaCaptura.get("IDSUCURSAL").disable();

            this._servicios.wsGeneral("getSucursalByID", { valor: this._IDSUCURSAL, idcliente: this._IDCLIENTE })
              .subscribe(datos => {
                this.validaCaptura.setValue({
                  IDSUCURSAL: datos.IDSUCURSAL,
                  IDCLIENTE: datos.IDCLIENTE,
                  NOMSUCURSAL: datos.NOMSUCURSAL
                });
              }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucrusal"),
                () => this.validaCaptura.markAllAsTouched());
          } else {
            this.validaCaptura.get("IDSUCURSAL").enable();
          }
            
            //this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false, GUARDARNUEVO: true });
        }
      });
  }

  // ACCION DEL BOTON - GUARDAR.
  guardar(boton: string) {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updSucursal";
    else
      ws = "insSucursal";

    let valores: any = this.validaCaptura.getRawValue();

    this._servicios.wsGeneral(ws, valores)
      .subscribe(resp => {
        sessionStorage.setItem("_IDSUCURSAL", valores.IDSUCURSAL);
        this._toastr.success(resp, "Sucursal");
        if (boton == "GUARDAR") 
          this._servicios.ventanaMaster(true);
        else {
          this._servicios.actualizarMaster(true);
          this.validaCaptura.reset();
          this.validaCaptura.get("IDSUCURSAL").enable();
          this.validaCaptura.patchValue({IDCLIENTE: this._IDCLIENTE});
        }
          
      }
      ,
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Sucursal detalle"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delSucursal", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Sucursal");
          sessionStorage.setItem("_ACCION", "B")
          this._servicios.ventanaMaster(true);
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
    // this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    sessionStorage.setItem("_ACCION", "");
    this._servicios.ventanaMaster(true);
    //this._router.navigate(['/sucursales']);
  }

  creaFormulario () {
    this.validaCaptura = this.formBuilder.group({
      IDSUCURSAL: [{ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      IDCLIENTE: [{ value: this._IDCLIENTE, disabled: true }, Validators.required],
      NOMSUCURSAL: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    });

    /*
    this.validaCaptura = new FormGroup({
      IDSUCURSAL: new FormControl({ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      NOMSUCURSAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)])
    });
    */
  }

  ngOnDestroy() {
    // sessionStorage.removeItem("_IDSUCURSAL");
    // sessionStorage.removeItem("_ACCION");
    // this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
    this.subScrVentanaAccion.unsubscribe();
    this._servicios.ventanaMaster(true);
  }

}
