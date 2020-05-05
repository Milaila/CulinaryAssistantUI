import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServerHttpService } from 'src/app/services/server-http.sevice';
import { IActionItem } from 'src/app/models/else/menu-item';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private serverService: ServerHttpService,
  ) { }

  filterActions: IActionItem[] = [{label: 'Click me' }];

  ngOnInit(): void {
  }

  onSearch() {

  }
}
