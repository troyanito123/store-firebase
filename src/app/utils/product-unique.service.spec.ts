import { TestBed } from '@angular/core/testing';

import { ProductUniqueService } from './product-unique.service';

describe('ProductUniqueService', () => {
  let service: ProductUniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductUniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
