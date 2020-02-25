import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Cancelamento de entrega',
      template: 'cancellation',
      context: {
        deliveryman: delivery.deliveryman.name,
        id: delivery.id,
      },
    });
  }
}

export default new CancellationMail();
