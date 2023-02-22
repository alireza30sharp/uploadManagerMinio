import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';
import { translateModuleConfig } from '../../projects/header-config/src/public_api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LanguageComponent } from './partials/sidebar-component/components/language/language.component';
import { CountryComponent } from './partials/sidebar-component/components/country/country.component';
import { AppSidebarComponent } from './partials/sidebar-component/sidebar';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SliderTimeComponent } from './slider-time/slider-time.component';
import { CalendarDateComponent } from './partials/calendar/calendar-date.component';
import { CalendarDatepickerComponent } from './partials/calendar-datepicker/calendar-datepicker.component';
import { NgxQuillMediaModule } from 'projects/ngx-quill-media/src/public-api';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { Application } from "./services/services.application";
import { ToastrModule, ToastrService } from 'ngx-toastr';
export function init_application(app: Application) {
  const x = () => new Promise<void>((resolve, reject) => {
    let interValModule: any = 0;
    interValModule = setInterval(async () => {
      if ((window as any).headerLoaded) {
        clearInterval(interValModule);
        await app.start();
        resolve();
      }
    }, 100);
  });

  return x;
}
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LanguageComponent,
    CountryComponent,
    AppSidebarComponent,
    CalendarDateComponent,
    SliderTimeComponent,
    CalendarDatepickerComponent
  ],
  imports: [
    ModalModule, 
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot(translateModuleConfig),
    NgxSliderModule,
    NgxQuillMediaModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'calendar', component: CalendarDateComponent },
      { path: 'slider', component: SliderTimeComponent },
    ]),
     ToastrModule.forRoot({
       timeOut: 2000,
       positionClass: 'toast-top-right',
       preventDuplicates: true,
     }),
  ],
  providers: [
    BsModalService,
    ToastrService ,
    //Application,{ provide: APP_INITIALIZER, useFactory: init_application, deps: [Application], multi: true }
],
  bootstrap: [AppComponent]
})
export class AppModule {
  //static forRoot(): ModuleWithProviders<AppModule> {
  //  return {
  //    ngModule: AppModule,
  //    providers: [
  //      Application
      
  //    ]
  //  };
  //}

}
//.AppModule.forRoot(),
