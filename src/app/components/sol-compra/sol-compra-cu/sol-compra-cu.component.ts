import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DetalleSolicitudCompraData, DetalleSolicitudCompraTable } from 'src/app/model/DetalleSolicitudCompra.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { SolicitudCompraService } from 'src/app/services/solicitud-compra.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductoData } from 'src/app/model/producto.model';
import { map, filter, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgenteService } from 'src/app/services/agente.service';

@Component({
  selector: 'sag-sol-compra-cu',
  templateUrl: './sol-compra-cu.component.html',
  styleUrls: ['./sol-compra-cu.component.scss']
})
export class SolCompraCuComponent implements OnInit {
  displayedColumns: string[] = ['id', 'productodesc', 'caracteristica','cantidad','gest'];
  checkedStatus: boolean = false;
  isLoading$: Observable<boolean>;

  productos$: Observable<ProductoData[]> 
  operacion: number;
  titulo$: Observable<string>;
  productosTable: string[]=[];
  datasource: MatTableDataSource<DetalleSolicitudCompraTable>;
  detalles: DetalleSolicitudCompraTable[]=[];
  productosCount: number;
  detalles$ = new Subject<DetalleSolicitudCompraTable[]>();
  

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('search', { static: false }) busqueda: ElementRef;

  detalleSolicitudform = this._formBuilder.group({
    id: [''],
    solicitudCompraId:  [''],
    productoId: [''],
    producto: [''],
    cantidad: [''],
    caracteristica: [''],
    fecha: [''],
    apeynomAgen: [''],
    sector:[''],
  });

  constructor(private _formBuilder: FormBuilder,
    private productoService: ProductoService,
    private agenteService: AgenteService,
    private solicitudCompraService: SolicitudCompraService,    
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  addRow(){    
    console.log("entre idolo");
    
    let detalle: DetalleSolicitudCompraTable = {
      id: this.detalleSolicitudform.get('productoId').value.id,
      productodesc: this.detalleSolicitudform.get('productoId').value.descripcion,
      cantidad: this.detalleSolicitudform.get('cantidad').value,
      caracteristica: this.detalleSolicitudform.get('caracteristica').value,
      disponible: true
    }
    this.detalles.push(detalle);
    this.detalles$.next(this.detalles);
    //this.getAllProductos().subscribe();
    //this.datasource = new MatTableDataSource(this.detalles);
  }

  ngOnInit() {
    this.productos$ = this.productoService.getProductos(false);
    console.log("ngOnInit");
    
    this.titulo$ = this.route.data.pipe(
      map(res => {
        return res.titulo
      })
    );

    this.route.data.subscribe(res => {
      this.operacion = res.operacion
    });
    this.getAllProductos().subscribe();

    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.get('id') !== null),
        switchMap((params: ParamMap) => this.agenteService.getAgenteById(+params.get('id'))),
        map(agente => {
          this.detalleSolicitudform.get('apeynomAgen').setValue(agente.apellido)
          this.detalleSolicitudform.get('sector').setValue(agente.sector)
          this.detalleSolicitudform.get('fecha').setValue(Date.now())          
          return agente;
        }),             
      );
  }
  
  private getAllProductos(): Observable<any> {
      return this.detalles$.asObservable().pipe(
        map(
        productos=>{
          this.getDataTableFunctions(productos)
        })
      );       
    }  
  private getDataTableFunctions(productos) {
    console.log(productos);
    this.productosCount = productos.length;
    this.datasource = new MatTableDataSource(productos);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

}
