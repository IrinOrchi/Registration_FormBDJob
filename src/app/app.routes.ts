import { Routes } from '@angular/router';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'register',
        pathMatch: 'full'
    },
    {
        path:'register',
        component: CreateAccountPageComponent
    }
];