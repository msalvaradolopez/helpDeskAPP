import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-temadet',
  templateUrl: './temadet.component.html',
  styleUrls: ['./temadet.component.css']
})
export class TemadetComponent implements OnInit {

  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "Tema detalle."
  _IDCLIENTE: string = "";
  _IDTIPO: string = "";
  _ACCION: string = "N"

  validaCaptura: FormGroup;

  subscription: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDTIPO = localStorage.getItem("_IDTIPO"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDTIPO: new FormControl({ value: "", disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      NOMTIPO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50)])
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


      this._servicios.wsGeneral("getTipoByID", { valor: this._IDTIPO, idcliente: this._IDCLIENTE })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDTIPO: datos.IDTIPO,
            IDCLIENTE: datos.IDCLIENTE,
            NOMTIPO: datos.NOMTIPO
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Tema"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updTipo";
    else
      ws = "insTipo";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Tema");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Tema"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delTipo", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Tema");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Tema"));
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
    localStorage.removeItem("_IDTIPO");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }


}
