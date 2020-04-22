import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { ProductoData } from '../model/producto.model';
import { Dialogo } from '../model/dialogo.model';


const UNDEFINED_MESSAGE: Dialogo = {
  estado: undefined,
  mensaje: undefined,
  icono: undefined,
  titulo: undefined
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  getProductoEndPoint: string = 'api/Producto';
  postProductoEndPoint: string = 'api/Producto';
  putProductoEndPoint: string = 'api/Producto';
  deleteEndPoint: string = 'api/Producto';

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor( private http: HttpClient) { }

  getProductos(incluirInactivos: boolean): Observable<ProductoData[]> {
    this.loadingSubject.next(true);
    return this.http.get<ProductoData[]>(BASEURL + this.getProductoEndPoint)
      .pipe(
        tap(() => {this.emmitResult(UNDEFINED_MESSAGE);}),
        map(response => {
          return response['payLoad'];
        }),
        map(payLoad => {
          if (incluirInactivos) {
            return Object.values(payLoad);
          } else {
            return Object.values(payLoad.filter(p => p.activo));
          }
        }),
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }
  createProducto(descripcion: string, rubroId:string): Observable<Dialogo> {
    this.loadingSubject.next(true);
 
    return this.http.post<Dialogo>(BASEURL + this.postProductoEndPoint, { descripcion, rubroId })
      .pipe(
        tap(resp => {
          this.emmitResult(resp);
        }),
        catchError((err) => {
          of([])
          throw err
        }),
        finalize(() => {
          this.loadingSubject.next(false)
        })
      )
  }
  updateProducto(producto: ProductoData): Observable<Dialogo> {
    this.loadingSubject.next(true);
    return this.http.put<any>(BASEURL + this.putProductoEndPoint, producto).pipe(
      tap(resp => {
        this.emmitResult(resp);
      }),
      catchError((err) => {
        of([])
        throw err
      }),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )
  }

  deleteProducto(id: number): Observable<Dialogo> {
    this.loadingSubject.next(true);
    const url = `${BASEURL}${this.deleteEndPoint}?id=${id}`;   

    return this.http.delete<any>(url)
    .pipe(
      tap(resp => {
        this.emmitResult(resp);
      }),
      catchError((err) => {
        of([])
        throw err
      }),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )
  }


  private emmitResult(data: Dialogo): void {
    var dialogo: Dialogo = {
      estado: data['estado'],
      mensaje: data['mensaje'],
      icono: data['estado'] ? 'done' : 'error',
      titulo: data['estado'] ? 'Mensaje' : 'Error'
    }
    this.messageSubject.next(dialogo);
  }

}
