import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { Dialogo } from '../model/dialogo.model';
import { FuncionData } from '../model/funcion.model';

const UNDEFINED_MESSAGE: Dialogo = {
  estado: undefined,
  mensaje: undefined,
  icono: undefined,
  titulo: undefined
}

@Injectable({
  providedIn: 'root'
})
export class FuncionService {

  getFuncionEndPoint: string = 'api/Funcion';
  postFuncionEndPoint: string = 'api/Funcion';
  putFuncionEndPoint: string = 'api/Funcion';
  deleteEndPoint: string = 'api/Funcion';

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();


  constructor(private http: HttpClient) { }

  getFunciones(incluirInactivos: boolean): Observable<FuncionData[]> {
    this.loadingSubject.next(true);
    return this.http.get<FuncionData[]>(BASEURL + this.getFuncionEndPoint)
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
  onCreateFuncion(descripcion: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post<Dialogo>(BASEURL + this.postFuncionEndPoint, { "Descripcion": descripcion })
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
  onEditFuncion(funcion: FuncionData): Observable<Dialogo> {
    this.loadingSubject.next(true);
    return this.http.put<any>(BASEURL + this.putFuncionEndPoint, funcion).pipe(
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

  deleteFuncion(id: number): Observable<Dialogo> {
    this.loadingSubject.next(true);
    const url = `${BASEURL}${this.deleteEndPoint}?id=${id}`;

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
