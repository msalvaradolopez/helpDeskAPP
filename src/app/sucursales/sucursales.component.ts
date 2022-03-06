import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit, OnDestroy {
  rows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";

  subscription: Subscription;
  subScrVentanaMaster: Subscription;
  subScrActualizarListado: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {

    this._servicios.validaSesion();
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true, GUARDARNUEVO: false });

    this._idcliente = sessionStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.

    this._servicios.buscarMat$
      .subscribe(resp => {
        this.valorBuscar = resp;
        this.getRows();
      });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "AGREGAR")
          this.newRow();
      });

      //SOLO ACTUALIZA EL LISTADO CUANDO SE ACTIVA LA VENTANA MASTER
      this.subScrVentanaMaster = this._servicios.ventanaMaster$
      .subscribe(resp => {
        if (resp) {
          this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true, GUARDARNUEVO: false });
          this.actualizarListado();
        }
      });

      // ACTUALIZA EL LISTADO SIN ACTIVAR VENTANA MASTER
      this.subScrActualizarListado = this._servicios.actualizarMaster$
      .subscribe(resp => {
        if (resp) {
          this.actualizarListado();
        }
      });

    this.getRows();
  }

  getRows() {

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    this._servicios.wsGeneral("getSucursalesList", { idcliente: this._idcliente, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucursal"));
  }

  editRow(idSucursal: string) {
    sessionStorage.setItem("_IDSUCURSAL", idSucursal);
    sessionStorage.setItem("_ACCION", "E");
    // this._router.navigate(['/sucursaldet']);
    this._servicios.ventanaMaster(false);
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false, GUARDARNUEVO: true});
  }

  newRow() {
    sessionStorage.setItem("_IDSUCURSAL", "0");
    sessionStorage.setItem("_ACCION", "N");    
    // this._router.navigate(['/sucursaldet']);
    this._servicios.ventanaMaster(false);
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false, GUARDARNUEVO: true});
  }

  regresaVentana() {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true, GUARDARNUEVO: false});
  }

  actualizarListado() {
    let idSucursal = sessionStorage.getItem("_IDSUCURSAL");
    let accion = sessionStorage.getItem("_ACCION");

    if (accion == "N" || accion == "E" )
      this._servicios.wsGeneral("getSucursalByID", { valor: idSucursal, idcliente: this._idcliente })
      .subscribe(datos => {
        if (accion == "N")
          this.rows.push(datos)
        else 
          this.rows.forEach((valor, index) => {
            if (valor.IDSUCURSAL == datos.IDSUCURSAL)
              valor.NOMSUCURSAL = datos.NOMSUCURSAL;
          }   );
      }
        
      , error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Sucrusal master")
      );

    if (accion == "B")
        this.rows.forEach((valor, index) => {
          if (valor.IDSUCURSAL == idSucursal)
            this.rows.splice(index, 1);
        });
  }

  ngOnDestroy() {
    
    this.subscription.unsubscribe();
    this.subScrVentanaMaster.unsubscribe();
    this.subScrActualizarListado.unsubscribe();
  }
}
