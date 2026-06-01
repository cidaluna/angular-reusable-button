import { TestBed } from '@angular/core/testing';

import { ButtonIdRegistryService } from './button-id-registry.service';

describe('ButtonIdRegistryService', () => {
  let service: ButtonIdRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonIdRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
