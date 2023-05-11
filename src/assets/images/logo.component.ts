import {Component} from "@angular/core";

@Component({
  selector: "logo",
  styles: [`
    .text {
      fill: #FFF;
    }
    .logo {
      fill: #dcad54;
    }
  `],
  template: `<div class="logo">
    <svg class="r6y3U" width="200" height="49" viewBox="0 0 200 49"><rect class="logo" width="6.3" height="24.7" y="9.2" rx=".3"></rect><rect class="logo" width="6.3" height="15.6" x="10" y="9.2" rx=".3"></rect><rect class="logo" width="6.3" height="24.7" x="19.9" rx=".3"></rect><rect class="logo" width="6.3" height="15.6" x="29.9" y="9.2" rx=".3"></rect><path class="text" d="M157.7 38.4l-.8-.1c-.8-.2-1.6-.4-1.6-1.2 0-.7.8-1 1.7-1a6.5 6.5 0 0 1 2.8.6l.8-2a7.4 7.4 0 0 0-3.5-.8c-1.8 0-4 1-4 3.3 0 2.1 1.5 2.8 3 3l1 .2c.9.2 1.4.5 1.4 1.2 0 .8-.7 1.2-1.9 1.2a7.5 7.5 0 0 1-3.2-.7l-.9 2a8 8 0 0 0 4 .8c2.4 0 4.3-1.2 4.3-3.4 0-2-1.4-2.8-3-3M165 30.2l-2.2 1.3V34h-1.2v2.2h1.2v4.6c0 2 .8 3.8 3.7 3.8h.9v-2.2h-.4a1.8 1.8 0 0 1-2-1.9v-4.3h2.6V34H165zM182.6 36.1a2 2 0 0 1 2 1.4l2.1-.8a4 4 0 0 0-4-2.8c-3 0-4.3 1.9-4.3 3.6v3.8c0 1.8 1.2 3.6 4.2 3.6a4 4 0 0 0 4.1-2.8l-2-.7a2 2 0 0 1-2 1.3c-1.6 0-2-.8-2-1.8v-3c0-1 .4-1.8 2-1.8M192.3 38.9l4.2-4.8h-2.8l-3.6 4.2v-8.1h-2.3v14.5h2.3v-3.4l.7-.8 3.2 4.2h2.8l-4.5-5.8zM198.9 36a1 1 0 0 1-1.1-1 1.1 1.1 0 0 1 2.2 0 1 1 0 0 1-1.1 1m0-1.9a.8.8 0 1 0 .8.9.8.8 0 0 0-.8-.9m.2 1.4l-.2-.3h-.1v.3h-.3v-1h.4a.4.4 0 0 1 .4.3.4.4 0 0 1-.2.3l.2.4zm0-.7c0-.1 0-.2-.2-.2h-.1v.4h.1c.2 0 .2 0 .2-.2zM174 36.4h-2.4a.7.7 0 0 0-.7.7v2.5h-2.3v-2.5a3 3 0 0 1 3-3h2.3zM172 42.4h2.3a.7.7 0 0 0 .7-.7v-2.5h2.3v2.5a3 3 0 0 1-3 3H172zM133.8 34.1h2.6v2.2h-2.6v4.3a1.8 1.8 0 0 0 2 2h.3v2.1h-.9c-2.9 0-3.7-1.8-3.7-3.8v-4.6h-3.8v4.3a1.8 1.8 0 0 0 2 2h.4v2.1h-1c-2.8 0-3.6-1.8-3.6-3.8v-4.6h-1.2V34h1.2v-2.6l2.2-1.3v4h3.8v-2.7l2.3-1.3zM109.4 34a5.4 5.4 0 0 0-2 .3v-4H105v14.4h2.2v-8.3a3.4 3.4 0 0 1 1.8-.4 1.8 1.8 0 0 1 2 2v6.7h2.3v-7a3.7 3.7 0 0 0-4-3.8M120.9 42.6a3.2 3.2 0 0 1-1.6.4c-1.6 0-2.3-.9-2.3-2V34h-2.2V41c0 2.6 1.5 4 4.3 4a10.6 10.6 0 0 0 4-1v-9.9H121zM100.9 38.4l-.9-.1c-.8-.2-1.5-.4-1.5-1.2 0-.7.7-1 1.7-1a6.5 6.5 0 0 1 2.7.6l.8-2a7.4 7.4 0 0 0-3.5-.8c-1.8 0-4 1-4 3.3 0 2.1 1.5 2.8 3 3l1 .2c1 .2 1.5.5 1.5 1.2 0 .8-.8 1.2-2 1.2a7.5 7.5 0 0 1-3.2-.7l-.8 2a8 8 0 0 0 4 .8c2.3 0 4.2-1.2 4.2-3.4 0-2-1.3-2.8-3-3M145.7 37.5c0-1.9-1.5-3.6-4.2-3.6-3 0-4.1 1.9-4.1 3.6v3.6c0 2.4 1.5 3.8 4.1 3.8a4 4 0 0 0 3.9-2.1l-1.9-1.2a2.1 2.1 0 0 1-2 1.2c-1.3 0-1.9-.8-1.9-1.8v-.6h6zm-2.3 1.1h-3.8v-.8a2 2 0 0 1 3.8 0zM147.1 37.6v7.1h2.3v-7c0-.6.3-1.6 2-1.6a8.5 8.5 0 0 1 1 .1V34a5.7 5.7 0 0 0-1.1-.1c-3 0-4.2 1.8-4.2 3.7M79.9 36a3.6 3.6 0 0 0-1.4-1 4.9 4.9 0 0 0-3.1-.3 5.3 5.3 0 0 0-1 .4v-5l-2.3.3v14a13.6 13.6 0 0 0 1.7.3 13.2 13.2 0 0 0 2.2.2 5.7 5.7 0 0 0 2-.4 4.3 4.3 0 0 0 1.7-1 4.6 4.6 0 0 0 1-1.6 6.2 6.2 0 0 0 .3-2.2 7.1 7.1 0 0 0-.3-2A4.8 4.8 0 0 0 80 36zm-2 6a2.4 2.4 0 0 1-2 1 7.7 7.7 0 0 1-.9-.1 6.3 6.3 0 0 1-.6-.1V37a3.5 3.5 0 0 1 1.9-.6 2 2 0 0 1 1.8.9 4 4 0 0 1 .6 2.3A3.6 3.6 0 0 1 78 42zM88.3 34.8l-1 3.6-1 3.6q-.5-.8-.8-1.7t-.7-2l-.6-1.8-.5-1.7h-2.4a49.8 49.8 0 0 0 1.8 5.2l2 4.5a3.5 3.5 0 0 1-.8 1.3 2 2 0 0 1-1.4.4 3.7 3.7 0 0 1-1.4-.2l-.4 1.8a3.5 3.5 0 0 0 .8.2 5.2 5.2 0 0 0 2.5 0 3.2 3.2 0 0 0 1-.6 4.3 4.3 0 0 0 1-1A10.4 10.4 0 0 0 87 45a72 72 0 0 0 3.5-10.2z"></path><path class="text" d="M172.2 12.6a5.9 5.9 0 0 0-3-.7 6.3 6.3 0 0 0-3.2.7 4.8 4.8 0 0 0-2 2 7.7 7.7 0 0 0-.7 3.9c0 2.7.6 4.2 1.8 5.2a5.2 5.2 0 0 0 1.9 1 7 7 0 0 0 2 .3 16.4 16.4 0 0 0 4.8-.7.6.6 0 0 0 .4-.6 12.8 12.8 0 0 0 0-1.6.4.4 0 0 0-.5-.5 30 30 0 0 1-4.4.3c-1.5 0-2.3-.6-2.3-2.2h7.2a.5.5 0 0 0 .5-.5v-1.5a6.8 6.8 0 0 0-.6-3 4.7 4.7 0 0 0-1.9-2m-1 4.6H167a2.7 2.7 0 0 1 .5-2 2 2 0 0 1 1.6-.6 2 2 0 0 1 1.6.7 2.8 2.8 0 0 1 .5 1.8zM182.4 11.9a11.8 11.8 0 0 0-4.4.8.6.6 0 0 0-.4.6 14.8 14.8 0 0 0 0 1.8c0 .3.2.5.5.4a12.7 12.7 0 0 1 2.2-.4 10.3 10.3 0 0 1 2.7 0c1 .2 1.2.7 1.2 2h-2.8a5.4 5.4 0 0 0-3.4 1 3.3 3.3 0 0 0-1.2 2.8 3.6 3.6 0 0 0 1.6 3.2 7.6 7.6 0 0 0 4 1 15.7 15.7 0 0 0 4.6-.8 1 1 0 0 0 .8-1V17c0-4-2.4-5.2-5.4-5.2m1.7 10a5.6 5.6 0 0 1-1.6.3 3.1 3.1 0 0 1-1.7-.3 1.1 1.1 0 0 1-.4-1 1.2 1.2 0 0 1 .4-1 2.3 2.3 0 0 1 1.4-.3h2zM97.4 11.9a7.2 7.2 0 0 0-3.3 1 5.7 5.7 0 0 0-3.4-1 10.5 10.5 0 0 0-4.2 1 1.1 1.1 0 0 0-.8 1.1v10.2a.5.5 0 0 0 .5.5H89a.5.5 0 0 0 .5-.5v-8.8a3.3 3.3 0 0 1 1.3-.3c1.1 0 1.7.5 1.7 1.8v7.3a.5.5 0 0 0 .4.5h2.6a.5.5 0 0 0 .5-.5V17a6.8 6.8 0 0 0-.1-1.5 3.3 3.3 0 0 1 1.4-.4c1.2 0 1.7.5 1.7 1.8v7.3a.5.5 0 0 0 .5.5h2.6a.5.5 0 0 0 .5-.5v-7.5c0-3.1-1.7-4.8-5-4.8M138.1 11.9a7.2 7.2 0 0 0-3.3 1 5.7 5.7 0 0 0-3.4-1 10.5 10.5 0 0 0-4.2 1 1.1 1.1 0 0 0-.8 1.1v10.2a.5.5 0 0 0 .5.5h2.7a.5.5 0 0 0 .5-.5v-8.8a3.3 3.3 0 0 1 1.3-.3c1.1 0 1.7.5 1.7 1.8v7.3a.5.5 0 0 0 .4.5h2.6a.5.5 0 0 0 .5-.5V17a6.8 6.8 0 0 0-.1-1.5 3.3 3.3 0 0 1 1.4-.4c1.2 0 1.7.5 1.7 1.8v7.3a.5.5 0 0 0 .5.5h2.6a.5.5 0 0 0 .5-.5v-7.5c0-3.1-1.7-4.8-5-4.8M106.1 24.7h2.7a.5.5 0 0 0 .5-.5V12.8a.5.5 0 0 0-.5-.4H106a.5.5 0 0 0-.5.4v11.4a.5.5 0 0 0 .5.5M122.6 24a1 1 0 0 0 .7-1V12.8a.5.5 0 0 0-.5-.4h-2.6a.5.5 0 0 0-.5.4v8.8a6.6 6.6 0 0 1-1.7.3c-1.5 0-2-.7-2-2v-7a.5.5 0 0 0-.5-.5H113a.5.5 0 0 0-.5.4v7.3c0 3.6 2.1 5 5.6 5a13.1 13.1 0 0 0 4.6-1M82 24.3a.6.6 0 0 0 .4-.6 13.2 13.2 0 0 0 0-1.7.4.4 0 0 0-.5-.4 29.9 29.9 0 0 1-4.4.3c-1.5 0-2.3-.6-2.3-2.2h7.2a.5.5 0 0 0 .5-.6v-1.4a6.8 6.8 0 0 0-.6-3 4.8 4.8 0 0 0-1.9-2 6 6 0 0 0-3-.8 6.3 6.3 0 0 0-3.2.7 4.8 4.8 0 0 0-2 2 7.7 7.7 0 0 0-.7 3.9c0 2.7.6 4.1 1.8 5.2a5.2 5.2 0 0 0 1.9 1 7.1 7.1 0 0 0 2 .3 16.4 16.4 0 0 0 4.8-.7m-6.8-7a2.7 2.7 0 0 1 .5-2 2 2 0 0 1 1.6-.6 2 2 0 0 1 1.6.7 2.8 2.8 0 0 1 .5 1.8v.1h-4.2zM49.3 24.7h3a.5.5 0 0 0 .5-.5v-5h1.6a7 7 0 0 0 5.2-1.7 5.8 5.8 0 0 0 1.7-4.2A5.6 5.6 0 0 0 59.6 9a7 7 0 0 0-5.1-1.8 42.1 42.1 0 0 0-4.6.4c-.8.1-1 .4-1 1.1v15.4a.5.5 0 0 0 .4.5m3.5-14a8.2 8.2 0 0 1 1.5 0 3.2 3.2 0 0 1 2.3.6 2.5 2.5 0 0 1 .7 2 2.6 2.6 0 0 1-.7 2 3.2 3.2 0 0 1-2.3.7h-1.5zM66.1 24.7a.5.5 0 0 0 .5-.5v-8.6a4.2 4.2 0 0 1 1.6-.3 5.2 5.2 0 0 1 1.6.2c.4.1.6 0 .6-.4l.2-2.2a.5.5 0 0 0-.5-.6 8.7 8.7 0 0 0-2.3-.4 10.5 10.5 0 0 0-4.1 1 1 1 0 0 0-.7.9v10.4a.5.5 0 0 0 .4.5h2.7M196.1 15.2a.5.5 0 0 0 .5-.5 14.6 14.6 0 0 0 0-1.9.5.5 0 0 0-.5-.5h-1.8V9.8a.4.4 0 0 0-.5-.4l-2.7.5a.5.5 0 0 0-.5.6v10.4a4.2 4.2 0 0 0 .8 3 3.9 3.9 0 0 0 3 .9 10.5 10.5 0 0 0 1.7-.2c.3 0 .5-.2.5-.4a12.8 12.8 0 0 0 0-1.8.5.5 0 0 0-.5-.5h-1c-.3 0-.6 0-.7-.2a1.2 1.2 0 0 1-.1-.7v-5.8zM158.5 15.9a4.6 4.6 0 0 0 1.5-1.5 3.9 3.9 0 0 0 .7-2.2 4.3 4.3 0 0 0-1.5-3.3c-1-.9-2.6-1.5-5-1.5a43.5 43.5 0 0 0-4.6.4c-.8 0-1 .4-1 1.1v14.6c0 .7.2 1 1 1.1a45.6 45.6 0 0 0 4.7.4 8.2 8.2 0 0 0 5.3-1.5 4.4 4.4 0 0 0 1.7-3.7 4.3 4.3 0 0 0-.7-2.5 3.8 3.8 0 0 0-2.1-1.4m-6-5a13 13 0 0 1 1.9-.1 2.4 2.4 0 0 1 1.8.6 1.8 1.8 0 0 1 .5 1.3 1.9 1.9 0 0 1-.5 1.3 1.7 1.7 0 0 1-.8.5 5.8 5.8 0 0 1-1.4 0h-1.5zm4 10.3a3.1 3.1 0 0 1-2 .6 11.1 11.1 0 0 1-2 0v-4.2h2.6a2.1 2.1 0 0 1 1.5.6 2 2 0 0 1 .5 1.3 2.1 2.1 0 0 1-.6 1.7M109.3 10.3a.5.5 0 0 1-.5.5H106a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2.7a.5.5 0 0 1 .5.4z"></path></svg>
  </div>`,
})
export class LogoComponent {
  constructor() {
  }
}