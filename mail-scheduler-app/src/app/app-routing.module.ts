import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: "authenticate", component: HomeNavComponent,
    children: [{
      path: "login",
      component: LoginComponent
    },
    {
      path: "",
      redirectTo: "login",
      pathMatch: "full"
    },
    {
      path: "register",
      component: RegisterComponent
    }
    ]
  },
  {
    path: "home",
    component: AppNavComponent,
    canActivate: [AuthGuard],
    
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
