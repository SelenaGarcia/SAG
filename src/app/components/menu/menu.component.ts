import { map } from 'rxjs/operators';
import { getMenu } from './../../miscelaneos/menu.const';
import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/model/menu.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'sag-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  panelOpenState:boolean = false; 
 
  menuItems$: Observable<Menu[]>;
  menuItemsCS$: Observable<Menu[]>;


  constructor() { }

  ngOnInit() {
    this.menuItems$ = getMenu().pipe(
      map(result => result.filter(tieneSub => !tieneSub.subMenu))
    );
    
    this.menuItemsCS$ = getMenu().pipe(
      map(result => result.filter(tieneSub => tieneSub.subMenu))
    );
  }  
 
}
