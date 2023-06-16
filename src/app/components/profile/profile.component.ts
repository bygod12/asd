import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { User } from "../../shared/services/user";
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  uid!: string;
  name!: string;
  description!: string;
  email!: string;
  telefone!: string;
  endereco!: string;
  site!: string;
  logo!: string;
  corMarca!: string;
  userData!: User | null;
  userpreview!: User;
  logoPreview!: any;

  constructor(private authService: AuthService, private db: AngularFirestore) { }
  getObjectById(id:string) {
    return this.db.collection<User>('users').doc(id).valueChanges()
  }
  ngOnInit() {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        let userData = JSON.parse(localStorage.getItem('user')!);
        this.getObjectById(userData.uid).subscribe( i => {
          this.userpreview = i!;
        });

      }
    });
  }
  handleLogoChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPreview = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
  updateUser() {
    console.log(this.userData);
    let userData = JSON.parse(localStorage.getItem('user')!);

    this.authService.updateUser(userData.uid, {
      uid: userData.uid,
      name: this.name,
      description: this.description,
      email: userData.email,
      telefone: this.telefone,
      endereco: this.endereco,
      site: this.site,
      logo: this.logoPreview, // Usar o logoPreview, caso exista, caso contrário manter o logo existente
      corMarca: this.corMarca
    })
      .then((r) => {
        this.getObjectById(userData.uid).subscribe( i => {
          this.userpreview = i!;
        });

        console.log(r);
        console.log(this.userData);
      })
      .catch((error) => {
        console.error('Erro ao atualizar os dados do usuário:', error);
      });
  }
}
