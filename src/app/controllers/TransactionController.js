import * as Yup from 'yup';
import sequelize from 'sequelize';
import Transactions from '../models/Transactions';
import Materials from '../models/Materials';
import Storage from '../models/Storages';

class TransactionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.number(),
      in_out: Yup.boolean(),
      price: Yup.number().required(),
      amount: Yup.number().required(),
      note: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const transaction = await Transactions.create(req.body);

    if (req.body.material_id) {
      const sum = await Transactions.findAll({
        where: { material_id: req.body.material_id, in_out: false },
        attributes: [
          [sequelize.literal('SUM(price * amount)'), 'product'],
          [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
        ],
      });

      const { product, amount } = sum[0].dataValues;

      const sub = await Storage.findAll({
        where: { material_id: req.body.material_id },
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'amount']],
      });

      const subt = await Transactions.findAll({
        where: { in_out: true, material_id: req.body.material_id },
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'amount']],
      });

      await Materials.update(
        {
          buy_price: product / amount,
          amount: amount - sub[0].dataValues.amount - subt[0].dataValues.amount,
        },
        { where: { id: req.body.material_id } }
      );
    }

    return res.json(transaction);
  }

  async index(req, res) {
    const { name } = req.params;
    if (!name) {
      return res.status(401).json({ error: 'the name cannot be empty' });
    }

    const log = await Transactions.findAll({
      where: { name },
      attributes: { exclude: ['updatedAt'] },
    });

    return res.json(log);
  }

  async list(req, res) {
    const all = await Transactions.findAll({
      include: [
        {
          model: Materials,
          as: 'material',
          attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['updatedAt'],
      },
    });
    let sum = 0;
    all.forEach((transaction) => {
      const { amount, price, in_out } = transaction;
      sum += in_out ? amount * price : -(amount * price);
    });
    return res.json({ all, sum });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      material_id: Yup.string(),
      in_out: Yup.boolean(),
      price: Yup.number(),
      amount: Yup.number(),
      note: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not provided' });
    }

    const ok = await Transactions.update(req.body, { where: { id } });

    if (!ok[0]) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (req.body.material_id) {
      const sum = await Transactions.findAll({
        where: { material_id: req.body.material_id },
        attributes: [
          [sequelize.literal('SUM(price * amount)'), 'product'],
          [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
        ],
      });

      const { product, amount } = sum[0].dataValues;

      const sub = await Storage.findAll({
        where: { material_id: req.body.material_id },
        attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'amount']],
      });

      await Materials.update(
        {
          buy_price: product / amount,
          amount: amount - sub[0].dataValues.amount,
        },
        { where: { id: req.body.material_id } }
      );
    }

    return res.json(ok);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not provided' });
    }

    const deleted = await Transactions.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    return res.json(deleted);
  }
}

export default new TransactionController();
