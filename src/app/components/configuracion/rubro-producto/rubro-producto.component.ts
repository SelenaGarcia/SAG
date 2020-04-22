import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map, switchMap, concatMap, first } from 'rxjs/operators';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { RubroProductoData, RubroProductoModal } from 'src/app/model/rubroProducto.model';
import { RubroProductoService } from 'src/app/services/rubro-producto.service';
import { RubroProductoModalCuComponent } from './rubro-producto-modal-cu/rubro-producto-modal-cu.component';

@Component({
  selector: 'sag-rubro-producto',
  templateUrl: './rubro-producto.component.html',
  styleUrls: ['./rubro-producto.component.scss']
})
export class RubroProductoComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'gest'];
  dataSource: MatTableDataSource<RubroProductoData>;
  rubroCount: number;
  checkedStatus: boolean= false;
  isLoading$: Observable<boolean>;

 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;

  constructor(
    public rubroProductoCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
    private rubroProductoService: RubroProductoService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.rubroProductoService.isLoading$;
    
    this.rubroProductoService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getAllRubros(this.checkedStatus).subscribe();
  }

  onCreateRubro() {

    const data: RubroProductoModal = {
      titulo: 'Nuevo Rubro',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.rubroProductoCrudDialog.open(RubroProductoModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditRubro(row: RubroProductoData) {
    const data: RubroProductoModal = {
      titulo: 'Modificar Rubro',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.rubroProductoCrudDialog.open(RubroProductoModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onDeleteRubro(row: RubroProductoData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar el rubro: ' + row.descripcion,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarRubro(dialogoEliminarRef, id).subscribe();
  }


  onActivateRubro(row: RubroProductoData) {
    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar el Rubro: ' + row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarRubro(dialogoEliminarRef, id).subscribe();
  }

  onToggleCheck(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getAllRubros(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private activarEliminarRubro(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.rubroProductoService.deleteRubro(id)),
      switchMap(() => this.getAllRubros(this.checkedStatus))
    );
  }


  private getAllRubros(incluirInactivos: boolean): Observable<any> {
    return this.rubroProductoService.getAllRubros(incluirInactivos)
      .pipe(
        map(productos => {
          this.getDataTableFunctions(productos);
        })
      );
  }

  private getDataTableFunctions(rubros) {
    this.rubroCount = rubros.length;
    this.dataSource = new MatTableDataSource(rubros);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<RubroProductoModalCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getAllRubros(this.checkedStatus)),
      first(),
    );
  }

}
