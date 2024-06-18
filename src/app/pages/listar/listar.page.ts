import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  arregloNoticias: any = [{
    id: '',
    titulo: '',
    texto: ''

  }]

  constructor(private router: Router, private servicioBD: BdserviceService) { }

  ngOnInit() {
    this.servicioBD.dbState().subscribe(res =>{
      if(res){
        this.servicioBD.fetchNoticias().subscribe(item =>{
          this.arregloNoticias = item;
        })
      }
    });
  }

  obtenerTexto($event: any){
    const valor = $event.target.value;
    console.log("text " + valor);
  }

  modificar(x: any){
    let navigationExtras: NavigationExtras = {
      state: {
        idEnviado: x.id,
        tituloEnviado: x.titulo,
        textoEnviado: x.texto
      }
    }

    this.router.navigate(['/modificar'], navigationExtras);
  }

  eliminar(x: any){
    this.servicioBD.eliminarNoticias(x.id);
    this.servicioBD.presentToast("Noticia eliminada");
  }

}
