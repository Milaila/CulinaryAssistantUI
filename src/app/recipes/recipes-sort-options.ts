import { RecipeSort } from './recipes-sort.enum';
import { ISortOption } from '../models/else/sort-option';

export const RECIPE_SORT_OPTIONS: ISortOption[] = [
  {
    type: RecipeSort.TitleAsc,
    name: 'За назвою (від А до Я)',
    title: 'cортування за назвою (від А до Я)'
  },
  {
    type: RecipeSort.TitleDesc,
    name: 'За назвою (від Я до А)',
    title: 'cортування за назвою (від Я до А)'
  },
  {
    type: RecipeSort.DateDesc,
    name: 'За датою створення (від нових до старих)',
    title: 'cортування за датою створення (від нових до старих)'
  },
  {
    type: RecipeSort.DateAsc,
    name: 'За датою створення (від старих до нових)',
    title: 'cортування за датою створення (від старих до нових)'
  },
];
