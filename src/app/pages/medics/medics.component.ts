import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-medics',
  templateUrl: './medics.component.html',
  styleUrls: ['./medics.component.scss']
})
export class MedicsComponent implements OnInit {

  medics;
  constructor(private firebaseSrv:FirebaseService) {}

  ngOnInit(): void {
    this.firebaseSrv.getUsers().subscribe((users) => {
      this.medics = users.filter((user) => user.type === 'Dentista');
    });
  }

}
