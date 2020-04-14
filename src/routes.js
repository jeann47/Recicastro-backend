const { Router } = require('express');

const MaterialController = require('./app/controllers/MaterialController');
const EmployeeController = require('./app/controllers/EmployeeController');
const StorageController = require('./app/controllers/StorageController');
const TransactionController = require('./app/controllers/TransactionController');
const WorkFlowController = require('./app/controllers/WorkFlowController');

const routes = new Router();

routes.get('', (req, res) => res.json({ ok: 'work' }));

routes.post('/material', MaterialController.store);
routes.get('/material/:name', MaterialController.index);
routes.get('/materials', MaterialController.list);
routes.put('/material/:id', MaterialController.update);
routes.delete('/material/:id', MaterialController.delete);

routes.post('/employee', EmployeeController.store);
routes.get('/employees', EmployeeController.list);
routes.get('/employee/:id', EmployeeController.index);
routes.put('/employee/:id', EmployeeController.update);
routes.delete('/employee/:id', EmployeeController.delete);

routes.post('/workflow', WorkFlowController.store);
routes.get('/workflows', WorkFlowController.list);
routes.get('/workflow/:id', WorkFlowController.index);
routes.put('/workflow/:id', WorkFlowController.update);
routes.delete('/workflow/:id', WorkFlowController.delete);

routes.post('/storage', StorageController.store);
routes.get('/storage/:id', StorageController.index);
routes.get('/storages', StorageController.list);
routes.put('/storage/:id', StorageController.update);
routes.delete('/storage/:id', StorageController.delete);

routes.post('/transaction', TransactionController.store);
routes.get('/transactions', TransactionController.list);
routes.get('/transactions/:name', TransactionController.index);
routes.put('/transaction/:id', TransactionController.update);
routes.delete('/transaction/:id', TransactionController.delete);

module.exports = routes;
