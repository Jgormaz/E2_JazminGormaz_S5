import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  tituloNoticia = "";
  textoNoticia = "";

  constructor(private router: Router, private service: BdserviceService) {

  }

  ngOnInit() {
  }

  insertar(){
    this.service.insertarNoticias(this.tituloNoticia, this.textoNoticia);
    this.service.presentToast("Noticia agregada");
    this.router.navigate(['/listar']);
  }

}
