import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class UserDetailComponent  implements OnInit {
  user = {
    name: 'Miguel A. Cavalcante',
    email: 'miguel@example.com',
    roles: ['admin', 'user']
  };

  constructor() { }

  ngOnInit() {}

}
