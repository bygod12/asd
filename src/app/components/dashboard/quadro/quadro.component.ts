import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-quadro',
  templateUrl: './quadro.component.html',
  styleUrls: ['./quadro.component.css']
})
export class QuadroComponent {
  @Input() imagemUrl!: any;
  @Input() titulo!: any;
  @Input() descricao!: any;

}
