import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Dialogo } from '../model/dialogo.model';
import { UNDEFINED_MESSAGE } from '../miscelaneos/dialogo.undefined';
import { HttpClient } from '@angular/common/http';
import { RubroProductoData } from '../model/rubroProducto.model';
import { BASEURL } from '../url/conection-url';
import { tap, map, catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RubroProductoService {

  getRubroEndPoint: string = 'api/Rubro';
  postRubroEndPoint: string = 'api/Rubro';
  putRubroEndPoint: string = 'api/Rubro';
  deleteRubroEndPoint: string = 'api/Rubro';


  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllRubros(incluirInactivos: boolean): Observable<RubroProductoData[]> {
    return this.http.get<RubroProductoData[]>(BASEURL + this.getRubroEndPoint)
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
  onCreateRubro(descripcion: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post<Dialogo>(BASEURL + this.postRubroEndPoint, { "Descripcion": descripcion })
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
  updateRubro(rubro: RubroProductoData): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.put<Dialogo>(BASEURL + this.putRubroEndPoint, rubro).pipe(
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

  deleteRubro(id: number): Observable<any> {
    this.loadingSubject.next(true);
    const url = `${BASEURL}${this.deleteRubroEndPoint}?id=${id}`;

    return this.http.delete<Dialogo>(url)
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

  fetchRubroProducto(): Observable<any> {
    this.loadingSubject.next(true);

    return this.http.get<RubroProductoData[]>(BASEURL + this.getRubroEndPoint).pipe(
      map(response => {
        return response['payLoad'];
      }),
      map(payLoad => {
        return Object.values(payLoad);
       
      }),
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    );
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
