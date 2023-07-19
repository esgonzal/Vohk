import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserComponent } from './user/user.component';
import { LockComponent } from './lock/lock.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { ICCardComponent } from './iccard/iccard.component';



const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'users/:id', component:UserComponent},
  {path:'lock/:id', component:LockComponent},
  {path:'lock/:id/passcode', component:PasscodeComponent},
  {path:'lock/:id/card', component:ICCardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
