import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
@Component({
  selector: 'app-show-turns',
  templateUrl: './show-turns.component.html',
  styleUrls: ['./show-turns.component.scss'],
})
export class ShowTurnsComponent implements OnInit {
  turnsPatient: Array<{
    uid: string;
    user: any;
    statusMedic: [{ turns: any; message: string; status: string }];
  }> = [];
  medic;
  isShowTurns = false;
  turns;
  userSelected;
  suscription: Subscription;
  selectedMedic: any;
  medicSelected: any;
  formSubmitted = false;
  myModal2;
  myModal;
  public reportTurn = this.fb.group({
    message: ['', [Validators.required]],
  });
  constructor(
    private firebaseSrv: FirebaseService,
    private sweetAlertSrv: SweetAlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.medic = JSON.parse(localStorage.getItem('user'));
    this.suscription = this.firebaseSrv
      .getTurns()
      .pipe(
        map((turn) => turn.filter((turn) => turn.medic.uid === this.medic.uid))
      )
      .subscribe((turns) => {
        this.turnsPatient = [];
        turns.forEach((element) => {
          if (this.turnsPatient.length == 0) {
            this.turnsPatient.push({
              uid: element.uid,
              user: element.user,
              statusMedic: [
                {
                  turns: element.turns,
                  message: element.message,
                  status: element.status,
                },
              ],
            });
            return;
          }
          let index = this.turnsPatient.findIndex(
            (medic) => medic.user.uid === element.user.uid
          );
          if (index == -1) {
            this.turnsPatient.push({
              uid: element.uid,
              user: element.user,
              statusMedic: [
                {
                  turns: element.turns,
                  message: element.message,
                  status: element.status,
                },
              ],
            });
          } else {
            this.turnsPatient[index].statusMedic.push({
              turns: element.turns,
              message: element.message,
              status: element.status,
            });
          }
        });
        this.isShowTurns=false
      });
  }
  formNotValid(camp: string): boolean {
    return this.reportTurn.get(camp).invalid && this.formSubmitted;
  }
  showTurns(turnUser) {
    this.isShowTurns = true;
    this.userSelected = turnUser;
  }
  cancelTurn(uid) {
    this.formSubmitted = true;
    if (this.reportTurn.valid) {
      this.firebaseSrv
        .cancelTurn(uid, this.reportTurn.value.message)
        .then(() => {
          this.isShowTurns = false;
          this.reportTurn.reset();
          document.getElementById('closeModalButton').click();
          this.sweetAlertSrv.alert(
            'success',
            'El turno ha sido cancelado',
            1500
          );
        })
        .catch(() => {
          this.reportTurn.reset();
          document.getElementById('closeModalButton').click();
          this.sweetAlertSrv.alert(
            'error',
            'No se pudo cancelar el turno',
            1500
          );
        });
    }
  }
  finalizeTurn(uid) {
    this.formSubmitted = true;
    if (this.reportTurn.valid) {
      this.firebaseSrv
        .finalizeTurn(uid, this.reportTurn.value.message)
        .then(() => {
          this.isShowTurns = false;
          this.reportTurn.reset();
          document.getElementById('closeModalButton2').click();
          this.sweetAlertSrv.alert(
            'success',
            'El turno ha sido finalizado',
            1500
          );
        })
        .catch(() => {
          this.reportTurn.reset();
          document.getElementById('closeModalButton2').click();
          this.sweetAlertSrv.alert(
            'error',
            'No se pudo finalizar el turno',
            1500
          );
        });
    }
  }
}
