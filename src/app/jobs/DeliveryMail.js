import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Nova entrega',
      template: 'assignment',
      context: {
        deliveryman: delivery.deliveryman.name,
        recipient: delivery.recipient.name,
        street: delivery.recipient.street,
        number: delivery.recipient.number,
        complement: delivery.recipient.complement,
        state: delivery.recipient.state,
        city: delivery.recipient.city,
        zip_code: delivery.recipient.zip_code,
      },
    });
  }
}

export default new DeliveryMail();
