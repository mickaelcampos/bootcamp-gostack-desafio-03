import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  // filtrar por delivery_id
  async index(req, res) {
    const deliveries = await DeliveryProblem.findAll();

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails, description is required' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: req.params.id,
      description: req.body.description,
    });
    return res.json(deliveryProblem);
  }

  /**
   * Cancela a encomenda com base no id do problema
   */
  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id);

    if (!problem) {
      return res.status(400).json({ error: 'Problem not exists' });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });
    delivery.canceled_at = new Date();

    await delivery.save();
    // envia email
    await Queue.add(CancellationMail.key, {
      delivery,
    });

    return res.json(delivery);
  }
}

export default new DeliveryProblemController();
