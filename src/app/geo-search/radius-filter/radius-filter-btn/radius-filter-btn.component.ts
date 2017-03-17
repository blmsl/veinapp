import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-radius-filter-btn',
  templateUrl: './radius-filter-btn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadiusFilterBtnComponent {
  @Input() distance;
  @Input() currentRadius = false;
  @Output() onChange = new EventEmitter<number>();

  setColor() {
    return this.currentRadius ? 'primary' : 'accent';
  }
  change(radius) {
    this.onChange.emit(radius);
  }

}
