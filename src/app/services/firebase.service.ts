import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private usersCollections: AngularFirestoreCollection<any>;
  private turnsCollections: AngularFirestoreCollection<any>;
  constructor(private afStore: AngularFirestore) {
    this.usersCollections = this.afStore.collection('users');
    this.turnsCollections = this.afStore.collection('turns');

  }

  getUsers() {
    return this.usersCollections.valueChanges()
  }

  getTurns(){
    return this.turnsCollections.valueChanges()
  }

  takeTurn(medic,turns?,user?){
    const uid=this.afStore.createId()
    return this.turnsCollections.doc(uid).set({
      uid: uid,
      medic,
      turns:[turns],  
      user,
      status:'pendiente',
      message:''
    });
  }

  editTurn(turnid,status,message?){
    return this.turnsCollections.doc(turnid).update({
      status,
      message
    });
  }

  cancelTurn(turnid,message?){
    return this.turnsCollections.doc(turnid).update({
      status:'cancelado',
      message: message?message:''
    });
  }
  finalizeTurn(turnid,message?){
    return this.turnsCollections.doc(turnid).update({
      status:'finalizado',
      message: message?message:''
    });
  }

}
