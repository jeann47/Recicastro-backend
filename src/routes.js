import { Router } from 'express';

import MaterialController from './app/controllers/MaterialController';
import EmployeeController from './app/controllers/EmployeeController';

const routes = new Router();

routes.get('', (req, res) => res.json({ ok: 'work' }));

routes.post('/material', MaterialController.store);
routes.get('/material/:name', MaterialController.index);
routes.get('/materials', MaterialController.list);
routes.put('/material/:id', MaterialController.update);
routes.delete('/material/:id', MaterialController.delete);

routes.post('/employee', EmployeeController.store);
routes.get('/employee/:id', EmployeeController.index);
routes.put('/employee/:id', EmployeeController.update);
routes.put('/employee/check/:id', EmployeeController.worked);
routes.put('/employee/pay/:id', EmployeeController.paid);
routes.delete('/employee/:id', EmployeeController.delete);

export default routes;
