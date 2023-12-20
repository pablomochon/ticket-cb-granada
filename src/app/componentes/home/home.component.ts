import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { Usuario } from '../../modelo/empleados';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import Swal from 'sweetalert2';
import { Partido } from '../../modelo/partidos';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
[x: string]: any;


  constructor(private snackBar: MatSnackBar,public service: ServiceService, private router: Router,public dialog: MatDialog) {
    this.createLoginForm();
  }
  // nombre: string;
  // email: string;
  todayDate: Date = new Date();
  selected: Date | null | undefined;
  hiddenList = false;
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  loginForm: FormGroup;
  bodyResponse: Usuario;
  currentUser: Usuario;
  partidos!: Partido[];
  partidosFran!: Partido[];
  variable = "holaaaa";

  @ViewChild('TABLE')table!: ElementRef;

  ngOnInit(){
    this.getUsers();
    this.getPartidos();

  }
  getUsers(){
    this.service.getUsers().subscribe(data =>{
      this.usuarios = data
      console.log('data', this.usuarios);
    });
  }
  createLoginForm(){
    this.loginForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("",Validators.required),
      apellido: new FormControl("",Validators.required)

    });
  }
  onSubmit(){
    if(this.loginForm.valid){
      const nombre = this.loginForm.get("nombre")?.value;
      const email = this.loginForm.get("email")?.value;
      const apellido = this.loginForm.get("apellido")?.value;

      //const contraseña = this.loginForm.get("contraseña")?.value;
      console.log("nombre", nombre,"email",email);

      this.bodyResponse = {

        nombre:nombre,
        email:email,
        apellido: apellido,
        isAdmin: false

      }
      this.service.insertLogin(this.bodyResponse).subscribe(data => {
        console.log("insert", data);
      });



    }
  }

  deleteUser(user: Usuario): void {

    this.service.deleteUser(user).subscribe(async data => {
      const dataUser = await Swal.fire({
        title: '¿Seguro que desea eliminar este usuario?',
        showDenyButton: true,
        denyButtonText: `Cancelar`,
        confirmButtonText: 'Eliminar',
      });
      if (dataUser.isConfirmed) {
        Swal.fire("Usuario Eliminado", "", "success");      }
      else if (dataUser.isDismissed) {
        //Swal.fire("Changes are not saved", "", "info");
      }
      this.getUsers();
    });
  }


  openSnackBar() {
    this.snackBar.open('Correo enviado satisfactoriamente', 'Cerrar', {
      duration: 3000
    });
  }

  onDateInput(event: any) {
    const selectedDate = new Date(event.target.value);
    this.todayDate = selectedDate;
  }

  displayedColumns: string[] = ['no','nombre','apellido','email','botones'];

  userList(){
    this.hiddenList = true;
    this.exportCsv = true;
  }
  hiddenUserList(){
    this.hiddenList = false;
    this.exportCsv = false;

  }
  ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
}
openDialog(usuario:Usuario) {
  this.dialog.open(UpdateUserComponent,{
    data: usuario ,
    width:'450px',
    height:'600px'

  });

  }
  getPartidos(){
    this.service.getPartidos().subscribe(data =>{
      this.partidosFran = data;
      console.log('Partidos',this.partidosFran);
    })
  }


}


