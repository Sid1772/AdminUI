import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  public getTableData():any{
    return this.http.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
  }
}
