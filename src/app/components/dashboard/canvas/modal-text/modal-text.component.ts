import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-text',
  templateUrl: './modal-text.component.html',
  styleUrls: ['./modal-text.component.css']
})
export class ModalTextComponent {
  newText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentText: string },
    public dialogRef: MatDialogRef<ModalTextComponent>
  ) {
    this.newText = data.currentText;
  }

  save(): void {
    // Aqui você pode adicionar a lógica para salvar o novo texto
    this.dialogRef.close({currentText: this.newText});
  }
}
