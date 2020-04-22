import { Injectable } from '@angular/core';
import { Sexo } from '../model/sexo.model';
import { BASEURL } from '../url/conection-url';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, finalize } from 'rxjs/operators';
import { UNDEFINED_MESSAGE } from '../miscelaneos/dialogo.undefined';
import { Dialogo } from '../model/dialogo.model';

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  sexoEndPoint: string = 'api/Sexo';
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchSexo(incluirInactivos: boolean): Observable<Sexo[]> {
    this.loadingSubject.next(true);
    return this.http.get<Sexo[]>(BASEURL + this.sexoEndPoint)
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
