import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginpageRootComponent } from './loginpage-root.component'
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '', component: LoginpageRootComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },

              // otherwise redirect to loginpage
            { path: '**', redirectTo: 'login' }
          
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class LoginpageRoutingModule { }