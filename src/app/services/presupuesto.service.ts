import { Injectable } from '@angular/core';
import { Dialogo } from '../model/dialogo.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PresupuestoData } from '../model/presupuesto';
import { BASEURL } from '../url/conection-url';
import { tap, map, catchError, finalize } from 'rxjs/operators';

const UNDEFINED_MESSAGE: Dialogo = {
  estado: undefined,
  mensaje: undefined,
  icono: undefined,
  titulo: undefined
}

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  getPresupuestoEndPoint: string = 'api/PresupuestoCompra';
  postPresupuestoEndPoint: string = 'api/PresupuestoCompra';
  putPresupuestoEndPoint: string = 'api/PresupuestoCompra';
  deleteEndPoint: string = 'api/PresupuestoCompra';
  getPresupuestoByIdEndPoint: string = 'api/PresupuestoCompra/GetById'
  getPresupuestoByNumeroFechaProveedorSolicitudEndPoint: string = 'api/PresupuestoCompra/GetByNumeroFechaProveedorSolicitud'


  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor( private http: HttpClient) { }

  getPresupuestos(incluirInactivos: boolean): Observable<PresupuestoData[]> {
    this.loadingSubject.next(true);
    return this.http.get<PresupuestoData[]>(BASEURL + this.getPresupuestoEndPoint)
      .pipe(
        tap(() => {this.emmitResult(UNDEFINED_MESSAGE);}),
        map(response => {
          return response['payLoad'];
        }),
        map(payLoad => {
          if (incluirInactivos) {
            return Object.values(payLoad);
          } else {
            return Object.values(payLoad.filter(s => s.activo));
          }
        }),
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }
  getPresupuestoById(id: number): Observable<PresupuestoData> {

    const url = `${BASEURL}${this.getPresupuestoByIdEndPoint}?id=${id}`;

    return this.http.get<PresupuestoData>(url)
      .pipe(
        tap(() => { this.emmitResult(UNDEFINED_MESSAGE); }),
        map(response => {
          return response['payLoad'];
        }),
        catchError(() => of([])),
        finalize(() => { })
      );
  }

  createPresupuesto(presupuesto: PresupuestoData): Observable<PresupuestoData[]> {
    this.loadingSubject.next(true);
 
    this.loadingSubject.next(true);
    //presupuesto.activo = true;
    presupuesto.id = 0;
    return this.http.post<PresupuestoData[]>(BASEURL + this.postPresupuestoEndPoint, presupuesto)
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
  editPresupuesto(presupuesto: PresupuestoData): Observable<PresupuestoData> {
    this.loadingSubject.next(true);
    //presupuesto.activo = true;
    return this.http.put<any>(BASEURL + this.putPresupuestoEndPoint, presupuesto).pipe(
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

  deletePresupuesto(id: number): Observable<any> {
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
          this.loadingSubject.next(false);
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