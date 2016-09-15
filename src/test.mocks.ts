import { TestBed, tick, ComponentFixture } from '@angular/core/testing';

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  return f;
}
