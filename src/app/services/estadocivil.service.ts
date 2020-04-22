import { Injectable } from '@angular/core';
import { EstadoCivil } from '../model/estadoCivil.model';
import { Dialogo } from '../model/dialogo.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UNDEFINED_MESSAGE } from '../miscelaneos/dialogo.undefined';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadocivilService {

  getEstadoCivilEndPoint: string = 'api/EstadoCivil';
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  // private refreshSectoresSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // refreshSectores$ = this.refreshSectoresSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllEstadoCivil(incluirInactivos: boolean): Observable<EstadoCivil[]> {
    this.loadingSubject.next(true);
    return this.http.get<EstadoCivil[]>(BASEURL + this.getEstadoCivilEndPoint)
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
