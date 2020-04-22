import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RubroProveedorModalCuComponent } from './rubro-proveedor-modal-cu/rubro-proveedor-modal-cu.component';
import {  RubroProveedorData, RubroProveedorModal } from 'src/app/model/rubroProveedor.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { DialogoEliminarModel } from "src/app/model/dialogo-eliminar-model";
import { filter, switchMap, map, concatMap, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { RubroProveedorService } from 'src/app/services/rubroProveedor.service';


@Component({
  selector: 'sag-rubro-proveedor',
  templateUrl: './rubro-proveedor.component.html',
  styleUrls: ['./rubro-proveedor.component.scss']
})

export class RubroProveedorComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'gest'];
  dataSource: MatTableDataSource<RubroProveedorData>;
  rubroCount: number;
  checkedStatus: boolean= false;
  isLoading$: Observable<boolean>;

 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;

  constructor(
    public rubroProveedorCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
    private rubroProveedorService: RubroProveedorService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.rubroProveedorService.isLoading$;
    
    this.rubroProveedorService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getAllRubros(this.checkedStatus).subscribe();
  }

  onCreateRubroProveedor() {

    const data: RubroProveedorModal = {
      titulo: 'Nuevo Rubro',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.rubroProveedorCrudDialog.open(RubroProveedorModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditRubroProveedor(row: RubroProveedorData) {
    const data: RubroProveedorModal = {
      titulo: 'Modificar Rubro',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.rubroProveedorCrudDialog.open(RubroProveedorModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onDeleteRubroProveedor(row: RubroProveedorData) {

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

    this.activarEliminarRubroProveedor(dialogoEliminarRef, id).subscribe();
  }


  onActivateRubro(row: RubroProveedorData) {
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

    this.activarEliminarRubroProveedor(dialogoEliminarRef, id).subscribe();
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

  private activarEliminarRubroProveedor(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.rubroProveedorService.deleteRubro(id)),
      switchMap(() => this.getAllRubros(this.checkedStatus))
    );
  }


  private getAllRubros(incluirInactivos: boolean): Observable<any> {
    return this.rubroProveedorService.getAllRubros(incluirInactivos)
      .pipe(
        map(sectores => {
          this.getDataTableFunctions(sectores);
        })
      );
  }

  private getDataTableFunctions(rubros) {
    this.rubroCount = rubros.length;
    this.dataSource = new MatTableDataSource(rubros);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<RubroProveedorModalCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getAllRubros(this.checkedStatus)),
      first(),
    );
  }
}

