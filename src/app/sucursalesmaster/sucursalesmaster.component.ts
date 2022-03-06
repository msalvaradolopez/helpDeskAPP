import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-sucursalesmaster',
  templateUrl: './sucursalesmaster.component.html',
  styleUrls: ['./sucursalesmaster.component.css']
})
export class SucursalesmasterComponent implements OnInit, OnDestroy{

  _ventanaMaster: boolean = true;
  _ventanaDetalle: boolean = false;

  _subscription: Subscription;

  constructor(private _servicios: ServiciosService) { }

  ngOnInit(): void {

    this._subscription = this._servicios.ventanaMaster$
    .subscribe(resp => {
      if (resp){
        this._ventanaMaster = true;
        this._ventanaDetalle = false;
      } else {
        this._ventanaMaster = false;
        this._ventanaDetalle = true;
      } 
    });
  }

  ngOnDestroy() {
    
    this._subscription.unsubscribe();
    
  }

}
