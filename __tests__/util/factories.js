import faker from 'faker';
import { factory } from 'factory-girl';
import Materials from '../../src/app/models/Materials';
import Employees from '../../src/app/models/Employees';

factory.define('Material', Materials, {
  name: faker.commerce.product(),
  type: faker.commerce.department(),
  buy_price: faker.commerce.price(),
  sell_price: faker.commerce.price(),
});

factory.define('Employee', Employees, {
  name: faker.name.firstName(),
  days: [faker.date.future(), faker.date.future()],
  salary: faker.commerce.price(),
  unpaid: faker.random.number(),
});

export default factory;
