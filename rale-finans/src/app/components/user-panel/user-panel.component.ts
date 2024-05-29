import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import AuthGlobalService from '../../services/global/auth-global.service';
import Category from '../../models/category';
import { inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import environment from '../../../environments/environment';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Validators } from '@angular/forms';
import User from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
  ],
  templateUrl: './user-panel.component.html',
})
export default class UserPanelComponent {
  readonly #API_URL = environment.API_URL;

  readonly #http = inject(HttpClient);

  authGlobalService = inject(AuthGlobalService);

  #snackbar = inject(MatSnackBar);

  #fb = inject(FormBuilder);

  financialForm = this.#fb.group({
    goalText: [
      this.authGlobalService.user()!.goal_text,
      [Validators.required, Validators.minLength(4)],
    ],
    goalValue: [
      this.authGlobalService.user()!.goal_value,
      [Validators.required, Validators.minLength(4)],
    ],
  });

  categoryForm = this.#fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    budget: ['', [Validators.required, Validators.minLength(2)]],
  });

  updateUser() {
    if (this.financialForm.valid) {
      const updatedUser = {
        GoalText: this.financialForm.value.goalText,
        GoalValue: this.financialForm.value.goalValue,
      };
      const headers = new HttpHeaders({
        Authorization: this.authGlobalService.jwt()!,
      });

      this.#http
        .put<any>(
          `${this.#API_URL}/users/${this.authGlobalService.user()!.id}`,
          updatedUser,
          {
            headers,
          }
        )
        .subscribe((response) => {
          const currentUser = this.authGlobalService.user();
          console.log(response);
          const updatedUserData = {
            ...currentUser,
            goal_text: response.GoalText,
            goal_value: response.GoalValue,
          };

          this.authGlobalService.user.set(updatedUserData as User);
          this.financialForm.markAsPristine();

          this.#snackbar.open('Başarıyla güncellendi', 'Kapat', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        });
    }
  }

  createCategory() {
    if (this.categoryForm.valid) {
      const newCategory = {
        Name: this.categoryForm.value.name,
        Budget: this.categoryForm.value.budget,
      };
      const headers = new HttpHeaders({
        Authorization: this.authGlobalService.jwt()!,
      });

      this.#http
        .post<any>(`${this.#API_URL}/categories`, newCategory, {
          headers,
        })
        .subscribe((response) => {
          const currentCategories = this.authGlobalService.categories() || [];
          console.log(response);

          const updatedCategory = {
            id: response.category.ID,
            name: response.category.Name,
            budget: response.category.Budget,
          };

          const updatedCategories = [...currentCategories, updatedCategory];

          this.authGlobalService.categories.set(updatedCategories);

          this.categoryForm.reset();
          Object.keys(this.categoryForm.controls).forEach((key) => {
            this.categoryForm.get(key)?.setErrors(null);
          });
          this.categoryForm.markAsPristine();
          this.categoryForm.markAsUntouched();

          this.#snackbar.open('Kategori oluşturuldu', 'Kapat', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        });
    }
  }

  updateCategory(category: Category) {
    const headers = new HttpHeaders({
      Authorization: this.authGlobalService.jwt()!,
    });

    const updatedCategoryData = {
      name: category.name,
      budget: category.budget,
    };

    this.#http
      .put<{ id: number; name: string; budget: number }>(
        `${this.#API_URL}/categories/${category.id}`,
        updatedCategoryData,
        { headers }
      )
      .subscribe((response) => {
        const categories = this.authGlobalService.categories()!.map((cat) => {
          if (cat.id === response.id) {
            return {
              ...cat,
              name: response.name,
              budget: response.budget,
            };
          }
          return cat;
        });
        this.authGlobalService.categories.set(categories);

        this.#snackbar.open('Kategori güncellendi', 'Kapat', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      });
  }

  deleteCategory(categoryId: number) {
    const headers = new HttpHeaders({
      Authorization: this.authGlobalService.jwt()!,
    });

    this.#http
      .delete(`${this.#API_URL}/categories/${categoryId}`, {
        headers,
      })
      .subscribe(() => {
        const categories = this.authGlobalService
          .categories()!
          .filter((cat) => cat.id !== categoryId);
        this.authGlobalService.categories.set(categories);

        this.#snackbar.open('Kategori silindi', 'Kapat', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      });
  }
}
