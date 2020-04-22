import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentaModal, CuentaData } from 'src/app/model/cuenta';
import { CuentaService } from 'src/app/services/cuenta.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sag-cuenta-cu',
  templateUrl: './cuenta-cu.component.html',
  styleUrls: ['./cuenta-cu.component.scss']
})
export class CuentaCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;
  numero: any;


  constructor(public dialogRef: MatDialogRef<CuentaCuComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: CuentaModal, 
    private cuentaService: CuentaService) { }

  formCuenta = new FormGroup({
    'descripcion': new FormControl('', [Validators.required]),
    'numero': new FormControl('', [Validators.required])
  });



  ngOnInit() {
    this.tituloModal = this.data.titulo;
    
    if (this.data.operacion === 2) {
      this.formCuenta.setValue({ 
        'descripcion': this.data.payload.descripcion, 
        'numero': this.data.payload.numero
     });
    }
  }

  
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {


    if (this.formCuenta.valid) {
      if (this.data.operacion === 1) {
        
          this.cuentaService.onCreateCuenta(
           this.formCuenta.value['descripcion'],
           this.formCuenta.value['numero'],
        ).subscribe((dialog) => {          
          this.formCuenta.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let cuenta: CuentaData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formCuenta.value['descripcion'],
          numero: this.formCuenta.value['numero'],
        }

        this.cuentaService.onEditCuenta(cuenta).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }

}
