import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { CustomSnackBarComponent } from '../shared/custom-snack-bar/custom-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { solicitudDataTabla, SolicitudCompraData } from 'src/app/model/SolicitudCompra.model';
import { SolicitudCompraService } from 'src/app/services/solicitud-compra.service';

@Component({
  selector: 'sag-sol-compra',
  templateUrl: './sol-compra.component.html',
  styleUrls: ['./sol-compra.component.scss']
})
export class SolCompraComponent implements OnInit {

  displayedColumns: string[] = ['numero', 'sector', 'fechaRegresoColegio', 'fecha', 'fechaRechazo', 'fechaFirma', 'estadoSolicitudCompra', 'gest'];
  dataSource: MatTableDataSource<solicitudDataTabla>
  solicitudCompraCount: number;
  checkedStatus: boolean = false;
  incomingData$: Observable<SolicitudCompraData[]>;
  isLoading$: Observable<boolean>
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;



  constructor(
    private solicitudCompraService: SolicitudCompraService,
    private snackBar: MatSnackBar,
    public dialogoEliminar: MatDialog,


  ) { }

  
  ngOnInit() {
    this.isLoading$ = this.solicitudCompraService.isLoading$;

    this.solicitudCompraService.message$.pipe(
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent, {
          data: resp,
        })
      })
    ).subscribe();
    this.getAllSolicitudCompra(this.checkedStatus).subscribe();

  }
 
  toggle(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getAllSolicitudCompra(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 

  private getAllSolicitudCompra(incluirInactivos: boolean): Observable<any> {
    return this.solicitudCompraService.getSolicitudCompra(incluirInactivos)
    .pipe(
      map(solicitudCompra => {
        this.getDataTableFunctions(solicitudCompra);
      })
    );
  }


  private getDataTableFunctions(solicitudCompra) {
    this.solicitudCompraCount = solicitudCompra.length;
    this.dataSource = new MatTableDataSource(solicitudCompra);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
