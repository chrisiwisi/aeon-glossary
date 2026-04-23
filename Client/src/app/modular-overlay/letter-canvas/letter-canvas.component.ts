import {AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {ModularOverlayRef} from "../modular-overlay-ref";
import {finalize, fromEvent, Subscription, switchMap, takeUntil, tap} from "rxjs";
import {Letter} from "../../code-note/letter/Letter";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {LETTER_INPUT_DATA} from "../modular-overlay.tokens";

@Component({
  selector: 'app-letter-canvas',
  imports: [
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './letter-canvas.component.html',
  standalone: true,
  styleUrl: './letter-canvas.component.css'
})
export class LetterCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  canvasPosition: { x: number, y: number } = {x: 0, y: 0};
  ctx!: CanvasRenderingContext2D;

  private dialogRef: ModularOverlayRef = inject(ModularOverlayRef);
  private letter: Letter = inject(LETTER_INPUT_DATA).letter;
  private subscription: Subscription;
  private saveLetter: boolean = true;
  private history: ImageData[] = [];
  private readonly MAX_HISTORY = 30;

  constructor() {
    this.subscription = this.dialogRef.onClose.subscribe(() => {
      if (this.saveLetter) {
        this.saveImageToLetter()
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvasPosition = this.canvas.nativeElement.getBoundingClientRect();

    const mouseDownStream = fromEvent<MouseEvent>(this.canvas.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent<MouseEvent>(this.canvas.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent<MouseEvent>(window, 'mouseup');

    const touchStartStream = fromEvent<TouchEvent>(this.canvas.nativeElement, 'touchstart');
    const touchMoveStream = fromEvent<TouchEvent>(this.canvas.nativeElement, 'touchmove');
    const touchEndStream = fromEvent<TouchEvent>(this.canvas.nativeElement, 'touchend');

    //MouseEvents draw on canvas
    mouseDownStream.pipe(
      tap((event: MouseEvent) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 15;
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(event.offsetX, event.offsetY);
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: MouseEvent) => {
          this.ctx.lineTo(event.offsetX, event.offsetY);
          this.ctx.stroke();
        }),
        takeUntil(mouseUpStream),
        finalize(() => {
          this.ctx.closePath();
          this.saveSnapshot();
        })
      ))
    ).subscribe();

    //TouchEvents draw on canvas
    touchStartStream.pipe(
      tap((event: TouchEvent) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 15;
        this.ctx.lineJoin = 'round';
        //this fixes a bug where the boundingClientRect is wrong/not fully initialized yet in the ngAfterViewInit lifecycle
        this.canvasPosition = this.canvas.nativeElement.getBoundingClientRect();
        this.ctx.moveTo(event.touches[0].clientX - this.canvasPosition.x, event.touches[0].clientY - this.canvasPosition.y);
        //console.log(`clientX: ${event.touches[0].clientX}, clientY: ${event.touches[0].clientY}, canvasRectangle: ${JSON.stringify(this.canvasPosition)}`);
      }),
      switchMap(() => touchMoveStream.pipe(
        tap((event: TouchEvent) => {
          event.preventDefault();
          this.ctx.lineTo(event.touches[0].clientX - this.canvasPosition.x, event.touches[0].clientY - this.canvasPosition.y);
          this.ctx.stroke();
        }),
        takeUntil(touchEndStream),
        finalize(() => {
          this.ctx.closePath();
          this.saveSnapshot();
        })
      ))
    ).subscribe();

    //load previous image
    if (this.letter.imageURL) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
        this.saveSnapshot();
      };
      img.src = this.letter.imageURL;
    }

    this.saveSnapshot();
  }

  private saveSnapshot(): void {
    const canvas = this.canvas.nativeElement;

    const snapshot = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.history.push(snapshot);

    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    }
  }

  private restoreSnapshot(snapshot: ImageData): void {
    this.ctx.putImageData(snapshot, 0, 0);
  }

  undoCanvas(): void {
    if (this.history.length <= 1) return;

    this.history.pop();

    const previous = this.history[this.history.length - 1];
    this.restoreSnapshot(previous);
  }

  resetCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.history = [];
    this.saveSnapshot();
  }

  saveImageToLetter() {
    this.letter.imageURL = this.canvas.nativeElement.toDataURL("image/png",0.90);
  }

  deleteCanvas() {
    this.letter.imageURL = undefined;
    this.saveLetter = false;
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
