import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-logout-confirmation',
    standalone: true,
    template: `
      <section class="logout-confirmation" aria-labelledby="logout-question">
        <svg class="logout-symbol" viewBox="0 0 80 86" aria-hidden="true">
          <path d="M49 18V12a7 7 0 0 0-7-7H14a7 7 0 0 0-7 7v60a7 7 0 0 0 7 7h28a7 7 0 0 0 7-7V53M40 43h34m-11-12 12 12-12 12" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 id="logout-question">Logout Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <div class="confirmation-actions">
          <button class="cancel" type="button" (click)="answer(false)">Cancel</button>
          <button class="confirm" type="button" (click)="answer(true)">Confirm</button>
        </div>
      </section>
    `,
    styles: [`
      :host { display:block; height:100%; }
      .logout-confirmation { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 24px; background:#fff; color:#080808; }
      .logout-symbol { width:80px; height:86px; color:#2012b4; margin-bottom:22px; }
      h2 { margin:0; text-align:center; font-size:32px; font-weight:700; line-height:1.2; letter-spacing:-.4px; }
      p { margin:16px 0 0; text-align:center; font-size:18px; }
      .confirmation-actions { display:flex; justify-content:center; gap:36px; width:100%; margin-top:42px; }
      button { width:150px; min-height:46px; border:1px solid #2012b4; border-radius:14px; font:inherit; font-weight:500; font-size:20px; cursor:pointer; }
      .cancel { background:#fff; color:#2012b4; }
      .confirm { background:#2012b4; color:#fff; }
      .cancel:hover { background:#f2f0ff; }
      .confirm:hover { background:#170b8e; }
      button:focus-visible { outline:2px solid #2012b4; outline-offset:4px; }
      @media(max-width:420px) { .logout-confirmation { padding:24px 16px; } h2 { font-size:25px; } p { font-size:16px; } .confirmation-actions { gap:16px; } button { width:130px; font-size:17px; } }
    `]
})
export class LogoutConfirmationComponent {
    private modal = inject(ModalController);
    answer(confirmed: boolean): void { void this.modal.dismiss(confirmed, confirmed ? 'confirm' : 'cancel'); }
}
