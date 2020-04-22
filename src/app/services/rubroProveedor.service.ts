import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RubroProveedorData } from '../model/rubroProveedor.model';
import { BASEURL } from '../url/conection-url';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Dialogo } from '../model/dialogo.model';
import { UNDEFINED_MESSAGE } from '../miscelaneos/dialogo.undefined';



@Injectable({
  providedIn: 'root'
})
export class RubroProveedorService {
  
  getRubroEndPoint: string = 'api/RubroProveedor';
  postRubroEndPoint: string = 'api/RubroProveedor';
  putRubroEndPoint: string = 'api/RubroProveedor';
  deleteRubroEndPoint: string = 'api/RubroProveedor';


  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllRubros(incluirInactivos: boolean): Observable<RubroProveedorData[]> {
    return this.http.get<RubroProveedorData[]>(BASEURL + this.getRubroEndPoint)
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
  updateRubro(rubro: RubroProveedorData): Observable<any> {
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

  fetchRubroProveedores(): Observable<any> {
    this.loadingSubject.next(true);

    return this.http.get<RubroProveedorData[]>(BASEURL + this.getRubroEndPoint).pipe(
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
