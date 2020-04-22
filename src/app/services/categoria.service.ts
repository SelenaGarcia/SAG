import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CategoriaData } from '../model/categoria.model';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize, tap } from 'rxjs/operators';
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
export class CategoriaService {

  getCategoriaEndPoint: string = 'api/Categoria';
  postCategoriaEndPoint: string = 'api/Categoria';
  putCategoriaEndPoint: string = 'api/Categoria';
  deleteEndPoint: string = 'api/Categoria';

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategorias(incluirInactivos: boolean): Observable<CategoriaData[]> {
    return this.http.get<CategoriaData[]>(BASEURL + this.getCategoriaEndPoint)
      .pipe(
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
  createCategoria(descripcion: string): Observable<Dialogo> {
    this.loadingSubject.next(true);
    return this.http.post<Dialogo>(BASEURL + this.postCategoriaEndPoint, { "Descripcion": descripcion })
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
  updateCategoria(categoria: CategoriaData): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.put<Dialogo>(BASEURL + this.putCategoriaEndPoint, categoria).pipe(
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

  deleteCategoria(id: number): Observable<any> {
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





