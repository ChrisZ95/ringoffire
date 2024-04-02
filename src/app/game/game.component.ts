import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  constructor(){}

  ngOnInit(): void {
      this.newGame();
  }

  newGame(){
    this.game = new Game();
    console.log(this.game);
  }

  takeCard(){
    const poppedCard = this.game.stack.pop();
    if (!this.pickCardAnimation && poppedCard !== undefined) {
      this.currentCard = poppedCard;
      this.pickCardAnimation = true;
      console.log('New Card: ', this.currentCard);
      console.log('Game is: ', this.game)
      setTimeout(()=>{
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000)
    } else {
      console.error("Keine weiteren Karten im Stapel!");
    }
  }
}
