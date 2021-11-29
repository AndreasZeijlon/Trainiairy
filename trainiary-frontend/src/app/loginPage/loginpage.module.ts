import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';



import { LoginpageRoutingModule } from './loginpage-routing.module';
import { LoginpageRootComponent } from './loginpage-root.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        LoginpageRoutingModule
    ],
    declarations: [
        LoginpageRootComponent,
        LoginComponent,
        RegisterComponent
    ]
})
export class LoginpageModule { }