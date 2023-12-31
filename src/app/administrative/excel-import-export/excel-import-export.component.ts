import { Component, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "app/core/service/user.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-excel-import-export",
  templateUrl: "./excel-import-export.component.html",
  styleUrls: ["./excel-import-export.component.scss"],
})

export class ExcelImportExportComponent implements OnInit {
  importForm: FormGroup;
  encType = "multipart/form-data";
  hide: boolean = false;
  hideMessage: boolean = false;
  importRes: any;
  byteCharacters: any;
  className: any;
  fileObservable: any;

  constructor(
    private userService: UserService,
    private fb: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public shared: SharedService,
    private router: Router,

  ) {
    this.className = shared.importExportClass;
  }

  importExport() {

    this.shared.importExportClass = "ContractEmployee";

    this.router.navigate([`/administrative/excel-import-export`]);

  }

  ngOnInit() {
    this.className = this.shared.importExportClass;

    this.importForm = this.fb.group({
      file: [, [Validators.required]],
    });
  }
  reset(){
    
   this.importForm.reset();
   this.hide = false;
  }

  downloadContractEmployeeExcel() {
    this.userService
      .downloadContractEmployeeExcel(this.className)
      .subscribe((response) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(
          new Blob([response.body], { type: response.body.type })
        );
        downloadLink.download = this.className + ".xlsx";
        downloadLink.click();
      });
  }

  onFileSelect(event) {
    this.importForm.controls["file"].setValue(event.target.files[0]);
  }

  onFileSelectClick(event) {
    event.target.value=''
  }

uploadContractEmployeeExcel() {
  console.log(this.importForm.value.file)
    if (
      this.importForm.value.file.type ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      if(this.className=='ContractEmployee'){
        this.userService
        .uploadContractEmployeeExcel(this.importForm.value.file)
        .subscribe((response: any) => {
          this.hide = true
          this.importRes = response
          if (this.importRes?.failureCount > 0) {
           this.byteCharacters = atob(this.importRes.errorCsvData);
            this.hideMessage = true
          } else {
            this.hideMessage = false
            // alert("contract employee details inserted successfully");
          }
        });
      }
      if(this.className=='Customer'){
        this.userService
        .uploadCustomerExcel(this.importForm.value.file)
        .subscribe((response: any) => {
          this.hide = true
          this.importRes = response
          if (this.importRes?.failureCount > 0) {
           this.byteCharacters = atob(this.importRes.errorCsvData);
            this.hideMessage = true
          } else {
            this.hideMessage = false
            // alert("contract employee details inserted successfully");
          }
        });
      }
      if(this.className=='Employee'){
        this.userService
        .uploadEmployeeExcel(this.importForm.value.file)
        .subscribe((response: any) => {
          this.hide = true
          this.importRes = response
          if (this.importRes?.failureCount > 0) {
            this.byteCharacters = atob(this.importRes.errorCsvData);
            this.hideMessage = true
          } else {
            this.hideMessage = false
            // alert("contract employee details inserted successfully");
          }
        });
      }
      if(this.className=='EmployeePayHours'){
        this.userService
        .uploadEmployeePayHours(this.importForm.value.file)
        .subscribe((response: any) => {
          this.hide = true
          this.importRes = response
          if (this.importRes?.failureCount > 0) {
           this.byteCharacters = atob(this.importRes.errorCsvData);
            this.hideMessage = true
          } else {
            this.hideMessage = false
            // alert("contract employee details inserted successfully");
          }
        });
      }
      if(this.className=='EmployeeWeeklyWages'){
        this.userService
        .uploadEmployeeWeeklyWages(this.importForm.value.file)
        .subscribe((response: any) => {
          this.hide = true
          this.importRes = response
          if (this.importRes?.failureCount > 0) {
           this.byteCharacters = atob(this.importRes.errorCsvData);
            this.hideMessage = true
          } else {
            this.hideMessage = false
          }
        });
      }
      
    } else {
      alert("please select excel file");
      
    }
  }

  downloadErrList(){
    const downloadLink = document.createElement("a");
    const byteNumbers = new Array (this.byteCharacters.length);
    for (let i = 0; i <this.byteCharacters.length; i ++) {
      byteNumbers [i] = this.byteCharacters.charCodeAt (i);
    }  
    const byteArray = new Uint8Array (byteNumbers);
    downloadLink.href = URL.createObjectURL(
      new Blob ([byteArray], {type: 'application / vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    );
    downloadLink.download = this.className + "-Error.xlsx";
    downloadLink.click();
  }

}
function saveAs(blob: any, arg1: string, arg2: { autoBOM: boolean; }) {
  throw new Error("Function not implemented.");
}
function base64StringToBlob(fileContent: any, contentType: string) {
  throw new Error("Function not implemented.");
}

