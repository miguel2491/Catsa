import React, {useState, useRef} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import ProgressBar from "@ramonak/react-progress-bar";
import Plantas from '../../base/parametros/Plantas'
import FechaI from '../../base/parametros/FechaInicio'
import FechaF from '../../base/parametros/FechaFinal'
import {FormatoFca} from '../../../Utilidades/Tools.js'
import { format } from 'date-fns';
import { getInvRes, fNumber, convertArrayOfObjectsToCSVCC} from '../../../Utilidades/Funciones.js'
import {
  CFormSelect,
  CContainer,
  CButton,
  CRow,
  CCol,
  CTabs,
  CTabPanel,
  CTabContent,
  CTabList,
  CTab,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSearch, cilChartPie } from '@coreui/icons'


const ResumenInv = () => {
    
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());
    const opcionesFca = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false);
    //Arrays
    const [dtInvRes, setDTInv] = useState([]);
    const [dtInvInt, setDTInvInt] = useState([]);
    const [dtInvCB, setDTInvCB] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBuscar, setBuscar] = useState('');
    
    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };
    //*************************************** GET DATE *************************************************************************************** */
    const getDatos = async() =>
    {
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();  // Muestra la animación de carga
            }
        });
        try
        {
            const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
            const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const ocList = await getInvRes(plantasSel, auxFcaI, auxFcaF);
            console.log(ocList)
            Swal.close(); 
            const inPC = ocList.INVENTARIO;
            const inINT = ocList.INTELISIS;
            const invConsCRM = inINT.filter(a => a.Mov === 'Consumo Material');
            const invEntCRM = inINT.filter(a => a.Mov === 'Entrada Compra' || a.Mov === 'Entrada Compra SL');
            const inCB = ocList.CB;
            const invConsCB = inCB.filter(a => a.Mov === 'Consumo Material');
            const invEntCB = inCB.filter(a => a.Mov === 'Entrada Compra' || a.Mov === 'Entrada Compra SL');
            const normalizeMaterial = m => m?.trim().toUpperCase();
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const groupedPC = inPC.reduce((acc, item) => {
                const key = normalizeMaterial(item.Material);
                
                if (!acc[key]) {
                    acc[key] = {
                    Material: key,
                    Fecha: item.FechaInv,
                    Cantidad: 0,
                    Planta: item.Planta,
                    Unidad:'',
                    items: []
                    };
                }
                
                acc[key].Cantidad += Number(item.InvFisico || 0);
                acc[key].items.push(item);
                return acc;
            }, {});
            const resultPC = Object.values(groupedPC);
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const groupedInt = invConsCRM.reduce((acc, item) => {
                const key = normalizeMaterial(item.Material);
                if (!acc[key]) {
                    acc[key] = {
                        Material: key,
                        Fecha:'',
                        Cantidad: 0,
                        Planta:'',
                        Unidad:item.Unidad,
                        items: []
                    };
                }

                acc[key].Cantidad += Number(item.Cantidad || 0);
                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultInt = Object.values(groupedInt);
            const groupedEntInt = invEntCRM.reduce((acc, item) => {
                const key = normalizeMaterial(item.Material);
                if (!acc[key]) {
                    acc[key] = {
                        Material: key,
                        Fecha:'',
                        Cantidad: 0,
                        Planta:'',
                        Unidad:item.Unidad,
                        items: []
                    };
                }

                acc[key].Cantidad += Number(item.Cantidad || 0);
                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultEntInt = Object.values(groupedEntInt);
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const groupedCB = invConsCB.reduce((acc, item) => {
                const key = normalizeMaterial(item.Material);
                if (!acc[key]) {
                    acc[key] = {
                        Material: key,
                        Fecha:'',
                        Cantidad: 0,
                        Planta:'',
                        Unidad:item.Unidad,
                        items: []
                    };
                }

                acc[key].Cantidad += Number(item.Cantidad || 0);
                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultCB = Object.values(groupedCB);
            const groupedEntCB = invEntCB.reduce((acc, item) => {
                const key = normalizeMaterial(item.Material);
                if (!acc[key]) {
                    acc[key] = {
                        Material: key,
                        Fecha:'',
                        Cantidad: 0,
                        Planta:'',
                        Unidad:item.Unidad,
                        items: []
                    };
                }

                acc[key].Cantidad += Number(item.Cantidad || 0);
                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultEntCB = Object.values(groupedEntCB);
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const mergeABC = (A, B, C, D, E) => {
            const map = {};
            const upsert = (key) => {
                if (!map[key]) map[key] = { Material: key };
                return map[key];
            };
            // A --------------------------
            A.forEach(item => {
                const key = normalizeMaterial(item.Material);
                const obj = upsert(key);
                obj.Fecha_PC = item.Fecha;
                obj.Cantidad_PC = item.Cantidad 
                obj.Unidad_PC = item.Unidad  || '-';
            });

            // B --------------------------
            B.forEach(item => {
                const key = normalizeMaterial(item.Material);
                const obj = upsert(key);
                obj.Cantidad_CRM = item.Cantidad;
                obj.Unidad_CRM  = item.Unidad  || '-';
            });
            // C --------------------------
            C.forEach(item => {
                const key = normalizeMaterial(item.Material);
                const obj = upsert(key);
                obj.Cantidad_CB = item.Cantidad;
                obj.Unidad_CB = item.Unidad || '-';
            });
            // D --------------------------
            D.forEach(item => {
                const key = normalizeMaterial(item.Material);
                const obj = upsert(key);
                obj.Cantidad_Ent_CRM = item.Cantidad;
            });
            // E --------------------------
            E.forEach(item => {
                const key = normalizeMaterial(item.Material);
                const obj = upsert(key);
                obj.Cantidad_Ent_CB = item.Cantidad;
            });
            return Object.values(map).map(o => ({
                ...o,
                Cantidad_PC: o.Cantidad_PC ?? 0,
                Cantidad_CRM: o.Cantidad_CRM ?? 0,
                Cantidad_CB: o.Cantidad_CB ?? 0,
                Cantidad_Ent_CRM: o.Cantidad_Ent_CRM ?? 0,
                Cantidad_Ent_CB: o.Cantidad_Ent_CB ?? 0,
                Unidad_PC: o.Unidad_PC ?? '-',
                Unidad_CRM: o.Unidad_CRM ?? '-',
                Unidad_CB: o.Unidad_CB ?? '-',
            }));
        };

            const result = mergeABC(resultPC, resultInt, resultCB, resultEntInt, resultEntCB);
            console.log("🐦‍🔥 resultado:", result);
            
            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            setDTInv(result)
            //------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        catch(error)
        {
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    }
    //*************************************** COLUMNAS *************************************************************************************** */
    const colInv = [
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
            width:"150px",
            sortable:true,
            grow:1,
        },
        // {
        //     name: 'UNIDAD',
        //     selector: row => {
        //         const aux = row.Unidad_CB;
        //         if (aux === null || aux === undefined) {
        //             return "No disponible";
        //         }
        //         if (typeof aux === 'object') {
        //         return "Sin Datos"; // O cualquier mensaje que prefieras
        //         }
        //         return aux;
        //     },
        //     width:"120px",
        //     sortable:true,
        //     grow:1,
        // },
        {
            name: 'ÚLTIMA FECHA',
            selector: row => {
                const fecha = row.Fecha_PC;
                if (fecha === null || fecha === undefined) {
                  return "No disponible";
                }
                if (typeof fecha === 'object') {
                  return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_;
            },
            width:"150px",
            sortable:true,
            grow:1,
        },
        {
            name: 'INV. INICIAL',
            selector: row => {
                const aux = row.Cantidad_PC;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'ENTRADAS CRM',
            selector: row => {
                const aux = row.Cantidad_Ent_CRM;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'ENTRADAS CB',
            selector: row => {
                const aux = row.Cantidad_Ent_CB;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'CONSUMOS CRM',
            selector: row => {
                const aux = row.Cantidad_CRM;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'CONSUMOS CB',
            selector: row => {
                const aux = row.Cantidad_CB;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0; // O cualquier mensaje que prefieras
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'FINAL INV CRM',
            selector: row => {
                const InvIni = row.Cantidad_PC;
                const InvEntCRM = row.Cantidad_Ent_CRM;
                const InvConCRM = row.Cantidad_CRM;
                const aux = InvIni + InvEntCRM - InvConCRM;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                    return 0;
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'FINAL INV INT',
            selector: row => {
                const InvIni = row.Cantidad_PC;
                const InvEntCB = row.Cantidad_Ent_CB;
                const InvConCB = row.Cantidad_CB;
                const aux = InvIni + InvEntCB - InvConCB;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0;
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
        {
            name: 'DIFERENCIA',
            selector: row => {
                const InvIniCRM = row.Cantidad_PC;
                const InvEntCRM = row.Cantidad_Ent_CRM;
                const InvConCRM = row.Cantidad_CRM;
                const totalInt = InvIniCRM + InvEntCRM - InvConCRM;
                const InvIni = row.Cantidad_PC;
                const InvEntCB = row.Cantidad_Ent_CB;
                const InvConCB = row.Cantidad_CB;
                const totalCB = InvIni + InvEntCB - InvConCB;
                const aux = totalInt - totalCB;
                if (aux === null || aux === undefined) {
                    return 0;
                }
                if (typeof aux === 'object') {
                return 0;
                }
                return fNumber(aux);
            },
            width:"180px",
            sortable:true,
            grow:1,
        },
    ];
    const rowStyles = [
        {
            when: row => {
            const InvIniCRM = Number(row.Cantidad_PC) || 0;
            const InvEntCRM = Number(row.Cantidad_Ent_CRM) || 0;
            const InvConCRM = Number(row.Cantidad_CRM) || 0;

            const InvIniCB  = Number(row.Cantidad_PC) || 0;
            const InvEntCB  = Number(row.Cantidad_Ent_CB) || 0;
            const InvConCB  = Number(row.Cantidad_CB) || 0;

            const totalInt = InvIniCRM + InvEntCRM - InvConCRM;
            const totalCB  = InvIniCB  + InvEntCB  - InvConCB;

            const aux = totalInt - totalCB;

            return aux !== 0; // 👈 positivo o negativo
            },
            style: {
            backgroundColor: '#F2BB16',
            color: '#262223',
            },
        },
    ];
    const buildTableRows = (data) =>
        data.map(row => {
            const InvIniCRM = row.Cantidad_PC ?? 0;
            const EntCRM = row.Cantidad_Ent_CRM ?? 0;
            const ConCRM = row.Cantidad_CRM ?? 0;

            const InvIniCB = row.Cantidad_PC ?? 0;
            const EntCB = row.Cantidad_Ent_CB ?? 0;
            const ConCB = row.Cantidad_CB ?? 0;

            const FinalCRM = InvIniCRM + EntCRM - ConCRM;
            const FinalCB = InvIniCB + EntCB - ConCB;
            const Diferencia = FinalCRM - FinalCB;

            return {
                MATERIAL: row.Material ?? 'No disponible',
                'ÚLTIMA FECHA': row.Fecha_PC?.split('T')[0] ?? 'No disponible',
                'INV. INICIAL': fNumber(InvIniCRM),
                'ENTRADAS CRM': fNumber(EntCRM),
                'ENTRADAS CB': fNumber(EntCB),
                'CONSUMOS CRM': fNumber(ConCRM),
                'CONSUMOS CB': fNumber(ConCB),
                'FINAL INV CRM': fNumber(FinalCRM),
                'FINAL INV INT': fNumber(FinalCB),
                'DIFERENCIA': fNumber(Diferencia),
            };
        });

    //*************************************** ********************************************************************* ************************* */
    const fDInv = dtInvRes.filter(item => {
        return item.Material.includes(fText);
    });
    //*************************************** ************ *************************************************************************************** */
    // Descargar CSV
    const downloadCSV = () => {
    const dataForCSV = buildTableRows(fDInv);

    let csv = convertArrayOfObjectsToCSVCC(dataForCSV);
    if (!csv) return;

    const filename = `Inventario_${plantasSel}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};

    //*************************************** ************ *************************************************************************************** */
return (
    <>
        <CContainer fluid>
        <CModal
            backdrop="static"
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="StaticBackdropExampleLabel"
        >
            <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Cargando...</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {loading && (
                    <CRow className="mt-3">
                    <ProgressBar completed={percentage} />
                    <p>Cargando: {percentage}%</p>
                    </CRow>
                )}
            </CModalBody>
            <CModalFooter>
            
            </CModalFooter>
        </CModal>
            <h3>Inventarios CICAT</h3>
            <CRow>
                <CCol xs={6} md={2}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <FechaF 
                        vFcaF={vFechaF} 
                        mFcaF={mFcaF}
                        className='form-control'
                    />
                </CCol>
                <CCol xs={6} md={2}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                    />
                </CCol>
                <CCol xs={6} md={3} className='mt-3'>
                    <CButton color='primary' onClick={getDatos}>
                      <CIcon icon={cilSearch} className="me-2" />
                       Buscar
                    </CButton>
                    <CButton color='danger' onClick={downloadCSV} style={{color:'white'}}>
                      <CIcon icon={cilCloudDownload} className="me-2" />
                       Exportar
                    </CButton>
                </CCol>
                
                <CCol xs={6} md={2}>
                    <label>Medida</label>
                    <CFormSelect 
                        options={[
                            'Medida',
                            { label: 'Kg', value: '1' },
                            { label: 'M3', value: '2' }
                        ]}
                    />
                </CCol>
            </CRow>
            <br />
            <CTabs activeItemKey={1}>
                <CTabList variant="tabs" layout="fill">
                    <CTab aria-controls="R_Diario" itemKey={1}>Resumen</CTab>
                </CTabList>
                <CTabContent>
                    <CTabPanel className="py-3" aria-labelledby="R_Diario" itemKey={1}>
                        <DataTable
                            columns={colInv}
                            data={fDInv}
                            pagination
                            persistTableHead
                            subHeader
                            conditionalRowStyles={rowStyles}
                        />
                    </CTabPanel>
                </CTabContent>
            </CTabs>
        </CContainer>
    </>
    )
}
export default ResumenInv
