import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'th[sortableHeader]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div (click)="headerClicked()">
      <i class="fa fa-sort" [hidden]="sort.field === fieldName"></i>
      <i class="fa fa-sort-asc" [hidden]="sort.field !== fieldName || sort.desc"></i>
      <i class="fa fa-sort-desc" [hidden]="sort.field !== fieldName || !sort.desc"></i>
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
        div {
          cursor: pointer;
          width: 80px;
        }
  `]
})
export class SimpleGridSortableHeader {

    // map the sortableHeader input into a local var named fieldName
    @Input('sortableHeader') fieldName: string;

    // no mapping just create local reference sort which gets passed in
    // the sort points to same instance as the one from the host component
    @Input() sort: {field: string, desc: boolean};

    headerClicked(): void {
        if (this.sort.field === this.fieldName) {
            if (this.sort.desc === true) {
                this.sort.desc = false;
                this.sort.field = null;
            } else {
                this.sort.desc = true;
            }
        } else {
            this.sort.field = this.fieldName;
            this.sort.desc = false;
        }
    }

}