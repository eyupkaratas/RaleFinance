import { Injectable, signal, inject, computed } from "@angular/core";
import User from "../../models/user";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import environment from "../../../environments/environment";
import { HttpHeaders } from "@angular/common/http";
import Category from "../../models/category";
import { switchMap, of } from "rxjs";
import { catchError } from "rxjs";
import Transaction from "../../models/transaction";
import GroupedTransactions from "../../models/groupedTransactions";

@Injectable({
  providedIn: "root",
})
export default class AuthGlobalService {
  user = signal<User | null>(null);
  categories = signal<Category[] | null>([]);
  transactions = signal<Transaction[] | null>([]);
  jwt = signal<string | null>(null);
  totalIncome = computed<number>(() => this.calculateTotalIncome());

  dailyTransactions = computed<GroupedTransactions[]>(() =>
    this.groupTransactionsByDay()
  );
  weeklyTransactions = computed<GroupedTransactions[]>(() =>
    this.groupTransactionsByWeek()
  );
  monthlyTransactions = computed<GroupedTransactions[]>(() =>
    this.groupTransactionsByMonth()
  );

  exceededCategories = computed(() => {
    const categories = this.categories();
    const transactions = this.transactions();

    if (!categories || !transactions) {
      return [];
    }

    return categories.filter((category) => {
      const totalAmount = transactions
        .filter((transaction) => transaction.category === category.name)
        .reduce((sum, transaction) => {
          return transaction.isIncome
            ? sum + transaction.amount
            : sum - transaction.amount;
        }, 0);
      return -totalAmount > category.budget;
    });
  });

  readonly #http = inject(HttpClient);

  readonly #API_URL = environment.API_URL;

  constructor(private router: Router) {}

  loginUser(jwt: any) {
    this.jwt.set(jwt.token);
    const decodedToken = this.decodeToken(jwt.token);
    const userId = decodedToken.userId;

    this.#http
      .get<any>(`${this.#API_URL}/users/${userId}`)
      .pipe(
        switchMap((userData) => {
          const user: User = {
            id: userData.ID,
            email: "",
            password: "",
            name: userData.Name,
            surname: userData.Surname,
            goal_text: userData.GoalText,
            goal_value: userData.GoalValue,
          };
          this.user.set(user);

          const headers = new HttpHeaders({
            Authorization: jwt.token,
          });

          return this.#http
            .get<any>(`${this.#API_URL}/categories`, {
              headers,
            })
            .pipe(
              catchError((error) => {
                console.error("Error fetching categories:", error);
                this.categories.set([]);
                return of([]);
              }),
              switchMap((categoriesData) => {
                const categories: Category[] = categoriesData
                  ? categoriesData.map((cat: any) => ({
                      id: cat.ID,
                      name: cat.Name,
                      budget: cat.Budget,
                    }))
                  : [];
                this.categories.set(categories);

                const headers = new HttpHeaders({
                  Authorization: jwt.token,
                });

                return this.#http.get<any>(`${this.#API_URL}/transactions`, {
                  headers,
                });
              })
            );
        }),
        catchError((error) => {
          console.error("Error fetching data:", error);
          return of(null);
        })
      )
      .subscribe((transactionsData) => {
        if (transactionsData) {
          const categories = this.categories() || [];
          const transactions: Transaction[] = transactionsData.map(
            (trans: any) => {
              const category = categories.find(
                (cat) => cat.id === trans.CategoryID
              );
              return {
                id: trans.ID,
                amount: trans.Amount,
                dateTime: trans.DateTime,
                isIncome: trans.IsIncome,
                category: category ? category.name : "deleted",
              };
            }
          );
          this.transactions.set(transactions);
        }
        this.router.navigate(["/home"]);
      });
  }

  logoutUser() {
    this.user.set(null);

    this.router.navigate(["/auth"]);
  }

  decodeToken(token: string): any {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  calculateTotalIncome(): number {
    return this.transactions()!.reduce((acc, transaction) => {
      const amount = transaction.isIncome
        ? transaction.amount
        : -transaction.amount;
      return acc + amount;
    }, 0);
  }

  groupTransactionsByDay(): GroupedTransactions[] {
    const grouped: { [key: string]: GroupedTransactions } = {};

    this.transactions()!.forEach((transaction) => {
      const date = new Date(transaction.dateTime).toISOString().split("T")[0];
      const dayName = new Date(transaction.dateTime).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );

      if (!grouped[date]) {
        grouped[date] = {
          transactions: [],
          totalIncome: 0,
          name: dayName,
        };
      }

      grouped[date].transactions.push(transaction);
      grouped[date].totalIncome += transaction.isIncome
        ? transaction.amount
        : -transaction.amount;
    });

    return Object.values(grouped);
  }

  groupTransactionsByMonth(): GroupedTransactions[] {
    const grouped: { [key: string]: GroupedTransactions } = {};

    this.transactions()!.forEach((transaction) => {
      const date = new Date(transaction.dateTime);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!grouped[month]) {
        grouped[month] = {
          transactions: [],
          totalIncome: 0,
          name: monthName,
        };
      }

      grouped[month].transactions.push(transaction);
      grouped[month].totalIncome += transaction.isIncome
        ? transaction.amount
        : -transaction.amount;
    });

    return Object.values(grouped);
  }

  groupTransactionsByWeek(): GroupedTransactions[] {
    const grouped: { [key: string]: GroupedTransactions } = {};

    this.transactions()!.forEach((transaction) => {
      const date = new Date(transaction.dateTime);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startWeekNumber = this.getWeekNumber(startOfWeek);
      const endWeekNumber = this.getWeekNumber(endOfWeek);

      const year = startOfWeek.getFullYear();
      const weekKey = `${year}-${startWeekNumber}`;
      const weekName = `${startWeekNumber}/${52} ${year}`;

      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          transactions: [],
          totalIncome: 0,
          name: weekName,
        };
      }

      grouped[weekKey].transactions.push(transaction);
      grouped[weekKey].totalIncome += transaction.isIncome
        ? transaction.amount
        : -transaction.amount;
    });

    return Object.values(grouped);
  }

  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - startOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }
}
