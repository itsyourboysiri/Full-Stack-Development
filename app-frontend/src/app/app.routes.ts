import { RouterModule, Routes } from '@angular/router';

import { SeatingComponent } from './seating/seating.component';
import { UserloginComponent } from '../user/userlogin/userlogin.component';
import { UsersignupComponent } from '../user/usersignup/usersignup.component';
import { NgModule } from '@angular/core';

import { AdminMovieComponent } from '../admin/admin-movie/admin-movie.component';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { AdminDashboardMovieComponent } from '../admin/admin-dashboard-movie/admin-dashboard-movie.component';




export const routes: Routes = [
    { path: '', component: AdminDashboardComponent }, // Default route

    { path: 'usersignup', component: UsersignupComponent },

 
    { path: 'seating', component: SeatingComponent}

];