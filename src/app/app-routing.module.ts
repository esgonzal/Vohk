import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { LockListComponent } from './lock-list/lock-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { AddLockToUserComponent } from './add-lock-to-user/add-lock-to-user.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'locks', component:LockListComponent},
  {path:'users', component:UserListComponent},
  {path:'users/:id', component:UserComponent},
  {path:'users/:id/addlock', component:AddLockToUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
