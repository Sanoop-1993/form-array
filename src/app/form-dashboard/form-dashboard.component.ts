import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormArray } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Employee } from '../employee';
import { Details } from '../details';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-form-dashboard',
  templateUrl: './form-dashboard.component.html',
  styleUrls: ['./form-dashboard.component.scss']
})
export class FormDashboardComponent implements OnInit {

  public formValue:FormGroup;
  employee = new Employee();
  details = new Details();


  constructor(private dataservice:DataService, private formbuilder:FormBuilder) {
    this.formValue = this.formbuilder.group({
      firstname : ['',[Validators.required]],
      lastname : ['',[Validators.required]],
      email : ['',[Validators.required]],
      detailsArr: this.formbuilder.array([]) ,
    });
    console.log(this.formValue);
   }

  ngOnInit(): void {
    

   
  }

  addEmployeeDetails()
  {
    this.employee.firstname = this.formValue.value.firstname;
    this.employee.lastname = this.formValue.value.lastname;
    this.employee.email = this.formValue.value.email;
    this.details.type = this.formValue.value.type;
    this.details.value = this.formValue.value.value;

    console.log(this.formValue.value);

    this.dataservice.addForm(this.formValue.value).subscribe(res=>{

      console.log(res);
      alert("Employee added Successfully");

    },
    err=>{
       alert("Something went wrong");
    })

  }

  detailsArr() : FormArray {
    return this.formValue.get("detailsArr") as FormArray
  }
   
  newdetailsArr(): FormGroup {
    return this.formbuilder.group({
      type: '',
      value: '',
    })
  }
   
  addDetails() {
    this.detailsArr().push(this.newdetailsArr());
  }
   
  removeDetails(i:number) {
    this.detailsArr().removeAt(i);
  }
   
  onSubmit() {
    console.log(this.formValue.value);
  }


  

}
