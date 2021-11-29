import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-loginpage-root',
  templateUrl: './loginpage-root.component.html',
  styleUrls: ['./loginpage-root.component.css']
})
export class LoginpageRootComponent  {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
    if (this.authService.userValue) {
      this.router.navigate(['/']);
    }
}

}
