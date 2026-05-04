import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {IconDefinition} from "@ant-design/icons-angular";
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {
  BackwardOutline,
  ClearOutline,
  CloseOutline,
  DeleteOutline,
  DragOutline,
  EditOutline,
  EnterOutline,
  PlusOutline,
  ReloadOutline,
  SaveOutline,
  UndoOutline,
  UploadOutline,
} from '@ant-design/icons-angular/icons';
import {provideNzIcons} from "ng-zorro-antd/icon";
import {provideAnimations} from "@angular/platform-browser/animations";
import {NzModalModule} from "ng-zorro-antd/modal";
import {provideFirebaseApp, initializeApp} from "@angular/fire/app";
import {environment} from "../environments/environment";
import {connectDatabaseEmulator, getDatabase, provideDatabase} from "@angular/fire/database";

const icons: IconDefinition[] = [
  PlusOutline, DeleteOutline, DragOutline, ClearOutline, UndoOutline,
  CloseOutline, BackwardOutline, EnterOutline, EditOutline, ReloadOutline,
  SaveOutline, UploadOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNzIcons(icons),
    provideAnimations(),
    importProvidersFrom(NzModalModule),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => {
      const db = getDatabase();
      if (!environment.production) {
        connectDatabaseEmulator(db, 'localhost', 9000);
      }
      return db;
    }),
  ]
};
