import { Routes } from '@angular/router';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import {NidVerificationComponent} from './pages/nid-verification/nid-verification.component';
import { BeforeLoginNidComponent } from './pages/before-login-nid/before-login-nid.component';
import { SuccessfulAccountComponent } from './pages/successful-account/successful-account.component';
import { AuthGuard } from './guards/auth.guard';
import { CommunicationComponent } from './pages/communication/communication.component';
import { EmailTemplateComponent } from './pages/email-template/email-template.component';
import { TemplateViewerComponent } from './pages/template-viewer/template-viewer.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo: 'communication',
        pathMatch: 'full'
    },
    {
        path:'register',
        component: CreateAccountPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "account-created-successfully",
        component: SuccessfulAccountComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'register/nidVerify',
        component: NidVerificationComponent
    },
    {
        path:'register/before-login-nid',
        component: BeforeLoginNidComponent
    },
    {
        path:'communication',
        component: CommunicationComponent,

    },
    {
        path:'email-template',
        component: EmailTemplateComponent
    },
    {
        path:'template-viewer',
        component: TemplateViewerComponent
    },
];