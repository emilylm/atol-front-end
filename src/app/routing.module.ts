import {Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";

import {SamplingMapComponent} from "./sampling-map/sampling-map.component";
import {LookerDashboardsComponent } from "./looker-dashboards/looker-dashboards.component";
import {BulkDownloadsComponent} from "./bulk-downloads/bulk-downloads.component";
import {AboutComponent} from "./about/about.component";
import {ApiDocumentationComponent} from "./api-documentation/api-documentation.component";
import {HelpComponent} from "./help/help.component";
import {StatusTrackingComponent} from "./status-tracking/status-tracking.component";
import {DataPortalComponent} from "./data-portal/data-portal.component";
import {DataPortalDetailsComponent} from "./data-portal/data-portal-details/data-portal-details.component";
import {PhylogenyComponent} from "./phylogeny/phylogeny.component";
import {OrganismDetailsComponent} from "./organism-details/organism-details.component";
import {SpecimenDetailsComponent} from "./specimen-details/specimen-details.component";
import {PublicationsComponent} from "./publications/publications.component";
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Function to disable routes so we can still retain the code for future implementation (and minimise deferal from EBI source repository)
const disabledRouteGuard = () => {
  const router = inject(Router);
  router.navigate(['/home']);
  return false;
};

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, title: "Home"},
    {
        path: 'data_portal',
        component: DataPortalComponent,
        title: "Data Portal"
    },
    {path: 'data_portal/:organismId', component: DataPortalDetailsComponent},
    {
        path: 'organism/:organismId',
        component: OrganismDetailsComponent,
        title: "Organism"
    },
    {
        path: 'specimen/:specimenId',
        component: SpecimenDetailsComponent,
        title: "Specimen"
    },
    {
        path: 'status_tracking',
        component: StatusTrackingComponent,
        title: "Status Tracking"
    },
    {
        path: 'phylogeny', 
        component: PhylogenyComponent, 
        title: "Phylogeny", 
        canActivate: [() => disabledRouteGuard()]
    },
    {path: 'about', component: AboutComponent, title: "About"},
    {
        path: 'api_documentation',
        component: ApiDocumentationComponent,
        title: "Api Documentation"
    },
    {path: 'help', component: HelpComponent, title: "Help"},
    {
        path: 'gis', 
        component: SamplingMapComponent, 
        title: "Sampling Map",
        canActivate: [() => disabledRouteGuard()]
    },
    {
        path: 'bulk-downloads', 
        component: BulkDownloadsComponent
    },
    {
        path: 'dashboards',
        component: LookerDashboardsComponent,
        title: "Dashboards",
        canActivate: [() => disabledRouteGuard()]
    },
    {
        path: 'publications',
        component: PublicationsComponent,
        title: "Publications",
        canActivate: [() => disabledRouteGuard()]
    },
]
