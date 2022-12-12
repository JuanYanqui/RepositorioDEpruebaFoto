import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[imageLoader]',
})
export class NoImageDirective {
  @Input() urlcustom!: string;
  constructor(private elementref: ElementRef) {}
  @HostListener('error')
  loadDefaultImage() {
    const element = this.elementref.nativeElement;
    element.src =
      this.urlcustom ||
      'https://64.media.tumblr.com/656cc93ba92e5bdb2c394de17b41e78c/tumblr_n5f1798Td41s2t3cto1_500.gifv';
  }
}
// export class ImageLoader {
//   @Input() imageLoader;

//   constructor(private el: ElementRef) {
//     this.el = el.nativeElement;
//     this.el.style.backgroundImage =
//       'url(http://smallenvelop.com/demo/image-loading/spinner.gif)';
//   }

//   ngOnInit() {
//     let image = new Image();
//     image.addEventListener('load', () => {
//       this.el.style.backgroundImage = `url(${this.imageLoader})`;
//     });
//     image.src = this.imageLoader;
//   }
// }
