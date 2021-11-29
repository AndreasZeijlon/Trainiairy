import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any;
  private userSub: any;

  constructor(authService: AuthService) {
    this.userSub = authService.user.subscribe(user => {
      this.user = user;
    })
   }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
