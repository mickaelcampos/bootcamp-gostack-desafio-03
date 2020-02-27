import DeliveryProblem from '../models/DeliveryProblem';

class ProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.id },
    });

    return res.json(problems);
  }
}

export default new ProblemController();
