import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { Ticket } from '../../core/models';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, IonicModule, PageHeaderComponent], templateUrl: './ticket-list.page.html', styleUrls: ['./ticket-list.page.scss'] })
export class TicketListPage {
    data = inject(DataService);
    auth = inject(AuthService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    constructor() { this.route.queryParamMap.subscribe(p => { this.status = p.get('status') || 'All'; this.scope = p.get('scope') || 'all'; }); }
    query = '';
    scope = 'all';
    dateRange = 'all';
    showFilters = false;
    newest = true;
    readonly statuses = ['All', 'Resolved', 'In Progress', 'Unresolved'];
    lab(id: string) { return this.data.state().labs.find(l => l.id === id); }
    computer(id: string) { return this.data.state().computers.find(c => c.id === id); }
    resolved(t: Ticket) { return ['Resolved', 'Closed'].includes(t.status); }
    matchesStatus(t: Ticket, status: string) { return status === 'All' || (status === 'Resolved' ? this.resolved(t) : status === 'In Progress' ? t.status === 'In progress' : status === 'Unresolved' ? ['Open', 'Pending'].includes(t.status) : t.status === status); }
    get matchingTickets() {
      const q = this.query.trim().toLowerCase();
      const cutoff = Date.now() - Number(this.dateRange) * 86400000;
      return this.data.state().tickets.filter(t => (t.id+' '+t.category+' '+t.description+' '+this.computer(t.computerId)?.name+' '+this.lab(t.labId)?.name).toLowerCase().includes(q) && (this.priority === 'All' || t.priority === this.priority) && (this.scope !== 'mine' || t.reporterId === this.auth.currentUser()?.id) && (this.dateRange === 'all' || Date.parse(t.createdAt) >= cutoff));
    }
    total(status: string) { return this.matchingTickets.filter(t => this.matchesStatus(t,status)).length; }
    status = 'All';
    priority = 'All';
    get tickets() { return this.matchingTickets.filter(t => this.matchesStatus(t,this.status)).sort((a,b) => a.createdAt.localeCompare(b.createdAt) * (this.newest ? -1 : 1)); }
    modal = inject(ModalController);
    async openReport() { const dialog = await this.modal.create({ component: (await import('../create-ticket/create-ticket.page')).CreateTicketPage, componentProps: { modalMode: true }, cssClass: 'mobile-report-modal' }); await dialog.present(); }
    private openingTicket = false;
    async go(id: string) {
        if (this.openingTicket) return;
        this.openingTicket = true;
        try {
            const { TicketDetailsPage } = await import('../ticket-details/ticket-details.page');
            const dialog = await this.modal.create({
                component: TicketDetailsPage,
                componentProps: { ticketId: id, presentedAsModal: true },
                cssClass: 'ticket-details-modal',
                backdropDismiss: true
            });
            await dialog.present();
            await dialog.onDidDismiss();
        } finally { this.openingTicket = false; }
    }
}
