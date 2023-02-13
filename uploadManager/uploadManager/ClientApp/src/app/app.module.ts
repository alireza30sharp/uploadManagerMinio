import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot(translateModuleConfig),
    NgxSliderModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'calendar', component: CalendarDateComponent },
      { path: 'slider', component: SliderTimeComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
