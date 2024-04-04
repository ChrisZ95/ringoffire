import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  aCollection = collection(this.firestore, 'games')
  
  constructor(private router: Router){
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
  }

  newGame(){
    // Start game
    let game = new Game();
    addDoc(this.aCollection, game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo['id']);
    });
  }

}
