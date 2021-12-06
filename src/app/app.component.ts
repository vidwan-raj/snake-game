import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { snakePart } from 'snakePart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('gamecanvas', { static: true })
  gamecanvas !: ElementRef<HTMLCanvasElement>;

  title = 'snake-app';
  score = 0;

  dx = 10;
  dy = 0;

  food_x = 0;
  food_y = 0;

  change_direction = false;
  ctx !: CanvasRenderingContext2D;
  snake: snakePart[] = [{ x: 300, y: 400 }, { x: 290, y: 400 }, { x: 280, y: 400 },]


  ngAfterViewInit(): void {
    const context = this.gamecanvas.nativeElement.getContext("2d");
    if (context != null) {
      this.ctx = context;
    }
    this.startGame();
    this.gen_food();
  }



  startGame() {
    if (this.hasGameEnded()) return;
    this.change_direction = false;

    setTimeout(() => {
      this.resetCanvas();
      this.drawFood();
      this.moveSnake();
      this.drawSnake();
      this.startGame();
    }, 100);

  }

  resetCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 600, 600);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, 600, 600);
  }

  drawSnakeParts(part: snakePart) {
    this.ctx.fillStyle = 'lightblue';
    this.ctx.strokeStyle = 'black';
    this.ctx.fillRect(part.x, part.y, 10, 10);
    this.ctx.strokeRect(part.x, part.y, 10, 10);

  }

  drawSnake() {
    this.snake.forEach((x: snakePart) => this.drawSnakeParts(x));
  }

  random_food(min: any, max: any) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  }

  gen_food() {
    this.food_x = this.random_food(0, 590);
    this.food_y = this.random_food(0, 590);

    this.snake.forEach(part => {
      if (part.x === this.food_x && part.y === this.food_y) {
        this.gen_food();
      }
    })
  }

  drawFood(){
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'black';
    this.ctx.fillRect(this.food_x,this.food_y, 10,10);
    this.ctx.strokeRect(this.food_x, this.food_y, 10,10);
  }

  moveSnake() {
    const newX = this.snake[0].x + this.dx;
    const newY = this.snake[0].y + this.dy;
    const head = { x: newX, y: newY };
    this.snake.unshift(head);

     if(this.snake[0].x == this.food_x && this.snake[0].y == this.food_y){
        this.score +=10;
        this.gen_food();

     }else{
      this.snake.pop();
     }
    
  }

  hasGameEnded(): boolean {
    for (let i = 3; i < this.snake.length; i++) {
      if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true;
    }

    const hitLeftWall = this.snake[0].x < 0;
    const hitRightWall = this.snake[0].x > 590;
    const hitTopWall = this.snake[0].y < 0;
    const hitBottomWall = this.snake[0].y > 590;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;

  }

  @HostListener('window:keydown', ['$event'])
  changeDirection(event: any) {

    const left_key = 37;
    const right_key = 39;
    const up_key = 38;
    const down_key = 40;

    if (this.change_direction) return;

    this.change_direction = true;

    const key_code = event.keyCode;
    const goingUp = this.dy === -10;
    const goingDown = this.dy === 10;
    const goingRight = this.dx === 10;
    const goingLeft = this.dx === -10;

    if (key_code === left_key && !goingRight) {
      this.dx = -10;
      this.dy = 0;
    }
    if (key_code === right_key && !goingLeft) {
      this.dx = 10;
      this.dy = 0;
    }
    if (key_code === up_key && !goingDown) {
      this.dy = -10;
      this.dx = 0;
    }
    if (key_code === down_key && !goingUp) {
      this.dy = 10;
      this.dx = 0;
    }
  }


}
