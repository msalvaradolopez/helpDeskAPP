import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  IDUSUARIO: string = "";
  PASSW: string = "";

  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService) {
    this._servicios.accionMenu(false);
  }

  ngOnInit(): void {

  }

  login() {
    if (this.IDUSUARIO == "") {
      this._toastr.error("Se requiere capturar el usuario.", "Login");
      return;
    }

    if (this.PASSW == "") {
      this._toastr.error("Se requiere capturar la contraseña.", "Login");
      return;
    }

    let param: any = {
      IDUSUARIO: this.IDUSUARIO,
      PASSW: this.PASSW
    }

    this._servicios.wsGeneral("getLogin", param)
      .subscribe(resp => {
        localStorage.setItem("IDUSUARIO", this.IDUSUARIO);
        localStorage.setItem("ROL", resp.ROL);
        localStorage.setItem("IDCLIENTE", resp.IDCLIENTE);

        this._servicios.accionMenu(true);

      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Login"));
  }

}
