import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './announcements.page.html', styleUrls: ['./announcements.page.scss'] })
export class AnnouncementsPage {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    query = '';
    get items() { return this.data.state().announcements.filter(a => !a.archived && (a.title + ' ' + a.body).toLowerCase().includes(this.query.toLowerCase())); }
    read(id: string) { return this.data.state().announcements.find(a => a.id === id)?.readBy.includes(this.auth.currentUser()?.id || '') || false; }
    async markAll() { const uid = this.auth.currentUser()?.id || ''; this.data.update(s => s.announcements.forEach(a => { if (!a.readBy.includes(uid))
        a.readBy.push(uid); })); await this.ui.toast('All announcements marked as read.', 'success'); }
}
