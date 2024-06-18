import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Noticia } from './noticia';

@Injectable({
  providedIn: 'root'
})
export class BdserviceService {

  public database!: SQLiteObject;

  tablaNoticias: string = "CREATE TABLE IF NOT EXIST noticias(id_noticia INTEGER PRIMARY KEY autoincrement, titulo VARCHAR(40) NOT NULL, texto TEXT NOT NULL);";

  registroNoticia: string = "INSERT INTO noticias VALUES (1, 'noticia 1', 'soy la noticia 1');";

  listaNoticias = new BehaviorSubject([]);

  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private alertController: AlertController, private toastController: ToastController, private sqlLite: SQLite, private platform: Platform) { 

    this.crearBD();
  }

  async presentToast(msj: string){
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      icon: 'globe'
    });

    await toast.present();
  }

  async presentAlert(msj: string){
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  fetchNoticias(): Observable<Noticia[]>{
    return this.listaNoticias.asObservable();
  }

  crearBD(){
    console.log("Creando BD");
    this.platform.ready().then(() => {
      console.log("Creando BD ... then");
      this.sqlLite.create({
        name: 'bdnoticias.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        this.database = db;
        this.crearTablas();
      }

      ).catch(e => {
        this.presentToast("Error al crear DB");
      })
    })
  }

  async crearTablas(){

    try{
      await this.database.executeSql(this.tablaNoticias,[]);
      await this.database.executeSql(this.registroNoticia,[]);
    }catch(e){
      this.presentToast("Error al crear tablas");
    }

  }

  buscarNoticias(){

    return this.database.executeSql('SELECT * FROM noticia',[]).then(res => {
      let items: Noticia[] = [];

      if(res.rows.length > 0){
        for(var i=0; i < res.rows.length; i++){
          items.push({
            id: res.rows.item(i).id_noticia,
            titulo: res.rows.item(i).titulo,
            texto: res.rows.item(i).texto
          })
          
        }
      }

      this.listaNoticias.next(items as any);
    }

    )
  }

  insertarNoticias(titulo: any, texto: any){
    let data = [titulo, texto];
    return this.database.executeSql('INSERT INTO noticias(titulo, texto) VALUES (?,?)', data).then(res => {
      this.buscarNoticias();
    })
  }

  modificarNoticias(id: any, titulo: any, texto: any){
    let data = [titulo, texto, id];
    return this.database.executeSql('UPDATE noticias SET titulo=?, texto=? WHERE id_noticia=?', data).then(res => {
      this.buscarNoticias();
    })
  }

  eliminarNoticias(id: any){
    
    return this.database.executeSql('DELETE FROM noticias WHERE id_noticia=?', [id]).then(res => {
      this.buscarNoticias();
    })
  }

}
