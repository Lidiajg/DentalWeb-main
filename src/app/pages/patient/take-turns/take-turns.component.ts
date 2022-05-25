import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-take-turns',
  templateUrl: './take-turns.component.html',
  styleUrls: ['./take-turns.component.scss'],
})
export class TakeTurnsComponent implements OnInit {
  medics;
  listaTurnos: string[];
  isShowTurns = false;
  selectedMedic: any;
  selectedTurns: string[] = [];
  user;
  allTurns;
  isloading = false;
  constructor(
    private fireSrv: FirebaseService,
    private sweetAlertSrv: SweetAlertService
  ) {
    this.listarTurnos();
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fireSrv.getUsers().subscribe((users) => {
      this.medics = users.filter((user) => user.type === 'Dentista');
    });
    this.fireSrv
      .getTurns()
      .pipe(
        map((turns: Array<any>) => {
          return turns.filter((turn) => turn.user.uid === this.user.uid);
        })
      )
      .subscribe((turns) => {
        turns.forEach((element) => {
          this.listaTurnos.splice(this.listaTurnos.indexOf(element.turns[0]), 1);
        });
      });
  }

  showTimes(medic) {
    if (!this.isShowTurns) {
      this.selectedMedic = medic;
      this.isShowTurns = true;
    }
  }

  saveTurn(item) {
    this.isloading = true;
    this.selectedTurns.push(item);
    this.fireSrv
      .takeTurn(
        this.selectedMedic,
        this.selectedTurns[this.selectedTurns.length - 1],
        this.user
      )
      .then(() => {
        this.sweetAlertSrv.alert('success', 'Turno tomado', 1500);
        this.isloading = false;
      })
      .catch(() => {
        this.sweetAlertSrv.alert('error', 'Error al tomar turno', 1500);
        this.isloading = false;
      });
  }

  listarTurnos() {
    let hoy = new Date();
    let dia = new Date();
    let maniana = new Date();
    this.listaTurnos = [];
    let diasActivo = [1, 2, 3, 4, 5, 6];
    let duracionTurno = 30;
    let ultimoTurno;
    for (let contador = 1; contador <= 5; contador++) {
      if (diasActivo.indexOf(dia.getDay()) !== -1) {
        ultimoTurno = dia;
        ultimoTurno.setHours(19, 0);
        if (dia.getDay() == 6) {
          ultimoTurno.setHours(14, 0);
        }
        ultimoTurno = new Date(ultimoTurno.getTime() - duracionTurno * 60000);
        dia.setHours(8, 0);
        do {
          this.listaTurnos.push(
            dia
              .toLocaleString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              .toString()
          );
          dia = new Date(dia.getTime() + duracionTurno * 60000);
        } while (dia <= ultimoTurno);
      }
      maniana.setDate(hoy.getDate() + contador);
      dia = maniana;
    }
  }
  
}
