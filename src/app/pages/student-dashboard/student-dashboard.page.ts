import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { labAvailability } from '../../shared/lab-status';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [FormsModule, CommonModule, IonicModule, PageHeaderComponent], templateUrl: './student-dashboard.page.html', styleUrls: ['./student-dashboard.page.scss'] })
export class StudentDashboardPage {
    data = inject(DataService);
    router = inject(Router);
    query = '';
    status = labAvailability;
    get labs() { const q = this.query.trim().toLowerCase(); return this.data.state().labs.filter(l => (l.name + ' ' + l.building + ' ' + l.room + ' ' + l.description + ' ' + this.status(l)).toLowerCase().includes(q)).slice(0, 6); }
    count(id: string) { return this.data.state().computers.filter(c => c.labId === id).length; }
    get computers() { return this.data.state().computers.filter(c => c.labId === 'LAB-01').slice(0, 24); }
    get working() { return this.data.state().computers.filter(c => c.status === 'Working').length; }
    get repair() { return this.data.state().computers.filter(c => c.status === 'Repair').length; }
    get announcements() { return this.data.state().announcements.filter(a => !a.archived).slice(0, 3); }
    go(path: string) { void this.router.navigateByUrl(path); }
}
