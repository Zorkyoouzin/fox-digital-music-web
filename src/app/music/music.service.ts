import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importante para o gatilho do contador

export interface Music {
  _id?: string; 
  singer: string;
  song: string;
  genre: string;
  registrationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  // Ajustado para o seu Docker/Localhost na porta 5000
  private apiUrl = 'http://localhost:5000/api/music'; 

  // --- ADIÇÃO PARA O REQUISITO DO CONTADOR ---
  // O Subject funciona como um rádio avisando a Sidebar para recontar os gêneros
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }
  // -------------------------------------------

  constructor(private http: HttpClient) { }

  // Opções de Header para evitar cache (MANTIDO)
  private httpOptions = {
    headers: new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    })
  };

  // GET: MANTIDO com termo de busca e timestamp para evitar cache
  getMusics(searchTerm?: string): Observable<Music[]> {
    let params = new HttpParams().set('_', new Date().getTime().toString());
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<Music[]>(this.apiUrl, { ...this.httpOptions, params });
  }

  // POST: MODIFICADO apenas para disparar o aviso de "Música Nova"
  createMusic(music: Music): Observable<Music> {
    return this.http.post<Music>(this.apiUrl, music, this.httpOptions).pipe(
      tap(() => {
        this._refreshNeeded$.next(); // Avisa a Sidebar para aumentar o contador
      })
    );
  }

  // GET: Obter uma música por ID (MANTIDO)
  getMusicById(id: string): Observable<Music> {
    return this.http.get<Music>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // PUT: Atualizar uma música (MANTIDO)
  updateMusic(id: string, music: Music): Observable<Music> {
    return this.http.put<Music>(`${this.apiUrl}/${id}`, music, this.httpOptions).pipe(
      tap(() => {
        this._refreshNeeded$.next(); // Avisa a Sidebar caso o gênero tenha mudado
      })
    );
  }

  // DELETE: MODIFICADO apenas para disparar o aviso de "Música Removida"
  deleteMusic(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        this._refreshNeeded$.next(); // Avisa a Sidebar para diminuir o contador
      })
    );
  }
}