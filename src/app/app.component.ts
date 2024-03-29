import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { ServiciosService } from './servicios.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'helpDeskAPP';
  classMenu: string = "";
  menuSiNo: boolean = false;

  constructor(private _servicios: ServiciosService) { }

  ngOnInit() {


    let _classMenu = sessionStorage.getItem("classMenu")
    let _menuSiNo = sessionStorage.getItem("menuSiNo");

    if (_classMenu)
      this.classMenu = _classMenu;

    if (_menuSiNo)
      this.menuSiNo = (_menuSiNo == "true");

    this._servicios.activarmenu$
    .subscribe(accion => {
      this.menuSiNo = accion;
      sessionStorage.setItem("menuSiNo", String(this.menuSiNo));
      if (accion) 
        this.classMenu = "content-wrapper";
       else
        this.classMenu = "wrapper";

        sessionStorage.setItem("classMenu", this.classMenu);

    });
  }

}
