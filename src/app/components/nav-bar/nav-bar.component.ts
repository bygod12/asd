import {Component, inject, Input} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {fabric} from "fabric";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input() canvass!:boolean;
  dash:boolean = true;
  profile:boolean = false;
  table:boolean = false;
  private breakpointObserver = inject(BreakpointObserver);
  title:string = 'dashboard';
  @Input() canvasselect!: Canvas;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  changePage(page:string){
    this.title = page;
    switch (page) {
      case 'dashboard' :
        this.canvass = false;
        this.dash = true;
        this.profile = false;
        this.table = false;
        break;
      case 'profile' :
        this.canvass = false;
        this.dash = false;
        this.profile = true;
        this.table = false;
        break;
      case 'table' :
        this.canvass = false;
        this.dash = false;
        this.profile = false;
        this.table = true;
        break;
      case 'canva' :
        this.canvass = true;
        this.dash = false;
        this.profile = false;
        this.table = false;
        break;
    }
  }
  canvaemit(value:any){
    this.canvasselect=value.canvasselect;
    this.canvass = value.iscanvas;
  }

}
interface Canvas {

  id?:string;
  name?: string;
  description?:string;
  width?:number;
  height?:number;
  background?:string;
  image?:string;
  components?: Components[];
  images?: string[];
  backgrounds?: string[];
  imgurlsave?: string;

}

interface Components {
  id?: string;
  name?: string;
  description?: string;
  left?: number;
  top?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fill?: string | fabric.Pattern | fabric.Gradient;
  image_url?: string;
  stroke?: string;
  strokeWidth?: number;
  scaleY?: number;
  scaleX?: number;
  imageUrl?: string;
  fontFamily?: string;
  fontSize?: number;
  text?: string;
  width?: number;
  height?: number;
  group?: Components[]; // Adicione a propriedade objects para armazenar os elementos do grupo
}


interface CustomControl extends fabric.Control {
  cornerSize?: number;
}

