import { TestBed } from '@angular/core/testing';

import { MailGuard } from './mail.guard';

describe('MailGuard', () => {
  let guard: MailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
