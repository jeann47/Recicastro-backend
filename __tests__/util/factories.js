import faker from 'faker';
import { factory } from 'factory-girl';
import Materials from '../../src/app/models/Materials';

factory.define('Material', Materials, {
  name: faker.commerce.product(),
  type: faker.commerce.department(),
  buy_price: faker.commerce.price(),
  sell_price: faker.commerce.price(),
});

export default factory;
