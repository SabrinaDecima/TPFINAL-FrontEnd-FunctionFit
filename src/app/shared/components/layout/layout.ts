import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, Footer, RouterOutlet],
  templateUrl: './layout.html',
  styles: ``
})
export default class LayoutComponent {
  layoutName = 'Angular 20'
}
