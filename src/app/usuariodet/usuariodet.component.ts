import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';

@Component({
  selector: 'app-usuariodet',
  templateUrl: './usuariodet.component.html',
  styleUrls: ['./usuariodet.component.css']
})
export class UsuariodetComponent implements OnInit, OnDestroy {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "USUARIO DETALLE."
  _IDCLIENTE: string = "";
  _IDUSUARIO: string = "";
  _ACCION: string = "N"

  validaCaptura: FormGroup;

  subscription: Subscription;

  perfiles: any[] = [
    { ID: "A", NOMBRE: "ADMIN" },
    { ID: "S", NOMBRE: "SUPERVISOR" },
    { ID: "U", NOMBRE: "USUARIO" }
  ];

  estatus: any[] = [
    { IDTIPO: "A", NOMBRE: "ACTIVO" },
    { IDTIPO: "B", NOMBRE: "BAJA" }
  ];

  sucursales: any[] = [];
  deptos: any[] = [];


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDCLIENTE = sessionStorage.getItem("IDCLIENTE"); // VARIABLE PARAMETRO.
    this._IDUSUARIO = sessionStorage.getItem("_IDUSUARIO"); // VARIABLE PARAMETRO.
    this._ACCION = sessionStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDUSUARIO: new FormControl({ value: "", disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      IDCLIENTE: new FormControl({ value: this._IDCLIENTE, disabled: true }, [Validators.required]),
      IDSUCURSAL: new FormControl("", [Validators.required]),
      IDDEPTO: new FormControl("", [Validators.required]),
      NOMUSUARIO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      EMAIL: new FormControl("", [Validators.required, Validators.email]),
      TELEFONO: new FormControl(""),
      PASSW: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
      ROL: new FormControl("U", [Validators.required]),
      ESTATUS: new FormControl("A", [Validators.required])
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

    this._servicios.wsGeneral("getSucursalesList", { valor: "0", idcliente: this._IDCLIENTE })
      .subscribe(resp => {
        this.sucursales = resp
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucrusales"));

    this._servicios.wsGeneral("getDeptosList", { valor: "0", idcliente: this._IDCLIENTE })
      .subscribe(resp => {
        this.deptos = resp
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Departamentos"));


    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });


      this._servicios.wsGeneral("getUsuarioByID", { valor: this._IDUSUARIO, idcliente: this._IDCLIENTE })
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDUSUARIO: datos.IDUSUARIO,
            IDCLIENTE: datos.IDCLIENTE,
            IDSUCURSAL: datos.IDSUCURSAL,
            IDDEPTO: datos.IDDEPTO,
            NOMUSUARIO: datos.NOMUSUARIO,
            EMAIL: datos.EMAIL,
            TELEFONO: datos.TELEFONO,
            PASSW: datos.PASSW,
            ROL: datos.ROL,
            ESTATUS: datos.ESTATUS
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Usuarios"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updUsuario";
    else
      ws = "insUsuario";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Usuario");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Usuario"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delUsuario", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Usuario");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Usuario"));
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
    this._router.navigate(['/usuarios']);
  }

  ngOnDestroy() {
    sessionStorage.removeItem("_IDUSUARIO");
    sessionStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }
}
