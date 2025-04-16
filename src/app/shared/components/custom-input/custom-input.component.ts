import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';7


@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
@Input() control: FormControl = new FormControl('');
@Input() label!: string;
@Input() type!: string;
@Input() icon: string = '';
@Input() autocomplete!: string;
@Input() placeholder!: string;


isPassword! : boolean;
hide: boolean = true;

  constructor() { }

  ngOnInit() {
    // Detecta si el campo es de tipo password
    this.isPassword = this.type === 'password';
   
  }


 // ✅ Alternar visibilidad de la contraseña
 showOrHidePassword() {
  this.hide = !this.hide;
  this.type = this.hide ? 'password' : 'text';
}

}
