import * as Yup from 'yup';
import Transactions from '../models/Transactions';

class TransactionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      in_out: Yup.boolean(),
      price: Yup.number().required(),
      ammount: Yup.number().required(),
      note: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const transaction = await Transactions.create(req.body);

    return res.json(transaction);
  }

  async index(req, res) {
    const all = await Transactions.findAll();
    let sum = 0;
    all.forEach((transaction) => {
      const { ammount, price, in_out } = transaction;
      sum += in_out ? ammount * price : -(ammount * price);
    });
    return res.json({ all, sum });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      in_out: Yup.boolean(),
      price: Yup.number(),
      ammount: Yup.number(),
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
