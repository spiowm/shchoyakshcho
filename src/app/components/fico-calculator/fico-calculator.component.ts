import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";


interface FicoResponse {
  prediction: number;
}

@Component({
  selector: 'app-fico-calculator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule,
    DecimalPipe
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
      description: 'Сукупний ліміт коштів, який ви можете позичити на всіх ваших рахунках та картках.',
      min: 0,
    },
    {
      id: 'used_credit_amount',
      label: 'Використані кредитні кошти',
      description: 'Загальна сума, яку ви витратили з доступного кредитного ліміту.',
      min: 0,
    },
    {
      id: 'available_credit_limit',
      label: 'Доступний кредит',
      description: 'Сума, яка ще доступна для використання в межах вашого кредитного ліміту.',
      min: 0,
    },
    {
      id: 'accounts_with_late_payments',
      label: 'Рахунки з простроченнями',
      description: 'Кількість рахунків, на яких коли-небудь було протерміновано виплату.',
      min: 0,
    },
    {
      id: 'total_accounts',
      label: 'Загальна кількість рахунків',
      description: 'Загальна кількість ваших рахунків та кредитних карток.',
      min: 0,
    },
    {
      id: 'number_of_derogatory_records',
      label: 'Кількість негативних записів',
      description: 'Кількість негативних записів у вашій кредитній історії (наприклад, судові позови).',
      min: 0,
    },
    {
      id: 'number_of_collections',
      label: 'Кількість боргів у колекторах',
      description: 'Кількість боргів, переданих до колекторських агентств.',
      min: 0,
    },
    {
      id: 'months_since_first_credit',
      label: 'Місяців від першого кредиту',
      description: 'Кількість місяців, що минуло з моменту, коли ви відкрили перший кредитний рахунок або взяли перший кредит.',
      min: 0,
    },
    {
      id: 'accounts_with_75_percent_limit',
      label: 'Рахунки з більше ніж 75% доступного кредиту',
      description: 'Кількість рахунків, де залишок доступного кредиту перевищує 75%.',
      min: 0,
    },
    {
      id: 'credits_overdue_120_days',
      label: 'Прострочення понад 120 днів',
      description: 'Кількість кредитів, у яких прострочення перевищує 120 днів.',
      min: 0,
    },
    {
      id: 'total_taken_credits',
      label: 'Загальна кількість взятих кредитів',
      description: 'Загальна кількість кредитів або позик, які ви отримали.',
      min: 0,
    },
    {
      id: 'credits_taken_last_2_years',
      label: 'Кредити за останні 2 роки',
      description: 'Кількість кредитів, оформлених вами протягом останніх двох років.',
      min: 0,
    },
    {
      id: 'total_card_balance',
      label: 'Загальний баланс на картках',
      description: 'Загальна сума коштів, що знаходиться на всіх ваших картках.',
      min: 0,
    },
    {
      id: 'total_income',
      label: 'Сумарний дохід',
      description: 'Ваш загальний дохід, який враховується при оцінці кредитоспроможності.',
      min: 0,
    },
    {
      id: 'monthly_debt_payments',
      label: 'Щомісячні виплати боргу',
      description: 'Сума, яку ви сплачуєте щомісяця за своїми боргами.',
      min: 0,
    },
    {
      id: 'credits_overdue_30_days',
      label: 'Прострочення понад 30 днів',
      description: 'Кількість кредитів, у яких прострочення перевищує 30 днів.',
      min: 0,
    }
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

    // Оновлюємо формат значення home_ownership перед відправкою
    const ownershipTypes = ['OWN', 'MORTGAGE', 'NONE', 'RENT', 'OTHER', 'ANY'];
    ownershipTypes.forEach(type => {
      this.formData[`home_ownership_${type}`] = 0; // Ініціалізуємо всі значення як 0
    });

    // Якщо вибрано значення, оновлюємо відповідне поле, інакше встановлюємо ANY = 1
    if (this.formData['home_ownership']) {
      this.formData[`home_ownership_${this.formData['home_ownership']}`] = 1;
    } else {
      this.formData['home_ownership_ANY'] = 1;
    }

    delete this.formData['home_ownership']; // Видаляємо оригінальне поле


    this.http.post<FicoResponse>('https://fico-api-8840c024e496.herokuapp.com/predict/', this.formData,
      {headers: { 'Content-Type': 'application/json' }
      }).subscribe({
      next: (response) => {
        this.ficoScore = response.prediction;
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
