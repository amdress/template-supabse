import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  imports: [ IonicModule]

})
export class RolesListComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
