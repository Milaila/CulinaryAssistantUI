import { Component, OnInit, Input } from '@angular/core';
import { IActionItem } from 'src/app/models/else/menu-item';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {

  @Input() headerTitle: string;
  @Input() description: string;
  @Input() actions: IActionItem[];

  constructor() { }

  ngOnInit(): void {
  }

}
