import { NgModule } from '@angular/core';
import { NgxQuillMediaComponent } from './components/ngx-quill-media/ngx-quill-media.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoadImgDirective } from './components/image-load.directive';
import { ClickOutsideDirective } from '@src/app/directive/click-outside.directive';
import { ToastrModule } from 'ngx-toastr';
import { NumericDirective } from '@src/app/directive/numeric.directive';
import { UniCodeDirective } from '@src/app/directive/input-unicod.directive';

@NgModule({
  declarations: [
    NgxQuillMediaComponent,
    LoadImgDirective,
    ClickOutsideDirective,
    UniCodeDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
   
  ],
  exports: [
    NgxQuillMediaComponent,
    LoadImgDirective,
    ClickOutsideDirective,
    UniCodeDirective,
    
  ]
})
export class NgxQuillMediaModule { }
