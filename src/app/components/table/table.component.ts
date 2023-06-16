import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

export interface User {
  uid?: string;
  name?: string;
  description?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  site?: string;
  logo?: string;
  corMarca?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  dataSource: User[] = [
    {
      uid: "1",
      name: "John Doe",
      description: "Lorem ipsum dolor sit amet",
      email: "johndoe@example.com",
      telefone: "1234567890",
      endereco: "123 Main Street",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#FF0000"
    },
    // Adicione mais exemplos aqui...
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "2",
      name: "Jane Smith",
      description: "Consectetur adipiscing elit",
      email: "janesmith@example.com",
      telefone: "0987654321",
      endereco: "456 Park Avenue",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#00FF00"
    },
    {
      uid: "12",
      name: "Michael Johnson",
      description: "Mauris vehicula consectetur",
      email: "michaeljohnson@example.com",
      telefone: "9876543210",
      endereco: "789 Broadway",
      site: "www.example.com",
      logo: "assets/img/logo.png",
      corMarca: "#0000FF"
    }
  ];

  displayedColumns: string[] = ['logo', 'name', 'corMarca', 'email'];

  // Configurações da paginação
  pageSize = 10;
  currentPage = 0;
  totalItems = this.dataSource.length;

  // Função para controlar a página atual
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }
}
