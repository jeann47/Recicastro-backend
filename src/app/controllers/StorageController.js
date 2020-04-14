import * as Yup from 'yup';
import 'dotenv/config';
import sequelize from 'sequelize';
import Storage from '../models/Storages';
import Material from '../models/Materials';
import Workflow from '../models/WorkFlow';
import Employees from '../models/Employees';

class StorageController {
  async store(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.number().required(),
      employee_id: Yup.number().required(),
      amount: Yup.number().required(),
      date: Yup.date(),
      sold: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { material_id, employee_id, date, amount, sold } = req.body;

    const material = await Material.findByPk(material_id);

    if (!material) {
      return res.status(404).json({ error: 'material not found' });
    }

    const wf = await Workflow.findOrCreate({
      where: { employee_id, createdAt: date },
    });

    const stored = await Storage.create({
      material_id,
      workflow_id: wf[0].id,
      amount,
      createdAt: date,
      sold,
    });

    if (material_id) {
      await Material.update(
        { amount: sequelize.literal(`amount -${amount}`) },
        { where: { id: material_id } }
      );
    }

    return res.json(stored);
  }

  async index(req, res) {
    const { id } = req.params;
    const stored = await Storage.findByPk(id, {
      include: [{ all: true }],
    });

    return res.json(stored);
  }

  async list(req, res) {
    const storage = await Storage.findAll({
      include: [
        {
          model: Material,
          as: 'material',
        },
        {
          model: Workflow,
          as: 'workflow',
          include: [
            {
              model: Storage,
              as: 'stored',
            },
            {
              model: Employees,
              as: 'employee',
            },
          ],
        },
      ],
    });

    return res.json(storage);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.number(),
      workflow_id: Yup.number(),
      amount: Yup.number(),
      sold: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'validation fails' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const ok = await Storage.update(req.body, { where: { id } });
    if (!ok[0]) {
      return res.status(404).json({ error: 'storage not found' });
    }
    return res.json(ok);
  }

  async delete(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const stored = await Storage.findByPk(id);

    if (stored) {
      await Material.update(
        { amount: sequelize.literal(`amount +${stored.dataValues.amount}`) },
        { where: { id: stored.dataValues.material_id } }
      );
    }

    const unstored = await Storage.destroy({ where: { id } });
    if (!unstored) {
      return res.status(404).json({ error: 'storage not found' });
    }
    return res.json(unstored);
  }
}

export default new StorageController();
