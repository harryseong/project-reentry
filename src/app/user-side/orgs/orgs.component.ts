import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orgs',
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.scss']
})
export class OrgsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 10);
  }
}
