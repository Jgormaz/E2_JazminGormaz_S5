import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BdserviceService } from 'src/app/services/bdservice.service';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {

  idNoticia = "";
  tituloNoticia = "";
  textoNoticia = "";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private servicio: BdserviceService) { 
    this.activatedRoute.queryParams.subscribe(param =>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.idNoticia = this.router.getCurrentNavigation()?.extras?.state?.['idEnviado'];
        this.tituloNoticia = this.router.getCurrentNavigation()?.extras?.state?.['tituloEnviado'];
        this.textoNoticia = this.router.getCurrentNavigation()?.extras?.state?.['textoEnviado'];
      }
    })


  }

  ngOnInit() {
  }

  editar(){
    this.servicio.modificarNoticias(this.idNoticia,this.tituloNoticia,this.textoNoticia);
    this.servicio.presentToast("Noticia actualizada");
    this.router.navigate(['/listar']);
  }

}
