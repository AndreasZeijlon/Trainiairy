import { Component } from '@angular/core';
import { User } from '@app/_models/user';
import {AuthService} from '@app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Trainiary';

  user: User;

  constructor(private authService: AuthService) {
      this.authService.user.subscribe(user => this.user = user);
  }

  logout() {
      this.authService.logout();
  }
}
