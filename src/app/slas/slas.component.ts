import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-slas',
  templateUrl: './slas.component.html',
  styleUrls: ['./slas.component.css']
})
export class SlasComponent implements OnInit {
  rows: any[] = null;
  valorBuscar: string = "";
  _idcliente: string = "";

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._idcliente = localStorage.getItem("IDCLIENTE"); // PARAMETRO GLOBAL.

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

    this.getRows();
  }

  getRows() {

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    this._servicios.wsGeneral("getSLAsList", { idcliente: this._idcliente, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;

        x.forEach(element => {
          if (element.IDPRIORIDAD == 1)
            element.IDPRIORIDAD = "BAJA";

          if (element.IDPRIORIDAD == 2)
            element.IDPRIORIDAD = "MEDIA";

          if (element.IDPRIORIDAD == 3)
            element.IDPRIORIDAD = "ALTA";

          if (element.IDPRIORIDAD == 4)
            element.IDPRIORIDAD = "URGENTE";

        });

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "SLAs"));
  }

  editRow(idsal: string) {
    localStorage.setItem("_IDSLA", idsal);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/sladet']);
  }

  newRow() {
    localStorage.setItem("_IDSLA", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/sladet']);
  }
}
