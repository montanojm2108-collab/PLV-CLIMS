import { Component, Input, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataService } from '../core/data.service';
import { AuthService } from '../core/auth.service';
@Component({ selector: 'app-page-header', standalone: true, imports: [CommonModule, FormsModule, IonicModule], template: `
<ion-header class="ion-no-border"><ion-toolbar *ngIf="auth.role()==='admin'; else mobileBrand"><ion-buttons slot="start"><ion-menu-button menu="main-menu" aria-label="Open navigation"></ion-menu-button></ion-buttons>
<ion-title><img src="assets/clims-portal-logo.png" alt="" class="portal-logo portal-logo--header" width="30" height="28">PLV-CLIMS <span class="sub">/ {{title}}</span></ion-title><ion-buttons slot="end"><ion-button (click)="goHome()" aria-label="Go to portal home"><ion-icon name="home-outline"></ion-icon></ion-button></ion-buttons></ion-toolbar><ng-template #mobileBrand><ion-toolbar class="mobile-brand-toolbar"><div class="mobile-brand" slot="start"><img src="assets/clims-portal-logo.png" alt="" width="34" height="32"><span>PLV-CLIMS<small>{{auth.role()==='student'?'STUDENT':'TECHNICAL REPRESENTATIVE'}}</small></span></div><ion-buttons slot="end"><ion-button (click)="open('/announcements')" aria-label="Announcements"><svg class="notification-bell" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 7V5a2.5 2.5 0 0 1 5 0v2M8 15a8 8 0 0 1 16 0c0 7 3 8 3 9H5c0-1,3-2,3-9Z"/><path d="M12.5 27a4 4 0 0 0 7 0M6 7a13 13 0 0 0-3 9M26 7a13 13 0 0 1 3 9"/></svg></ion-button></ion-buttons></ion-toolbar></ng-template></ion-header>
<div class="search-container" *ngIf="auth.role() === 'admin' && !compact"><input class="field" placeholder="Search labs, PCs, tickets..." aria-label="Global search" [(ngModel)]="query" (ngModelChange)="lookup()"><div class="search-results" *ngIf="query.trim()"><div class="no-results" *ngIf="!results.length">No matching records</div><button *ngFor="let item of results" (click)="open(item.path)">{{item.label}} <small>{{item.type}}</small></button></div></div>
`, styles: [`@media(min-width:992px){:host.student-header,:host.compact-header{display:none}} :host{display:block;position:relative;flex:0 0 auto;width:100%;background:white;z-index:10}ion-toolbar{--background:white;--color:#201420;--border-color:#e5e5ed;--min-height:56px}ion-title{font-weight:700;font-size:15px}.sub{font-weight:400;font-size:12px;color:#6B6B6B}.search-container{padding:6px 18px 10px;position:relative;width:100%;max-width:none;margin-left:auto}.field{height:36px;min-height:36px;font-size:12px;padding:8px}.search-results{position:absolute;top:46px;left:18px;right:18px;z-index:100;background:#fff;border:1px solid #d9dbe2;box-shadow:0 8px 20px #0002;max-height:min(240px,50dvh);overflow:auto;border-radius:8px}.search-results button{padding:12px;display:block;width:100%;border:0;background:white;text-align:left;font:inherit;color:#201420;cursor:pointer}.search-results button:hover{background:#f4f3ff}.search-results small{float:right;color:#6B6B6B}.no-results{padding:12px;font-size:13px}@media(min-width:1200px){
 ion-title{padding-inline-end:280px}
 .search-container{
  position:absolute;
  top:calc(var(--ion-safe-area-top, 0px) + 10px);
  right:60px;
  width:min(600px, calc(100vw - 420px));
  padding:0;
  z-index:3;
 }
 .search-results{top:40px;left:0;right:0}
}@media(max-width:480px){.sub{display:none}}
.mobile-brand-toolbar{--min-height:72px;--padding-start:22px;--padding-end:14px}
.mobile-brand{display:flex;align-items:center;gap:4px;color:#2012b4;font-size:16px;font-weight:500}
.mobile-brand img{object-fit:contain}
.mobile-brand small{display:block;font-size:8px;margin-top:1px}
.mobile-brand-toolbar ion-button{--color:#2012b4;font-size:22px}.notification-bell{display:block;width:27px;height:27px;color:#2012b4}
`] })
export class PageHeaderComponent {
    @Input()
    title = '';
    @Input() @HostBinding('class.compact-header') compact = false;
    @HostBinding('class.student-header') get studentHeader() { return this.auth.role() === 'student' || this.auth.role() === 'technical'; }
    query = '';
    results: {
        label: string;
        type: string;
        path: string;
    }[] = [];
    data = inject(DataService);
    auth = inject(AuthService);
    router = inject(Router);
    lookup() { const q = this.query.trim().toLowerCase(); if (!q) {
        this.results = [];
        return;
    } const s = this.data.state(); this.results = [...s.labs.filter(x => x.name.toLowerCase().includes(q)).map(x => ({ label: x.name, type: 'Laboratory', path: '/student/laboratories/' + x.id })), ...s.computers.filter(x => x.name.toLowerCase().includes(q) || x.id.toLowerCase().includes(q)).slice(0, 8).map(x => ({ label: x.name + ' · ' + x.labId, type: 'Computer', path: '/student/computers/' + x.id })), ...(this.auth.role() === 'student' ? [] : s.tickets.filter(x => (x.id + ' ' + x.category).toLowerCase().includes(q)).map(x => ({ label: x.id + ' · ' + x.category, type: 'Ticket', path: '/tickets/' + x.id })))].slice(0, 12); }
    open(path: string) { this.query = ''; this.results = []; void this.router.navigateByUrl(path); }
    goHome() { void this.router.navigateByUrl(this.auth.home()); }
}

