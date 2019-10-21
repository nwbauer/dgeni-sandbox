/**
 * Main description.
 * @description The main component module
 * @hidePrivateMembers false
 */


import { Component } from '@angular/core';


/**
 * @description My function
 */
export function helloWorld() {
  return 'hello!';
}

/**
 * Main Component Class
 * @description The main component class
 * @param my thing
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly title: string = 'dgeni-app';

  constructor(private thing) {
    console.log('hello!');
  }

  /**
   * @description This is the getTitleFunction
   * @param special thing
   */
  public getTitle(special: boolean) {
    return this.title;
  }
}
