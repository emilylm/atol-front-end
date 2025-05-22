import {Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';
import { SafePipe } from '../shared/pipes/safe.pipe';

@Component({
    selector: 'app-api-documentation',
    templateUrl: './api-documentation.component.html',
    styleUrls: ['./api-documentation.component.css'],
    standalone: true,
    imports: [SafePipe]
})
export class ApiDocumentationComponent implements OnInit {
    apiDocUrl: string;

    constructor() {
        this.apiDocUrl = `${environment.host}/api/redoc`;
    }

    ngOnInit(): void {
    }

}
