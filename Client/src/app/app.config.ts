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
  DragOutline, EnterOutline,
  PlusOutline,
  UndoOutline
} from '@ant-design/icons-angular/icons';
import {provideNzIcons} from "ng-zorro-antd/icon";
import {provideAnimations} from "@angular/platform-browser/animations";
import {NzModalModule} from "ng-zorro-antd/modal";

const icons: IconDefinition[] = [PlusOutline, DeleteOutline, DragOutline, ClearOutline, UndoOutline, CloseOutline, BackwardOutline, EnterOutline];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNzIcons(icons),
    provideAnimations(),
    importProvidersFrom(NzModalModule)
  ]
};
