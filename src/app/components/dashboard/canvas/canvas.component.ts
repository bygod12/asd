import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { fabric } from 'fabric';
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {ActivatedRoute, Router} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {Gradient, Pattern} from "fabric/fabric-impl";
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import {ImageService} from "./image.service";
import {ModalTextComponent} from "./modal-text/modal-text.component";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/services/user";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit {
  @Input() canvasselect!: Canvas;
  objectsMake: any[] = [];
  objects: any[] = [];
  public loadedImages: Array<string | ArrayBuffer> = [];
  public canvas!: fabric.Canvas;
  public loadedBackground: Array<string | ArrayBuffer> = [];
  cliente:boolean = false;
  components: any[] = [];
  height:string = "800";
  width:string = "600";
  background!:string;
  textChange: any[] = [];
  imageChange: GroupImage[] = [];
  userpreview!: User;

  constructor(private db: AngularFirestore,private authService: AuthService,private firestore: AngularFirestore,public is: ImageService, public router: Router,public route:ActivatedRoute, private dialog: MatDialog) { }

  deleteIcon: string = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  img!: HTMLImageElement;
  getObjectById(id:string) {
    return this.db.collection<User>('users').doc(id).valueChanges()
  }

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        let userData = JSON.parse(localStorage.getItem('user')!);
        this.getObjectById(userData.uid).subscribe( i => {
          this.userpreview = i!;
          const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
          this.canvas = new fabric.Canvas(canvasElement);


          // this.img = new Image();
          // this.img.src = this.deleteIcon;
          //
          // (fabric.Object.prototype.controls as any).deleteControl = new fabric.Control({
          //   x: 0.5,
          //   y: -0.5,
          //   offsetY: 16,
          //   cursorStyle: 'pointer',
          //   mouseUpHandler: this.deleteObject.bind(this),
          //   render: this.renderIcon.bind(this)
          // } as CustomControl);
          // this.add();
          console.log(this.canvasselect);
          this.buildCanvas(this.canvasselect);
        });

      }
    });

  }

  add(): void {
    const rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: 'yellow',
      width: 200,
      height: 100,
      objectCaching: false,
      stroke: 'lightgreen',
      strokeWidth: 4
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }

  deleteObject(eventData: any, transform: any, x:any, y:any) {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
    return true;
  }

  renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ): void {
    const size = fabricObject.cornerSize || 24;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
// Função para montar um canvas a partir de um objeto do tipo Canvas
  themeColor: any;
  selectedPhoto: any;
  verificarElemento(frase: string): boolean {
    const inicio = "<<";
    const fim = ">>";

    const temInicio = frase.indexOf(inicio) !== -1;
    const temFim = frase.indexOf(fim) !== -1;

    return temInicio && temFim;
  }
  // getObjectById(id:string) {
  //   return this.db.collection<User>('users').doc(id).valueChanges()
  // }
  defineScale(width:number, height:number,scale:boolean){

    // Calcule a escala com base no novo tamanho do canvas
    const scaleX = width / this.canvas.getWidth();
    const scaleY = height / this.canvas.getHeight();

    // Ajuste a escala de cada objeto no canvas
    this.canvas.getObjects().forEach((obj) => {
      const objLeft = obj.left! * scaleX;
      const objTop = obj.top! * scaleY;

      obj.scaleX! *= scaleX;
      obj.scaleY! *= scaleY;

      obj.set({
        left: objLeft,
        top: objTop,
        selectable:scale// Desativa a seleção de cada objeto

      });

      obj.setCoords(); // Atualize as coordenadas do objeto após a escala e a posição
    });

// Redefina o tamanho do canvas
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);

    this.canvas.renderAll(); // Renderize o canvas novamente após as alterações

  }

    buildCanvas(canvasData: Canvas): fabric.Canvas {
      let userData = JSON.parse(localStorage.getItem('user')!);

      // this.getObjectById(userData.uid).subscribe( i => {
      //   this.userpreview = i!;
      // });
      this.canvas = new fabric.Canvas('canvas');

      const canvas = this.canvas;

      canvasData.components!.forEach(componentData => {
        let component: fabric.Object | null = null;

        switch (componentData.name) {
          case 'circle':
            component = new fabric.Circle({
              left: componentData.left,
              top: componentData.top,
              radius: componentData.radius,
              fill: componentData.fill,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY
            });
            break;
          case 'ellipse':
            component = new fabric.Ellipse({
              left: componentData.left,
              top: componentData.top,
              rx: componentData.rx,
              ry: componentData.ry,
              fill: componentData.fill,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY
            });
            break;
          case 'rect':
            component = new fabric.Rect({
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
            });
            break;
          case 'triangle':
            component = new fabric.Triangle({
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY
            });
            if(componentData.strokeWidth! >0){

            }
            break;
          case 'image':
            fabric.Image.fromURL(componentData.image_url!, (img) => {
              img.set({
                left: componentData.left,
                top: componentData.top,
                scaleX: componentData.scaleX,
                scaleY: componentData.scaleY
              });
              canvas.add(img);
            });
            break;
          case 'textbox'|| 'i-text' ||'text':
            let text;
            if(componentData.text == "<<Digite_seu_texto>>"){
              console.log(componentData.text == "<<Digite_seu_texto>>");
              text = this.userpreview.telefone;
            }else
              text = componentData.text!;

            component = new fabric.Text(text!, {
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              fontSize: componentData.fontSize,
              fontFamily: componentData.fontFamily,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY
            });
            if(this.verificarElemento(componentData.text!)){
              this.textChange.push(component);

            }
            break;
          case 'textbox':
            let text2;
            if(componentData.text == "<<Digite_seu_texto>>"){
              console.log(componentData.text == "<<Digite_seu_texto>>");
              text2 = this.userpreview.telefone;
            }else
              text2 = componentData.text!;

            component = new fabric.Textbox(text2!, {
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              fontSize: componentData.fontSize,
              fontFamily: componentData.fontFamily,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY,
            });
            if(this.verificarElemento(componentData.text!)){
              this.textChange.push(component);

            }
            break;
          case 'i-text':
            let text4;
            if(componentData.text == "<<Digite_seu_texto>>"){
              console.log(componentData.text == "<<Digite_seu_texto>>");
              text4 = this.userpreview.telefone;
            }else
              text4 = componentData.text!;

            component = new fabric.IText(text4!, {
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              fontSize: componentData.fontSize,
              fontFamily: componentData.fontFamily,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY,
            });
            console.log(component);
            console.log(componentData);
            if(this.verificarElemento(componentData.text!)){
              this.textChange.push(component);

            }
            break;
          case 'text':
            let text3;
            if(componentData.text == "<<Digite_seu_texto>>"){
              console.log(componentData.text == "<<Digite_seu_texto>>");
               text3 = this.userpreview.telefone;
            }else
               text3 = componentData.text!;

            component = new fabric.Text(text3!, {
              left: componentData.left,
              top: componentData.top,
              width: componentData.width,
              height: componentData.height,
              fill: componentData.fill,
              fontSize: componentData.fontSize,
              fontFamily: componentData.fontFamily,
              strokeWidth: componentData.strokeWidth,
              stroke: componentData.stroke,
              scaleX: componentData.scaleX,
              scaleY: componentData.scaleY,
            });
            if(this.verificarElemento(componentData.text!)){
              this.textChange.push(component);

            }
            break;
          case 'group':
            const groupComponents: fabric.Object[] = [];
            let textgroup: string ='';
            let leftgroup: number = 0;
            let topgroup: number = 0;
            let widthgroup: number = 0;
            let heigthgroup: number =0;
            let scalexgroup:number = 0;
            let scaleygroup:number = 0;

            componentData.group?.forEach(groupComponentData => {
              let heightrectangulo: number;
              let groupComponent: fabric.Object | null = null;
              let width: number = widthgroup;
              let height:number = heigthgroup;
              let left: number = leftgroup;
              let top: number = topgroup;
              let scalex:number = scalexgroup;
              let scaley:number = scaleygroup;
              let rectHeigth: number;
              let groupImage: GroupImage;
              // Crie o componente interno do grupo
              switch (groupComponentData.name) {
                case 'rect':
                  groupComponent = new fabric.Rect({
                    left: componentData.left,
                    top: componentData.top,
                    width: groupComponentData.width,
                    height: groupComponentData.height,
                    fill: groupComponentData.fill,
                    strokeWidth: groupComponentData.strokeWidth,
                    stroke: groupComponentData.stroke,
                  });
                  heightrectangulo = groupComponentData.height!;
                  width = groupComponentData.width!;
                  left = groupComponentData.left!;
                  top = groupComponentData.top!;
                  height = groupComponentData.height!;
                  break;
                case 'image':
                  groupComponent = new fabric.Image(groupComponentData.image_url!, {
                    left: groupComponentData.left,
                    top: groupComponentData.top,
                    scaleX: groupComponentData.scaleX,
                    scaleY: groupComponentData.scaleY
                  });
                  break;
                case 'textbox' || 'i-text':
                  groupComponent = new fabric.Textbox(groupComponentData.text!, {
                    left: groupComponentData.left,
                    top: groupComponentData.top,
                    width: groupComponentData.width,
                    height: groupComponentData.height,
                    fill: groupComponentData.fill,
                    fontSize: groupComponentData.fontSize,
                    fontFamily: groupComponentData.fontFamily,
                    strokeWidth: groupComponentData.strokeWidth,
                    stroke: groupComponentData.stroke,
                    scaleX: groupComponentData.scaleX,
                    scaleY: groupComponentData.scaleY,
                    selectable: false,
                    selected: false
                  });
                  textgroup = groupComponentData.text!;
                  break;
                case 'text':
                  groupComponent = new fabric.Text(groupComponentData.text!, {
                    left: groupComponentData.left,
                    top: groupComponentData.top,
                    width: groupComponentData.width,
                    height: groupComponentData.height,
                    fill: groupComponentData.fill,
                    fontSize: groupComponentData.fontSize,
                    fontFamily: groupComponentData.fontFamily,
                    strokeWidth: groupComponentData.strokeWidth,
                    stroke: groupComponentData.stroke,
                    scaleX: groupComponentData.scaleX,
                    scaleY: groupComponentData.scaleY,
                    selectable: false,
                  });
                  textgroup = groupComponentData.text!;
                  break;
              }

              if (groupComponent) {
                groupComponents.push(groupComponent);
              }
            });



            // Crie o grupo com os componentes internos
            if (groupComponents.length > 0) {
              if(textgroup == "<<image_sa>>"){
                fabric.Image.fromURL(this.userpreview.logo!, (img) => {
                  img.set({
                    left: componentData.left,
                    top: componentData.top,
                    scaleX: componentData.scaleX,
                    scaleY: componentData.scaleY
                  });
                  canvas.add(img);
                });

              }
              else {
                component = new fabric.Group(groupComponents);
              }
              let groupImage: GroupImage = {
                groutext: component,
                top: componentData.top,
                height: componentData.height,
                width: componentData.width,
                text: textgroup,
                left: componentData.left,
                scaleX:componentData.scaleX,
                scaleY:componentData.scaleY
              };
              console.log(groupComponents);
              this.imageChange.push(groupImage);
            }
            break;
        }


        if (component) {

          canvas.add(component);
        }
      });
      if(this.canvasselect.background!=''){
        if (this.isColor(this.canvasselect.background)){
          this.onColorChangeBuild(this.canvasselect.background);
        }else if(this.canvasselect.background == 'marca'){
          this.SelectColorPadron()
        }else{
          this.SelectBackground(this.canvasselect.background);
        }
      }
      return canvas;
    }

  substituiImagem(event: any, obj: GroupImage) {
    let file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      const canvas = this.canvas; // Supondo que você já tenha uma instância de fabric.Canvas definida

      reader.onload = (event) => {

        let imageUrl = event.target!.result as string;

        console.log(imageUrl); // Exibe o URL de dados da imagem no console

        fabric.Image.fromURL(imageUrl, (img) => {
          const imgWidth = img.width || img.getScaledWidth();
          const imgHeight = img.height || img.getScaledHeight();

          const scale = Math.min(obj.width / imgWidth, obj.height / imgHeight);

          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;

          const left = obj.left + (obj.width - scaledWidth) / 2;
          const top = obj.top + (obj.height - scaledHeight) / 2;

          img.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
          });

          console.log(img);
          console.log(obj);

          // Remova os componentes existentes do grupo
          canvas.remove(obj.groutext!);
          // Adicione a nova imagem ao canvas
          canvas.add(img);
          canvas.renderAll();
        });
      };

      reader.readAsDataURL(file);
    }
  }




  changeText(obj:any){
    const dialogRef = this.dialog.open(ModalTextComponent, {
      width: '400px',
      data: { currentText: obj.text } // Passa o texto atual para o modal
    });

    dialogRef.afterClosed().subscribe(newText => {
      console.log(obj);
      if (newText.currentText) {
        obj.set('text', newText.currentText);
        this.canvas.renderAll();
      }
    });

  }
  onColorChange(event: any) {

    const color = event.target.value;
    this.canvas.setBackgroundImage(undefined!, this.canvas.renderAll.bind(this.canvas));
    this.canvas.backgroundImage = undefined;
    this.canvas.renderAll();
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas));
    this.canvas.renderAll();
    console.log(color);
    this.background = color;
  }
  SelectBackground(imageUrl: any){
    var canvas = this.canvas;
    var background = this.background;
    fabric.Image.fromURL(imageUrl, function(img) {
      // add background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / img.width!,
        scaleY: canvas.height! / img.height!
      });
      background = imageUrl;
      console.log(background);
    });
    this.background = imageUrl;
  }

  isColor(value: any): boolean {
    // Verifica se o valor corresponde a um formato hexadecimal (#RRGGBB)
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    if (hexRegex.test(value)) {
      return true;
    }

    // Verifica se o valor corresponde a um nome de cor pré-definido
    const predefinedColors = [
      'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia',
      'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua'
    ];
    if (predefinedColors.includes(value.toLowerCase())) {
      return true;
    }

    return false;
  }
  onColorChangeBuild(color: any) {

    this.canvas.setBackgroundImage(undefined!, this.canvas.renderAll.bind(this.canvas));
    this.canvas.backgroundImage = undefined;
    this.canvas.renderAll();
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas));
    this.canvas.renderAll();
    console.log(color);
    this.background = color;
  }
  SelectColorPadron(){
    var canvas = this.canvas;
    const imageUrl = '../assets/img.png'
    var background = this.background;

    fabric.Image.fromURL(imageUrl, function(img) {
      // add background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / img.width!,
        scaleY: canvas.height! / img.height!
      });
      background = imageUrl;
    });
    this.background = 'marca';

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
  description?:string;
  left?: number;
  top?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fill?: string | Pattern | Gradient;
  image_url?:string;
  stroke?:string;
  strokeWidth?:number;
  scaleY?:number;
  scaleX?:number;
  imageUrl?:string;
  fontFamily?:string;
  fontSize?:number;
  text?:string;
  width?:number;
  height?:number;
  group?: Components[]; // Adicione a propriedade objects para armazenar os elementos do grupo
}

interface GroupImage {
  groutext?:any;
  text?:any;
  left?: any;
  top?: any;
  width?:any;
  height?:any;
  scaleX?: any;
  scaleY?: any;
}
interface CustomControl extends fabric.Control {
  cornerSize?: number;
}
