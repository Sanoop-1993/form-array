import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  addForm(data:any){
    return this.http.post('http://127.0.0.1:8000/api/addForm',data);
  }

  
}
