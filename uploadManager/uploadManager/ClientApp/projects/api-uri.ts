import { environment } from './environments/environment';

export abstract class APIURI {


  api = {
    get: `${environment.origin}weatherforecast`,
    getAllFileUrl: `${environment.origin}api/media/search/files?IsRecursive=true` ,
    upload: `${environment.origin}api/media/upload/files`,
    updateTags: `${environment.origin}api/media/updatetags/files`,
  };


}
