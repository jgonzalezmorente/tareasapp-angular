import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel;
  rememberMe = false;

  constructor( private router: Router,
               private authService: AuthService ) { }

  ngOnInit(): void {

    this.user = new UserModel();
    if ( localStorage.getItem('email') ) {
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }

  }

  login( form: NgForm ): void {

    if ( form.invalid ) {
      return;
    }

    Swal.fire({
      title: 'Ingresando',
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });

    Swal.showLoading();

    this.authService.login( this.user )
      .subscribe( resp => {
          console.log(resp);
          if ( this.rememberMe ) {
            localStorage.setItem('email', this.user.email);
          } else {
            localStorage.removeItem('email');
          }
          Swal.close();
          this.router.navigateByUrl('/my-tasks');
        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: err.error.non_field_errors[0]
          });
        });
      }

}
