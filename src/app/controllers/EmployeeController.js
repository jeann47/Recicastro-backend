const Yup = require('yup');
const Employees = require('../models/Employees');
const Workflow = require('../models/WorkFlow');
const Storage = require('../models/Storages');

class EmployeeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      salary: Yup.number(),
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

    const employee = await Employees.findByPk(id, {
      include: [
        {
          model: Workflow,
          as: 'workflows',
          include: [
            {
              model: Storage,
              as: 'stored',
            },
          ],
        },
      ],
    });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    return res.json(employee);
  }

  async list(req, res) {
    const emp = await Employees.findAll({
      include: [
        {
          model: Workflow,
          as: 'workflows',
          include: [
            {
              model: Storage,
              as: 'stored',
            },
          ],
        },
      ],
    });

    return res.json(emp);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Id not provided' });

    const schema = Yup.object().shape({
      name: Yup.string(),
      salary: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const employee = await Employees.update(req.body, { where: { id } });

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

module.exports = new EmployeeController();
