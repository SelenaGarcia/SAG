import { SectorService } from './../../../services/sector.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SectorModalCuComponent } from './sector-modal-cu/sector-modal-cu.component';
import { SectorData, SectorModal } from 'src/app/model/sector.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogoDeleteComponent } from '../../shared/dialogo-delete/dialogo-delete.component';
import { DialogoEliminarModel } from "src/app/model/dialogo-eliminar-model";
import { filter, switchMap, map, concatMap, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../shared/custom-snack-bar/custom-snack-bar.component';


@Component({
  selector: 'sag-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {

  displayedColumns: string[] = ['descripcion', 'gest'];

  dataSource: MatTableDataSource<SectorData>;

  sectorCount: number;

  checkedStatus: boolean = false;

  isLoading$: Observable<boolean>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;

  constructor(
    public sectorCrudDialog: MatDialog,
    public dialogoEliminar: MatDialog,
    private sectorService: SectorService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.isLoading$ = this.sectorService.isLoading$;
    
    this.sectorService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();

    this.getAllSectores(this.checkedStatus).subscribe();
  }

  onCreateSector() {

    const data: SectorModal = {
      titulo: 'Nuevo Sector',
      operacion: 1,
      payload: { descripcion: '', id: null, activo: false }
    };

    const dialogRef = this.sectorCrudDialog.open(SectorModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onEditSector(row: SectorData) {
    const data: SectorModal = {
      titulo: 'Modificar Sector',
      operacion: 2,
      payload: { descripcion: row.descripcion, id: row.id, activo: row.activo }
    };

    const dialogRef = this.sectorCrudDialog.open(SectorModalCuComponent,
      {
        data: data
      });

    this.afterCloseModalCu(dialogRef).subscribe();

  }

  onDeleteSector(row: SectorData) {

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

    this.activarEliminarSector(dialogoEliminarRef, id).subscribe();
  }


  onActivateSector(row: SectorData) {
    const id = row.id;

    const data: DialogoEliminarModel = {
      icono: 'done',
      mensaje: 'Desea activar el Sector: ' + row.descripcion,
      titulo: 'Activar'
    }

    const dialogoEliminarRef = this.dialogoEliminar.open(DialogoDeleteComponent,
      {
        data: data,
      });

    this.activarEliminarSector(dialogoEliminarRef, id).subscribe();
  }

  onToggleCheck(event) {
    this.busqueda.nativeElement.value = '';
    this.checkedStatus = event.checked;
    this.getAllSectores(this.checkedStatus).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

// ________________________________ Metodos Privados____________________________



  private activarEliminarSector(dialogoEliminarRef: MatDialogRef<DialogoDeleteComponent>, id): Observable<any> {
    return dialogoEliminarRef.afterClosed().pipe(
      filter(estado => estado === true),
      switchMap(() => this.sectorService.deleteSector(id)),
      switchMap(() => this.getAllSectores(this.checkedStatus))
    );
  }


  private getAllSectores(incluirInactivos: boolean): Observable<any> {
    return this.sectorService.getAllSectores(incluirInactivos)
      .pipe(
        map(sectores => {
          this.getDataTableFunctions(sectores);
        })
      );
  }

  private getDataTableFunctions(sectores) {
    this.sectorCount = sectores.length;
    this.dataSource = new MatTableDataSource(sectores);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private afterCloseModalCu(dialogRef: MatDialogRef<SectorModalCuComponent>): Observable<any> {
    return dialogRef.afterClosed().pipe(
      concatMap(() => this.getAllSectores(this.checkedStatus)),
      first(),
    );
  }
}

