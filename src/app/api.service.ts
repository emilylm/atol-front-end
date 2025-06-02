import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private http: HttpClient,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    getData(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
            filterValue: string[], currentClass: string, phylogenyFilters: string[], indexName: string) {

        const projectNames = [
            'DTOL',
            'ERGA',
            'Project Psyche',
            'ERGA BGE',
            'ERGA Pilot',
            '25 genomes',
            'ATLASea',
            'CBP',
            'ENDEMIXIT',
            'ERGA Community Genomes',
            'ERGA Swiss node',
            'ATOL',
            'atol'
        ];
        const offset = pageIndex * pageSize;
        let url = `${environment.host}/api/${indexName}?limit=${pageSize}&offset=${offset}`;
        if (searchValue) {
            url += `&search=${searchValue}`;
        }
        if (sortActive && sortDirection) {
            url += `&sort=${sortActive}:${sortDirection}`;
        }
        if (filterValue.length !== 0) {
            let filterStr = '&filter=';
            let filterItem;
            for (let i = 0; i < filterValue.length; i++) {
                if (projectNames.indexOf(filterValue[i]) !== -1) {
                    filterValue[i] === 'DToL' ? filterItem = 'project_name:dtol' : filterItem = `project_name:${filterValue[i]}`;
                } else if (filterValue[i].includes('-') && !filterValue[i].startsWith('experimentType')) {
                    if (filterValue[i].startsWith('symbionts')) {
                        filterItem = filterValue[i].replace('-', ':');
                    } else {
                        filterItem = filterValue[i].split(' - ')[0].toLowerCase().split(' ').join('_');
                        if (filterItem === 'assemblies') {
                            filterItem = 'assemblies_status:Done';
                        } else if (filterItem === 'genome_notes') {
                            filterItem = 'genome_notes:Submitted';
                        } else {
                            filterItem = `${filterItem}:Done`;
                        }
                    }
                } else if (filterValue[i].includes('_') && filterValue[i].startsWith('experimentType')) {
                    // Extract the experiment type value after the underscore
                    const experimentType = filterValue[i].split('_')[1];
                    filterItem = `experiment.library_construction_protocol:${experimentType}`;
                } else {
                    filterItem = `${currentClass}:${filterValue[i]}`;
                }
                filterStr === '&filter=' ? filterStr += `${filterItem}` : filterStr += `,${filterItem}`;
            }
            url += filterStr;
        }
        if (phylogenyFilters.length !== 0) {
            let filterStr = '&phylogeny_filters=';
            for (let i = 0; i < phylogenyFilters.length; i++) {
                filterStr === '&phylogeny_filters=' ? filterStr += `${phylogenyFilters[i]}` : filterStr += `-${phylogenyFilters[i]}`;
            }
            url += filterStr;
        }
        url += `&current_class=${currentClass}`;

        return this.http.get<any>(url);
    }

    getDetailsData(organismName: any, indexName: string) {
        const url = `${environment.host}/api/${indexName}/${organismName}`;
        return this.http.get<any>(url);
    }

    downloadRecords(downloadOption: string, pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
                    filterValue: string[], currentClass: string, phylogenyFilters: string[], indexName: string,) {

        const url = `${environment.host}/api/data-download`;

        const projectNames =  ['DTOL',
            'ERGA',
            'Project Psyche',
            'ERGA BGE',
            'ERGA Pilot',
            '25 genomes',
            'ATLASea',
            'CBP',
            'ENDEMIXIT',
            'ERGA Community Genomes',
            'ERGA Swiss node',
            'ATOL',
            'atol'
        ];

        // phylogeny
        const phylogenyStr = phylogenyFilters.length ? phylogenyFilters.join('-') : '';

        // Filter string
        let filterStr = '';

        if (filterValue.length !== 0) {
            const filterItems = [];

            for (const item of filterValue) {
                let filterItem = '';

                if (projectNames.includes(item)) {
                    filterItem = item === 'DToL' ? 'project_name:dtol' : `project_name:${item}`;
                } else if (item.includes('-') && !item.startsWith('experimentType')) {
                    if (item.startsWith('symbionts') || item.startsWith('metagenomes')) {
                        filterItem = item.replace('-', ':');
                    } else {
                        filterItem = item.split(' - ')[0].toLowerCase().replace(/\s+/g, '_');
                        if (filterItem === 'assemblies') {
                            filterItem = 'assemblies_status:Done';
                        }else if (filterItem === 'genome_notes') {
                            filterItem = 'genome_notes:Submitted';
                        } else
                            filterItem = `${filterItem}:Done`;
                    }
                } else if (item.includes('_') && item.startsWith('experimentType')) {
                    filterItem = item.replace('_', ':');
                } else {
                    filterItem = `${currentClass}:${item}`;
                }

                filterItems.push(filterItem);
            }

            filterStr = filterItems.join(',');
        }

        const payload = {
            pageIndex,
            pageSize,
            searchValue,
            sortValue: `${sortActive}:${sortDirection}`,
            filterValue: filterStr || '',
            currentClass,
            phylogeny_filters: phylogenyStr,
            index_name: indexName,
            downloadOption
        };
        return this.http.post(url, payload, {responseType: 'blob'});
    }

    getPublicationsData(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
                        filterValue: string[], index_name: string) {

        const sortActiveESField: { [index: string]: any } = {
            'title': 'title',
            'study_id': 'study_id',
            'organism_name': 'organism_name'
        }

        const offset = pageIndex * pageSize;
        let url = `${environment.host}/api/${index_name}?limit=${pageSize}&offset=${offset}`;
        // let url = `http://127.0.0.1:8000/${index_name}?limit=${pageSize}&offset=${offset}`;
        if (searchValue) {
            url += `&search=${searchValue}`;
        }
        if (sortActive && sortDirection) {
            url += `&sort=${sortActive in sortActiveESField ?  sortActiveESField[sortActive]: sortActive}:${sortDirection}`;
        }
        if (filterValue.length !== 0) {
            let filterStr = '&filter=';
            let filterItem;
            for (let i = 0; i < filterValue.length; i++) {
                const filterName = filterValue[i].split('-')[0]
                const filterVal = filterValue[i].split('-')[1]
                if (filterName == 'article_type'){
                    filterItem = `articleType:${filterVal}`
                } else if (filterName == 'pub_year') {
                    filterItem = `pubYear:${filterVal}`;
                } else if (filterName == 'journal_title') {
                    filterItem = `journalTitle:${filterVal}`;
                }
                filterStr === '&filter=' ? filterStr += `${filterItem}` : filterStr += `,${filterItem}`;
            }
            url += filterStr;
        }

        // will not reload the page, but will update query params
        this.router.navigate([],
            {
                relativeTo: this.activatedRoute,
                queryParams: {
                    'filter': filterValue,
                    'sortActive': sortActive in sortActiveESField ?  sortActiveESField[sortActive]: sortActive,
                    'sortDirection': sortDirection,
                    'searchValue': searchValue,
                    'pageIndex': pageIndex,
                    'pageSize': pageSize
                },
                queryParamsHandling: 'merge',
            });

        return this.http.get<any>(url);
    }

}
