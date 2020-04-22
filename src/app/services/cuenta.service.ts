import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Dialogo } from '../model/dialogo.model';
import { HttpClient } from '@angular/common/http';
import { CuentaData } from '../model/cuenta';
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
export class CuentaService {
  getCuentaEndPoint: string = 'api/Cuenta';
  postCuentaEndPoint: string = 'api/Cuenta';
  putCuentaEndPoint: string = 'api/Cuenta';
  deleteEndPoint: string = 'api/Cuenta';

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();


  constructor(private http: HttpClient) { }

  getCuentas(incluirInactivos: boolean): Observable<CuentaData[]> {
    this.loadingSubject.next(true);
    return this.http.get<CuentaData[]>(BASEURL + this.getCuentaEndPoint)
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
  onCreateCuenta(descripcion: string, numero:string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post<Dialogo>(BASEURL + this.postCuentaEndPoint, { "Descripcion": descripcion, "numero":numero })
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
  onEditCuenta(cuenta: CuentaData): Observable<Dialogo> {
    this.loadingSubject.next(true);
    return this.http.put<any>(BASEURL + this.putCuentaEndPoint, cuenta).pipe(
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

  deleteCuenta(id: number): Observable<Dialogo> {
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
