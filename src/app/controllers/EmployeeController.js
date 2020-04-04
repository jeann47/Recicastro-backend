import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Employees from '../models/Employees';

class EmployeeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      days: Yup.array(),
      salary: Yup.number(),
      unpaid: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const employee = await Employees.create(req.body);

    return res.json(employee);
  }

  async index(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Id not provided' });

    const employee = await Employees.findByPk(id);

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    return res.json(employee);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Id not provided' });

    const schema = Yup.object().shape({
      name: Yup.string(),
      days: Yup.array(),
      salary: Yup.number(),
      unpaid: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const employee = await Employees.update(req.body, { where: { id } });

    if (!employee[0])
      return res.status(404).json({ error: 'employee not found' });

    return res.json(employee);
  }

  async worked(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Id not provided' });

    const schema = Yup.object().shape({
      day: Yup.date().required(),
    });
    const { day } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const employee = await Employees.update(
      {
        days: Sequelize.fn('array_append', Sequelize.col('days'), day),
        $inc: { unpaid: 1 },
      },
      { where: { id } }
    );

    if (!employee[0])
      return res.status(404).json({ error: 'employee not found' });

    return res.json(employee);
  }

  async paid(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Id not provided' });

    const { ammount } = req.body;

    if (!ammount)
      return res.status(400).json({ error: 'insert a valid value (>0)' });

    const employee = await Employees.update(
      { unpaid: Sequelize.literal(`unpaid - ${ammount}`) },
      {
        where: { id },
      }
    );

    if (!employee[0])
      return res.status(404).json({ error: 'employee not found' });

    return res.json(employee);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not provided' });
    }

    const ex = await Employees.destroy({ where: { id } });
    if (!ex) return res.status(404).json({ error: 'Employee not found' });

    return res.json({ deleted: true });
  }
}

export default new EmployeeController();
