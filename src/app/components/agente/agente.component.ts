import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AgenteData } from 'src/app/model/agente.model';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgenteService } from 'src/app/services/agente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { CustomSnackBarComponent } from '../shared/custom-snack-bar/custom-snack-bar.component';


@Component({
  selector: 'sag-agente',
  templateUrl: './agente.component.html',
  styleUrls: ['./agente.component.scss']
})
export class AgenteComponent implements OnInit {

  displayedColumns: string[] = ['apellido', 'nombre', 'gest'];
  dataSource: MatTableDataSource<AgenteData>
  agenteCount: number;
  checkedStatus: boolean = false;
  isLoading$: Observable<boolean>

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;



  constructor(        
    private agenteService: AgenteService,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit() {
    this.isLoading$ = this.agenteService.isLoading$;
    
    this.agenteService.message$.pipe(     
      filter(resp => resp.estado !== undefined),
      map(resp => {
        this.snackBar.openFromComponent(CustomSnackBarComponent,{
          data: resp,
        })
      })
    ).subscribe();
    this.getAllAgentes(this.checkedStatus).subscribe();

  }
  private getAllAgentes(incluirInactivos: boolean): Observable<any> {
    return this.agenteService.getAllAgentes(incluirInactivos)
      .pipe(
        map(agentes => {
          this.getDataTableFunctions(agentes);
        })
      );
  }
  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  private getDataTableFunctions(agentes) {
    this.agenteCount = agentes.length;
    this.dataSource = new MatTableDataSource(agentes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
