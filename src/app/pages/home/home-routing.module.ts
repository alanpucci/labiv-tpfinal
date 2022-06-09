import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from 'src/app/components/list-users/list-users.component';
import { RegisterAdminComponent } from 'src/app/components/register-admin/register-admin.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {path:'', component:HomeComponent, children:[
    {path:'', pathMatch:'full', redirectTo:'/home/register-admin'},
    {path:'register-admin', component:RegisterAdminComponent},
    {path:'list-users', component:ListUsersComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
