import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('it fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userOne = global.signin();

  //make a request to build an order with the ticket
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(orderOne.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  //make a request to build an order with the ticket
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make a request to fetch the order
  await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});
