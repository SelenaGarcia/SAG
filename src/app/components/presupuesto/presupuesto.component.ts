import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../shared/custom-snack-bar/custom-snack-bar.component';
import { filter } from 'rxjs/internal/operators/filter';
import { map, switchMap } from 'rxjs/operators';
import { PresupuestoService } from 'src/app/services/presupuesto.service';
import { PresupuestoData } from 'src/app/model/presupuesto';
import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { DialogoDeleteComponent } from '../shared/dialogo-delete/dialogo-delete.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'sag-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss']

})

export class PresupuestoComponent implements OnInit {


  displayedColumns: string[] = ['numeroPresupuesto', 'proveedor', 'fecha', 'fechaVencimiento', 'total', 'gest'];
  dataSource: MatTableDataSource<PresupuestoData>
  presupuestoCount: number;
  checkedStatus: boolean = false;
  incomingData$: Observable<PresupuestoData[]>;
  isLoading$: Observable<boolean>
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;



  constructor(
    private presupuestoService: PresupuestoService,
    public dialogoEliminar: MatDialog,
    private snackBar: MatSnackBar

  ) { }

  
  ngOnInit() {
    this.isLoading$ = this.presupuestoService.isLoading$;

    this.presupuestoService.message$.pipe(
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent, {
          data: resp,
        })
      })
    ).subscribe();
    this.getAllPresupuestos(this.checkedStatus).subscribe();

  }

  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  filtroFecha( event: MatDatepickerInputEvent<Date>){
    this.events.push(`${event.value}`);
    if( this.date.value < event || this.serializedDate.value > event){
          
      console.log(`${event.value}`);
    }

  }
  
  onDeletePresupuesto(row: PresupuestoData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar el Presupuesto: ' + row.numeroPresupuesto,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarPresupuesto(dialogoEliminarRef, id).subscribe();
  }

  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getAllPresupuestos(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 

// ---------------------------------Metodos Privados----------------------------------------

  private activarEliminarPresupuesto(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.presupuestoService.deletePresupuesto(id)),
      switchMap(() => this.getAllPresupuestos(this.checkedStatus))
    );
  }
  private getAllPresupuestos(incluirInactivos: boolean): Observable<any> {
    return this.presupuestoService.getPresupuestos(incluirInactivos)
    .pipe(
      map(presupuesto => {
        this.getDataTableFunctions(presupuesto);
      })
    );
  }
  private getDataTableFunctions(presupuesto) {
    this.presupuestoCount = presupuesto.length;
    this.dataSource = new MatTableDataSource(presupuesto);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
