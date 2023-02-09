import { Component, Input, ViewEncapsulation, OnInit, Output, EventEmitter, OnChanges, OnDestroy, ViewChild, ElementRef, SimpleChanges, HostListener, AfterViewInit, HostBinding } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'exir-sidebar-web-component',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  encapsulation: ViewEncapsulation.ShadowDom


})
export class AppSidebarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @HostBinding("class.is-large-menu")
  isLargeMenu: boolean = false;

  @Output() hideMenuEvent = new EventEmitter<boolean>();

  // hideMenu: boolean = false
  activeMenuItem: boolean = false

  baseIconUrl = "/assets"; //"https:/assets/icons";
  miladiDaysName = ['یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', '5 شنبه', 'جمعه', 'شنبه'];
  miladiDaysNumber = [1, 2, 3, 4, 5, 6, 0];
  ngxToolsHidden = true;
  ngxDetialsUser = true;
  ngxDetialRing = true;
  scrollActive = false;
  moreMessage: boolean = true;
  isShowDetailRingItem = false;
  isShowRingContent = true;
  isShowCopyModal = false;
  isShowRingKnow = false;
  isShowRing = true;
  multigrambadge = 0;
  @Output() bellStatus = new EventEmitter();
  isShowDropDown = false;
  /** لودینگ فعال و غیرفعال کردن هشدارها روی زنگوله */
  loadingSilenceTime: boolean = false;
  checkRingOpen = false;
  SameLastDataRing = false;

  isShowRemoveDialog = false;
  href: any;
  supportUrl: any;
  step1Content = false;

  isSata86 = true;

  afterClickHover: boolean = true;

  resultLength: any = 0;
  enterLength: any = 0;

  dateServer: any;

  warningData: any = [];
  @Input()
  name = "";

  @Input()
  icon = "";

  logoSrc: string = "";

  @Input()
  class: any;

  /*clickMenu: boolean = true;*/

  _config: any = {
    showProfileButton: true,
    showSearchButton: true,
    showDarkMode: true,
    showLang: true
  };

  languageActive: boolean = false;
  countryActive: boolean = false;

  @Input()
  get config(): any {
    return this._config;
  }

  set config($val: any) {
    this._config = Object.assign(<any>{
      showProfileButton: true,
      showSearchButton: true,
      showDarkMode: true,
      showLang: true
    }, $val);
  }

  @Input()
  link = "/";

  @ViewChild("ngxTools")
  ngxTools: any;

  @ViewChild("ngxUserTools")
  ngxUserTools: any;


  @ViewChild("ngxRing")
  ngxRingViewChild: any;

  clients = [];

  permissionMenuKey = "sata_menu_sub_clients";

  displayName = "";
  profileImage = "";

  isNetworkOffline: boolean;
  private _subscription = new Subscription();

  constructor(
    private readonly $elementRef: ElementRef,
    private $http: HttpClient,
  
  ) {
    // این مورد خطا میداد ظاهرا در ورژن جدید idp آبجکت auth تغییر کرده است
    //this.auth.isOffline.subscribe(state => {
    //  this.isNetworkOffline = state;
    //});
    this.isNetworkOffline = false;
  }

  ngAfterViewInit(): void {
    const _name = this.$elementRef.nativeElement.attributes.name;
    if (_name && _name.value) {
      this.name = _name.value;
    }

    const _iconSrc = this.$elementRef.nativeElement.attributes.icon;
    if (_iconSrc && _iconSrc.value) {
      this.logoSrc = _iconSrc.value;
    }

    //for open or close sidebar config
    const _wideMenu = this.$elementRef.nativeElement.attributes.wideMenu;
    if (_wideMenu && _wideMenu.value) {
      try {
        this.isLargeMenu = JSON.parse(_wideMenu.value);
      } catch {
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.body.scrollTop >= 100 || document.documentElement.scrollTop >= 100) {
      this.scrollActive = true;
    } else {
      this.scrollActive = false;
    }
  }

  ngOnInit(): void {
 
    const t = (new Date()).toLocaleDateString().replace(/\//gui, "");
    this.logoSrc = ''//`https:///${(window as any).clientId}.svg?=t${t}`;

    this.getClient();


    this.getUsername();
    this.getImageProfile();
    setTimeout(() => {
    }, 1000);
  }

  hideMenu() {
    this.isLargeMenu = !this.isLargeMenu;
    this.hideMenuEvent.emit(this.isLargeMenu);
  }

  getClient() {

  }

  logoClick(event: any) {
    if ((window as any) && (window as any).onLogoClick) {
      event.preventDefault();
      (window as any).onLogoClick();
    }
  }








  ngOnChanges(changes: SimpleChanges) {
    if (changes["name"] && changes["name"].currentValue) {
      this.name = changes["name"].currentValue;
    }
    if (changes["icon"] && changes["icon"].currentValue) {
      this.icon = changes["icon"].currentValue;
    }
  }

  @HostListener("document:click", ["$event"])
  docEvent($e: any) {
    if (this.ngxToolsHidden && (this.config.showProfileButton && this.ngxDetialsUser) && this.ngxDetialRing) {
      return;
    }
    const paths: Array<HTMLElement> = $e["path"];
    if (!paths.some(p => p === this.ngxTools.nativeElement)) {
      this.ngxToolsHidden = true;
    }
    if (!paths.some(p => p === this.ngxUserTools.nativeElement)) {
      this.ngxDetialsUser = true;
    }
    if (!paths.some(p => p === this.ngxRingViewChild.nativeElement)) {
      this.ngxDetialRing = true;
      this.step1Content = false;
      this.isShowRingContent = true;
      this.isShowDetailRingItem = false;
      this.isShowRingKnow = false;
      this.isShowDropDown = false;
  
    }
  }

  showHeader($e: MouseEvent) {
    /*this.clickMenu = false;*/
    this.toggle();
    $e.stopPropagation();
    $e.preventDefault();
  }

  showSet = false;
  showSetting() {
    this.showSet = !this.showSet;
  }



  showDetails($e: MouseEvent) {
    this.toggleDetails();
    if (!this.ngxDetialRing) {
      this.ngxDetialRing = !this.ngxDetialRing;
    }
    $e.stopPropagation();
    $e.preventDefault();
  }

  toggleDetails() {
    this.closeDropDown();
    if (!this.ngxToolsHidden) {
      this.toggle();
    }
    this.ngxDetialsUser = !this.ngxDetialsUser;
  }

  logout() {
  }

  toggle() {
    this.closeDropDown();
    if (!this.ngxDetialsUser) {
      this.toggleDetails();
    }
    if (!this.ngxDetialRing) {
      this.ngxDetialRing = !this.ngxDetialRing;
    }
    this.ngxToolsHidden = !this.ngxToolsHidden;
    if (!this.ngxToolsHidden) {
    }
  }
  //sideMenu
  openNav() {
    (document.querySelector('.sidenavPlatforms') as HTMLElement).style.width = '100%';
  }

  closeNav() {
    (document.querySelector('.sidenavPlatforms') as HTMLElement).style.width = "0";
  }

  getUsername() {
    this.displayName = 'aaa';
    //const url = ``;
    //this.$http.get(url, {}).subscribe((response: any) => {
    //  if (response) {
    //    this.displayName = response[0].fullName;
    //  }
    //});
  }

  getImageProfile() {
    this.profileImage = 'ss';
    //const url = ``;
    //this.$http.get(url, {}).subscribe((response: any) => {
    //  if (response && response.length > 0 && response[0].profileImage) {
    //  //  this.profileImage = response[0].profileImage;
    //  } else {
    //    this.profileImage = "https://profile.sata.sys/assets/user.png";
    //  }
    //});
  }


 



  closeModal() {
  }

  showDropDown() {
    this.isShowDropDown = !this.isShowDropDown;
  }

  silentClick(type: number) {
 
  }

  closeAllRingDropDown() {
    //  this.iconBellService.isShowSpinner = true;
    this.isShowRingContent = true;
    this.isShowDetailRingItem = false;
    this.isShowRingKnow = false;
    this.isShowDropDown = false;
    this.step1Content = false;
  }

  showRemoveDialog(event: MouseEvent) {
    this.ngxToolsHidden = !this.ngxToolsHidden;
  }

  removeLimitTime() {  // غیرفعال کردن دستور عدم ایجاد مزاحمت


  }

  getListSilence() {
 
  }

  goToIssueInfo(item: any) {
    window.open('https://im.sata.sys/issueInfo/' + item['FK_ConceptID'], '_blank');
  }

  toggleHeight(item: any) {
    if (item.enterLength >= 2 || item.resultLength > 130) {
      item['isOpen'] = !item['isOpen'];
    }
  }

  ngOnDestroy(): void {
    this._subscription && (this._subscription.unsubscribe());
  }

  closeDropDown() {

    this.languageActive = true;
    setTimeout(() => {
      this.languageActive = false;
    }, 1);

    this.countryActive = true;
    setTimeout(() => {
      this.countryActive = false;
    }, 1);
  }
}
