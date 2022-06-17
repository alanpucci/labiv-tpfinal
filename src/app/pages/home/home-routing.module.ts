import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from 'src/app/components/appointments/appointments.component';
import { ListUsersComponent } from 'src/app/components/list-users/list-users.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { RegisterAdminComponent } from 'src/app/components/register-admin/register-admin.component';
import { RequestAppointmentComponent } from 'src/app/components/request-appointment/request-appointment.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {path:'', component:HomeComponent, children:[
    {path:'', pathMatch:'full', redirectTo:'/home/register-admin'},
    {path:'register-admin', component:RegisterAdminComponent},
    {path:'list-users', component:ListUsersComponent},
    {path:'profile', component:ProfileComponent},
    {path:'appointments', component:AppointmentsComponent},
    {path:'request-appointment', component:RequestAppointmentComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
