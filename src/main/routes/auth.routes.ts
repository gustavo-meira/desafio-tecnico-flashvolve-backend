import { type Router } from 'express';
import { makeSignUpController } from '../factories/signup';
import { adaptExpressRoute } from '../adapters/expressRouteAdapter';
import { makeSignInController } from '../factories/signin';

export const signupRoutes = (router: Router): void => {
  router.post('/signup', adaptExpressRoute(makeSignUpController()));
  router.post('/signin', adaptExpressRoute(makeSignInController()));
};
