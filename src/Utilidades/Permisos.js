import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function Permisos(rol){
    
    const Apermisos = cookies.get('permisos');
    if(Apermisos != undefined)
    {
        const getPermiso = Apermisos.find(Apermisos => Apermisos.roleName === rol);
        const isPermiso = getPermiso !== undefined;
        return isPermiso
    }
}
