import { ResolveFn } from '@angular/router';

export const gamesResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
