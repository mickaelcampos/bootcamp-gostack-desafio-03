import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    // paginate?
    const deliverymans = await Deliveryman.findAll({
      where: { inative: false },
    });
    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // update on avatar?
  // need check if avatar_id is valid
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * verify avatar_id is valid
     */

    const avatarExists = await File.findByPk(req.body.avatar_id);

    if (!avatarExists) {
      return res.status(400).json({ error: 'avatar_id is invalid' });
    }

    /**
     * verify email exists
     */
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: "Deliveryman don't exists." });
    }

    const { id, name, email, avatar_id } = await deliverymanExists.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    deliveryman.inative = true;

    await deliveryman.save();

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
