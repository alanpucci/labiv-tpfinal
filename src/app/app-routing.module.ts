import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'/welcome'},
  {path:'welcome', component:WelcomeComponent},
  {path:'login', component:LoginComponent},
  {path:'home', canActivate:[AuthGuard], loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
