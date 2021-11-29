import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarRootComponent } from '@app/calendar/calendar-root.component'
import { StatisticsComponent} from '@app/statistics/statistics.component'
import { SettingsComponent } from '@app/settings/settings.component'
import { ProfileComponent } from '@app/profile/profile.component'
import { AuthGuard } from '@app/auth-guard';

const loginpageModule = () => import('./loginPage/loginpage.module').then(x => x.LoginpageModule);

const routes: Routes = [
  { path: '', component: CalendarRootComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'start', loadChildren: loginpageModule},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
