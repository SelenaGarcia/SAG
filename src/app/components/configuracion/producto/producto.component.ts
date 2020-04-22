import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ProductoData, ProductoModal } from 'src/app/model/producto.model';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoCuComponent } from './producto-cu/producto-cu.component';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { filter, switchMap, map, concatMap, first, tap } from 'rxjs/operators';
import { RubroProveedorData } from 'src/app/model/rubroProveedor.model';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'sag-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  displayedColumns: string[] = ['descripcion','rubro', 'gest'];
  dataSource: MatTableDataSource<ProductoData>;
  productoCount: number;
  checkedStatus: boolean = false;
  incomingData$: Observable<ProductoData[]>;
  rubros$: Observable<RubroProveedorData[]>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search',{static:false}) busqueda: ElementRef;

  constructor(
    public snackBar: MatSnackBar,
    public productoService: ProductoService,   
    public dialogoEliminar: MatDialog,
    public productoCrudDialog: MatDialog,
   
  ) { }

  ngOnInit() {
    // this.isLoading$ = this.productoService.isLoading$;
    
    this.productoService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getProducto(this.checkedStatus).subscribe();
  }

  onCreateProducto() {
    const data: ProductoModal = {
      titulo: 'Nuevo Producto',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false, rubro: null, rubroId: null }
    };

    const dialogRef = this.productoCrudDialog.open(ProductoCuComponent,
      {
        data: data,
        'minWidth': 350
      });
    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditProducto(row: ProductoData) {
    const data: ProductoModal = {
      titulo: 'Modificar Producto',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo, rubro: row.rubro, rubroId: row.rubroId }
    };

    const dialogRef = this.productoCrudDialog.open(ProductoCuComponent,
      {
        data: data,
        'minWidth': 350
      });
      this.afterCloseModalCu(dialogRef).subscribe();
  }

  onDeleteProducto(row: ProductoData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar el Sector: ' + row.descripcion,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarProducto(dialogoEliminarRef, id).subscribe();
  }

  onActivateProducto(row: ProductoData) {
    const id = row.id;
  
    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar el Producto: '+ row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarProducto(dialogoEliminarRef, id).subscribe();
  }
  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getProducto(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // ________________________________ Metodos Privados____________________________


  private activarEliminarProducto(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.productoService.deleteProducto(id)),
      switchMap(() => this.getProducto(this.checkedStatus))
    );
  }


  private getProducto(incluirInactivos: boolean): Observable<any> {
    return this.productoService.getProductos(incluirInactivos)
    .pipe(
      map(productos => {
        this.getDataTableFunctions(productos);
      })
    );
  }

  private getDataTableFunctions(productos) {
    this.productoCount = productos.length;
    this.dataSource = new MatTableDataSource(productos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<ProductoCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getProducto(this.checkedStatus)),
      first(),
    );
  }
}
