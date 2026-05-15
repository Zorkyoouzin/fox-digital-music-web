import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Adicionado Router aqui
import { CommonModule } from '@angular/common';
import { MusicService } from './music.service';
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

  // Injetamos o Router aqui no construtor
  constructor(private musicService: MusicService, private router: Router) {}

  ngOnInit(): void {
    // Relógio Real-time (MANTIDO)
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // 1. Faz a contagem inicial ao abrir o sistema
    this.loadAndCountGenres();

    // 2. Se inscreve para ouvir o "rádio" do serviço
    this.refreshSub = this.musicService.refreshNeeded$.subscribe(() => {
      this.loadAndCountGenres();
    });
  }

  loadAndCountGenres() {
    this.musicService.getMusics().subscribe(musics => {
      const counts: any = { 
        'Pop': 0, 'Rock': 0, 'Sertanejo': 0, 'Religioso': 0, 
        'Samba': 0, 'Funk': 0, 'Internacional': 0, 'MPB': 0 
      };

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

  // FUNÇÃO DE SAIR CORRIGIDA
  logout() {
    console.log('Saindo do sistema FOX...');
    
    // Limpa os dados de sessão (Opcional, mas boa prática)
    localStorage.clear();
    sessionStorage.clear();

    // Redireciona para a tela de login
    this.router.navigate(['/login']);
  }
}