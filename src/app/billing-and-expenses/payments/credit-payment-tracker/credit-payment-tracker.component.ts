import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { sort } from 'app/core/models/sort';
import { BillingService } from 'app/core/service/billing/billing.service';

import { NotificationsComponent } from 'app/additional-components/notifications/notifications.component';
import { SharedService } from 'app/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from "@angular/common";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';


@Component({
  selector: 'app-credit-payment-tracker',
  templateUrl: './credit-payment-tracker.component.html',
  styleUrls: ['./credit-payment-tracker.component.scss']
})
export class CreditPaymentTrackerComponent implements OnInit {

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild(MatTableExporterDirective, { static: true })
  exporter: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  displayedColumns = [
    //"paymentId",
    "customerId",
    "salesId",
    "pendingAmount",
    "paidAmount",
    "totalOrderAmount",
    //"orderDateTime",
    //"notificationSendAt",
    "description",
  ];

  creditTracker: FormGroup;
  dataSource: any;
  loading = false;
  hide = false;
  rowDetails: any;
  data: any;
  searchTerm: string = "";
  sortEvent: sort = {
    active: "",
    direction: "DESC",
  };
  pageSize: number = 5;
  pageIndex: number = 0;
  dueDate: string;
  description: string;
  deleteItem = {
    id:0,
    key : ''
  };

  constructor(
    private fb: UntypedFormBuilder,
    public router: Router,
    public billingService : BillingService, 
    private notification: NotificationsComponent,
    private shared: SharedService,
    private spinner: NgxSpinnerService,
    public datepipe:DatePipe

  ) {}


  ngOnInit() {
    this.loadData();

    this.creditTracker = this.fb.group({
      dueDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  currentDateTime = this.datepipe.transform(
    new Date(),
    "MM-dd-yyyy h-mm-ss"
  );


  exelExport() {
    this.exporter.exportTable(ExportType.XLSX, {
      fileName: "KPR_Credit_Payment_Tracker_Details_" + this.currentDateTime,
    });
  }

  pdfExport() {
    let data: any = this.dataSource;
    const doc = new jsPDF("portrait", "px", "a4");
    doc.text("KPR Credit Payment Tracker Details", 15, 25);

    autoTable(doc,
      {
        theme: "grid",
        styles: { halign: "center", fillColor: [78, 78, 229] },
        bodyStyles: { fillColor: [235, 235, 238] },
        margin: { top: 40 },
        body: data,
        columns: [
          { header: "Customer Id", dataKey: "customerId" },
          { header: "Sales id ", dataKey: "salesId" },
          { header: "Pending Amount", dataKey: "pendingAmount" },
          { header: "Paid Amount", dataKey: "paidAmount" },
          { header: "Total Order Amount", dataKey: "totalOrderAmount" },
          { header: "Description", dataKey: "description" }
          
        ],
        didParseCell: function (data) {
          if (data.column.dataKey === 'customerId') {
            var text = data.row.raw["customerId"].name;
            if (text && text.length > 0) {
              data.cell.text = text;
            }

          }
        }
      }
    );
    doc.save("KPR_Credit_Payment_Tracker_Details_" + this.currentDateTime);
  }




  viewCall(row){
this.rowDetails = row
this.hide = true
  }

  sortData(event: Sort) {
    this.sortEvent = event;
    this.sort.disableClear=true;
    this.loadData();
  }

  getPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadData();
  }

  public loadData() {
    
    this.rowDetails = '';
    this.hide = false;
    this.billingService.getAllCreditPaymentTracker( 
    this.pageIndex,
    this.pageSize,
    this.sortEvent.direction.toUpperCase(),
    this.sortEvent.active,
    this.searchTerm
      )
      .subscribe((response: any) => {
        this.data = response.data;
        this.dataSource = this.data.content;
        this.pageIndex = 0;
      });
      
  }

  update(){
    
    this.billingService.editCreditPaymentTracker(this.rowDetails.id, this.creditTracker.value).subscribe(res=>{
      this.loadData();
    })
    
  }

}