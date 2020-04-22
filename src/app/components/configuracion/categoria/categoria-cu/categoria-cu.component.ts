import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaModal, CategoriaData } from 'src/app/model/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sag-categoria-cu',
  templateUrl: './categoria-cu.component.html',
  styleUrls: ['./categoria-cu.component.scss']
})
export class CategoriaCuComponent implements OnInit {
  tituloModal: string;
  descripcion: any;


  constructor(public dialogRef: MatDialogRef<CategoriaCuComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: CategoriaModal, 
    private categoriaService: CategoriaService) { }

  formCategoria = new FormGroup({
    'descripcion': new FormControl('', [Validators.required])
  });


  getErrorMessage() {
    return this.formCategoria['descripcion'].hasError('required') ? 'ingrese un sector' : '' ;
  }

  ngOnInit() {
    this.tituloModal = this.data.titulo;
    
    if (this.data.operacion === 2) {
      this.formCategoria.setValue({ 'descripcion': this.data.payload.descripcion });
    }
  }

  
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {

    if (this.formCategoria.valid) {
      if (this.data.operacion === 1) {
        
        this.categoriaService.createCategoria(
          this.formCategoria.value['descripcion']
        ).subscribe((dialog) => {          
          this.formCategoria.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let categoria: CategoriaData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formCategoria.value['descripcion']
        }

        this.categoriaService.updateCategoria(categoria).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }


}
