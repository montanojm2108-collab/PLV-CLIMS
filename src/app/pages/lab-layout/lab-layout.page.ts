import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ModalController } from '@ionic/angular';
import { ComputerDetailsPage } from '../computer-details/computer-details.page';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './lab-layout.page.html', styleUrls: ['./lab-layout.page.scss'] })
export class LabLayoutPage implements OnInit {
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    modal = inject(ModalController);
    labId = '';
    filter = 'All';
    query = '';
    editing = false;
    firstSelected = '';
    ngOnInit() { this.route.paramMap.subscribe(p => { this.labId = p.get('labId') || ''; this.firstSelected = ''; }); this.route.queryParamMap.subscribe(p => this.editing = p.get('edit') === 'true' && this.auth.role() === 'admin'); }
    get lab() { return this.data.state().labs.find(x => x.id === this.labId); }
    get unresolvedTickets() { return this.data.state().tickets.filter(t => t.labId === this.labId && !['Resolved', 'Closed'].includes(t.status)).length; }
    get lastInspected() { return this.data.state().inspections.filter(i => i.labId === this.labId).map(i => i.createdAt).sort().at(-1); }
    get all() { return this.data.state().computers.filter(c => c.labId === this.labId); }
    get computers() { return this.all.filter(c => (this.filter === 'All' || c.status === this.filter) && c.name.toLowerCase().includes(this.query.toLowerCase())); }
    count(status: string) { return this.all.filter(c => c.status === status).length; }
    async go(id: string) { if (!this.editing) {
        if (window.matchMedia('(max-width: 700px)').matches) {
            const dialog = await this.modal.create({ component: ComputerDetailsPage, componentProps: { computerId: id }, cssClass: 'pc-details-modal', breakpoints: [0, 1], initialBreakpoint: 1, handle: true });
            await dialog.present();
            return;
        }
        void this.router.navigateByUrl('/student/computers/' + id);
        return;
    } if (!this.firstSelected) {
        this.firstSelected = id;
        await this.ui.toast('Select another computer tile to swap positions.');
        return;
    } if (this.firstSelected === id) {
        this.firstSelected = '';
        return;
    } const first = this.firstSelected; this.data.update(s => { const i = s.computers.findIndex(c => c.id === first); const j = s.computers.findIndex(c => c.id === id); if (i >= 0 && j >= 0)
        [s.computers[i], s.computers[j]] = [s.computers[j], s.computers[i]]; }, this.auth.currentUser()?.name, 'Changed computer layout in ' + this.labId); this.firstSelected = ''; await this.ui.toast('Computer positions swapped.', 'success'); }
}
