import { Injectable } from '@angular/core';
import { Dialogo } from '../model/dialogo.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../url/conection-url';
import { tap, map, catchError, finalize } from 'rxjs/operators';
import { SolicitudCompraData } from '../model/SolicitudCompra.model';
import { ProductoData } from '../model/producto.model';


const UNDEFINED_MESSAGE: Dialogo = {
  estado: undefined,
  mensaje: undefined,
  icono: undefined,
  titulo: undefined
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudCompraService {

  getSolicitudCompraEndPoint: string = 'api/SolicitudCompra';
  postSolicitudCompraEndPoint: string = 'api/SolicitudCompra';
  putSolicitudCompraEndPoint: string = 'api/SolicitudCompra';
  getSolicitudCompraByIdEndPoint: string = 'api/SolicitudCompra/GetById'
  getSolicitudCompraByFechaSectorEndPoint: string = 'api/SolicitudCompra/GetByFechaSector'


  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor( private http: HttpClient) { }

  getSolicitudCompra(incluirInactivos: boolean): Observable<SolicitudCompraData[]> {
    this.loadingSubject.next(true);
    return this.http.get<SolicitudCompraData[]>(BASEURL + this.getSolicitudCompraEndPoint)
      .pipe(
        tap(() => {this.emmitResult(UNDEFINED_MESSAGE);}),
       
        map(response => {
          return response['payLoad'];
        }),
        map(payLoad => {
            return Object.values(payLoad);
        }),
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }
  getSolicitudCompraById(id: number): Observable<SolicitudCompraData> {

    const url = `${BASEURL}${this.getSolicitudCompraByIdEndPoint}?id=${id}`;

    return this.http.get<SolicitudCompraData>(url)
      .pipe(
        tap(() => { this.emmitResult(UNDEFINED_MESSAGE); }),
        map(response => {
          return response['payLoad'];
        }),
        catchError(() => of([])),
        finalize(() => { })
      );
  }

  createSolicitudCompra(solicitud: SolicitudCompraData): Observable<SolicitudCompraData[]> {
    this.loadingSubject.next(true);

    solicitud.id = 0;
    return this.http.post<SolicitudCompraData[]>(BASEURL + this.postSolicitudCompraEndPoint, solicitud)
      .pipe(
        catchError((err) => {
          of([])
          throw err
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
  }
  editSolicitudCompra(solicitud: SolicitudCompraData): Observable<SolicitudCompraData> {
    this.loadingSubject.next(true);
    return this.http.put<any>(BASEURL + this.putSolicitudCompraEndPoint, solicitud).pipe(
      tap(resp => {
        this.emmitResult(resp);
      }),
      catchError((err) => {
        of([])
        throw err
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    )
  }

  // fetchProducto(): Observable<ProductoData[]> {
  //   return this.http.get<ProductoData[]>(BASEURL + this.getSolicitudCompraEndPoint).pipe(
  //     map(response => {
  //       return response['payLoad'];
  //     }),
  //     map(payLoad => {
  //       return Object.values(payLoad);
       
  //     }),
  //     catchError(() => of([])),
  //     finalize(() => {
  //     })
  //   );
  // }



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