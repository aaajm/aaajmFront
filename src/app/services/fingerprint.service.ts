import {Injectable} from '@angular/core';
import fpPromise from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root',
})
export class FingerprintService {
  private cachedFingerprint: string | null = null;

  constructor() {}

  async getFingerprint(): Promise<string> {
    if (this.cachedFingerprint) {
      return this.cachedFingerprint;
    }

    const fp = await fpPromise.load();
    const result = await fp.get();

    this.cachedFingerprint = result.visitorId;
    return this.cachedFingerprint;
  }
}
