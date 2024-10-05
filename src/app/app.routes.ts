import { Routes } from '@angular/router';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import {NidVerificationComponent} from './pages/nid-verification/nid-verification.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'register/nidVerify',
        pathMatch: 'full'
    },
    {
        path:'register',
        component: CreateAccountPageComponent
    },
    {
        path:'register/nidVerify',
        component: NidVerificationComponent
    }
];