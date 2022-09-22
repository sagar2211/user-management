import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth-guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';

const routes: Routes = [
  {
    path : '',
    component : HomeComponent,
    children : [
      {
        path : '',
        redirectTo : 'login',
        pathMatch:"full"
      },
      {
        path : 'register',
        component : RegisterComponent
      },
      {
        path : 'login',
        component : LoginComponent
      },
      {
        path : 'dashboard',
        component : DashboardComponent,
        canActivate: [AuthGuard],
        data : {
          role : 'admin'
        }
      },
      {
        path : 'list',
        component : ListComponent,
        canActivate: [AuthGuard],
        data : {
          role : 'admin'
        }
      },
      {
        path : 'welcome',
        component : UserWelcomeComponent,
        canActivate: [AuthGuard],
        data : {
          role : 'normalUser'
        }
      },
      {
        path : '**',
        component : LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
