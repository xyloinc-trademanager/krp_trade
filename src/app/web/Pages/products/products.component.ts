import { Component, HostListener } from '@angular/core';
import { InventoryService } from 'app/core/service/inventory/inventory.service';
import { noImg } from 'app/inventory-management/inventory-management.module';
import { NgxSpinnerService } from 'ngx-spinner';

export class list {
  itemMaster: any;
  unitOfMeasure: any;
  itemCount: any;
  unitPrice: number;
  quantity: any;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  @HostListener('window:scroll', ['$event']) 
  brands: any[]
  productList: Array<list> = [];
  page: number = 0;
  size: number = 10;
  selectedBrand: any = ''
  isMobile = false
  noImg = noImg
  message = "Loading..."

  constructor(
    private inventoryService: InventoryService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.inventoryService.getWebBrand().subscribe((response:any) =>{
        this.brands = response.data
    })
    this.isMobileMenu();
    this.loadData();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      this.page = this.page + 1;
      this.loadData();
    }
  }

  isMobileMenu() {
    if ($(window).width() > 758) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  selectBrand(brand): void {
    this.page = 0;
    this.productList = [];
    this.selectedBrand = brand;
    this.loadData();
  }

  loadData (){
    this.spinner.show();
    this.inventoryService.getWebCartItems(
        this.page,
        this.size,
        (this.selectedBrand.name ? this.selectedBrand?.name : '')
      ).subscribe((response: any) => {
        if(response.data.content){
        for (let item of response.data.content) {
          this.productList.push(item);
        }
        this.spinner.hide();
      } else {
        this.productList = [];
      }
      }, (error) => {
        this.spinner.hide();
      });
  }

}

