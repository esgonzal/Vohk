import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserComponent } from './user/user.component';
import { LockComponent } from './lock/lock.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { ICCardComponent } from './iccard/iccard.component';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { EkeyComponent } from './ekey/ekey.component';


const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'users/:id', component:UserComponent},
  {path:'lock/:id', component:LockComponent},
  {path:'lock/:id/passcode', component:PasscodeComponent},
  {path:'lock/:id/card', component:ICCardComponent},
  {path:'lock/:id/fingerprint', component:FingerprintComponent},
  {path:'lock/:id/ekey', component:EkeyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
