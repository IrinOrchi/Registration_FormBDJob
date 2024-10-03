
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Webcam: any; // Import webcam.js

@Component({
  selector: 'app-capture-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss']
})
export class CaptureImageComponent implements AfterViewInit {
  @Output() capturedImage = new EventEmitter<string>(); // Emit the captured image

  ngAfterViewInit() {
    Webcam.set({
      width: 160,
      height: 120,
      image_format: 'jpeg',
      jpeg_quality: 90
    });
    Webcam.attach('#camera'); // Attach webcam to the div with ID 'camera'
  }

  capture() {
    Webcam.snap((dataUri: string) => {
      this.capturedImage.emit(dataUri); // Emit the captured image back to parent
    });
  }
}
