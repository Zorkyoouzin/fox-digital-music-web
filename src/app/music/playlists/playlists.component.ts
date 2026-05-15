import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Playlist {
  id: number;
  name: string;
  createdAt: Date;
  songs?: any[]; // Array para guardar as músicas do banco
}

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null; // Guarda a playlist que abrimos
  newPlaylistName: string = '';
  showInput: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    const savedPlaylists = localStorage.getItem('myPlaylists');
    if (savedPlaylists) {
      this.playlists = JSON.parse(savedPlaylists);
    }
  }

  // --- LÓGICA DE NAVEGAÇÃO INTERNA ---

  viewPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
    console.log('Abrindo playlist:', playlist.name);
  }

  closePlaylist() {
    this.selectedPlaylist = null;
    this.loadPlaylists(); // Recarrega para garantir que os dados estão frescos
  }

  // --- GESTÃO DA PLAYLIST ---

  toggleInput() {
    this.showInput = !this.showInput;
    this.newPlaylistName = ''; 
  }

  createPlaylist() {
    if (this.newPlaylistName.trim()) {
      const newList: Playlist = {
        id: Date.now(),
        name: this.newPlaylistName,
        createdAt: new Date(),
        songs: []
      };
      this.playlists.push(newList);
      this.saveToStorage();
      this.showInput = false;
      this.newPlaylistName = '';
      this.snackBar.open('Playlist criada!', 'OK', { duration: 2000 });
    }
  }

  deletePlaylist(id: number) {
    if (confirm('Deseja excluir a playlist inteira?')) {
      this.playlists = this.playlists.filter(p => p.id !== id);
      this.saveToStorage();
      this.snackBar.open('Playlist removida.', 'OK', { duration: 2000 });
    }
  }

  removeSongFromPlaylist(musicId: string) {
    if (this.selectedPlaylist && this.selectedPlaylist.songs) {
      this.selectedPlaylist.songs = this.selectedPlaylist.songs.filter(s => s._id !== musicId);
      
      // Atualiza na lista geral para salvar
      const index = this.playlists.findIndex(p => p.id === this.selectedPlaylist?.id);
      if (index !== -1) {
        this.playlists[index] = this.selectedPlaylist;
        this.saveToStorage();
        this.snackBar.open('Música removida da playlist.', 'OK', { duration: 2000 });
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('myPlaylists', JSON.stringify(this.playlists));
  }
}