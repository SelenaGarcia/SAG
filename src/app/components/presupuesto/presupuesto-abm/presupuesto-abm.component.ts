import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { map, filter, switchMap } from 'rxjs/operators';
import { PresupuestoService } from 'src/app/services/presupuesto.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { PresupuestoData } from 'src/app/model/presupuesto';
import { ProveedorData } from 'src/app/model/proveedor.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductoData } from 'src/app/model/producto.model';
import { solicitudDataTabla } from 'src/app/model/SolicitudCompra.model';


@Component({
  selector: 'sag-presupuesto-abm',
  templateUrl: './presupuesto-abm.component.html',
  styleUrls: ['./presupuesto-abm.component.scss']
})
export class PresupuestoAbmComponent implements OnInit {
 
  titulo$: Observable<string>;
  operacion: number;
  displayedColumns: string[] = ['id', 'producto', 'fecha', 'fechaVencimiento'];
  dataSource: MatTableDataSource<ProductoData>
  checkedStatus: boolean = false;
  dateFecha = new FormControl(new Date());
  dateFechaVencimiento = new FormControl(new Date());
  proveedores$: Observable<ProveedorData[]>;
  solicitudes$: Observable<ProductoData[]>;
   presupuestoForm = this._formBuilder.group({
     id: [''],
     numeroPresupuesto: ['', Validators.required],
     numeroSolicitud: [''],
     solicitudCompraId: [''],
     proveedorId: [''],
     proveedor: ['', Validators.required],
     fecha: [''],
     fechaVencimiento: [''],
     total: [''],
     activo: true,

  });

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;
  
  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private presupuestoService: PresupuestoService,
    private proveedorService: ProveedorService,
   //private solComprasService: solicitudDataTabla,
  ) { }

  ngOnInit() {

    this.proveedores$ = this.proveedorService.fetchProveedor(); 
   // this.solicitudes$= this.solComprasService.fetchProducto();

    this.titulo$ = this.route.data.pipe(
      map(res => {
        return res.titulo
      })
    );
    this.route.data.subscribe(res => {
      this.operacion = res.operacion
    });
    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.get('id') !== null),
        switchMap((params: ParamMap) => this.presupuestoService.getPresupuestoById(+params.get('id'))),
        map(presu => {
          this.presupuestoForm.setValue({ ...presu });
          this.presupuestoForm.get('proveedor').setValue(presu.proveedorId);
          return presu;
        }));
  }

  getTotalCost() {
    return 100;//this.proveedor.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }
  onSubmit() {

    if (this.presupuestoForm.valid) {
      let presupuestoData: PresupuestoData = this.presupuestoForm.value;

      presupuestoData.proveedorId = this.presupuestoForm.get('proveedor').value;
      presupuestoData.proveedor = '';
    
      if (this.operacion === 1) {
        this.presupuestoService.createPresupuesto(presupuestoData).subscribe(() => {
          
          this.router.navigate(['/presupuesto']);

        })
      }
      if (this.operacion === 2) {
        this.presupuestoService.editPresupuesto(presupuestoData).subscribe(() => {
          presupuestoData.proveedorId = this.presupuestoForm.get('proveedor').value;
          this.router.navigate(['/presupuesto']);
        })
      }
    }
  }
}

