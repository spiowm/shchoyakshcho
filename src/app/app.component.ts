import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Test1Component} from "./components/test1/test1.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Test1Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shchoyakshcho';
}
