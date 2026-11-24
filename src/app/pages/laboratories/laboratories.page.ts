import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ComputerStatus, Lab } from '../../core/models';
import { labAvailability } from '../../shared/lab-status';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, RouterLink, PageHeaderComponent], templateUrl: './laboratories.page.html', styleUrls: ['./laboratories.page.scss'] })
export class LaboratoriesPage {
    data = inject(DataService);
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
    private indicatorCount(lab: Lab, status: string): number {
        if (status === 'Unavailable') return this.count(lab.id, 'Unavailable');
        return status === 'All' || this.status(lab) === status ? 1 : 0;
    }
    get labs() { return this.matchingLabs.filter(l => this.indicatorCount(l, this.availability) > 0).sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true}) * (this.descending ? -1 : 1)); }
    total(status: string) { return this.matchingLabs.reduce((sum, lab) => sum + this.indicatorCount(lab, status), 0); }
    count(id: string, status?: ComputerStatus) { return this.data.state().computers.filter(c => c.labId === id && (!status || c.status === status)).length; }
}
