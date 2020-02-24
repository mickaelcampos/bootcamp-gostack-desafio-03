import {
  format,
  setSeconds,
  setMinutes,
  setHours,
  isAfter,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

class DistributionController {
  /**
   * GET https://fastfeet.com/deliveryman/1/deliveries
   * listar encomendas que ja foram entregues por ele, com base em seu DI de cadastro
   */
  async index(req, res) {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
    });
    return res.json(deliveries);
  }

  /**
   * Retirada para entrega
   * O entregador só pode fazer 5 retiradas por dia
   */
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.body.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found ' });
    }

    const interval = ['00:00', '18:00'];

    const formattedInterval = interval.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(new Date(), hour), minute),
        0
      );
      return {
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
      };
    });

    // const now = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");
    /**
     * verifica se a hora atual esta entre 8 e 18
     */
    const validInteval =
      isBefore(new Date(), new Date(formattedInterval[1].value)) && // 2020-02-24T02:00:00-03:00
      isAfter(new Date(), new Date(formattedInterval[0].value)); // 2020-02-24T22:00:00-03:00

    if (!validInteval) {
      return res.status(400).json({
        error: 'deliveries can only be withdrawn between 8 am and 6 pm',
      });
    }

    /**
     * Verifica se o entregador possui mais de 5 entregas associadas
     */

    const overloaded = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: delivery.deliveryman_id,
        start_date: {
          [Op.not]: null,
        },
      },
    });

    if (overloaded.count >= 5) {
      return res.status(400).json({ error: 'You are overloaded' });
    }

    delivery.start_date = new Date(); // "start_date": "2020-02-23T21:49:46.000Z",
    delivery.save();

    return res.json(delivery);
  }

  /**
   * Finaliza entrega
   */
  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    delivery.end_date = new Date();
    await delivery.save();
    // foto da assinatura aqui?
    return res.json(delivery);
  }
}

export default new DistributionController();