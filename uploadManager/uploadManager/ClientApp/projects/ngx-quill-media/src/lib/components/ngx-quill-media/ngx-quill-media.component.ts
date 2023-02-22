import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  Renderer2
} from '@angular/core';
import {
  IFolder,
  NgxQuillMediaService,
  SelectAllInput,
  SelectAllOutput,
} from '../../ngx-quill-media.service';
import { forkJoin } from 'rxjs';
import { fadeAnimation } from 'src/app/core/animation-fade';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-quill-media',
  templateUrl: './ngx-quill-media.component.html',
  styleUrls: ['./ngx-quill-media.component.scss'],
  animations: [fadeAnimation],
})
export class NgxQuillMediaComponent implements OnInit {
  // image/*, video/*
  loading: boolean = true;
  showLoadMore: boolean = true;
  fileCount: number = 0;
  selectedSrc: string;
  onClose: any;
  Skip = -50;
  @ViewChild('inputUpload', { static: false }) bultanPdfElement: ElementRef;

  files: SelectAllOutput[] = [];
  masterFiles: SelectAllOutput[] = [];
  folders: IFolder[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private readonly ngxQuillMediaSvc: NgxQuillMediaService,
    private elementRef: ElementRef,
    private _toster: ToastrService,
    private renderer:Renderer2
  ) {}

  ngOnInit() {
    this.reset();
    this.getAllFile();
  }

  getAllFile() {
    this.loading = true;
    this.Skip = 50 + this.Skip;
    const model: SelectAllInput = {
      Skip: this.Skip,
      Extention: 'jpg,png',
      Top: 50,
    };
    this.ngxQuillMediaSvc.getAllFile(model).subscribe((res) => {
      const allFile = res;

      // مشخص کردن پوشه های فایل ها
      const folders: IFolder[] = [];
      allFile.forEach((f) => {
        f.folder = f.path.split('/').length > 5 ? f.path.split('/')[4] : 'root';
        f.editMode = false;
      });

      allFile.forEach((f) => {
        if (folders.find((x) => x.name == f.folder)) {
          folders.find((x) => x.name == f.folder).count++;
        } else {
          folders.push({ check: f.folder == 'root', count: 1, name: f.folder });
        }
      });
      this.folders = folders;

      this.files = JSON.parse(JSON.stringify(allFile));
      this.masterFiles = JSON.parse(JSON.stringify(allFile));
      this.filterFileWithFolder();
      this.loading = false;
    });
  }
  clearEditMode() {
    this.files.forEach((f) => (f.editMode = false));
  }
  updateTitle(event: any, item: SelectAllOutput) {
    this.clearEditMode();
    event.stopPropagation();
    item.editMode = !item.editMode; 
    setTimeout(()=>{
      this.renderer.selectRootElement("#input").focus();

    },100)
  }

  saveUpdateTitle(event: any, item: SelectAllOutput) {
    event.stopPropagation();
    item.editMode = !item.editMode;
    let itemSelect =  item;
    this.ngxQuillMediaSvc
      .UpdateTags(item, this.folders.find((f) => f.check).name)
      .subscribe(
        (res) => {
          if (res) {
            this._toster.success('با موفقیت ویرایش شد');
            let find = this.masterFiles.find((f) =>
              f.path.includes(itemSelect.path)
            );
            if (find) {
              find.tags = Object.assign({}, itemSelect.tags);
            }

            //this.getAllFile();
          }
          this.loading = false;
        },
        (error) => {
          
          this._toster.error('مجددا تلاش کنید');
          let find = this.masterFiles.find((f) =>
            f.path.includes(itemSelect.path)
          );
          if (find) {
            itemSelect.tags = Object.assign({},find.tags);
          }
        }
      );
  }
  uploadFile() {
    const req = [];
    this.loading = true;
    Array.from(this.bultanPdfElement.nativeElement.files).forEach(
      (file: any) => {
        req.push(
          this.ngxQuillMediaSvc.uploadFile(
            file,
            this.folders.find((f) => f.check).name
          )
        );
      }
    );

    forkJoin(req).subscribe((res) => {
      this.reset();
      this.getAllFile();
      this.loading = false;
    });
  }

  filterFileWithFolder() {
    this.selectedSrc = null;
    const folder = this.folders.find((f) => f.check).name;
    this.files = JSON.parse(
      JSON.stringify(this.masterFiles.filter((f) => f.folder == folder))
    );
  }

  selectFolder(index: number) {
    this.folders.forEach((f, i) => (f.check = i == index));
    this.filterFileWithFolder();
  }

  addFolder(event) {
    if (event.currentTarget.value) {
      this.folders.forEach((f) => (f.check = false));
      this.folders.push({
        check: true,
        count: 0,
        name: event.currentTarget.value,
      });
      event.currentTarget.value = null;
      this.filterFileWithFolder();
    }
  }

  reset() {
    this.Skip = -50;
    this.files = [];
    this.fileCount = 0;
    if (
      this.bultanPdfElement &&
      this.bultanPdfElement.nativeElement &&
      this.bultanPdfElement.nativeElement.value
    ) {
      this.bultanPdfElement.nativeElement.value = '';
    }
  }

  fileCountDetect(event) {
    this.fileCount = event.currentTarget.files.length;
  }

  selectFile(file: SelectAllOutput) {
    this.files.forEach((item) => {
      item.check = file.path == item.path;
    });
    this.selectedSrc = this.files.find((f) => f.check).path;
  }

  close() {
    this.bsModalRef.hide();
  }

  sendData() {
    this.onClose({ src: this.selectedSrc });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.clearEditMode();
  }
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.clearEditMode();
    }
  }
}
