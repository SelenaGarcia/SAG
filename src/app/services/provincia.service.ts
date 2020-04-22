import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Provincia } from '../model/provincia.model';
import { BASEURL } from '../url/conection-url';
import { map, catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  provinciaEndPoint: string = 'api/Provincia';

  constructor(private http: HttpClient) { }

  fetchProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(BASEURL + this.provinciaEndPoint).pipe(
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
}
