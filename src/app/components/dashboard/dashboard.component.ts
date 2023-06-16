import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {fabric} from "fabric";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  canvas1: Canvas[] = [];
  matriz: boolean = false;
  @Input() canvass!: boolean;
  @Input() dash!: boolean;
  @Input() profile!: boolean;
  @Input() table!: boolean;
  @Input() title!: string;
  @Input() canvasselect!: Canvas;
  @Output() outputEmitido = new EventEmitter<any>();

  matriz2: boolean = false;
// Criar um novo canvas
  newCanvas: Canvas = {
    name: 'Meu Canvas',
    description: 'Descrição do meu canvas',
    width: 800,
    height: 600,
    background: '#FFFFFF',
  };

  constructor(
    public router: Router,
    private firestore: AngularFirestore
  ) {
  }

  ngOnInit(): void {
    this.getAllCanvas();


  }

  createCanvas(canvas: Canvas) {
    this.firestore
      .collection('canvas')
      .add(canvas)
      .then((docRef) => {
        console.log('Canvas created successfully! Document ID:', docRef.id);

      })
      .catch((error) => {
        console.error('Error creating canvas:', error);
      });
    this.getAllCanvas();

  }


  getAllCanvas() {
    this.firestore.collection<Canvas>('canvas').snapshotChanges().subscribe(data => {
      this.canvas1 = data.map(item => {
        const id = item.payload.doc.id;
        const canvas = item.payload.doc.data() as Canvas;
        return {id, ...canvas};
      });
      console.log(this.canvas1);
    });
  }

  redirectMatriz(obj: Canvas) {
    this.canvasselect = obj;

    this.matriz = true;
  }

  changePage(page: string, obj: Canvas) {
    this.canvasselect = obj;
    this.matriz = true;
    this.title = page;

    this.canvass = true;
    this.dash = false;
    this.profile = false;
    this.table = false;

    this.outputEmitido.emit({
      canvasselect: this.canvasselect,
      iscanvas: this.canvass
    });

    console.log(this.canvass);
    console.log('dash');
  }
  getUrl(canvas:fabric.Canvas){
    return  canvas.toDataURL({
      format: 'image/png',
      quality: 1,
    });
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

