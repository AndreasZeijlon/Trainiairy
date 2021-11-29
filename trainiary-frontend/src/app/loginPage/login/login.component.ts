import { Component, OnInit } from '@angular/core';
import { AuthService} from '@app/services/auth.service';
import { ErrorHandler } from '@app/errorHandler'
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginForm } from '@app/_models/loginForm';
import { AlertService } from '@app/services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  hide = true;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
    ) { }
  
  errorHandler = new ErrorHandler();

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)     
      ])
    });
  }

  onLogin() { 

    // reset alerts on submit
    this.alertService.clear();

    if(this.loginForm.invalid) {
      return;
    }

    this.loading=true;
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      response => {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error => {
        this.alertService.error(error.error["message"]);
        this.loading=false;

      }
    );

  }

  get getLoginForm() { return this.loginForm; }

  get getUsername() { return this.loginForm.get('username'); }
  get getPassword() { return this.loginForm.get('password'); }



}
