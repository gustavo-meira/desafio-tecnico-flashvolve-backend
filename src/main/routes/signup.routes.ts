import { type Router } from 'express';
import { makeSignUpController } from '../factories/signup';
import { adaptExpressRoute } from '../adapters/expressRouteAdapter';

export const signupRoutes = (router: Router): void => {
  router.post('/signup', adaptExpressRoute(makeSignUpController()));
};
