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

  fields = [
    {
      id: 'total_credit_limit',
      label: 'Загальний кредитний ліміт',
      description: 'Сукупний кредитний ліміт за всіма вашими рахунками та картками.'
    },
    {
      id: 'used_credit_amount',
      label: 'Використані кредитні кошти',
      description: 'Загальна сума, яку ви вже використали з доступного кредитного ліміту.'
    },
    {
      id: 'total_card_balance',
      label: 'Баланс на картках',
      description: 'Сума коштів, яка наразі є на всіх ваших картках.'
    },
    {
      id: 'available_credit_limit',
      label: 'Доступний кредит',
      description: 'Сума, яка ще доступна для використання в межах кредитного ліміту.'
    },
    {
      id: 'accounts_with_75_percent_limit',
      label: 'Рахунки з 75% доступного кредиту',
      description: 'Кількість рахунків, де залишок кредитного ліміту перевищує 75%.'
    },
    {
      id: 'total_accounts',
      label: 'Кількість рахунків/карток',
      description: 'Сукупна кількість активних рахунків та кредитних карток.'
    },
    {
      id: 'number_of_late_payments',
      label: 'Прострочення платежів',
      description: 'Число випадків, коли ви не вклалися у строк погашення кредиту.'
    },
    {
      id: 'total_taken_credits',
      label: 'Усі отримані кредити',
      description: 'Загальна кількість кредитів або позик, які ви брали.'
    },
    {
      id: 'credits_overdue_120_days',
      label: 'Прострочення понад 120 днів',
      description: 'Кредити, де термін прострочення перевищує 120 днів.'
    },
    {
      id: 'number_of_bankruptcies',
      label: 'Банкрутства',
      description: 'Скільки разів ви оголошували про своє банкрутство.'
    },
    {
      id: 'number_of_derogatory_records',
      label: 'Негативні записи',
      description: 'Кількість негативних моментів у вашій кредитній історії.'
    },
    {
      id: 'non_exhausted_credit_accounts',
      label: 'Рахунки з невичерпаним кредитом',
      description: 'Кількість рахунків, де кредитний ліміт ще не вичерпано повністю.'
    },
    {
      id: 'credits_overdue_30_days',
      label: 'Прострочення понад 30 днів',
      description: 'Кількість кредитів із простроченням понад 30 днів.'
    },
    {
      id: 'months_since_first_credit',
      label: 'Час від першого кредиту',
      description: 'Кількість місяців, що минули з моменту отримання вашого першого кредиту.'
    },
    {
      id: 'credits_taken_last_2_years',
      label: 'Кредити за останні 2 роки',
      description: 'Кількість кредитів, які ви оформили за останні два роки.'
    }
  ];


  ownershipOptions = [
    {id: 'home_ownership_OWN', label: 'Власне житло'},
    {id: 'home_ownership_MORTGAGE', label: 'Іпотека'},
    {id: 'home_ownership_NONE', label: 'Житло відсутнє'},
    {id: 'home_ownership_RENT', label: 'Оренда'},
    {id: 'home_ownership_ANY', label: 'Будь-яке'},
    {id: 'home_ownership_OTHER', label: 'Інше'},
  ];

  constructor(private http: HttpClient) {
  }

  onSubmit() {
    // Додаємо всі варіанти в форму, якщо вони не вибрані
    this.ownershipOptions.forEach(option => {
      if (!(option.id in this.formData)) {
        this.formData[option.id] = false;  // Якщо не вибрано, ставимо false
      }
    });

    // Тепер можемо відправляти форму
    this.http.post<{ fico: number }>('/api/calculate-fico/', this.formData).subscribe({
      next: (response) => {
        this.ficoScore = response.fico;
      },
      error: (error) => {
        console.error('Error calculating FICO', error);
      },
    });
  }


}
