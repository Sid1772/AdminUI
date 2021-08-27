import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  public getTableData():any{
    //GeekTrust API with 46 users
    return this.http.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    //Mocky APi with more users for testing
    //return this.http.get('https://run.mocky.io/v3/a2050c68-9e97-476d-927a-9230a9d8ca05')
  }
}
