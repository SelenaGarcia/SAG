import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';

@Component({
  selector: 'sag-dialogo-delete',
  templateUrl: './dialogo-delete.component.html',
  styleUrls: ['./dialogo-delete.component.scss']
})
export class DialogoDeleteComponent implements OnInit {

  mensaje: string;
  titulo: string;
  icono: string;

  constructor(public dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogoEliminarModel) { }

  ngOnInit() {
    this.mensaje = this.data.mensaje;
    this.titulo = this.data.titulo;
    this.icono = this.data.icono;
  }

  onClose() {
    this.dialogoEliminarRef.close(false);
  }

  onDelete() {
    this.dialogoEliminarRef.close(true);
  }

}
