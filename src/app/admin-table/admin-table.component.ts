import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Members } from './admin-grid-type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
})
export class AdminTableComponent implements OnInit {
  gridData!: MatTableDataSource<any>;
  tableData!: Array<any>;
  rowsPerPage = 10; //Number Of Entries per Page
  noOfPages = 0; //Number of Pages in the Table
  currentPage = 1;
  countShown = 5; //Number of Pages shown in Paginator
  roles = ['member', 'admin']; //Roles of Users
  selectedRows: Array<any> = [];
  allSelected = false;
  totalRecords=0
  displayedColumns = ['check', 'name', 'email', 'role', 'action']; //Columns to display in Table
  constructor(private service: AdminService) {}

  ngOnInit(): void {
    this.service.getTableData().subscribe((docs: Members[]) => {
      this.gridData = new MatTableDataSource<Members>(docs);
      this.findNumberOfPages(docs.length);
      this.setData();
    });
  }
  /**
   * filterGridData - Function to filter Data in Table on basis of keywords in Search bar
   * @param filterString
   */
  filterGridData(filterString: string) {
    filterString = filterString.trim();
    filterString = filterString.toLowerCase();
    this.gridData.filter = filterString;
    this.findNumberOfPages(this.gridData.filteredData.length);
    this.currentPage = 1;
    this.setData();
  }

  /**
   * returnArray- Called from Html File to get the Number of pages to show in the paginator Max count will be countShown
   * @returns Array<Number>
   */
  returnArray() {
    var arr = [];
    const page = this.currentPage + this.countShown;
    if (page <= this.noOfPages) {
      for (let i = this.currentPage; i < page; i++) {
        arr.push(i);
      }
    } else {
      var diff =this.currentPage-(page-this.noOfPages)+1;
      if(diff<=0)diff=1
      for (let i = diff; i <= this.noOfPages; i++) {
        arr.push(i);}
    }
    return arr;
  }
  /**
   * Changes the current page as per selection from html file
   * @param page
   * @return void
   */
  changePage(page: number) {
    if (page > this.noOfPages) return;
    this.currentPage = page;
    this.setData();
  }
  /**
   * Finds total  number of pages in the grid
   * @param length
   */
  findNumberOfPages(length: number) {
    this.noOfPages = Math.ceil(length / 10 < 1 ? 1 : length / 10);
  }
  /**
   * Sets Data according to Page Number selected
   */
  setData() {
    this.totalRecords=this.gridData.filteredData.length
    const dataIndex = (this.currentPage - 1) * this.rowsPerPage;
    this.tableData = this.gridData.filteredData.slice(
      dataIndex,
      dataIndex + 10
    );
  }
  /**
   * Deletes single or multiple rows as per selection using Rest operators as params
   * @param row
   */
  delete(...row: any) {
    row.forEach((element: any) => {
      var index = this.gridData.filteredData.indexOf(element);
      this.gridData.filteredData.splice(index, 1);
    });
    this.findNumberOfPages(this.gridData.filteredData.length);
    this.setData();
  }
  /**
   * Adds or removes rows from selectedRows Array as per checkbox selection in UI
   * @param row
   */
  toggle(row: any) {
    if (this.selectedRows.includes(row)) {
      var index = this.selectedRows.indexOf(row);
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(row);
    }
    if (this.selectedRows.length == this.rowsPerPage) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
  }
  /**
   * Called on selection of header checkbox ,Selects or deselects all checkboxes in that page
   */
  toggleAll() {
    if (this.allSelected) {
      this.allSelected = false;
      this.selectedRows = [];
    } else {
      this.selectedRows = this.tableData.slice(0, this.rowsPerPage);
      this.allSelected = true;
    }
  }
  /**
   * Delete multiple rows
   */
  deleteMultiple() {
    this.delete(...this.selectedRows);
    this.allSelected = false;
    this.selectedRows = [];
  }
}
