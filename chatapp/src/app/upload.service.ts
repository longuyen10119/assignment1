import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  // Get profile pic
  getProfile(id){
    return this.http.get('http://localhost:3000/api/upload/' + id);
  }
  // Upload profile pic
  uploadProfile(fd){ 
    return this.http.post<any>('http://localhost:3000/api/upload', fd)
  }
}
