import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Importamos o Router

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit, OnDestroy {
  genreCounts: any = {};
  currentTime: Date = new Date(); 
  timer: any;

  // Injetamos o Router aqui no constructor
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    // Inicializando os contadores (incluindo os novos gêneros)
    this.genreCounts = { 
      'Pop': 0, 'Rock': 0, 'Sertanejo': 0, 'Internacional': 0, 
      'Eletrônica': 0, 'MPB': 0, 'Religioso': 0, 'Pagode': 0, 
      'Samba': 0, 'Funk': 0 
    };
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // AGORA O BOTÃO VAI FUNCIONAR!
  logout() {
    console.log('Encerrando sessão FOX Digital...');
    // Se você tiver token no localStorage, pode limpar aqui:
    // localStorage.removeItem('token'); 
    
    // Redireciona para a tela de login
    this.router.navigate(['/login']);
  }
}