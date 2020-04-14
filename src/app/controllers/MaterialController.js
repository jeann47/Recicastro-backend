const { Op } = require('sequelize');
const Yup = require('yup');
const Materials = require('../models/Materials');

class MaterialController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      type: Yup.string().required(),
      buy_price: Yup.number(),
      sell_price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const material = await Materials.create(req.body);
    const { id, name, type, buy_price, sell_price, createdAt } = material;

    return res.json({
      id,
      name,
      type,
      buy_price,
      sell_price,
      created_at: createdAt,
    });
  }

  async index(req, res) {
    const { name } = req.params;
    if (!name)
      return res.status(400).json({ error: 'the name cannot be empty' });
    const materials = await Materials.findAll({
      where: { name: { [Op.substring]: name } },
    });

    return res.json(materials);
  }

  async list(req, res) {
    const materials = await Materials.findAll({
      attributes: {
        exclude: ['createdAt'],
      },
    });

    return res.json(materials);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      type: Yup.string(),
      buy_price: Yup.number(),
      sell_price: Yup.number(),
      amount: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    if (!req.params.id)
      return res.status(400).json({ error: 'id not provided' });

    const material = await Materials.update(req.body, {
      where: { id: req.params.id },
    });

    if (!material[0])
      return res.status(404).json({ error: 'material not found' });

    return res.json(material);
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ error: 'id not provided' });

      const material = await Materials.destroy({ where: { id } });
      if (!material)
        return res.status(404).json({ error: 'material not found' });

      return res.json({ deleted: true });
    } catch (err) {
      return res.status(401).json(err);
    }
  }
}

module.exports = new MaterialController();
