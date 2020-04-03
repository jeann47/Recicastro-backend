import { Router } from 'express';

import MaterialController from './app/controllers/MaterialController';

const routes = new Router();

routes.get('', (req, res) => res.json({ ok: 'work' }));

routes.post('/material', MaterialController.store);
routes.get('/material/:name', MaterialController.index);
routes.get('/materials', MaterialController.list);
routes.put('/material/:id', MaterialController.update);
routes.delete('/material/:id', MaterialController.delete);

export default routes;
