import {ApplicationConfig} from '@angular/core';
import {IconDefinition} from "@ant-design/icons-angular";
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {DeleteOutline, PlusOutline} from '@ant-design/icons-angular/icons';
import {provideNzIcons} from "ng-zorro-antd/icon";

const icons: IconDefinition[] = [PlusOutline, DeleteOutline];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideNzIcons(icons)
  ]
};
