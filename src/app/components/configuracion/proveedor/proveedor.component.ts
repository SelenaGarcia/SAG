import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorData} from 'src/app/model/proveedor.model';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ProveedorService } from 'src/app/services/proveedor.service';
import { DialogoEliminarModel } from 'src/app/model/dialogo-eliminar-model';
import { map, filter, switchMap} from 'rxjs/operators';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'sag-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProveedorComponent implements OnInit {

  displayedColumns: string[] = ['razonSocial','cuit','rubroProveedor', 'gest'];
  dataSource: MatTableDataSource<ProveedorData>;
  expandedElement: ProveedorData | null;
  proveedorCount: number;
  checkedStatus: boolean = false;
  incomingData$: Observable<ProveedorData[]>;
  isLoading$: Observable<boolean>;



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search',{static:false}) busqueda: ElementRef;

  constructor(
    public proveedorService: ProveedorService,   
    public dialogoEliminar: MatDialog,
    public proveedorCrudDialog: MatDialog,
    private snackBar: MatSnackBar,
    
  ) { }

  ngOnInit() {
    this.proveedorService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getProveedores(this.checkedStatus).subscribe();
  }
  
  onDeleteProveedor(row: ProveedorData) {

    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'warning',
      mensaje: 'Desea eliminar el Proveedor: ' + row.razonSocial,
      titulo: 'Eliminar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data
      });

    this.activarEliminarProveedor(dialogoEliminarRef, id).subscribe();
  }

  onActivateProveedor(row: ProveedorData) {
    const id = row.id;
    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar el Proveedor: '+ row.razonSocial,
      titulo: 'Activar'
    }
    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarProveedor(dialogoEliminarRef, id).subscribe();
  }
  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getProveedores(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


// ---------------------------------Metodos Privados----------------------------------------

  private activarEliminarProveedor(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.proveedorService.DeleteProveedor(id)),
      switchMap(() => this.getProveedores(this.checkedStatus))
    );
  }


  private getProveedores(incluirInactivos: boolean): Observable<any> {
    return this.proveedorService.getProveedores(incluirInactivos)
    .pipe(
      map(productos => {
        this.getDataTableFunctions(productos);
      })
    );
  }

  private getDataTableFunctions(proveedores) {
    this.proveedorCount = proveedores.length;
    this.dataSource = new MatTableDataSource(proveedores);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
}
