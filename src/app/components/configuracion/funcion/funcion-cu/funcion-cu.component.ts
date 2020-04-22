import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FuncionService } from 'src/app/services/funcion.service';
import { FuncionModal, FuncionData } from 'src/app/model/funcion.model';

@Component({
  selector: 'sag-funcion-cu',
  templateUrl: './funcion-cu.component.html',
  styleUrls: ['./funcion-cu.component.scss']
})
export class FuncionCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;


  constructor(public dialogRef: MatDialogRef<FuncionCuComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: FuncionModal, 
    private funcionService: FuncionService) { }

  formFuncion = new FormGroup({
    'descripcion': new FormControl('', [Validators.required])
  });


  getErrorMessage() {
    return this.formFuncion['descripcion'].hasError('required') ? 'ingrese un sector' : '' ;
  }

  ngOnInit() {
    this.tituloModal = this.data.titulo;
    
    if (this.data.operacion === 2) {
      this.formFuncion.setValue({ 'descripcion': this.data.payload.descripcion });
    }
  }

  
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {

    if (this.formFuncion.valid) {
      if (this.data.operacion === 1) {
        
        this.funcionService.onCreateFuncion(
          this.formFuncion.value['descripcion']
        ).subscribe((dialog) => {          
          this.formFuncion.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let funcion: FuncionData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formFuncion.value['descripcion']
        }

        this.funcionService.onEditFuncion(funcion).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }

}
