import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-logout-confirmation',
    standalone: true,
    template: `
      <section class="logout-confirmation" aria-labelledby="logout-question">
        <svg class="logout-symbol" viewBox="0 0 80 86" aria-hidden="true">
          <path d="M35 5 14 13C8 15 6 19 6 25v38c0 6 2 10 8 12l21 8c7 3 12-1 12-8V13c0-7-5-11-12-8Z" fill="currentColor"/>
          <ellipse cx="30" cy="44" rx="3" ry="4" fill="white"/>
          <path d="M54 12h8c6 0 9 4 9 10v6M71 64v7c0 6-3 10-9 10h-8" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
          <path d="M54 45h19m-8-8 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 id="logout-question">Are you sure you want to<br>log out?</h2>
        <div class="confirmation-actions">
          <button class="cancel" type="button" (click)="answer(false)">No</button>
          <button class="confirm" type="button" (click)="answer(true)">Yes</button>
        </div>
      </section>
    `,
    styles: [`
      :host { display:block; height:100%; }
      .logout-confirmation { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 24px; background:#fff; color:#080808; }
      .logout-symbol { width:65px; height:76px; color:#404040; margin-bottom:26px; }
      h2 { margin:0; text-align:center; font-size:23px; font-weight:500; line-height:1.2; letter-spacing:-.4px; }
      .confirmation-actions { display:flex; justify-content:center; gap:28px; width:100%; margin-top:36px; }
      button { width:117px; min-height:37px; border:0; border-radius:24px; font:inherit; font-weight:600; font-size:17px; cursor:pointer; }
      .cancel { background:#d9d9d9; color:#080808; }
      .confirm { background:#ff444b; color:#fff; }
      .cancel:hover { background:#ccc; }
      .confirm:hover { background:#eb343c; }
      button:focus-visible { outline:2px solid #2012b4; outline-offset:4px; }
      @media(max-width:360px) { h2 { font-size:21px; } .confirmation-actions { gap:20px; } }
    `]
})
export class LogoutConfirmationComponent {
    private modal = inject(ModalController);
    answer(confirmed: boolean): void { void this.modal.dismiss(confirmed, confirmed ? 'confirm' : 'cancel'); }
}
