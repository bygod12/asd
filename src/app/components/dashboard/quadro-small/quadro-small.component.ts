import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-quadro-small',
  templateUrl: './quadro-small.component.html',
  styleUrls: ['./quadro-small.component.css']
})
export class QuadroSmallComponent {
  @Input() imagemUrl!: any;
  @Input() titulo!: any;
  @Input() descricao!: any;

}
