/* eslint-disable no-undef */
import request from 'supertest';
import factory from './util/factories';
import truncate from './util/truncate';
import app from '../src/app';

beforeEach(async () => {
  await truncate();
});

describe('Init', () => {
  it('should work', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: 'work' });
  });
});

describe('Materials', () => {
  it('should be able to add a material row', async () => {
    const material = await factory.attrs('Material');
    const res = await request(app).post('/material').send(material);
    expect(res.status).toBe(200);
  });
  it('should be able to find material rows by a substring', async () => {
    const material = await factory.attrs('Material');
    await request(app)
      .post('/material')
      .send({ ...material, name: 'something' });
    await request(app)
      .post('/material')
      .send({ ...material, name: 'something else' });

    const res = await request(app).get('/material/some');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should be able to find all materials', async () => {
    await factory.create('Material');
    await factory.create('Material');
    await factory.create('Material');
    await factory.create('Material');
    await factory.create('Material');
    await factory.create('Material');
    await factory.create('Material');

    const materials = await request(app).get('/materials');
    expect(materials.status).toBe(200);
  });

  it('should be able to update a material by his id', async () => {
    const mat = await factory.attrs('Material');

    const material = await request(app).post('/material').send(mat);

    const res = await request(app)
      .put(`/material/${material.body.id}`)
      .send({ name: 'new name' });

    expect(res.status).toBe(200);
  });

  it('should be able to delete a material by his id', async () => {
    const mat = await factory.attrs('Material');

    const material = await request(app).post('/material').send(mat);

    const res = await request(app).delete(`/material/${material.body.id}`);

    expect(res.status).toBe(200);
  });

  describe('Validation', () => {
    describe('Create', () => {
      it('should not be able to add a material without name', async () => {
        const material = await factory.attrs('Material');
        const res = await request(app)
          .post('/material')
          .send({ ...material, name: null });

        expect(res.status).toBe(400);
      });
      it('should not be able to add a material without a type', async () => {
        const material = await factory.attrs('Material');
        const res = await request(app)
          .post('/material')
          .send({ ...material, type: null });

        expect(res.status).toBe(400);
      });
      it('should not be able to add a material without a buy price', async () => {
        const material = await factory.attrs('Material');
        const res = await request(app)
          .post('/material')
          .send({ ...material, buy_price: null });

        expect(res.status).toBe(400);
      });
      it('should not be able to add a material without a sell price', async () => {
        const material = await factory.attrs('Material');
        const res = await request(app)
          .post('/material')
          .send({ ...material, sell_price: null });

        expect(res.status).toBe(400);
      });
    });
    describe('Update', () => {
      it('should not be able to update without providing a id', async () => {
        const mat = await factory.attrs('Material');

        await request(app).post('/material').send(mat);

        const res = await request(app)
          .put(`/material/${''}`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
      it('should not be able to update a unexistent material', async () => {
        const res = await request(app)
          .put(`/material/1337`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
    });
    describe('Delete', () => {
      it('should not be able to delete without providing a id', async () => {
        const mat = await factory.attrs('Material');

        await request(app).post('/material').send(mat);

        const res = await request(app)
          .delete(`/material/${''}`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });

      it('should not be able to delete a unexistent material', async () => {
        const res = await request(app)
          .delete(`/material/1337`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
    });
  });
});

describe('Employees', () => {
  it('should be able to add a employee row', async () => {
    const employee = await factory.attrs('Employee');
    const res = await request(app).post('/employee').send(employee);
    expect(res.status).toBe(200);
  });
  it('should be able to find a employee by his id', async () => {
    const employee = await factory.attrs('Employee');
    const data = await request(app).post('/employee').send(employee);

    const res = await request(app).get(`/employee/${data.body.id}`);
    expect(res.status).toBe(200);
  });

  it('should be able to update a salary by employee id', async () => {
    const employee = await factory.attrs('Employee');
    const data = await request(app).post('/employee').send(employee);

    const res = await request(app)
      .put(`/employee/${data.body.id}`)
      .send({ salary: 1337.99 });
    expect(res.status).toBe(200);

    const check = await request(app).get(`/employee/${data.body.id}`);

    expect(check.body.salary).toBe(1337.99);
  });
  it('should be able to add a worked day by employee id', async () => {
    const employee = await factory.attrs('Employee');
    const data = await request(app).post('/employee').send(employee);
    const res = await request(app)
      .put(`/employee/check/${data.body.id}`)
      .send({ day: new Date() });
    expect(res.status).toBe(200);
  });
  it('should be able to see how much you need to pay to the employee by his id', async () => {
    const employee = await factory.attrs('Employee');
    const data = await request(app).post('/employee').send(employee);
    const res = await request(app)
      .put(`/employee/pay/${data.body.id}`)
      .send({ ammount: 2 });
    expect(res.status).toBe(200);
    const check = await request(app).get(`/employee/${data.body.id}`);
    expect(data.body.unpaid - check.body.unpaid).toBe(2);
  });
  it('should be able to delete a employee by his id', async () => {
    const employee = await factory.attrs('Employee');
    const data = await request(app).post('/employee').send(employee);
    const res = await request(app).delete(`/employee/${data.body.id}`);
    expect(res.status).toBe(200);
  });
  describe('Validation', async () => {
    describe('Create', () => {
      it('should not be able to register an employee without name', async () => {
        const employee = await factory.attrs('Employee');
        const res = await request(app)
          .post('/employee')
          .send({ ...employee, name: null });
        expect(res.status).toBe(400);
      });
    });
    describe('Update', () => {
      it('should not be able to update without providing a id', async () => {
        const employee = await factory.attrs('Employee');

        await request(app).post('/employee').send(employee);

        const res = await request(app)
          .put(`/employee/${''}`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
      it('should not be able to update a unexistent Employee', async () => {
        const res = await request(app)
          .put(`/employee/1337`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
    });
    describe('Delete', () => {
      it('should not be able to delete without providing a id', async () => {
        const employee = await factory.attrs('Employee');

        await request(app).post('/employee').send(employee);

        const res = await request(app)
          .delete(`/employee/${''}`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });

      it('should not be able to delete a unexistent Employee', async () => {
        const res = await request(app)
          .delete(`/employee/1337`)
          .send({ name: 'new name' });

        expect(res.status).toBe(404);
      });
    });
  });
});
