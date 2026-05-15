import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Music, MusicService } from '../music.service'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule, MatSnackBarModule], 
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  allMusics: Music[] = []; 
  musicList: Music[] = []; 
  playlists: any[] = []; 
  
  searchTerm: string = ''; 
  displayedColumns: string[] = ['singer', 'song', 'genre', 'registrationDate']; 
  viewMode: 'cards' | 'table' = 'cards'; 

  // Variável para controlar qual menu de playlist está aberto
  activeMenuId: string | null = null;

  constructor(private http: HttpClient, private router: Router, private musicService: MusicService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log('ListComponent inicializado');
    this.fetchMusic();
    this.loadPlaylists(); 
  }

  // Função para abrir/fechar o menu de playlist no clique
  togglePlaylistMenu(event: Event, musicId: string): void {
    event.stopPropagation(); // Impede que o clique "vaze" para o card
    this.activeMenuId = this.activeMenuId === musicId ? null : musicId;
  }

  // Fecha o menu se clicar em qualquer outro lugar da tela
  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenuId = null;
  }

  loadPlaylists(): void {
    const saved = localStorage.getItem('myPlaylists');
    this.playlists = saved ? JSON.parse(saved) : [];
  }

  addToPlaylist(playlistId: number, music: Music): void {
    const savedPlaylists = JSON.parse(localStorage.getItem('myPlaylists') || '[]');
    const playlistIndex = savedPlaylists.findIndex((p: any) => p.id === playlistId);

    if (playlistIndex !== -1) {
      if (!savedPlaylists[playlistIndex].songs) {
        savedPlaylists[playlistIndex].songs = [];
      }
      const alreadyHas = savedPlaylists[playlistIndex].songs.some((s: any) => s._id === music._id);
      if (!alreadyHas) {
        savedPlaylists[playlistIndex].songs.push(music);
        localStorage.setItem('myPlaylists', JSON.stringify(savedPlaylists));
        this.snackBar.open(`🎵 ${music.song} adicionada!`, 'OK', { duration: 2000 });
        this.activeMenuId = null; // Fecha o menu após adicionar
      } else {
        this.snackBar.open('⚠️ Já está na playlist!', 'Fechar', { duration: 2000 });
      }
    }
  }

  fetchMusic(): void {
    this.musicService.getMusics().subscribe({
      next: (data) => {
        this.allMusics = data; 
        this.musicList = data; 
      },
      error: (error) => {
        console.error('Erro ao buscar as músicas', error);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.musicList = !term ? this.allMusics : this.allMusics.filter(m => 
      m.song.toLowerCase().includes(term) || m.singer.toLowerCase().includes(term)
    );
  }

  confirmDelete(musicId: string): void {
    if (window.confirm('Deseja excluir esta música?')) {
      this.deleteMusic(musicId);
    }
  }

  deleteMusic(musicId: string): void {
    this.musicService.deleteMusic(musicId).subscribe({
      next: () => {
        this.allMusics = this.allMusics.filter(m => m._id !== musicId);
        this.musicList = this.musicList.filter(m => m._id !== musicId);
        this.snackBar.open('Música excluída!', 'Fechar', { duration: 3000 });
      }
    });
  }

  viewDetails(musicId: string): void {
    this.router.navigate(['/details', musicId]); 
  }
  
  addNewMusic(): void {
    this.router.navigate(['/new']); 
  }

  getGenreGlow(genre: string): string {
    if (!genre) return 'hover:border-slate-500';
    switch(genre.toLowerCase()) {
      case 'pop': return 'hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'rock': return 'hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case 'sertanejo': return 'hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]';
      case 'internacional': return 'hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'eletrônica': return 'hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]';
      case 'mpb': return 'hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      default: return 'hover:border-slate-500';
    }
  }
}