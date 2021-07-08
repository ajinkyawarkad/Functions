import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Employee } from '../../models/users';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  employee = {} as Employee;


  constructor(public navCtrl: NavController, ) {

  }

  // sendData(employee:Employee){
  //   var headers = new HttpHeaders();
  //   //headers.append("Accept", 'application/json');
  //   //headers.append('Content-Type', 'application/json' );
  //   //const requestOptions = new RequestOptions({ headers: headers });
  //   let postData = {
  //     "dest": employee.email
      
      
      
  //   }
  //   console.log(employee.email )

  //   this.http.post("https://us-central1-adminnew-d710c.cloudfunctions.net/sendMail?", postData, { headers: headers })
  //     .subscribe(data => {
  //       console.log(data['_body']);
  //      }, error => {
  //       console.log(error);
  //     });





  // }

}
