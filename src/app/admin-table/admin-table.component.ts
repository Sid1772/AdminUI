import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Members } from './admin-grid-type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
})
export class AdminTableComponent implements OnInit, AfterViewInit {
  gridData!: MatTableDataSource<any>;
  tableData!: Array<any>;
  rowsPerPage = 10;
  noOfPages = 0;
  currentPage = 1;
  countShown = 5;
  roles = ['member', 'admin'];
  selectedRows: Array<any> = [];
  allSelected = false;
  @ViewChild('paginator') Paginator!: MatPaginator;
  displayedColumns = ['check', 'name', 'email', 'role', 'action'];
  constructor(private service: AdminService) {}

  ngOnInit(): void {
    this.service.getTableData().subscribe((docs: Members[]) => {
      this.gridData = new MatTableDataSource<Members>(docs);
      this.findNumberOfPages(docs.length);
      this.setData();
    });
  }
  ngAfterViewInit() {}
  filterGridData(filterString: string) {
    filterString = filterString.trim();
    filterString = filterString.toLowerCase();
    this.gridData.filter = filterString;
    this.findNumberOfPages(this.gridData.filteredData.length);
    this.currentPage = 1;
    this.setData();
  }
  returnArray(length: number) {
    return Array(length);
  }
  changePage(page: number) {
    this.currentPage = page;
    this.setData();
  }
  findNumberOfPages(length: number) {
    this.noOfPages = Math.ceil(length / 10 < 1 ? 1 : length / 10);
  }
  setData() {
    const dataIndex = (this.currentPage - 1) * this.rowsPerPage;
    this.tableData = this.gridData.filteredData.slice(
      dataIndex,
      dataIndex + 10
    );
  }
  delete(...row: any) {
    console.log(row);
    row.forEach((element: any) => {
      console.log(element);
      var index = this.gridData.filteredData.indexOf(element);
      this.gridData.filteredData.splice(index, 1);
    });
    this.findNumberOfPages(this.gridData.filteredData.length);
    this.setData();
  }
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
  toggleAll() {
    if (this.allSelected) {
      this.allSelected = false;
      this.selectedRows = [];
    } else {
      const selectedIndexStart = (this.currentPage - 1) * this.rowsPerPage;
      const selectedIndexEnd = selectedIndexStart + this.rowsPerPage;
      this.selectedRows = this.tableData.slice(
        selectedIndexStart,
        selectedIndexEnd
      );
      this.allSelected = true;
    }
  }
  deleteMultiple() {
    this.delete(...this.selectedRows);
    this.allSelected = false;
    this.selectedRows = [];
  }
}
