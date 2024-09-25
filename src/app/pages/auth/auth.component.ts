import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{
     authForm: FormGroup;

    constructor() {
    }
    ngOnInit() {
    this.initForm();
    }

    initForm(){
      this.authForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
      })
    }

  submitAuth() {

  }

  cancelSubmitAuthForm() {
    this.authForm.reset();
  }
}
