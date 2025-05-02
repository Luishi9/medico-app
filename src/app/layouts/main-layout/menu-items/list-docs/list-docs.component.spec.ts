import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocsComponent } from './list-docs.component';

describe('ListDocsComponent', () => {
  let component: ListDocsComponent;
  let fixture: ComponentFixture<ListDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
