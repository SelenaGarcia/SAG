import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FuncionData, FuncionModal } from 'src/app/model/funcion.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuncionService } from 'src/app/services/funcion.service';
import { FuncionCuComponent } from './funcion-cu/funcion-cu.component';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { filter, switchMap, map, concatMap, first } from 'rxjs/operators';
import { DialogoComponent } from '../../shared/dialogo/dialogo.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'sag-funcion',
  templateUrl: './funcion.component.html',
  styleUrls: ['./funcion.component.scss']
})
export class FuncionComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'gest'];

  dataSource: MatTableDataSource<FuncionData>;

  funcionCount: number;

  checkedStatus: boolean = false; 

  isLoading$: Observable<boolean>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search',{static:false}) busqueda: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    public funcionService: FuncionService,
    public funcionCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.funcionService.isLoading$;
    
    this.funcionService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getFunciones(this.checkedStatus).subscribe();
  }    
  

  onCreateFuncion() {

    const data:  FuncionModal = {
      titulo: 'Nueva Función',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.funcionCrudDialog.open(FuncionCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditFuncion(row: FuncionData) {
    const data: FuncionModal = {
      titulo: 'Modificar Función',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.funcionCrudDialog.open(FuncionCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();
  }

  onDeleteFuncion(row: FuncionData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar la Función: ' + row.descripcion,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarFuncion(dialogoEliminarRef, id).subscribe();
  }


  onActivateFuncion(row: FuncionData) {
    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar la Función: ' + row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarFuncion(dialogoEliminarRef, id).subscribe();
  }

  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getFunciones(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
// ________________________________ Metodos Privados____________________________

  private activarEliminarFuncion(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.funcionService.deleteFuncion(id)),
      switchMap(() => this.getFunciones(this.checkedStatus))
    );
  }


  private getFunciones(incluirInactivos: boolean): Observable<any> {
    return this.funcionService.getFunciones(incluirInactivos)
    .pipe(
      map(funciones => {
        this.getDataTableFunctions(funciones);
      })
    );
  }

  private getDataTableFunctions(funciones) {
    this.funcionCount = funciones.length;
    this.dataSource = new MatTableDataSource(funciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<FuncionCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getFunciones(this.checkedStatus)),
      first(),
    );
  }
}
