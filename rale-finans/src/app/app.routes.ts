import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import userGuard from './guards/user.guard';
import UserPanelComponent from './components/user-panel/user-panel.component';
import AuthComponent from './components/auth/auth.component';
import PageNotFoundComponent from './components/page-not-found/page-not-found.component';
import ResourcesComponent from './components/resources/resources.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'user-panel',
    component: UserPanelComponent,
    canActivate: [userGuard],
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    canActivate: [userGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [userGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
