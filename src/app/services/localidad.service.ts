import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BASEURL } from '../url/conection-url';
import { tap, map, catchError, finalize, filter } from 'rxjs/operators';
import { Localidad } from '../model/localidad.model';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  localidadEndPoint: string = 'api/Localidad';

  constructor(private http: HttpClient) { }

  fetchLocalidades(provinciaId?: number): Observable<Localidad[]> {
    //this.loadingSubject.next(true);
    return this.http.get<Localidad[]>(BASEURL + this.localidadEndPoint).pipe(

      map(response => {
        return response['payLoad'];
      }),
      map(payLoad => {

        if (provinciaId) {
          return Object.values(payLoad.filter(p => p.provinciaId === provinciaId));
        } else {
          return Object.values(payLoad);
        }
      }),
      catchError(() => of([])),
      finalize(() => {
        //this.loadingSubject.next(false);
      })
    );
  }
}
