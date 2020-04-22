import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaData, CategoriaModal } from 'src/app/model/categoria.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaCuComponent } from './categoria-cu/categoria-cu.component';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { filter, switchMap, map, concatMap, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'sag-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'gest'];

  dataSource: MatTableDataSource<CategoriaData>;

  categoriaCount: number;

  checkedStatus: boolean = false; 
  
  isLoading$: Observable<boolean>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search',{static:false}) busqueda: ElementRef;

  constructor(
    public snackBar: MatSnackBar,
    public categoriaService: CategoriaService,
    public categoriaCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.categoriaService.isLoading$;
    
    this.categoriaService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getCategorias(this.checkedStatus).subscribe();
  }
  onCreateCategoria() {

    const data:  CategoriaModal = {
      titulo: 'Nueva Categoria',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.categoriaCrudDialog.open(CategoriaCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditCategoria(row: CategoriaData) {
    const data: CategoriaModal = {
      titulo: 'Modificar Categoria',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.categoriaCrudDialog.open(CategoriaCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onDeleteCategoria(row: CategoriaData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar la Categoría: ' + row.descripcion,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarCategoria(dialogoEliminarRef, id).subscribe();
  }


  onActivateCategoria(row: CategoriaData) {
    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar la Categoría: ' + row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarCategoria(dialogoEliminarRef, id).subscribe();
  }

  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getCategorias(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


// ________________________________ Metodos Privados____________________________

  

private activarEliminarCategoria(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.categoriaService.deleteCategoria(id)),
      switchMap(() => this.getCategorias(this.checkedStatus))
    );
  }


  private getCategorias(incluirInactivos: boolean): Observable<any> {
    return this.categoriaService.getCategorias(incluirInactivos)
    .pipe(
      map(categorias => {
        this.getDataTableFunctions(categorias);
      })
    );
  }

  private getDataTableFunctions(categorias) {
    this.categoriaCount = categorias.length;
    this.dataSource = new MatTableDataSource(categorias);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<CategoriaCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getCategorias(this.checkedStatus)),
      first(),
    );
  }
}
