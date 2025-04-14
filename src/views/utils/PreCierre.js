import React, {useEffect, useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { convertArrayOfObjectsToCSV, getPreCierres, setPreCierres, fNumberCad, fNumber } from '../../Utilidades/Funciones';
import {
  CForm,
  CContainer,
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilBell, cilSearch } from '@coreui/icons'
import Plantas from '../base/parametros/Plantas'
import Periodo from '../base/parametros/Periodo'
import Mes from '../base/parametros/Mes'
import TabulatorG from '../base/tabs/TabulatorP'

const PreCierre = () => {
    //*************************************** VARIABLES ************************* */
    const [plantasSel , setPlantas] = useState('');
    const [periodoSel , setPeriodo] = useState('');
    const [mesSel , setMes] = useState('');
    const [dtPreCie, setDTPreCie] = useState([]);
    const [exOC, setExOc] = useState([]);
    const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
    const [vBPlanta, setBPlanta] = useState('');
    const [bRealizar, setBRealizar] = useState(false);
    //*************************************** PRINCIPALES ************************* */
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    const mPeriodo = (event) => {
        setPeriodo(event.target.value);
    };
    const mMes = (event) => {
        setMes(event.target.value);
    };
    const sendPC = () =>{
        setPreCierre_(plantasSel, periodoSel, mesSel)
    };
    //*************************************** FUNCIONES ************************* */
    const setPreCierre_ = async(planta, periodo, mes) =>
    {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        if(planta === "" || periodo === "" || mes === "")
        {
            console.error("Debes llenar todos los parametros", planta, periodo, mes)
            Swal.close();
        }
        else
        {
            try
            {
                //------------------------------------------------------------------------------------------------------------------------------------------------------
                const ocList = await setPreCierres(planta, periodo, mes);
                Swal.close();  // Cerramos el loading
                //------------------------------------------------------------------------------------------------------------------------------------------------------
            }
            catch(error)
            {
                Swal.close();
                Swal.fire("Error", "No se pudo obtener la información", "error");
            }
        }
    }
    const getPreCierres_ = async() =>
        {
            Swal.fire({
                title: 'Cargando...',
                text: 'Estamos obteniendo la información...',
                didOpen: () => {
                    Swal.showLoading();  // Muestra la animación de carga
                }
            });
            if(plantasSel === "" || periodoSel === "" || mesSel === "")
            {
                console.error("Debes llenar todos los parametros", plantasSel, periodoSel, mesSel)
                Swal.close();
            }
            else
            {
                try
                {
                    //------------------------------------------------------------------------------------------------------------------------------------------------------
                    const ocList = await getPreCierres(plantasSel, fNumberCad(mesSel), periodoSel);
                    setBRealizar(false)
                    if(ocList)
                    {
                        setDTPreCie(ocList)
                        setBRealizar(false)
                    }else{
                        setBRealizar(true)
                        setDTPreCie([])
                    }
                    Swal.close();  // Cerramos el loading
                    //------------------------------------------------------------------------------------------------------------------------------------------------------
                }
                catch(error)
                {
                    Swal.close();
                    Swal.fire("Error", "No se pudo obtener la información", "error");
                }
            }
        }
    //*************************************** COLUMNAS ************************* */
    const colPreCie = [
        {
            name: 'PLANTA',
            selector: row => {
                const aux = row.Planta;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'MATERIAL',
            selector: row => {
                const aux = row.Material;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"120px",
            sortable:true,
            grow:1,
        },
        {
            name: 'FECHA',
            selector: row => {
                const aux = row.FechaInv;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'USUARIO',
            selector: row => {
                const aux = row.Usuario;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"100px",
            sortable:true,
            grow:1,
        },
        {
            name: 'COMENTARIO',
            selector: row => {
                const aux = row.Comentario;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"130px",
            sortable:true,
            grow:1,
        },
        {
            name: 'INV. INICIAL',
            selector: row => {
                const aux = fNumber(row.InvInicial);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'COMPRAS',
            selector: row => {
                const aux = fNumber(row.Compras);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"130px",
            sortable:true,
            grow:1,
        },
        {
            name: 'INV. FINAL',
            selector: row => {
                const aux = fNumber(row.InvFinal);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'CONSUMOS',
            selector: row => {
                const aux = fNumber(row.Consumos);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"130px",
            sortable:true,
            grow:1,
        },
        {
            name: 'CONSUMOS REAL',
            selector: row => {
                const aux = fNumber(row.ConsumosReal);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"170px",
            sortable:true,
            grow:1,
        },
        {
            name: 'TOTAL INV.',
            selector: row => {
                const aux = fNumber(row.TotalInv);
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'CANT. MERMA',
            selector: row => {
                const aux = row.CantMerma;
                if (aux === null || aux === undefined) {
                    return "No disponible";
                }
                if (typeof aux === 'object') {
                return "Sin Datos"; // O cualquier mensaje que prefieras
                }
                return aux;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
    ];
    //*************************************** BUSCAR ************************* */
    const onFindBusqueda = (e) => {
        setBPlanta(e.target.value);
        setFText(e.target.value);
    };
    const fBusqueda = () => {
        if(vBPlanta.length != 0){
            const valFiltrados = dtPreCie.filter(dtPreCie => 
              dtPreCie.Planta.includes(vBPlanta) // Filtra los clientes por el número de cliente
            );
        }else{
          getPreCie_()
        }
    };
    const fPreCie = dtPreCie.filter(item => {
        // Filtrar por planta, interfaz y texto de búsqueda
        return item.Planta.toLowerCase().includes(fText.toLowerCase()) || item.mes.includes(fText) || item.periodo.includes(fText);
    });
    //*************************************** ***************************************************************** ************************* */
    return (
        <>
            <CContainer fluid>
                <h1>PreCierre</h1>
                <CForm>
                <CRow className='mb-3'>
                    <CCol sm="auto">
                        <Plantas  
                            mCambio={mCambio}
                            plantasSel={plantasSel}
                        />
                    </CCol>
                    <CCol sm="auto">
                        <Periodo
                        mPeriodo={mPeriodo}
                        periodoSel={periodoSel}
                        />
                    </CCol>
                    <CCol sm="auto">
                        <Mes
                        mMes={mMes}
                        mesSel={mesSel}
                        />
                    </CCol>
                    <CCol sm="auto" className='mt-4'>
                        <CButton color='primary' onClick={getPreCierres_} style={{'color':'white'}}>
                        <CIcon icon={cilSearch} className="me-2" />
                        Buscar
                        </CButton>
                    </CCol>
                    {bRealizar && (
                    <CCol sm="auto" className='mt-4'>
                        <CButton color='warning' onClick={sendPC} style={{'color':'white'}}>
                        <CIcon icon={cilBell} className="me-2" />
                        Realizar
                        </CButton>
                    </CCol>
                    )}
                </CRow>
                <CRow>
                    <DataTable
                      columns={colPreCie}
                      data={fPreCie}
                      pagination
                      persistTableHead
                      subHeader
                  />
                </CRow>
                </CForm>
            </CContainer>
        </>
    )
}
export default PreCierre