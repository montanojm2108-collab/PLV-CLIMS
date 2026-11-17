import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LogoutConfirmationComponent } from '../shared/logout-confirmation.component';
import { DataService } from './data.service';
import { Role, User } from './models';
const REMEMBER = 'plv-clims-remember';
const SESSION = 'plv-clims-session';
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly userId = signal<string | null>(sessionStorage.getItem(SESSION) || localStorage.getItem(REMEMBER));
    readonly currentUser = computed(() => this.data.state().users.find(u => u.id === this.userId() && u.active) || null);
    readonly role = computed<Role | null>(() => this.currentUser()?.role || null);
    private lastActivity = Date.now();
    constructor(private data: DataService, private router: Router, private modal: ModalController) {
        if (typeof window !== 'undefined') {
            const activity = () => { this.lastActivity = Date.now(); };
            window.addEventListener('pointerdown', activity, { passive: true });
            window.addEventListener('keydown', activity, { passive: true });
            window.setInterval(() => { if (this.currentUser() && Date.now() - this.lastActivity > this.data.state().settings.sessionTimeout * 60000)
                this.logout(); }, 30000);
        }
    }
    login(handle: string, password: string, remember: boolean): boolean {
        const user = this.data.state().users.find(u => u.active && (u.email.toLowerCase() === handle.trim().toLowerCase() || u.studentId === handle.trim()) && u.password === password);
        if (!user)
            return false;
        this.userId.set(user.id);
        this.lastActivity = Date.now();
        sessionStorage.setItem(SESSION, user.id);
        if (remember)
            localStorage.setItem(REMEMBER, user.id);
        else
            localStorage.removeItem(REMEMBER);
        return true;
    }
    home(role: Role | null = this.role()): string { return role === 'student' ? '/student/dashboard' : role === 'technical' ? '/technical/dashboard' : role === 'admin' ? '/admin/users' : '/login'; }
    logout(): void { this.userId.set(null); sessionStorage.removeItem(SESSION); localStorage.removeItem(REMEMBER); void this.router.navigateByUrl('/login', { replaceUrl: true }); }
    private logoutConfirmationOpen = false;
    async confirmLogout(): Promise<void> {
        if (this.logoutConfirmationOpen || !this.currentUser()) return;
        this.logoutConfirmationOpen = true;
        try {
            const dialog = await this.modal.create({
                component: LogoutConfirmationComponent,
                cssClass: 'logout-confirmation-modal',
                backdropDismiss: true
            });
            await dialog.present();
            const result = await dialog.onDidDismiss<boolean>();
            if (result.role === 'confirm' && result.data === true) this.logout();
        } finally { this.logoutConfirmationOpen = false; }
    }
    create(name: string, email: string, password: string): boolean {
        if (this.data.state().users.some(u => u.email.toLowerCase() === email.toLowerCase()))
            return false;
        this.data.update(s => s.users.push({ id: this.data.id('U'), name, email, password, role: 'student', active: true, notifications: true }), name, 'Created demo student account');
        return true;
    }
    resetPassword(email: string, newPassword: string): boolean {
        const user = this.data.state().users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user)
            return false;
        this.data.update(s => { s.users.find(u => u.id === user.id)!.password = newPassword; }, user.name, 'Demo password changed');
        return true;
    }
}
