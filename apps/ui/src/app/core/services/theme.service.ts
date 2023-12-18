import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadTheme() {
    const href = `${
      localStorage.getItem('theme') === 'dark' ? 'lara-dark-purple' : 'lara-light-purple'
    }.css`;
    this.getLinkElementForKey('app-theme').setAttribute('href', href);
  }

  switchTheme(isDark: boolean) {
    const href = `${isDark ? 'lara-dark-purple' : 'lara-light-purple'}.css`;
    this.getLinkElementForKey('app-theme').setAttribute('href', href);
  }

  private getLinkElementForKey(key: string) {
    return this.getExistingLinkElementByKey(key) || this.createLinkElementWithKey(key);
  }

  private getExistingLinkElementByKey(key: string) {
    return this.document.getElementById('app-theme') as HTMLLinkElement;
  }

  private createLinkElementWithKey(key: string) {
    const linkEl: HTMLLinkElement = this.document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.id = 'app-theme';
    document.head.appendChild(linkEl);

    return linkEl;
  }
}
