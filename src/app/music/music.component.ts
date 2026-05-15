import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MusicService } from './music.service'; // Certifique-se do caminho
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit, OnDestroy {
  // Objeto que reflete exatamente os 8 gêneros da sua Sidebar
  genreCounts: any = { 
    'Pop': 0, 'Rock': 0, 'Sertanejo': 0, 'Religioso': 0, 
    'Samba': 0, 'Funk': 0, 'Internacional': 0, 'MPB': 0 
  };
  
  currentTime: Date = new Date();
  timer: any;
  private refreshSub: Subscription = new Subscription();

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    // Relógio Real-time (MANTIDO)
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // 1. Faz a contagem inicial ao abrir o sistema
    this.loadAndCountGenres();

    // 2. Se inscreve para ouvir o "rádio" do serviço
    // Toda vez que cadastrar ou deletar, ele roda a contagem de novo
    this.refreshSub = this.musicService.refreshNeeded$.subscribe(() => {
      this.loadAndCountGenres();
    });
  }

  loadAndCountGenres() {
    this.musicService.getMusics().subscribe(musics => {
      // Reseta os 8 gêneros para não acumular lixo
      const counts: any = { 
        'Pop': 0, 'Rock': 0, 'Sertanejo': 0, 'Religioso': 0, 
        'Samba': 0, 'Funk': 0, 'Internacional': 0, 'MPB': 0 
      };

      // Percorre as músicas vindas do MongoDB e soma
      musics.forEach(m => {
        if (counts[m.genre] !== undefined) {
          counts[m.genre]++;
        }
      });
      this.genreCounts = counts;
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  logout() {
    console.log('Saindo do sistema FOX...');
  }
}