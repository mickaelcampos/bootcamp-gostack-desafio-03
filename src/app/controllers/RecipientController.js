import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      recipient: {
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      old_zip_code: Yup.string(),
      zip_code: Yup.string().when('old_zip_code', (old_zip_code, field) =>
        old_zip_code ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name } = req.body;

    const recipient = await Recipient.findByPk(req.userId);

    if (name !== recipient.name) {
      const recipientExists = await Recipient.findOne({ where: { name } });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists.' });
      }
    }

    const {
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.update(req.body);

    return res.json({
      recipient: {
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      },
    });
  }
}

export default new RecipientController();
