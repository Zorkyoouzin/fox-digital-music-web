import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MusicService } from '../music.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  musicForm: FormGroup;
  
  // 1. OBJETO COM OS 8 GÊNEROS EXATOS DA SIDEBAR
  // Essa variável garante que o sistema saiba o que contar
  genreCounts: { [key: string]: number } = {
    'Pop': 0, 
    'Rock': 0, 
    'Sertanejo': 0, 
    'Religioso': 0, 
    'Samba': 0, 
    'Funk': 0, 
    'Internacional': 0, 
    'MPB': 0
  };

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private musicService: MusicService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) { 
    // MANTIDA TODA A SUA LÓGICA DE VALIDAÇÃO ORIGINAL
    this.musicForm = this.formBuilder.group({
      singer: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      song: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      genre: ['Pop', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]], 
      registrationDate: [new Date().toISOString().substring(0, 10), Validators.required], 
    });
  }

  // 2. INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    // Busca os dados assim que abre a tela para alinhar com a Sidebar
    this.updateGenreCounts();
  }

  // 3. LÓGICA DE ATUALIZAÇÃO DO CONTADOR (REQUISITO 2)
  // Essa função lê o banco e atualiza os números que a Sidebar vai mostrar
  updateGenreCounts(): void {
    this.musicService.getMusics().subscribe({
      next: (musics) => {
        // Reseta os valores para não somar lixo
        Object.keys(this.genreCounts).forEach(key => this.genreCounts[key] = 0);
        
        // Loop que faz o "Internacional +1" ou "Rock +1"
        musics.forEach(music => {
          if (this.genreCounts[music.genre] !== undefined) {
            this.genreCounts[music.genre]++;
          }
        });
        console.log('Contadores sincronizados:', this.genreCounts);
      },
      error: (err) => console.error('Erro ao sincronizar contadores:', err)
    });
  }

  // 4. SUBMISSÃO DO FORMULÁRIO (MANTIDA E MELHORADA)
  onSubmit() {
    if (this.musicForm.valid) {
      const newMusic = this.musicForm.value;
      this.musicService.createMusic(newMusic).subscribe({
        next: (response) => {
          console.log('Música cadastrada com sucesso!', response);
          
          this.snackBar.open('🚀 Música cadastrada e contador atualizado!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          
          // ATUALIZA O CONTADOR ANTES DE VOLTAR
          this.updateGenreCounts();
          
          this.musicForm.reset();
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar a música:', error);
          this.snackBar.open('Erro ao cadastrar a música. Tente novamente.', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        complete: () => {
          console.info('Cadastro de música completo');
        }
      });
    } else {
      // Mantido o comportamento de validação visual
      this.musicForm.markAllAsTouched();
      console.log('Formulário inválido');
    }
  }

  // 5. NAVEGAÇÃO DE RETORNO
  listMusics(): void {
    this.router.navigate(['/list']);
  }
  
  // 6. MENSAGENS DE ERRO (MANTIDAS)
  getErrorMessage(controlName: string): string {
    const control = this.musicForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório.';
    }
    if (control?.hasError('minlength')) {
      return `O mínimo de caracteres é ${control.errors?.['minlength'].requiredLength}.`;
    }
    if (control?.hasError('maxlength')) {
      return `O máximo de caracteres é ${control.errors?.['maxlength'].requiredLength}.`;
    }
    return '';
  }
}