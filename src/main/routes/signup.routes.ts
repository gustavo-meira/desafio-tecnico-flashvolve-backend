import { type Router } from 'express';

export const signupRoutes = (router: Router): void => {
  router.post('/signup', (req, res) => {
    res.status(201).send();
  });
};
