import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, HostListener, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SelectAllOutput } from '../ngx-quill-media.service';

@Directive({ selector: 'img[loadImg]' })
export class LoadImgDirective implements OnInit {

    @Input() loadImg: SelectAllOutput;

    constructor(
        private readonly $http: HttpClient,
        private el: ElementRef) { }

    ngOnInit() {

    }

}