// services/ticket.service.js
import { v4 as uuidv4 } from 'uuid';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { TicketDTO } from '../dtos/ticket.dto.js';

export class TicketService {
    constructor() {
    this.ticketRepository = new TicketRepository();
    }

    async generateTicket({ amount, purchaser }) {
    const code = uuidv4(); // código único
    const ticketData = {
        code,
        amount,
        purchaser
    };
    const ticket = await this.ticketRepository.create(ticketData);
    return new TicketDTO(ticket);
    }
}
