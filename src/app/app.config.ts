import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideAnimationsAsync('noop'), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-e2924","appId":"1:27363616860:web:504b097d69c8551dfe1e99","storageBucket":"ring-of-fire-e2924.appspot.com","apiKey":"AIzaSyDHcIIb8RSQQW9PCSh80-K-J6UC89RIjLE","authDomain":"ring-of-fire-e2924.firebaseapp.com","messagingSenderId":"27363616860"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
