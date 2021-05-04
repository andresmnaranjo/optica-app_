import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private serverUrl = "https://optica-app.herokuapp.com/";
  private token: string;

  constructor(private http: HttpClient) { }

  private crearRequestHeader() {
    let headers = new HttpHeaders({
      "Authorization": "Bearer " + this.token,
      "Content-Type": "application/json"
    });

    return headers;
  }

  obtenerUsuarios() {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.get(
      this.serverUrl + "api/usuarios", { headers: headers });

  }

  obtenerUsuarioPorId(id) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.get(
      this.serverUrl + "api/usuarios/" + id, { headers: headers });

  }

  eliminarUsuarioPorId(id) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.delete(
      this.serverUrl + "api/usuarios/" + id, { headers: headers });

  }

  registrar(data: any) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post(
      this.serverUrl + "api/usuarios/registrar", data, { headers: headers });

  }

  autenticar(data: any) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post(
      this.serverUrl + "api/usuarios/autenticar", data, { headers: headers });

  }

  cambiarCel(data:any, id){
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.put(
      this.serverUrl + "api/usuarios/changecel/" + id, data, { headers: headers });
  }

  cambiarName(data:any, id){
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.put(
      this.serverUrl + "api/usuarios/changename/" + id, data, { headers: headers });
  }

  cambiarCountry(data:any, id){
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.put(
      this.serverUrl + "api/usuarios/changecountry/" + id, data, { headers: headers });
  }

  cambiarTypeUser(id, data:any){
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.put(
      this.serverUrl + "api/usuarios/changetypeuser/" + id, data, { headers: headers });
  }

}