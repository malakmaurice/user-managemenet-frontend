import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './user.service';
interface status {
  value: string;
  viewValue: string;
}
interface group {
  value: string;
  viewValue: string;
}
enum Group{
  Office,Managers,Head
}
enum Status {
  Locked,Inactive,Active}

export interface user {
  name: string,
  userName: string,
  email: string,
  userGroup: string,
  userStatus: string,
  created: any
}

export interface searchCriateria{
 searchField:string;
  userGroup:string;
  start :string;
  end:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-material';
  closeResult = '';
  panelOpenState = false;
  submittedSaveorm = false;
  
  user:user= {name:'',userName:'',email:'',userGroup:"",created:"",userStatus:"Inactive"};
  searchCriateria:searchCriateria={searchField:"",userGroup:"",start:"",end:""}
  
  userStatus: status[] = [
    { value: 'Any', viewValue: 'Any' },
    { value: 'Inactive', viewValue: 'Inactive' },
    { value: 'Active', viewValue: 'Active' },
    { value: 'Locked', viewValue: 'Locked' },
    { value: 'Blocked', viewValue: 'Blocked' },
  ];
  userGroups: group[] = [
    { value: 'Office', viewValue: 'Office' },
    { value: 'Managers', viewValue: 'Managers' },
    { value: 'Head', viewValue: 'Head Office' },
  ];

  selected = this.userStatus[0].value;
  form: FormGroup = new FormGroup({});
  saveForm: FormGroup = new FormGroup({});
  users:user[]|undefined;
  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private userService: UserService) {

    this.form = fb.group({
      selectedStatus: [this.selected, [Validators.required]],
      search: '',
      start: '',
      end: '',
    })
    this.saveForm = fb.group({
      name: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      group: new FormControl('', Validators.required),
    });

    this.userService.getUsers().subscribe((data)=>{
      this.users=data;
      console.log(this.users);
    });
    
  }
  
  get email() { return this.saveForm.get('email'); }
  get name() { return this.saveForm.get('name'); }
  get userName() { return this.saveForm.get('userName'); }
  get group() { return this.saveForm.get('group'); }

  get search() { return this.form.get('search'); }
  get start() { return this.form.get('start'); }
  get end() { return this.form.get('end'); }
  get status() { return this.form.get('selectedStatus'); }

  submit() {
    this.searchCriateria.searchField=this.search?.value;
    this.searchCriateria.start=this.start?.value;
    this.searchCriateria.end=this.end?.value;
    this.searchCriateria.userGroup=this.status?.value;
    
    console.log(this.searchCriateria);
    this.userService.getUsersByFillter(this.searchCriateria).subscribe((data)=>{
      this.users=data;
    },()=>{
      console.log("filter faild");
    })
  }

  saveUser() {
    this.submittedSaveorm = true;
    if (this.saveForm.valid) {
      
    
      this.user.name=this.name?.value;
      this.user.email=this.email?.value;
      this.user.userName=this.userName?.value;
      this.user.userGroup=this.group?.value;
      
      this.userService.saveUser(this.user).subscribe((data)=>{
        this.users=data;
       
      },()=>{
        console.log("faild");
      });
    }
  }
  open(content: any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', windowClass: 'my-class' }).result.then((result:any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason:any) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

