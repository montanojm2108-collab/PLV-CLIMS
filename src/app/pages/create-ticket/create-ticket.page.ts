import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { readSmallImage } from '../../shared/files';
import { PageHeaderComponent } from '../../shared/page-header.component';
@Component({ standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageHeaderComponent], templateUrl: './create-ticket.page.html', styleUrls: ['./create-ticket.page.scss'] })
export class CreateTicketPage implements OnInit {
    @Input() modalMode = false;
    @Input() initialComputerId = '';
    data = inject(DataService);
    auth = inject(AuthService);
    ui = inject(UiService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    modalController = inject(ModalController);
    private fb = inject(FormBuilder);
    photo?: string;
    photoName = '';
    duplicate = '';
    form = this.fb.nonNullable.group({ labId: ['', Validators.required], computerId: ['', Validators.required], category: ['', Validators.required], priority: ['Medium' as 'Low' | 'Medium' | 'High', Validators.required], description: ['', [Validators.required, Validators.minLength(8)]] });
    ngOnInit() { const id = this.initialComputerId || this.route.snapshot.queryParamMap.get('computer'); const c = this.data.state().computers.find(x => x.id === id); if (c)
        this.form.patchValue({ labId: c.labId, computerId: c.id }); }
    get computers() { return this.data.state().computers.filter(c => c.labId === this.form.controls.labId.value); }
    computerName(id: string) { return this.data.state().computers.find(c => c.id === id)?.name || id; }
    labChanged() { this.form.controls.computerId.setValue(''); this.clearDuplicate(); }
    clearDuplicate() { this.duplicate = ''; this.duplicateMatch = null; }
    duplicateMatch: any = null;
    findDuplicate() { const v = this.form.getRawValue(); const match = this.data.state().tickets.find(t => t.computerId === v.computerId && t.category === v.category && !['Resolved', 'Closed'].includes(t.status)); this.duplicateMatch = match || null; this.duplicate = match ? 'Possible duplicate found' : 'No duplicates found'; return match; }
    async check() { if (this.form.controls.labId.invalid || this.form.controls.computerId.invalid || this.form.controls.category.invalid) { this.form.controls.labId.markAsTouched(); this.form.controls.computerId.markAsTouched(); this.form.controls.category.markAsTouched(); return; } this.findDuplicate(); }
    close() { void this.modalController.dismiss(); }
    async file(e: Event) { try {
        const photo = await readSmallImage(e);
        if (photo) {
            this.photo = photo;
            this.photoName = (e.target as HTMLInputElement).files![0].name;
        }
    }
    catch (err) {
        await this.ui.toast(String(err), 'danger');
    } }
    async submit() { if (this.form.invalid) {
        this.form.markAllAsTouched();
        await this.ui.toast('Complete all required fields and enter at least 8 characters.', 'danger');
        return;
    } if (this.findDuplicate()) {
        await this.ui.toast('Possible duplicate. Review the existing ticket first.', 'warning');
        return;
    } const v = this.form.getRawValue(), id = this.data.id('TK'), now = new Date().toISOString(), u = this.auth.currentUser()!; try {
        this.data.update(s => s.tickets.unshift({ id, ...v, photo: this.photo, reporterId: u.id, status: 'Open', assignee: 'Unassigned', createdAt: now, updatedAt: now, history: [{ date: now, by: u.name, message: 'Issue reported' }] }), u.name, 'Created ticket ' + id);
        await this.ui.toast('Ticket ' + id + ' saved locally.', 'success');
        if (this.modalMode) await this.modalController.dismiss({ ticketId: id }, 'submitted');
        await this.router.navigateByUrl('/tickets/' + id);
    }
    catch (e) {
        await this.ui.toast(String(e), 'danger');
    } }
}
