import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ComputerStatus } from '../../core/models';
import { labAvailability } from '../../shared/lab-status';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './laboratories.page.html', styleUrls: ['./laboratories.page.scss'] })
export class LaboratoriesPage {
    data = inject(DataService);
    router = inject(Router);
    query = '';
    building = 'all';
    availability = 'All';
    pcFilter = 'all';
    showFilters = false;
    descending = false;
    status = labAvailability;
    readonly statuses = ['All', 'Available', 'In Use', 'Unavailable'];
    get buildings() { return [...new Set(this.data.state().labs.map(l => l.building))]; }
    get matchingLabs() { return this.data.state().labs.filter(l => (l.name + ' ' + l.building + ' ' + l.room).toLowerCase().includes(this.query.trim().toLowerCase()) && (this.building === 'all' || l.building === this.building) && (this.pcFilter === 'all' || this.count(l.id, this.pcFilter as ComputerStatus) > 0)); }
    get labs() { return this.matchingLabs.filter(l => this.availability === 'All' || this.status(l) === this.availability).sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true}) * (this.descending ? -1 : 1)); }
    total(status: string) { return this.matchingLabs.filter(l => status === 'All' || this.status(l) === status).length; }
    count(id: string, status?: ComputerStatus) { return this.data.state().computers.filter(c => c.labId === id && (!status || c.status === status)).length; }
    go(id: string) { void this.router.navigateByUrl('/student/laboratories/' + id); }
}
