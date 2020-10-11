import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@lkptickets/common';
import { OrderCancelledListener } from '../order-cancelled-listeners';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //create an instance of a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //create and savea ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    userId: 'ASD',
  });
  ticket.set({ orderId });
  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('updated the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId)?.not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
