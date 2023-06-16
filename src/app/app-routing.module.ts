import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {AuthGuard} from "./shared/services/auth.guard";
import {NavBarComponent} from "./components/nav-bar/nav-bar.component";
import {CanvasComponent} from "./components/dashboard/canvas/canvas.component";
import {ProfileComponent} from "./components/profile/profile.component";
// route guard


const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'canvas', component: CanvasComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: NavBarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
