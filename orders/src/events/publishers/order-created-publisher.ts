import { Publisher, OrderCreatedEvent, Subjects } from '@lkptickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
