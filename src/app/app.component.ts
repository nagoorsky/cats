import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout/layout.component';
@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  template: '<app-layout />',
})
export class AppComponent {
  title = 'cats';
}
