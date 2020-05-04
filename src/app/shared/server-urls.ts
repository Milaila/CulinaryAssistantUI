import { environment } from 'src/environments/environment';

export const serverUrls = {
  recipes: environment.serverBaseUrl + 'recipes',
  images: environment.serverBaseUrl + 'images',
  auth: environment.serverBaseUrl + 'auth',
  profiles: environment.serverBaseUrl + 'profiles',
  products: environment.serverBaseUrl + 'products',
  filters: environment.serverBaseUrl + 'filters',
  tags: environment.serverBaseUrl + 'recipes/tags',
};
