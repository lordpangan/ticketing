import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@lkptickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
