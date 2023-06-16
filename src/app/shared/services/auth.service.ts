import { Injectable } from '@angular/core';
import { User } from '../services/user';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import * as auth from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Salva os dados do usuário logado
  constructor(
    public afs: AngularFirestore, // Injeta o serviço Firestore
    public afAuth: AngularFireAuth, // Injeta o serviço de autenticação do Firebase
    public router: Router,
  ) {
    // Salva os dados do usuário no localStorage quando está logado ou define como nulo quando está deslogado
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  // Entrar com email/senha
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Cadastrar com email/senha
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.router.navigate(['sign-in']);

      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Redefinir senha esquecida
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Email de redefinição de senha enviado, verifique sua caixa de entrada.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Retorna verdadeiro quando o usuário está logado
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // Entrar com o Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }

  // Lógica de autenticação para os provedores de autenticação
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Configura os dados do usuário no Firestore
  // Configura os dados do usuário no Firestore
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      telefone: '',
      endereco: '',
      site: '',
      logo: '',
      corMarca: '',
      name: '',
      description: ''
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Atualiza os dados do usuário no Firestore

  // Sair
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  updateUser(uid: string, userData: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
     userRef.set(userData, { merge: true });
    return this.getUserById(uid);
  }
  getUserById(uid: string): Promise<User | null> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(`users/${uid}`);
    return userRef.get()
      .toPromise()
      .then((doc) => {
        if (doc!.exists) {
          return doc!.data() as User;
        } else {
          return null; // Caso o usuário não exista
        }
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

}
