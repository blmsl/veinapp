import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: [ './input-search.component.scss' ]
})
export class InputSearchComponent {
  @ViewChild('searchInput') input;
  @Output() onSearch = new EventEmitter();
  @Input() set address(address: string) {
    this.input.value = address;
  };
  @Input() set focus(focus: boolean) {
    const inputDirective = this.input._input;
    if (focus) { inputDirective.focus(); }
  };

  search() {
    const val = this.input.value;
    if (!val) { return; }
    this.onSearch.emit(val);
  }

}