import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create a ticket with ticket model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userOne = global.signin();
  // make a reqest to create an order
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a reqest to cancel the order
  await request(app)
    .delete(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  const { body: fetchedOrder } = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200);

  // expectation to make sure the thing is cancelled
  expect(fetchedOrder[0].status).toEqual('cancelled');
});

it('emits an order cancelled event', async () => {
  // create a ticket with ticket model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userOne = global.signin();
  // make a reqest to create an order
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a reqest to cancel the order
  await request(app)
    .delete(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
