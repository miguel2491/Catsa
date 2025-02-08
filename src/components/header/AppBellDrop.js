import {useEffect,useState,React} from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
} from '@coreui/icons'
import Swal from "sweetalert2";
import { getNotificaciones,setNotificacion } from '../../Utilidades/Funciones';
import CIcon from '@coreui/icons-react'
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import '../SideBar.css'

const AppBell = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [nNot , setNNot] = useState(0);
  const [ListNot , setLNot] = useState([]);
  const [shNot , setShNot] = useState(false);
  const [shNNot , setShNNot] = useState(false);

  useEffect(() => {
      getNoticias();  
  }, []);

  const getNoticias = async () => {
    setShNNot(false)
    setShNot(false)
    setLNot(null)
    setNNot(0)
    try{
        const ocList = await getNotificaciones();
        if(ocList)
        {
          setShNNot(true)
          setShNot(true)
          setLNot(ocList)
          setNNot(ocList.length)
        }
    }catch(error){
      console.error(error)
    }
  };

  const getUrl = async (idN,url) =>{
    Swal.fire({
        title: 'Cargando...',
        text: 'Cargando...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    try{
      const ocList = await setNotificacion(idN);
      navigate(url)
      getNoticias();
      Swal.close();
    }catch(error){
      Swal.close();
      console.error(error)
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false} style={{ position: 'relative' }}>
        <CIcon icon={cilBell} size="lg" style={{marginTop:'8px'}} />
          {shNNot && (
            <CBadge color='primary'
            style={{
              position: 'absolute', 
              top: '-5px',    // Ajusta la distancia desde la parte superior del icono
              right: '-10px',  // Ajusta la distancia desde la parte derecha del icono
              padding: '0.2rem 0.5rem',
              fontSize: '0.7rem'
            }}>
              {nNot}
            </CBadge>
          )}
      </CDropdownToggle>
      {shNot && (
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Nuevas</CDropdownHeader>
          {ListNot.map(noticia =>(
              <CDropdownItem key={noticia.id_notificaciones} onClick={()=>getUrl(noticia.id_notificaciones,noticia.url)}>
                <CIcon icon={cilBell} className="mt-2 mr-2" /> 
                {noticia.descripcion}
                <CBadge color="info" className="ms-2">
                  {noticia.titulo}
                </CBadge>
              </CDropdownItem>
          ))}
        </CDropdownMenu>
      )}
    </CDropdown>
  )
}

export default AppBell
