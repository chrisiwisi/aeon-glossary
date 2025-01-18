import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {ModularOverlayRef} from "./modular-overlay-ref";
import {FILE_PREVIEW_DIALOG_DATA} from "./modular-overlay.tokens";
import {finalize, fromEvent, switchMap, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-modular-overlay',
  imports: [],
  templateUrl: './modular-overlay.component.html',
  standalone: true,
  styleUrl: './modular-overlay.component.css'
})
export class ModularOverlayComponent {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  canvasPosition: { x: number, y: number } = {x: 0, y: 0};

  constructor(
    public dialogRef: ModularOverlayRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public message: any) {
  }

  ngAfterViewInit() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
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
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.lineJoin = 'round';
        ctx.moveTo(event.offsetX, event.offsetY);
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: MouseEvent) => {
          ctx.lineTo(event.offsetX, event.offsetY);
          ctx.stroke();
        }),
        takeUntil(mouseUpStream),
        finalize(() => {
          ctx.closePath();
        })
      ))
    ).subscribe();

    //TouchEvents draw on canvas
    touchStartStream.pipe(
      tap((event: TouchEvent) => {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.lineJoin = 'round';
        //this fixes a bug where the boundingClientRect is wrong/not fully initialized yet in the ngAfterViewInit lifecycle
        this.canvasPosition = this.canvas.nativeElement.getBoundingClientRect();
        ctx.moveTo(event.touches[0].clientX - this.canvasPosition.x, event.touches[0].clientY - this.canvasPosition.y);
        console.log(`clientX: ${event.touches[0].clientX}, clientY: ${event.touches[0].clientY}, canvasRectangle: ${JSON.stringify(this.canvasPosition)}`);
      }),
      switchMap(() => touchMoveStream.pipe(
        tap((event: TouchEvent) => {
          event.preventDefault();
          ctx.lineTo(event.touches[0].clientX - this.canvasPosition.x, event.touches[0].clientY - this.canvasPosition.y);
          ctx.stroke();
        }),
        takeUntil(touchEndStream),
        finalize(() => {
          ctx.closePath();
        })
      ))
    ).subscribe();
  }

  close() {
    this.dialogRef.close();
  }

}
