import Ticket from '../dao/models/ticket.model.js';

export class TicketRepository {
    async create(ticketData) {
    return await Ticket.create(ticketData);
    }

    async findByCode(code) {
    return await Ticket.findOne({ code });
    }
}
