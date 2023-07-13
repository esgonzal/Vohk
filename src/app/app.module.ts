import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { LockListComponent } from './lock-list/lock-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { AddLockToUserComponent } from './add-lock-to-user/add-lock-to-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    LockListComponent,
    UserListComponent,
    UserComponent,
    AddLockToUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
    
  ],
  providers: [UserListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
