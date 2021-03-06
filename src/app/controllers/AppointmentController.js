import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20, // Mostrar 20 por página
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valição falhou' });
    }

    const { provider_id, date } = req.body;

    // Verificar se é provedor de serviço
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Você somente pode criar compromisso como provedor' });
    }

    // parseISO transforma a string date em objeto date do JS
    // startOfHour arredondamento  (19:30) > (19)
    const hourStart = startOfHour(parseISO(date));

    // Verifica se está antes da data atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data não permitida' });
    }

    const checkAvalilability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvalilability) {
      return res.status(400).json({ error: 'Data não acessível' });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    // Buscar usuário
    const user = await User.findByPk(req.userId);

    // Formatar data, ex: 22 de Junho, às 8:40h
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    // Notificar provedor
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!appointment) {
      return res.status(400).json({
        error: 'Compromisso não encontrado',
      });
    }

    // compara o usuário enviado com o logado
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Você não tem permissão de cancelar este compromisso',
      });
    }

    // Diminuir 2 horas (pode cancelar se 2 horas antes)
    const dateWithSub = subHours(appointment.date, 2);

    // Verifica se o horário é antes do horário atual
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'Você somente pode cancelar compromissos mais que 2 horas antes',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
