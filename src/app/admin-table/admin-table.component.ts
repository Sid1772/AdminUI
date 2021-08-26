import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {AdminService} from '../admin.service'
import {Members} from './admin-grid-type'
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit ,AfterViewInit{
gridData!:MatTableDataSource<any>
tableData!:Array<any>
rowsPerPage=10;
pageCount=0
currentPage=1
countShown=5
roles=["member","admin"]
@ViewChild('paginator') Paginator!:MatPaginator
displayedColumns=["check","name","email","role","action"]
  constructor(private service:AdminService) { }

  ngOnInit(): void {
    this.service.getTableData().subscribe((docs:Members[])=>{
     this.gridData=new MatTableDataSource<Members>(docs);
     this.findPageCount(docs.length)
     this.setData()
     
    })
  }
  ngAfterViewInit(){
    
  
  }
  filterGridData(filterString:string){
    filterString=filterString.trim()
    filterString=filterString.toLowerCase()
    this.gridData.filter=filterString
    this.findPageCount(this.gridData.filteredData.length)
    this.currentPage=1
    this.setData()
  }
  returnArray(length:number){
    return Array(length)
  }
  changePage(page:number){
    this.currentPage=page
    this.setData()
  }
  findPageCount(length:number){
    this.pageCount=Math.ceil(length/10<1?1:length/10)
  }
  setData(){
    const dataIndex=(this.currentPage-1)*this.rowsPerPage 
    this.tableData=this.gridData.filteredData.slice(dataIndex,dataIndex+10)
    
  }

}
