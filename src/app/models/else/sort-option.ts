import { RecipeSort } from 'src/app/recipes/recipes-sort.enum';

export interface ISortOption {
  type: RecipeSort;
  name: string;
  title: string;
}
