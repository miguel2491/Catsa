import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function Rol(rol){
    
    const Aroles = cookies.get('roles');
    const getRol = Aroles.find(Aroles => Aroles.roleName === rol);
    const isRol = getRol !== undefined;
    return isRol
}
