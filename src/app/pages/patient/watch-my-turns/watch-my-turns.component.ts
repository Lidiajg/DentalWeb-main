import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-watch-my-turns',
  templateUrl: './watch-my-turns.component.html',
  styleUrls: ['../take-turns/take-turns.component.scss'],
})
export class WatchMyTurnsComponent implements OnInit, OnDestroy {
  turnsMedic: Array<{
    medic: any;
    statusMedic: [{ uid: string; turns: any; message: string; status: string }];
  }> = [];
  user;
  isShowTurns = false;
  turns;
  medicSelected;
  suscription: Subscription;
  constructor(
    private firebaseSrv: FirebaseService,
    private sweetAlertSrv: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.suscription = this.firebaseSrv
      .getTurns()
      .pipe(
        map((turn) => turn.filter((turn) => turn.user.uid === this.user.uid))
      )
      .subscribe((turns) => {
        this.turnsMedic = [];
        turns.forEach((element) => {
          if (this.turnsMedic.length == 0) {
            this.turnsMedic.push({
              medic: element.medic,
              statusMedic: [
                {
                  uid: element.uid,
                  turns: element.turns,
                  message: element.message,
                  status: element.status,
                },
              ],
            });
            return;
          }
          let index = this.turnsMedic.findIndex(
            (medic) => medic.medic.uid === element.medic.uid
          );
          if (index == -1) {
            this.turnsMedic.push({
              medic: element.medic,
              statusMedic: [
                {
                  uid: element.uid,
                  turns: element.turns,
                  message: element.message,
                  status: element.status,
                },
              ],
            });
          } else {
            this.turnsMedic[index].statusMedic.push({
              uid: element.uid,
              turns: element.turns,
              message: element.message,
              status: element.status,
            });
          }
        });
        this.isShowTurns = false;
      });
  }
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  showTurns(turnMedic) {
    this.isShowTurns = true;
    this.medicSelected = turnMedic;
    console.log(this.medicSelected);
  }

  cancelTurn(uid) {
    this.firebaseSrv
      .cancelTurn(uid)
      .then(() => {
        this.isShowTurns = false;
        this.sweetAlertSrv.alert('success', 'El turno ha sido cancelado', 1500);
      })
      .catch(() => {
        this.sweetAlertSrv.alert('error', 'No se pudo cancelar el turno', 1500);
      });
  }
}
