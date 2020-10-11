import { Publisher, Subjects, TicketUpdatedEvent } from '@lkptickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdate = Subjects.TicketUpdate;
}
