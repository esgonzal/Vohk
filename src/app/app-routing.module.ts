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
import { PassageModeComponent } from './passage-mode/passage-mode.component';
import { TransferLockComponent } from './transfer-lock/transfer-lock.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';


const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'users/:id', component:UserComponent},
  {path:'users/:id/perfil', component:PerfilComponent},
  {path:'lock/:id', component:LockComponent},
  {path:'lock/:id/passcode', component:PasscodeComponent},
  {path:'lock/:id/card', component:ICCardComponent},
  {path:'lock/:id/fingerprint', component:FingerprintComponent},
  {path:'lock/:id/ekey', component:EkeyComponent},
  {path:'lock/:id/passageMode', component:PassageModeComponent},
  {path:'lock/:id/transferLock', component:TransferLockComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
