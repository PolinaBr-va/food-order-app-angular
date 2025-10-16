import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccessModal } from './order-success-modal';

describe('OrderSuccessModal', () => {
  let component: OrderSuccessModal;
  let fixture: ComponentFixture<OrderSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSuccessModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSuccessModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
