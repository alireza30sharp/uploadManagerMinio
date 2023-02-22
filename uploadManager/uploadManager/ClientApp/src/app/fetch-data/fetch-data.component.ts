import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURI } from '../../../projects/api-uri';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxQuillMediaComponent } from '../../../projects/ngx-quill-media/src/lib/components/ngx-quill-media/ngx-quill-media.component';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent extends APIURI implements OnInit  {
  public forecasts: WeatherForecast[] = [];
  modalRef?: BsModalRef;
  modalMediaRef?: BsModalRef;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private modalService: BsModalService) {
    super()
    http.get<WeatherForecast[]>('https://localhost:7172/' + 'weatherforecast').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }
  ngOnInit() {
    

    this.http.get(this.api.getAllFileUrl).subscribe(res => {
      var a=res

    })
  }

  openMediaModal() {
    this.modalMediaRef = this.modalService.show(NgxQuillMediaComponent, Object.assign({}, { class: 'media-modal gray modal-lg' }));
    this.modalMediaRef.content.onClose = (data: { src }) => {
     //; this.termData.pic_url = data.src;
      this.modalMediaRef.hide();
    };
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
