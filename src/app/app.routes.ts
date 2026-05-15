import { Routes } from '@angular/router';
import { MusicComponent } from './music/music.component';
import { NewsComponent } from './music/news/news.component';
import { DetailsComponent } from './music/details/details.component';
import { ListComponent } from './music/list/list.component';
import { LoginComponent } from './login/login.component'; // <-- Importamos o Login
import { PlaylistsComponent } from './music/playlists/playlists.component'; // <-- Importamos as Playlists

export const routes: Routes = [
    {
        // 1. Quando o usuário entra no site raiz, ele é jogado pro Login
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        // 2. A rota isolada do Login (sem a barra lateral)
        path: 'login',
        component: LoginComponent,
    },
    {
        // 3. O painel principal (com a barra lateral) e suas páginas filhas
        path: '',
        component: MusicComponent,
        children: [
            {
                path: 'new',
                component: NewsComponent,
            },
            {
                path: 'details/:id',
                component: DetailsComponent,
            },
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'playlists',
                component: PlaylistsComponent, // <-- A rota da nova tela!
            }
        ]
    }
];