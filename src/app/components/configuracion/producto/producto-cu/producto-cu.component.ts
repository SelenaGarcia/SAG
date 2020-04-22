import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoModal, ProductoData } from 'src/app/model/producto.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RubroProveedorService } from 'src/app/services/rubroProveedor.service';
import { RubroProveedorData } from 'src/app/model/rubroProveedor.model';

@Component({
  selector: 'sag-producto-cu',
  templateUrl: './producto-cu.component.html',
  styleUrls: ['./producto-cu.component.scss']
})
export class ProductoCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;

  rubros$: Observable<RubroProveedorData[]>;

  constructor(public dialogRef: MatDialogRef<ProductoCuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoModal,
    private productoService: ProductoService,
    private rubroPoveedorService: RubroProveedorService) { }

  formProducto = new FormGroup({
    'descripcion': new FormControl('', [Validators.required]),
    'rubroSelect': new FormControl('', [Validators.required])
  });

  ngOnInit() {

    this.rubros$ = this.rubroPoveedorService.getAllRubros(true);

    this.tituloModal = this.data.titulo;

    if (this.data.operacion === 2) {

      this.formProducto.get('descripcion').setValue(this.data.payload.descripcion);
      this.formProducto.get('rubroSelect').setValue(this.data.payload.rubroId);
    }
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {
    if (this.formProducto.valid) {
      if (this.data.operacion === 1) {
        this.productoService.createProducto(
          this.formProducto.value['descripcion'],
          this.formProducto.value['rubroSelect'],
        ).subscribe((dialog) => {
          this.formProducto.reset();
          this.dialogRef.close(dialog);
        });
      }
      if (this.data.operacion === 2) {
        let producto: ProductoData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formProducto.value['descripcion'],
          rubroId: this.formProducto.value['rubroSelect'],                  
        }       

        this.productoService.updateProducto(producto).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }
    }
  }
  // REVISAR ESTE METODO D:
  getErrorMessage() {
    return this.formProducto['descripcion'].hasError('required') ? 'ingrese un producto' : '';
  }
}
