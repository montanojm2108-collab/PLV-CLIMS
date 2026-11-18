import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, calendarOutline, optionsOutline, homeOutline, gridOutline, businessOutline, desktopOutline, ticketOutline, addCircleOutline, clipboardOutline, timeOutline, constructOutline, megaphoneOutline, peopleOutline, settingsOutline, personOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './core/auth.service';
import { CreateTicketPage } from './pages/create-ticket/create-ticket.page';
interface NavLink {
    title: string;
    path: string;
    icon: string;
}
@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, IonicModule, RouterLink, RouterLinkActive], templateUrl: './app.component.html', styleUrls: ['./app.component.scss'] })
export class AppComponent {
    constructor() { addIcons({ searchOutline, calendarOutline, optionsOutline, homeOutline, gridOutline, businessOutline, desktopOutline, ticketOutline, addCircleOutline, clipboardOutline, timeOutline, constructOutline, megaphoneOutline, peopleOutline, settingsOutline, personOutline, logOutOutline }); }
    auth = inject(AuthService);
    router = inject(Router);
    modal = inject(ModalController);
    async openMobileReport() { const dialog = await this.modal.create({ component: CreateTicketPage, componentProps: { modalMode: true }, cssClass: 'mobile-report-modal' }); await dialog.present(); }
    desktopMenuVisible = false;
    readonly student: NavLink[] = [{ title: 'Dashboard', path: '/student/dashboard', icon: 'grid-outline' }, { title: 'Laboratories', path: '/student/laboratories', icon: 'business-outline' }, { title: 'Announcements', path: '/announcements', icon: 'megaphone-outline' }, { title: 'Account Settings', path: '/account', icon: 'person-outline' }];
    readonly technical: NavLink[] = [{ title: 'Dashboard', path: '/technical/dashboard', icon: 'grid-outline' }, { title: 'Laboratories', path: '/student/laboratories', icon: 'business-outline' }, { title: 'Tickets', path: '/technical/tickets', icon: 'ticket-outline' }, { title: 'Announcements', path: '/announcements', icon: 'megaphone-outline' }, { title: 'Account Settings', path: '/account', icon: 'person-outline' }];
    readonly admin: NavLink[] = [{ title: 'User Management', path: '/admin/users', icon: 'person-outline' }, { title: 'Laboratory Management', path: '/admin/laboratories', icon: 'business-outline' }, { title: 'Computer Map', path: '/student/laboratories', icon: 'desktop-outline' }, { title: 'Tickets', path: '/technical/tickets', icon: 'ticket-outline' }, { title: 'Announcements & Reports', path: '/admin/reports', icon: 'grid-outline' }, { title: 'Inspection History', path: '/technical/history', icon: 'time-outline' }, { title: 'Maintenance', path: '/technical/maintenance', icon: 'settings-outline' }, { title: 'Settings & Audit Logs', path: '/admin/settings', icon: 'settings-outline' }, { title: 'My Account', path: '/account', icon: 'person-outline' }];
    get links(): NavLink[] { return this.auth.role() === 'student' ? this.student : this.auth.role() === 'technical' ? this.technical : this.admin; }
    get mobileLinks(): NavLink[] { return this.links.filter(link => link.path !== '/announcements'); }
    mobileSelected(link: NavLink): boolean {
        const path = this.router.url.split('?')[0];
        return path === link.path || (link.path === '/student/laboratories' && (path.startsWith('/student/laboratories/') || path.startsWith('/student/computers/'))) || (link.path === '/technical/tickets' && (path.startsWith('/technical/tickets/') || path.startsWith('/tickets/')));
    }
    get portal(): string { return this.auth.role() === 'student' ? 'STUDENT' : this.auth.role() === 'technical' ? 'TECHNICAL REPRESENTATIVE' : 'ADMIN PORTAL'; }
}
