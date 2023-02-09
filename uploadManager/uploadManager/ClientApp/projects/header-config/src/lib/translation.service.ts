import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { forkJoin, Observable, Observer } from "rxjs";
import {
  TranslateLoader,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class ClientMissingTranslationHandler
  implements MissingTranslationHandler
{
  constructor(private ngZone: NgZone) {}

  handle(params: MissingTranslationHandlerParams) {
    this.ngZone.run(() => {
      return params.key;
    });
  }
}

@Injectable({ providedIn: "root" })
export class ClientTranslateLoader implements TranslateLoader {
  constructor(private readonly $http: HttpClient, private ngZone: NgZone) {}

  getTranslation(lang: string): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      let clients ='apiservice' //[null, window["clientId"]].filter((f) => f != null);
      
      this.$http
        .get<TranslationModel[]>(
          `http://127.0.0.1:9000/i18n/${clients}-${lang}.json`
        )
        .subscribe((_t) => {
          obs.next(_t);
          obs.complete();
        });
    });
  }

  apiTransToObjectTrans(trans: any, lang: string) {
    const tObj: { [index: string]: string } = {};
    for (const t of trans) {
      tObj[t.key] = t[lang];
    }
    return tObj;
  }
}

export interface IObject {
  [index: string]: string;
}

export interface LanguageConfig {
  clients: string[];
  apiUrl: string;
}

export interface TranslationModel {
  id: number;
  client: string;
  key: string;
  fa: string;
  en: string;
  ar: string;
  isCommon: boolean;
}
