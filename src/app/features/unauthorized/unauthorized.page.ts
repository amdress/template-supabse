import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.page.html',
  styleUrls: ['./unauthorized.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class UnauthorizedPage implements OnInit {

  constructor(
  
    private location: Location
  ) { }

  ngOnInit() {
  }

  async goHome(): Promise<void> {
    this.location.back();
  }
  

}
