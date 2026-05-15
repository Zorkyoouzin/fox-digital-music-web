import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true; 
  username = '';
  password = '';
  statusMessage: string = '';
  statusType: 'error' | 'success' | null = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  toggleMode(event: Event) {
    event.preventDefault(); 
    this.isLoginMode = !this.isLoginMode;
    this.username = ''; 
    this.password = '';
    this.limparStatus();
  }

  definirStatus(mensagem: string, tipo: 'error' | 'success') {
    this.limparStatus();
    this.statusMessage = mensagem;
    this.statusType = tipo;
    this.cdr.detectChanges(); 
  }

  limparStatus() {
    this.statusMessage = '';
    this.statusType = null;
  }

  onSubmit() {
    this.limparStatus();
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');

    if (this.isLoginMode) {
      const validUser = users.find((u: any) => u.username === this.username && u.password === this.password);
      if (validUser) {
        localStorage.setItem('userToken', 'token-vip-' + this.username);
        this.definirStatus('Login efetuado com sucesso!', 'success');
        setTimeout(() => { this.router.navigate(['/list']); }, 1200);
      } else {
        this.definirStatus('Usuário ou senha incorretos!', 'error');
      }
    } else {
      const userExists = users.find((u: any) => u.username === this.username);
      if (userExists) {
        this.definirStatus('Nome de utilizador em uso!', 'error');
      } else if (this.username && this.password) {
        users.push({ username: this.username, password: this.password });
        localStorage.setItem('appUsers', JSON.stringify(users));
        this.definirStatus('Registo realizado com sucesso!', 'success');
        setTimeout(() => {
          this.limparStatus();
          this.isLoginMode = true; 
          this.password = ''; 
          this.cdr.detectChanges();
        }, 1200);
      }
    }
  }
}