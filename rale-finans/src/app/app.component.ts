import { Component, inject } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from "@angular/router";
import AuthGlobalService from "./services/global/auth-global.service";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <div id="index" class="flex flex-col min-h-screen">
      <mat-toolbar color="primary">
        <div class="flex items-center container mx-auto">
          <a
            class="mr-8 text-white hover:underline flex items-center"
            [routerLink]="['/home']"
            [routerLinkActive]="'border-b-2 border-white'"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <img src="assets/logo.png" alt="Logo" class="h-80 " />
          </a>

          <button
            class="mr-8 text-white hover:underline"
            [routerLink]="['/resources']"
            [routerLinkActive]="'border-b-2 border-white'"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            Finansal Eğitim
          </button>
          <ng-container *ngIf="user() as user; else showLoginButton">
            <button
              class="text-white hover:underline ml-auto"
              [routerLink]="['/user-panel']"
              [routerLinkActive]="'border-b-2 border-white'"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              {{ user.name | titlecase }} {{ user.surname | titlecase }}
            </button>
            <button mat-icon-button (click)="logout()" class="text-white mr-4">
              <mat-icon>logout</mat-icon>
            </button>
          </ng-container>
          <ng-template #showLoginButton>
            <button
              class="text-white hover:underline ml-auto"
              [routerLink]="['/auth']"
              [routerLinkActive]="'border-b-2 border-white'"
            >
              Giriş Yap
            </button>
          </ng-template>
        </div>
      </mat-toolbar>

      <div class="flex-grow container mx-auto">
        <router-outlet></router-outlet>
      </div>
      <mat-toolbar> </mat-toolbar>
    </div>
  `,
  styles: [],
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatIcon,
  ],
})
export class AppComponent {
  #authStore = inject(AuthGlobalService);
  user = this.#authStore.user;

  logout() {
    this.#authStore.logoutUser();
  }
}
