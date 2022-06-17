import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UsersService } from 'src/app/services/users/users.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  images:any;
  constructor(public usersService:UsersService, public storageService:StorageService) { }

  async ngOnInit() {
    await this.usersService.loadUsers();
    setTimeout(async ()=>{
      this.usersService.users.forEach(async user => {
        (await this.storageService.getImgUrl(user.images[0])).subscribe(data => {
          this.images = {...this.images, [user.email]:data}
        })
      })
    },2000)
  }

  async updateUser(email:string, state:string) {
    await this.usersService.updateUser(email, {state:state==="activo"?"inactivo":"activo"});
  }

  exportexcel(): void
  {
    /* pass here the table id */
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.usersService.users);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, 'lista-usuarios.xlsx');
 
  }


}
