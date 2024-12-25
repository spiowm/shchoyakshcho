import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf} from "@angular/common";


interface FicoResponse {
  fico: number;
}

@Component({
  selector: 'app-fico-calculator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './fico-calculator.component.html',
  styleUrl: './fico-calculator.component.scss'
})
export class FicoCalculatorComponent {
  formData: { [key: string]: any } = {};
  ficoScore: number | null = null;
  isLoading = false;
  errorMessage = '';

  fields = [
    {
      id: 'total_credit_limit',
      label: 'Загальний кредитний ліміт',
      description: 'Сукупний кредитний ліміт за всіма вашими рахунками та картками.',
      min: 0,
    },
    // {
    //   id: 'used_credit_amount',
    //   label: 'Використані кредитні кошти',
    //   description: 'Загальна сума, яку ви вже використали з доступного кредитного ліміту.',
    //   min: 0,
    // },
    // {
    //   id: 'total_card_balance',
    //   label: 'Баланс на картках',
    //   description: 'Сума коштів, яка наразі є на всіх ваших картках.',
    //   min: 0,
    // },
    // {
    //   id: 'available_credit_limit',
    //   label: 'Доступний кредит',
    //   description: 'Сума, яка ще доступна для використання в межах кредитного ліміту.',
    //   min: 0,
    // },
    // {
    //   id: 'accounts_with_75_percent_limit',
    //   label: 'Рахунки з 75% доступного кредиту',
    //   description: 'Кількість рахунків, де залишок кредитного ліміту перевищує 75%.',
    //   min: 0,
    // },
    // {
    //   id: 'total_accounts',
    //   label: 'Кількість рахунків/карток',
    //   description: 'Сукупна кількість активних рахунків та кредитних карток.',
    //   min: 0,
    // },
    // {
    //   id: 'number_of_late_payments',
    //   label: 'Прострочення платежів',
    //   description: 'Число випадків, коли ви не вклалися у строк погашення кредиту.',
    //   min: 0,
    // },
    // {
    //   id: 'total_taken_credits',
    //   label: 'Усі отримані кредити',
    //   description: 'Загальна кількість кредитів або позик, які ви брали.',
    //   min: 0,
    // },
    // {
    //   id: 'credits_overdue_120_days',
    //   label: 'Прострочення понад 120 днів',
    //   description: 'Кредити, де термін прострочення перевищує 120 днів.',
    //   min: 0,
    // },
    // {
    //   id: 'number_of_bankruptcies',
    //   label: 'Банкрутства',
    //   description: 'Скільки разів ви оголошували про своє банкрутство.',
    //   min: 0,
    // },
    // {
    //   id: 'number_of_derogatory_records',
    //   label: 'Негативні записи',
    //   description: 'Кількість негативних моментів у вашій кредитній історії.',
    //   min: 0,
    // },
    // {
    //   id: 'non_exhausted_credit_accounts',
    //   label: 'Рахунки з невичерпаним кредитом',
    //   description: 'Кількість рахунків, де кредитний ліміт ще не вичерпано повністю.',
    //   min: 0,
    // },
    // {
    //   id: 'credits_overdue_30_days',
    //   label: 'Прострочення понад 30 днів',
    //   description: 'Кількість кредитів із простроченням понад 30 днів.',
    //   min: 0,
    // },
    // {
    //   id: 'months_since_first_credit',
    //   label: 'Час від першого кредиту',
    //   description: 'Кількість місяців, що минули з моменту отримання вашого першого кредиту.',
    //   min: 0,
    // },
    // {
    //   id: 'credits_taken_last_2_years',
    //   label: 'Кредити за останні 2 роки',
    //   description: 'Кількість кредитів, які ви оформили за останні два роки.',
    //   min: 0,
    // }
  ];


  ownershipOptions = [
    {id: 'OWN', label: 'Власне житло'},
    {id: 'MORTGAGE', label: 'Іпотека'},
    {id: 'NONE', label: 'Житло відсутнє'},
    {id: 'RENT', label: 'Оренда'},
    {id: 'OTHER', label: 'Інше'}
  ];

  constructor(private http: HttpClient) {
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<FicoResponse>('/api/calculate-fico/', this.formData).subscribe({
      next: (response) => {
        this.ficoScore = response.fico;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error calculating FICO', error);
        this.errorMessage = 'Помилка при розрахунку. Спробуйте ще раз.';
        this.isLoading = false;
      },
    });
  }


}
