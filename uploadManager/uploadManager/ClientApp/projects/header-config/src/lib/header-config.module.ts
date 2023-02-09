import { NgModule } from "@angular/core";
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModuleConfig,
} from "@ngx-translate/core";
import {
  ClientMissingTranslationHandler,
  ClientTranslateLoader,
} from "./translation.service";

export const translateModuleConfig: TranslateModuleConfig = {
  loader: { provide: TranslateLoader, useClass: ClientTranslateLoader },
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useClass: ClientMissingTranslationHandler,
  },
  useDefaultLang: false,
};

@NgModule()
class HeaderConfigModule {}
