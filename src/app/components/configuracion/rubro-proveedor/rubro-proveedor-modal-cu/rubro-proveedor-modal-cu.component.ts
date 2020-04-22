import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RubroProveedorService } from 'src/app/services/rubroProveedor.service';
import { RubroProveedorModal, RubroProveedorData } from 'src/app/model/rubroProveedor.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sag-rubro-proveedor-modal-cu',
  templateUrl: './rubro-proveedor-modal-cu.component.html',
  styles: []
})
export class RubroProveedorModalCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;

  constructor(public dialogRef: MatDialogRef<RubroProveedorModalCuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RubroProveedorModal, private rubroProveedorService: RubroProveedorService) {}

    formRubroProveedor = new FormGroup({
      'descripcion': new FormControl('', [Validators.required])
    });

  ngOnInit() {
    this.tituloModal= this.data.titulo;

    if (this.data.operacion === 2){      
      this.formRubroProveedor.setValue({'descripcion': this.data.payload.descripcion});
    }
  }
  getErrorMessage() {
    return this.formRubroProveedor['descripcion'].hasError('required') ? 'ingrese un rubro' : '' ;
  }
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {

    if (this.formRubroProveedor.valid) {
      if (this.data.operacion === 1) {
        
        this.rubroProveedorService.onCreateRubro(
          this.formRubroProveedor.value['descripcion']
        ).subscribe((dialog) => {          
          this.formRubroProveedor.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let rubro: RubroProveedorData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formRubroProveedor.value['descripcion']
        }

        this.rubroProveedorService.updateRubro(rubro).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }

}
