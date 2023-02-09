import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostListener, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "country-component",
  templateUrl: "./country.component.html",
  encapsulation: ViewEncapsulation.None
})
export class CountryComponent implements OnInit, OnChanges {

  afterClickHover: boolean = true;

  countries: CountryModel[] = [];

  activeCountry: CountryModel = <any>{};
  @Input() active = false;

  STORAGE_KEY = "country";

  constructor(private readonly $http: HttpClient,
    private readonly eleRef: ElementRef,
  ) {
  }

  async ngOnInit() {
    this.getCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.active = changes && changes.active.currentValue;
  }

  getCountries() {
    this.countries = [
      { code: 65, title: "ایران", flagUrl: "iran.svg" },
      { code: 66, title: "عراق", flagUrl: "iraq.svg" },
      { code: 138, title: "سوریه", flagUrl: "syria.svg" },
      { code: 157, title: "یمن", flagUrl: "yemen.svg" },
      { code: 1, title: "افغانستان", flagUrl: "afghanistan.svg" }];

    let code = localStorage.getItem(this.STORAGE_KEY) || 65;
    let findCountry = this.countries.find(l => l.code == code) || this.countries[0];
    this.setActiveCountry(findCountry);
  }

  async onCountryChange(country: CountryModel) {
    this.active = false;
    this.setActiveCountry(country);
  }

  getActiveCountry() {
    return this.activeCountry;
  }

  setActiveCountry(country: CountryModel) {
    (window as any)["activeCountry"] = country;
    if ((window as any)["onChangeCountry"]) {
      (window as any)["onChangeCountry"](country);
    }
    localStorage.setItem(this.STORAGE_KEY, country && country.code.toString());
    this.activeCountry = country;
    //this.hSvc._setCountryChange(country);
  }

  @HostListener("document:click", ["$event"])
  docEvent($e: any) {
    if (!this.active) {
      return;
    }
    const paths: Array<HTMLElement> = $e["path"];
    if (!paths.some(((p: any) => p === this.eleRef.nativeElement) as any)) {
      this.active = false;
    }
  }
}


export interface CountryModel {
  title: string;
  code: number;
  flagUrl: string;
}

export interface LanguageModel {
  title: string;
  translate: string;
}
