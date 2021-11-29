import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models/user';
import { AuthService} from '@app/services/auth.service';
import { ErrorHandler } from '@app/errorHandler'
import { format } from 'util';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  registerForm: FormGroup;


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
    ) { }
  
  errorHandler = new ErrorHandler();

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',[
        Validators.required,
        Validators.minLength(4)     
      ]], 
      confirmpassword: ['', Validators.required],
      firstname: ['',Validators.required],
      lastname: ['',Validators.required]
    }, {
      validator: this.matchPasswordValidator('password', 'confirmpassword')
    });
  }

  onSignup() {
    const user = this.registerForm.value;

    // reset alerts on submit
    this.alertService.clear();

    if(this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(user).subscribe(
      response => {
          this.alertService.success(response["message"], {keepAfterRouteChange : true});
          this.router.navigate(['../login'], { relativeTo: this.route });
      },
      error => {
          for (let index = 0; index < error.error["message"].length; index++) {
            const element = error.error["message"][index];
            this.alertService.error(element);
          }
          this.loading = false;
      }
    );
  }

  matchPasswordValidator (controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
 

      if (matchingControl.errors && !matchingControl.errors.unEqual) {
        // return if another validator has already found an error on the matchingControl
        return;
    }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ unEqual: true });
      } else {
          matchingControl.setErrors(null);
      }

    }

  }

  get f() { return this.registerForm.controls; }

  get getRegisterForm() { return this.registerForm; }

  get getUsername() { return this.registerForm.get('username'); }

  get getPassword() { return this.registerForm.get('password'); }

  get getConfirmPassword() { return this.registerForm.get('confirmpassword'); }

  get getFirstname() { return this.registerForm.get('firstname'); }

  get getLastname() { return this.registerForm.get('lastname'); }

}
