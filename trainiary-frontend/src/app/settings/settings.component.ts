import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  loading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmNewPassword = true;
  passwordForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private alertService: AlertService,
    ) { }

  ngOnInit(): void {

    this.passwordForm = this.formBuilder.group({
      currentpassword: ['',[
        Validators.required,
        Validators.minLength(4)     
      ]], 
      newpassword: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      confirmnewpassword: ['',Validators.required]
    }, {
      validator: this.matchPasswordValidator('newpassword', 'confirmnewpassword')
    });
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

  onChangePassword() {
    const formData = this.passwordForm.value;

    // reset alerts on submit
    this.alertService.clear();

    if(this.passwordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.changepassword(formData).subscribe(
      response => {
          this.alertService.success(response["message"]);
          this.loading = false;
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


  get getFormGroup() { return this.passwordForm; }

  get f() { return this.passwordForm.controls; }



}
