import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { of } from "rxjs/internal/observable/of";
import { LicenseManager } from "ag-grid-enterprise";
import { TranslateService } from "@ngx-translate/core";
import { NgxPermissionsService } from "ngx-permissions";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class Application {

	constructor(
		private readonly $http: HttpClient,
		private permissionsService: NgxPermissionsService,
		private readonly translate: TranslateService,
	) {

    
	//	this.licenseAgGrid();
	}

	/**
	 * A function that will be executed when an application(all service) is initialized.
	 */
  async start() {
    debugger
		this.permissionsService.addPermission(window["permissionsList"]);
		this.initTranslation();

	}

  async initTranslation() {
    debugger
		// this language will be used as a fallback when a translation isn't found in the current language
		// this.translate.setDefaultLang("fa");
		// the lang to use, if the lang isn't available, it will use the current loader to get them
		const lang = localStorage.getItem("lang") || localStorage.getItem("lang_def") || "fa";
		await this.translate.use(lang).toPromise();

		// Test Translation loaded
		this.translate.get("تایید").subscribe((res: string) => {
			if (res === "تایید") {
				console.log("%c📟 Translation Loaded.", "color: green;");
			} else {
				console.log("%c💔 Translation Failed.", "color: red;");
			}
		});
	}

	licenseAgGrid() {
		(LicenseManager.prototype as any).showValid = true;
		LicenseManager.prototype.validateLicense = () => {
			if ((LicenseManager.prototype as any).showValid) {
				console.log("%c📃 ag-grid licensed.", "color: green;");
			}
			(LicenseManager.prototype as any).showValid = false;
			return true;
		};
	}

	userData(): Observable<UserData> {

		const oidc = localStorage.getItem("oidc.user:https://accounts/user");
		if (oidc) {
			const profile = JSON.parse(oidc).profile;
			if (profile) {
				return of({
					Id: profile.almasId,
					sId: profile.sub,
					userName: profile.username
				});
			}
		}

		return this.$http.get<any>("https://accounts/connect/userinfo").pipe(map<any,UserData>((profile) => {
			return {
				Id: profile.Id,
				sId: profile.sub,
				userName: profile.username
			};
		}));

	}
}
export interface UserData {
  Id: number;
  sId: string;
  userName?: string;
}
