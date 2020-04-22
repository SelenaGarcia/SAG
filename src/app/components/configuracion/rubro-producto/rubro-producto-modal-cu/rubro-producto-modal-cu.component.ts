import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RubroProductoModal, RubroProductoData } from 'src/app/model/rubroProducto.model';
import { RubroProductoService } from 'src/app/services/rubro-producto.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'sag-rubro-producto-modal-cu',
  templateUrl: './rubro-producto-modal-cu.component.html',
  styleUrls: ['./rubro-producto-modal-cu.component.scss']
})
export class RubroProductoModalCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;

  constructor(public dialogRef: MatDialogRef<RubroProductoModalCuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RubroProductoModal, private rubroProductoService: RubroProductoService) {}

    formRubroProducto = new FormGroup({
      'descripcion': new FormControl('', [Validators.required])
    });

  ngOnInit() {
    this.tituloModal= this.data.titulo;

    if (this.data.operacion === 2){      
      this.formRubroProducto.setValue({'descripcion': this.data.payload.descripcion});
    }
  }
  getErrorMessage() {
    return this.formRubroProducto['descripcion'].hasError('required') ? 'ingrese un rubro' : '' ;
  }
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {

    if (this.formRubroProducto.valid) {
      if (this.data.operacion === 1) {
        
        this.rubroProductoService.onCreateRubro(
          this.formRubroProducto.value['descripcion']
        ).subscribe((dialog) => {          
          this.formRubroProducto.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let rubro: RubroProductoData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formRubroProducto.value['descripcion']
        }

        this.rubroProductoService.updateRubro(rubro).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }
}
