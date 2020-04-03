import { Router } from 'express';

const routes = new Router();

routes.get('', (req, res) => res.json({ ok: 'work' }));


export default routes;
