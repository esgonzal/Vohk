import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserComponent } from './user/user.component';
import { LockComponent } from './lock/lock.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { EkeyComponent } from './ekey/ekey.component';
import { PassageModeComponent } from './passage-mode/passage-mode.component';
import { TransferLockComponent } from './transfer-lock/transfer-lock.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { GrupoCerradurasComponent } from './grupo-cerraduras/grupo-cerraduras.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users/:username', component: UserComponent },
  { path: 'users/:username/perfil', component: PerfilComponent },
  { path: 'users/:username/grupos', component: GrupoCerradurasComponent },
  { path: 'users/:username/lock/:id', component: LockComponent },
  { path: 'users/:username/lock/:id/passcode', component: PasscodeComponent },
  { path: 'users/:username/lock/:id/ekey', component: EkeyComponent },
  { path: 'users/:username/lock/:id/passageMode', component: PassageModeComponent },
  { path: 'users/:username/lock/:id/transferLock', component: TransferLockComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
