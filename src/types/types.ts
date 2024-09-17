export interface AuthResponse {
    body: {
      user: User;
      accessToken: string;
      refreshToken: string;
    };
  }
  export interface AuthResponseError {
    body: {
      error: string;
    };
  }
  
  export interface User {
    _id: string;
    name: string;
    username: string;
  }
  
  export interface AccessTokenResponse {
    statusCode: number;
    body: {
      accessToken: string;
    };
    error?: string;
  } 

  export interface respuesta {
    id_usuario: string;
    nombre: string;
  }

export interface tokenSes {
  token:string;
  usuario:string;
  rol:number
}
export interface Permisos {
  id_permiso:number;
  id_rol:number;
  permiso:string;
}
