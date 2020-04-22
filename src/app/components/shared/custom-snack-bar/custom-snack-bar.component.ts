import { Dialogo } from 'src/app/model/dialogo.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'sag-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss']
})
export class CustomSnackBarComponent implements OnInit {

  icono: string;
  mensaje: string;
  estado: boolean;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: Dialogo) { }

  ngOnInit() {
    this.icono = this.data.icono;
    this.mensaje = this.data.mensaje;
    this.estado = this.data.estado;
  }

}
