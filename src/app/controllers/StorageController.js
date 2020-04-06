import * as Yup from 'yup';
import Storage from '../models/Storages';
import Material from '../models/Materials';
import Employee from '../models/Employees';

class StorageController {
  async store(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.number().required(),
      employee_id: Yup.number(),
      ammount: Yup.number().required(),
      sold: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'validation fails' });
    }

    const { material_id, employee_id } = req.body;

    if (material_id) {
      const material = await Material.findByPk(material_id);

      if (!material) {
        return res.status(404).json({ error: 'material not found' });
      }
    }
    if (employee_id) {
      const employee = await Employee.findByPk(employee_id);

      if (!employee) {
        return res.status(404).json({ error: 'employee not found' });
      }
    }

    const stored = await Storage.create(req.body);

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
          model: Employee,
          as: 'employee',
        },
      ],
    });

    return res.json(storage);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.number(),
      employee_id: Yup.number(),
      ammount: Yup.number(),
      sold: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'validation fails' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }
    const { material_id, employee_id } = req.body;

    if (material_id) {
      const material = await Material.findByPk(material_id);

      if (!material) {
        return res.status(404).json({ error: 'material not found' });
      }
    }
    if (employee_id) {
      const employee = await Employee.findByPk(employee_id);

      if (!employee) {
        return res.status(404).json({ error: 'employee not found' });
      }
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

    const unstored = await Storage.destroy({ where: { id } });
    if (!unstored) {
      return res.status(404).json({ error: 'storage not found' });
    }
    return res.json(unstored);
  }
}

export default new StorageController();
