import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Music {
  _id?: string; // Coloquei opcional porque no POST o ID ainda não existe
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

  constructor(private http: HttpClient) { }

  // Opções de Header para evitar cache (Boa prática de Pleno)
  private httpOptions = {
    headers: new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    })
  };

  // GET: Agora aceita um termo de busca para filtrar (Diferencial do teste)
  getMusics(searchTerm?: string): Observable<Music[]> {
    let params = new HttpParams().set('_', new Date().getTime().toString());
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<Music[]>(this.apiUrl, { ...this.httpOptions, params });
  }

  // POST: Criar uma nova música
  createMusic(music: Music): Observable<Music> {
    return this.http.post<Music>(this.apiUrl, music, this.httpOptions);
  }

  // GET: Obter uma música por ID
  getMusicById(id: string): Observable<Music> {
    return this.http.get<Music>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // PUT: Atualizar uma música
  updateMusic(id: string, music: Music): Observable<Music> {
    return this.http.put<Music>(`${this.apiUrl}/${id}`, music, this.httpOptions);
  }

  // DELETE: Excluir uma música
  deleteMusic(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicionamos OnDestroy
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit, OnDestroy {
  genreCounts: any = {};
  currentTime: Date = new Date(); // Variável que guarda a hora
  timer: any; // Referência do intervalo

  constructor() {}

  ngOnInit(): void {
    // Atualiza a hora a cada 1 segundo (1000ms)
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // Simulando dados de gêneros (mantenha sua lógica original aqui)
    this.genreCounts = { 'Pop': 1, 'Rock': 0, 'Sertanejo': 0, 'Internacional': 1, 'Eletrônica': 0, 'MPB': 0 };
  }

  // Limpa o relógio quando o componente for destruído
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  logout() {
    console.log('Saindo...');
    // Sua lógica de logout aqui
  }
}