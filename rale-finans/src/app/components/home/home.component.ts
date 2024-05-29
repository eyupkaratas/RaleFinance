import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { inject } from '@angular/core';
import AuthGlobalService from '../../services/global/auth-global.service';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import environment from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';
import Transaction from '../../models/transaction';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import GroupedTransactions from '../../models/groupedTransactions';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatRadioModule,
    NgStyle,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatOption,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
  ],
  templateUrl: './home.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly #API_URL = environment.API_URL;

  readonly #http = inject(HttpClient);

  authGlobalService = inject(AuthGlobalService);

  #snackbar = inject(MatSnackBar);
  #fb = inject(FormBuilder);
  displayedColumns: string[] = ['category', 'cost'];

  expandedElement: GroupedTransactions | null = null;

  formVisible = false;

  myForm = this.#fb.group({
    isIncome: ['', Validators.required],
    category: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
  });

  openForm() {
    this.formVisible = true;
  }
  closeForm() {
    this.formVisible = false;
  }

  isBoxOpen = false;

  createTransaction() {
    if (this.myForm.valid) {
      const newTransaction = {
        dateTime: new Date().toISOString(),
        amount: this.myForm.value.amount,
        isIncome: +this.myForm.value.isIncome!,
        categoryId: this.myForm.value.category,
      };
      const headers = new HttpHeaders({
        Authorization: this.authGlobalService.jwt()!,
      });

      this.#http
        .post<any>(`${this.#API_URL}/transactions`, newTransaction, { headers })
        .subscribe((response) => {
          const currentTransactions =
            this.authGlobalService.transactions() || [];

          const category = this.authGlobalService
            .categories()!
            .find((c) => c.id === response.transaction.CategoryID);

          const updatedTransaction: Transaction = {
            id: response.transaction.ID,
            dateTime: response.transaction.DateTime,
            amount: response.transaction.Amount,
            isIncome: response.transaction.IsIncome,
            category: category ? category.name : 'deleted',
          };

          const updatedTransactions = [
            ...currentTransactions,
            updatedTransaction,
          ];

          this.authGlobalService.transactions.set(updatedTransactions);

          this.myForm.reset();
          Object.keys(this.myForm.controls).forEach((key) => {
            this.myForm.get(key)?.setErrors(null);
          });
          this.myForm.markAsPristine();
          this.myForm.markAsUntouched();
          this.closeForm();

          this.#snackbar.open('İşlem eklendi', 'Kapat', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        });
    }
  }
}
