import { Component, OnInit,ViewChild,HostListener,ElementRef,NgZone } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataServiceService } from '../../data-service.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

import { FormGroup,FormControl,Validators,FormBuilder, } from '@angular/forms';
import { GoogleMap } from '@agm/core/services/google-maps-types';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-installer-list',
  templateUrl: './installer-list.component.html',
  styleUrls: ['./installer-list.component.scss']
})
export class InstallerListComponent implements OnInit {
  rows = [];
  public isFormSubmit:boolean=false;
  public formValue:FormGroup;
  logoFiles:any;
  filedata:any;
  fileEvent(e){
      this.filedata = e.target.files[0];
  }

  temp = [];
  columns  = [{ prop:'Sl no'},{ prop: 'Name' }, { prop: 'Email id' }, { prop: 'Phone number' }, { prop: 'Contact person' }, { prop: 'Status' },{ prop: 'Action' }];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  ColumnMode = ColumnMode;
  
  public locationlist=[
    { id:1 , name:"Sydney" },
    { id:2 , name:"Melbourne" },
    { id:3 , name:"New south wales"},
    { id:4 , name:"Queensland"}
   ];
  constructor(config: NgbDropdownConfig,private toast:ToastrService,
     private modalService: NgbModal,public dataService: DataServiceService,  private formbuilder:FormBuilder) {

    this.formValue = this.formbuilder.group({
      fullName : ['',[Validators.required]],
      contactPerson : ['',[Validators.required]],
      phone : ['',[Validators.required]],
      emailId : ['',[Validators.required,Validators.email]],
      location : ['',[Validators.required]],
      website : ['',[Validators.required]],
      logo : ['',[Validators.required]],
    });
    this.fetch(data => {
      // cache our list
      this.temp = [...data[10]];

      // push our inital complete list
      this.rows = data[10];


    });
    
    console.log(this.formValue)




  }
  

  
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.Name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  ngOnInit() {
  }

  opencustomeradd(addinstaller) {
    this.modalService.open(addinstaller, { backdropClass: 'light-blue-backdrop',size:'lg',centered: true });
  }
  opencustomeredit(editinstaller){
    this.modalService.open(editinstaller, { backdropClass: 'light-blue-backdrop',size:'lg' });
  }
 
  isAnimationDone: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.dataService.isAnimationDone=false;
    setTimeout(() =>this.dataService.isAnimationDone=true, 200);
  }
  log(x){
    console.log(x);
  }
  openBackDropCustomClass(popup1){
    this.modalService.open(popup1,{backdropClass:"light-blue-backDrop" , windowClass:"my-class" ,size:'md'});
  }

  onFileChange(event) {
   
    if (event.target.files.length > 0) {
      this.logoFiles  = event.target.files[0];
      // const file = event.target.files;
      // this.formValue.get('logo').setValue(file);
      // console.log(this.formValue.value)
    }
  }

 

  addNewInstaller(){
    this.isFormSubmit = true;
if(this.formValue.valid)
{
  var myFormData = new FormData();
  var formData = JSON.stringify(this.formValue.value);
   myFormData.append('formdata', formData);
   myFormData.append('logofile',this.logoFiles);  

  this.dataService.addInstructor(myFormData).subscribe(res=>{
    this.isFormSubmit = false;
    this.formValue.reset();
    this.modalService.dismissAll();
    this.toast.success("Successfully added.");
    console.log(res);

  },
  err=>{
    this.toast.success("Something went wrong.");
    //  alert("Something went wrong");
  })
  
}    
   
 }


  statuschange() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      
      title: 'Are you sure',
      text: "Want to change status?",
      icon: 'warning',
      // text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
      
    }).then((result) => {
      if (result.value) {
        swalWithBootstrapButtons.fire(
          'Success!',
          'Your status change successfully.',
          'success'
        )
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your status change cancelled :)',
          'error'
        )
      }
    })
  }
    

 
}
