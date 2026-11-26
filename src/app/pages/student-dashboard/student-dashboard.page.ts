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
    get labs() { const q = this.query.trim().toLowerCase(); return this.data.state().labs.filter(l => (l.name + ' ' + l.building + ' ' + l.room + ' ' + l.description + ' ' + this.status(l)).toLowerCase().includes(q)); }
    get featuredLabs() { return this.labs.slice(0, 3); }
    computerCount(id: string) { return this.data.state().computers.filter(c => c.labId === id).length; }
    get announcements() { return this.data.state().announcements.filter(a => !a.archived); }
    go(path: string) { void this.router.navigateByUrl(path); }
}
