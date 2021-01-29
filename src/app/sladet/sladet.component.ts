import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-sladet',
  templateUrl: './sladet.component.html',
  styleUrls: ['./sladet.component.css']
})
export class SladetComponent implements OnInit {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "SLA DETALLE."
  _IDCLIENTE: string = "";
  _IDSLA: string = "";
  _ACCION: string = "N"

  estatus: any[] = [
    { IDTIPO: "A", NOMBRE: "ACTIVO" },
    { IDTIPO: "B", NOMBRE: "BAJA" }
  ];


  validaCaptura: FormGroup;

  subscription: Subscription;


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = localStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDSLA = localStorage.getItem("_IDSLA"); // VARIABLE PARAMETRO.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDSLA: new FormControl({ value: "", disabled: true }, [Validators.required]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      IDPRIORIDAD: new FormControl({ value: "", disabled: true }, [Validators.required]),
      RESPONDEREN: new FormControl("", [Validators.required, Validators.min(1), Validators.max(24)]),
      RESOLVEREN: new FormControl("", [Validators.required, Validators.min(1), Validators.max(24)]),
      ESTATUS: new FormControl("A", [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "SLA");
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getSLAByID", { valor: this._IDSLA, idcliente: this._IDCLIENTE })
        .subscribe(datos => {

          if (datos.IDPRIORIDAD == 1)
            datos.IDPRIORIDAD = "BAJA";
          if (datos.IDPRIORIDAD == 2)
            datos.IDPRIORIDAD = "MEDIA";
          if (datos.IDPRIORIDAD == 3)
            datos.IDPRIORIDAD = "ALTA";
          if (datos.IDPRIORIDAD == 4)
            datos.IDPRIORIDAD = "URGENTE";

          this.validaCaptura.setValue({
            IDSLA: datos.IDSLA,
            IDCLIENTE: datos.IDCLIENTE,
            IDPRIORIDAD: datos.IDPRIORIDAD,
            RESPONDEREN: datos.RESPONDEREN,
            RESOLVEREN: datos.RESOLVEREN,
            ESTATUS: datos.ESTATUS
          });

        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "SLA"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updSLA";
    else
      ws = "insSLA";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "SLA");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "SLA"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delSLA", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "SLA");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "SLA"));
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
    this._router.navigate(['/slas']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDSLA");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
