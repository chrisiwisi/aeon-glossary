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
  ctx!: CanvasRenderingContext2D;

  constructor(
    public dialogRef: ModularOverlayRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public message: any) {
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
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
        this.ctx.moveTo(event.touches[0].clientX, event.touches[0].clientY);
      }),
      switchMap(() => touchMoveStream.pipe(
        tap((event: TouchEvent) => {
          this.ctx.lineTo(event.touches[0].clientX, event.touches[0].clientY);
          this.ctx.stroke();
        }),
        takeUntil(touchEndStream),
        finalize(() => {
          this.ctx.closePath();
        })
      ))
    ).subscribe();
  }

  close() {
    this.dialogRef.close();
  }

}
