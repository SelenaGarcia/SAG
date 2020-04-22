import { SectorData } from 'src/app/model/sector.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { BASEURL } from '../url/conection-url';
import { Dialogo } from '../model/dialogo.model';

const UNDEFINED_MESSAGE: Dialogo = {
  estado: undefined,
  mensaje: undefined,
  icono: undefined,
  titulo: undefined
}

@Injectable({ providedIn: 'root' })
export class SectorService {

  getSectorEndPoint: string = 'api/Sector';
  postSectorEndPoint: string = 'api/Sector';
  putSectorEndPoint: string = 'api/Sector';
  deleteEndPoint: string = 'api/Sector';

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  
  constructor(private http: HttpClient) { }

  getAllSectores(incluirInactivos: boolean): Observable<SectorData[]> {
    this.loadingSubject.next(true);
    return this.http.get<SectorData[]>(BASEURL + this.getSectorEndPoint)
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
  createSector(descripcion: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post<Dialogo>(BASEURL + this.postSectorEndPoint, { "Descripcion": descripcion })
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
  updateSector(sector: SectorData): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.put<Dialogo>(BASEURL + this.putSectorEndPoint, sector).pipe(
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

  deleteSector(id: number): Observable<any> {
    this.loadingSubject.next(true);
    const url = `${BASEURL}${this.deleteEndPoint}?id=${id}`;
    

    return this.http.delete<any>(url)
      .pipe(       
        map(resp => {
          var dialogo: Dialogo = {
            estado: resp['estado'],
            mensaje: resp['mensaje'],
            icono: resp['estado'] ? 'done' : 'error',
            titulo: resp['estado'] ? 'Mensaje' : 'Error'
          }
          return dialogo;
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


