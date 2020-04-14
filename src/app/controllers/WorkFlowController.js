const Yup = require('yup');
const Workflow = require('../models/WorkFlow');
const Storage = require('../models/Storages');
const Employee = require('../models/Employees');
const Materials = require('../models/Materials');

class WorkFlowController {
  async store(req, res) {
    const schema = Yup.object().shape({
      paid: Yup.boolean(),
      employee_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const wf = await Workflow.create(req.body);

    return res.json(wf);
  }

  async index(req, res) {
    const { id } = req.params;
    const wf = await Workflow.findByPk(id, {
      include: [
        {
          model: Storage,
          as: 'stored',
          include: [
            {
              model: Materials,
              as: 'material',
            },
          ],
        },
        {
          model: Employee,
          as: 'employee',
        },
      ],
    });
    return res.json(wf);
  }

  async list(req, res) {
    const wf = await Workflow.findAll({
      include: [
        {
          model: Storage,
          as: 'stored',
          include: [
            {
              model: Materials,
              as: 'material',
            },
          ],
        },
        {
          model: Employee,
          as: 'employee',
        },
      ],
    });
    return res.json(wf);
  }

  async update(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ error: 'Id not provided' });
    }

    const updated = await Workflow.update(req.body, { where: { id } });

    if (!updated[0]) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    return res.json({ updated: true });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Id not provided' });
      }

      const deleted = await Workflow.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      return res.json({ deleted: true });
    } catch (err) {
      return res.status(401).json(err);
    }
  }
}

module.exports = new WorkFlowController();
