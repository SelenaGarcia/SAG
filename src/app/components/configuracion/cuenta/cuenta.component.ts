import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, map, switchMap, concatMap, first } from 'rxjs/operators';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { CuentaData, CuentaModal } from 'src/app/model/cuenta';
import { CuentaService } from 'src/app/services/cuenta.service';
import { CuentaCuComponent } from './cuenta-cu/cuenta-cu.component';

@Component({
  selector: 'sag-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {
  
  
  displayedColumns: string[] = ['numero','descripcion', 'gest'];

  dataSource: MatTableDataSource<CuentaData>;

  cuentaCount: number;

  checkedStatus: boolean = false; 

  isLoading$: Observable<boolean>;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search',{static:false}) busqueda: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    public cuentaService: CuentaService,
    public cuentaCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.cuentaService.isLoading$;
    
    this.cuentaService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getCuentas(this.checkedStatus).subscribe();
  }    
  

  onCreateCuenta() {

    const data:  CuentaModal = {
      titulo: 'Nueva Cuenta',
      operacion: 1,
      payload: {numero:'', descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.cuentaCrudDialog.open(CuentaCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditCuenta(row: CuentaData) {
    const data: CuentaModal = {
      titulo: 'Modificar Cuenta',
      operacion: 2,
      payload: {numero: row.numero , descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.cuentaCrudDialog.open(CuentaCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();
  }

  onDeleteCuenta(row: CuentaData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar la Cuenta: ' + row.descripcion,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarCuenta(dialogoEliminarRef, id).subscribe();
  }


  onActivateCuenta(row: CuentaData) {
    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar la Cuenta: ' + row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarCuenta(dialogoEliminarRef, id).subscribe();
  }

  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getCuentas(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
// ________________________________ Metodos Privados____________________________

  private activarEliminarCuenta(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.cuentaService.deleteCuenta(id)),
      switchMap(() => this.getCuentas(this.checkedStatus))
    );
  }


  private getCuentas(incluirInactivos: boolean): Observable<any> {
    return this.cuentaService.getCuentas(incluirInactivos)
    .pipe(
      map(cuentas => {
        this.getDataTableFunctions(cuentas);
      })
    );
  }

  private getDataTableFunctions(cuentas) {
    this.cuentaCount = cuentas.length;
    this.dataSource = new MatTableDataSource(cuentas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<CuentaCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getCuentas(this.checkedStatus)),
      first(),
    );
  }
}
