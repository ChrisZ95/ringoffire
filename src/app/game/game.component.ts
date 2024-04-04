import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, MatDialogModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  aCollection = collection(this.firestore, 'games')

  constructor(private route: ActivatedRoute, public dialog: MatDialog){
    const aCollection = collection(this.firestore, 'games')
    this.items$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);

      const docRef = doc(this.aCollection, params['id']);
      getDoc(docRef).then((snapshot) => {
        console.log('Game update', snapshot.data());
        const gameData = snapshot.data();
        if (gameData) {
          this.game.currentPlayer = gameData['currentPlayer']; 
          this.game.playedCards = gameData['playedCards'];
          this.game.players = gameData['players'];
          this.game.stack = gameData['stack'];
          this.game.pickCardAnimation = gameData['pickCardAnimation'];
          this.game.currentCard = gameData['currentCard'];
        } else {
          console.error("No data found for game.");
        }
      }).catch(error => {
        console.error("Error getting document:", error);
      });
    })
  }

  newGame(){
    this.game = new Game();
  }

  takeCard(){
    const poppedCard = this.game.stack.pop();
    if (!this.game.pickCardAnimation && poppedCard !== undefined) {
      this.game.currentCard = poppedCard;
      this.game.pickCardAnimation = true;
      console.log('New Card: ', this.game.currentCard);
      console.log('Game is: ', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(()=>{
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000)
    } else {
      console.error("Keine weiteren Karten im Stapel!");
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gameId = this.route.snapshot.params['id'];
    const gameDocRef = doc(this.aCollection, gameId);
    const gameData = this.game.toJson();

    updateDoc(gameDocRef, gameData)
      .then(() => {
        console.log("Spiel erfolgreich gespeichert!");
      })
      .catch((error) => {
        console.error("Fehler beim Speichern des Spiels:", error);
      });
  }
}