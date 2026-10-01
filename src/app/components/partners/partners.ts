import {Partner, PartnerService} from '@aaajm/client';
import {CommonModule} from '@angular/common';
import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthProvider} from '@/app/providers';
import {ToastService} from '@/app/utils';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.html',
  styleUrl: './partners.css',
})
export class Partners implements OnInit {
  private partnerService = inject(PartnerService);
  authProvider = inject(AuthProvider);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  partners = signal<Partner[]>([]);
  currentIndex = signal(0);
  visibleCount = 3;

  ngOnInit(): void {
    this.partnerService.getPartners().subscribe({
      next: (res) => {
        this.partners.set(res || []);
      },
      error: (err) => console.error('Failed to load partners', err),
    });
  }

  async deletePartner(partner: Partner) {
    if (!this.authProvider.isAdmin()) return;
    if (!confirm('Voulez-vous vraiment supprimer ce partenaire ?')) return;
    try {
      await firstValueFrom(this.http.delete(`${import.meta.env.NG_APP_API_URL}/partners/${partner.id}`));
      this.toast.message('success', 'Succès', 'Partenaire supprimé');
      this.partners.update(list => list.filter(p => p.id !== partner.id));
    } catch(err) {
      console.error(err);
      this.toast.message('error', 'Erreur', 'Impossible de supprimer le partenaire');
    }
  }

  nextSlide() {
    const total = this.partners().length;
    if (total === 0) return;
    if (this.currentIndex() + 1 <= total - this.visibleCount) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.currentIndex.set(0);
    }
  }

  prevSlide() {
    const total = this.partners().length;
    if (total === 0) return;
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    } else {
      const maxIndex = Math.max(0, total - this.visibleCount);
      this.currentIndex.set(maxIndex);
    }
  }

  visiblePartners() {
    const list = this.partners();
    if (list.length === 0) return [];
    if (list.length <= this.visibleCount) return list;
    return list.slice(this.currentIndex(), this.currentIndex() + this.visibleCount);
  }
}
