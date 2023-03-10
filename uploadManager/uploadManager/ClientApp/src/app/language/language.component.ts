import { Component, ElementRef, HostListener, OnInit, OnChanges, Input, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { TranslateService } from "@ngx-translate/core";
import { LanguageModel } from "../models/LanguageModel";


@Component({
  selector: "language-component",
  templateUrl: "./language.component.html",

})
export class LanguageComponent implements OnInit, OnChanges {

  afterClickHover: boolean = true;

  languages: LanguageModel[] = [];

  activeLang: LanguageModel = <any>{};
  @Input() active = false;

  STORAGE_KEY = "lang";

  constructor(private readonly $http: HttpClient,
    private readonly eleRef: ElementRef,
    private readonly translate: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.active = changes && changes.active.currentValue;
  }

  ngOnInit() {
    this.initTranslation();
    this.getLangs();
  }


  getLangs() {
    this.languages = [
      {
        "title": "Persion",
        "translate": "fa"
      },
      {
        "title": "Arabic",
        "translate": "ar",
      }
    ];
    this.setActiveLanguage(this.getActiveLanguage() || this.languages[0]);
  }

  async onLangChange(l: LanguageModel) {
    this.active = false;
    await this.translate.use(l.translate).toPromise();
    this.setActiveLanguage(l);
  }

  getActiveLanguage() {
    let code = localStorage.getItem(this.STORAGE_KEY) || "fa";
    if (!this.languages.find(l => l.translate === code)) {
      code = "fa";
    }
    return this.languages.find(l => l.translate === code);
  }

  setActiveLanguage(lang: LanguageModel) {
    if ((window as any) && (window as any)["onChangeLang"]) {
      (window as any)["onChangeLang"](lang);
    }
    localStorage.setItem(this.STORAGE_KEY, lang.translate);
    this.activeLang = lang;
   // this.hSvc._setLanguage(lang);
  }

  initTranslation() {

    (async () => {

      // this language will be used as a fallback when a translation isn't found in the current language
      //this.translate.setDefaultLang("fa");
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      const lang = localStorage.getItem("lang") || localStorage.getItem("lang_def") || "fa";
      await this.translate.use(lang).toPromise();

      // Test Translation loaded
      this.translate.get("??????????").subscribe((res: string) => {
        if (res && res.length > 0) {
          console.log("%c???? Translation Loaded.", "color: green;");
        } else {
          console.log("%c???? Translation Failed.", "color: red;");
        }
      }, err => {
        console.log("%c???? Translation Failed.", "color: red;");
      });
    })();
  }

  @HostListener("document:click", ["$event"])
  docEvent($e: any) {
    if (!this.active) {
      return;
    }
    const paths: Array<HTMLElement> = $e["path"];

    if (paths) {
      if (!(paths.some(((p: any) => p === this.eleRef.nativeElement) as any))) {
        this.active = false;
      }
    }

  }
}
