import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-logout-confirmation',
    standalone: true,
    template: `
      <section class="logout-confirmation" aria-labelledby="logout-question">
        <img class="logout-symbol" src="assets/logout-icon-blue.png" alt="" aria-hidden="true">
        <h2 id="logout-question">Logout Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <div class="confirmation-actions">
          <button class="cancel" type="button" (click)="answer(false)">Cancel</button>
          <button class="confirm" type="button" (click)="answer(true)">Confirm</button>
        </div>
      </section>
    `,
    styles: [`
      :host { display:block; height:100%; overflow-y:auto; }
      .logout-confirmation { min-height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:28px 24px; background:#fff; color:#080808; }
      .logout-symbol { flex-shrink:0; width:52px; height:56px; object-fit:contain; margin-bottom:18px; }
      h2 { margin:0; text-align:center; font-size:22px; font-weight:600; line-height:1.3; }
      p { margin:10px 0 0; text-align:center; font-size:14px; line-height:1.5; }
      .confirmation-actions { display:flex; justify-content:center; gap:16px; width:100%; margin-top:28px; }
      button { flex:1; max-width:160px; min-width:0; min-height:44px; border:1px solid #2012b4; border-radius:8px; font:inherit; font-weight:500; font-size:14px; cursor:pointer; }
      .cancel { background:#fff; color:#2012b4; }
      .confirm { background:#2012b4; color:#fff; }
      .cancel:hover { background:#f2f0ff; }
      .confirm:hover { background:#170b8e; }
      button:focus-visible { outline:2px solid #2012b4; outline-offset:4px; }
      @media(max-width:420px) { .logout-confirmation { padding:24px 20px; } h2 { font-size:20px; } }
    `]
})
export class LogoutConfirmationComponent {
    private modalController = inject(ModalController);
    answer(confirmed: boolean): void { void this.modalController.dismiss(confirmed, confirmed ? 'confirm' : 'cancel'); }
}
