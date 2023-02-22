import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs";
import { APIURI } from "../../../api-uri";

export interface SelectAllInput {
  Extention: string;
  Top?: number;
  Skip?: number;
}

export interface SelectAllOutput {
  path: string,
  tags: ITagModel,
  check: boolean,
  folder: string,
  editMode:boolean
}

export interface ITagModel{
  name:string,
  caption: string,
}
export interface IFolder {
  check: boolean,
  count: number,
  name: string
}

@Injectable({
  providedIn: "root"
})
export class NgxQuillMediaService extends APIURI {



  constructor(private readonly $http: HttpClient) { super() }

  getAllFile(model: SelectAllInput) {
    return this.$http.get<SelectAllOutput[]>(this.api.getAllFileUrl).pipe(map(res => {
      const extentionList = ['jpg', 'png'];

      res = res.filter(f => extentionList.includes(f.path.split(".")[1]));

      res.forEach(f => {
        f.check = false;
        f.path = `https://fs.sata.sys/${f.path}`
      })

      return res;
    }));
  }

  uploadFile(file: any, folder: string) {

let extention,name=null;
    function uuidv4() {
      return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
if(file.path){
  let splice=file.path.split('/');
  name=splice[splice.length-1].split(".")[0]
  extention =splice[splice.length-1].split(".")[1];
}
else
{
    name=uuidv4();
   extention = file.name.split(".").pop();
}

    var data = new FormData();

    const tags =file.tags?file.tags: {name:''};

    data.append("File", file);
    data.append("FileName", `${folder}/${name}.${extention}`);
    data.append("Tags", JSON.stringify(tags));
    return this.$http.post(this.api.upload, data);
  }

  UpdateTags(file: any, folder: string) {
    let extention,name=null;
        function uuidv4() {
          return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          );
        }
    if(file.path){
      let splice=file.path.split('/');
      name=splice[splice.length-1].split(".")[0]
      extention =splice[splice.length-1].split(".")[1];
    }
    else
    {
        name=uuidv4();
       extention = file.name.split(".").pop();
    }
    
    var data = new FormData();
    const tags =file.tags?file.tags: {name:''};
    let fileName="";
if(folder=='root'){
  fileName=`${name}.${extention}`
}
else
{
  fileName=`${folder}/${name}.${extention}`
}
  fileName=folder=='root'?`${name}.${extention}`:`${folder}/${name}.${extention}`
    data.append("FileName", fileName);
    data.append("Tags", JSON.stringify(tags));

    return this.$http.post(this.api.updateTags, data);
      }

}
