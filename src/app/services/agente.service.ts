import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Dialogo } from '../model/dialogo.model';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../url/conection-url';
import { AgenteData } from '../model/agente.model';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { UNDEFINED_MESSAGE } from '../miscelaneos/dialogo.undefined';

@Injectable({
  providedIn: 'root'
})
export class AgenteService {

  getAgenteEndPoint: string = 'api/Agente';
  postAgenteEndPoint: string = 'api/Agente';
  putAgenteEndPoint: string = 'api/Agente';
  deleteAgenteEndPoint: string = 'api/Agente';
  getAgenteByIdEndPoint: string = 'api/Agente/GetById'

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  private messageSubject: BehaviorSubject<Dialogo> = new BehaviorSubject<Dialogo>(UNDEFINED_MESSAGE);
  message$ = this.messageSubject.asObservable();
  
  
  constructor(private http: HttpClient) {}
    
    getAllAgentes(incluirInactivos: boolean): Observable<AgenteData[]> {
      return this.http.get<AgenteData[]>(BASEURL + this.getAgenteEndPoint)
        .pipe(
          tap(() => {this.emmitResult(UNDEFINED_MESSAGE);}),
          map(response => {
            console.log(response);
            return response['payLoad'];
          }),
          map(payLoad => {
            console.log(payLoad);
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

    getAgenteById(agenteId: number): Observable<AgenteData> {

      const url = `${BASEURL}${this.getAgenteByIdEndPoint}?id=${agenteId}`;
  
      return this.http.get<AgenteData>(url)
        .pipe(
          tap(() => { this.emmitResult(UNDEFINED_MESSAGE); }),
          map(response => {
            return response['payLoad'];
          }),
          catchError(() => of([])),
          finalize(() => { })
        );
    }
  



    onCreateAgente(agente: AgenteData): Observable<AgenteData[]> {
      this.loadingSubject.next(true);
  
      return this.http.post<AgenteData[]>(BASEURL + this.postAgenteEndPoint, agente )
        .pipe(
          tap(response => console.log(response)),
          map(resp => {
            return (resp['payLoad']);
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
    onDeleteAgente(id: number): Observable<Dialogo> {
      this.loadingSubject.next(true);
      const url = `${BASEURL}${this.deleteAgenteEndPoint}?id=${id}`;
  
      return this.http.delete<any>(url)
        .pipe(
          map(resp => {
            return this.dialogoResult(resp);
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
  private dialogoResult(data): Dialogo {
    var dialogo: Dialogo = {
      estado: data['estado'],
      mensaje: data['mensaje'],
      icono: data['estado'] ? 'done' : 'error',
      titulo: data['estado'] ? 'Mensaje' : 'Error'
    }
    return dialogo;
  }
}
