import { Category } from './category.model';

export interface Settings {
  salary: number;
  salaryDay: number;
  creditCardDueDay: number;
  categories: Category[];
}

