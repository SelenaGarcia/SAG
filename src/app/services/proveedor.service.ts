import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProveedorData } from '../model/proveedor.model';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize, tap, first } from 'rxjs/operators';
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
export class ProveedorService {


  getProveedoresEndPoint: string = 'api/Proveedor';
  postProveedoresEndPoint: string = 'api/Proveedor';
  putProveedoresEndPoint: string = 'api/Proveedor';
  deleteEndPoint: string = 'api/Proveedor';
  getProveedorByIdEndPoint: string = 'api/Proveedor/GetById'

  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProveedores(incluirInactivos: boolean): Observable<ProveedorData[]> {
    this.loadingSubject.next(true);
    return this.http.get<ProveedorData[]>(BASEURL + this.getProveedoresEndPoint)
      .pipe(
        tap(() => { this.emmitResult(UNDEFINED_MESSAGE); }),
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

  getProveedorById(proveedorId: number): Observable<ProveedorData> {

    const url = `${BASEURL}${this.getProveedorByIdEndPoint}?id=${proveedorId}`;

    return this.http.get<ProveedorData>(url)
      .pipe(
        tap(() => { this.emmitResult(UNDEFINED_MESSAGE); }),
        map(response => {
          return response['payLoad'];
        }),
        catchError(() => of([])),
        finalize(() => { })
      );
  }


  createProveedor(proveedor: ProveedorData): Observable<ProveedorData[]> {
    this.loadingSubject.next(true);
    proveedor.activo = true;
    proveedor.id = 0;
    return this.http.post<ProveedorData[]>(BASEURL + this.postProveedoresEndPoint, proveedor)
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
  EditProveedor(proveedor: ProveedorData): Observable<ProveedorData> {
    this.loadingSubject.next(true);
    proveedor.activo = true;
    return this.http.put<any>(BASEURL + this.putProveedoresEndPoint, proveedor).pipe(
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

  DeleteProveedor(id: number): Observable<any> {
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

  fetchProveedor(): Observable<ProveedorData[]> {
    return this.http.get<ProveedorData[]>(BASEURL + this.getProveedoresEndPoint).pipe(
      map(response => {
        return response['payLoad'];
      }),
      map(payLoad => {
        return Object.values(payLoad);
       
      }),
      catchError(() => of([])),
      finalize(() => {
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
