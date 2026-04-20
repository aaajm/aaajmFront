import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private cachedFingerprint: string | null = null;

  constructor() {}

  async getFingerprint(): Promise<string> {
    if (this.cachedFingerprint) {
      return this.cachedFingerprint;
    }

    const components = await this.getBrowserComponents();
    this.cachedFingerprint = await this.hashCode(JSON.stringify(components));
    return this.cachedFingerprint;
  }

  private async getBrowserComponents(): Promise<any> {
    const components: any = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      cpuCores: navigator.hardwareConcurrency || 0,
      touchSupport: 'ontouchstart' in window,
      deviceMemory: (navigator as any).deviceMemory || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0
    };

    // Ajouter les plugins disponibles
    if (navigator.plugins) {
      components.plugins = Array.from(navigator.plugins).map(p => p.name);
    }

    return components;
  }

  private async hashCode(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}