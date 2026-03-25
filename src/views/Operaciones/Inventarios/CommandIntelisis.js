import React, {useEffect, useState} from 'react'
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import FechaI from '../../base/parametros/FechaInicio';
import FechaF from '../../base/parametros/FechaFinal';
import Plantas from '../../base/parametros/Plantas';
import '../../../estilos.css';
import BuscadorDT from '../../base/parametros/BuscadorDT'
import { getAlmacenCommand, safeNumber, safeString, convertArrayOfObjectsToCSV} from '../../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CTab,
    CTabContent,
    CTabList,
    CTabPanel,
    CTabs,
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilCloudDownload, cilSearch, cilTrash } from '@coreui/icons'
import { format } from 'date-fns';
import { Rol } from '../../../Utilidades/Roles'

const CommandIntelisis = () => {
    const [plantasSel , setPlantas] = useState('');
    const [vFechaI, setFechaIni] = useState(new Date());
    const [vFechaF, setFechaFin] = useState(new Date());

    const userIsOperacion = Rol('Operaciones');
    const userIsJP = Rol('JefePlanta');
    const userIsDos = Rol('userIsDosif');

    //Arrays
    const [dtAlmComm, setDTAlmComm] = useState([]);
    const [dtAlmacen, setDTAlmacen] = useState([]);
    const [dtCommand, setDTCommand] = useState([]);
    //Buscador
    const [fText, setFText] = useState(''); 
    const [vBPlanta, setBPlanta] = useState('');

    const opcionesFca = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const cFechaI = (fecha) => {
        setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
    };
    const mFcaF = (fcaF) => {
        setFechaFin(fcaF.toLocaleDateString('en-US',opcionesFca));
    };
    const mCambio = (event) => {
        setPlantas(event.target.value);
    };

    // Columnas de la tabla
    const colAlm = [
        {
            name: 'Ticket ID',
            selector: row => safeString(row?.IdTicket),
            sortable:true,
            width:"300px",
        },
        {
            name: 'Material',
            selector: row => safeString(row?.Material),
            sortable:true,
            width:"150px",
        },
        {
            name: 'Cantidad Batched CB',
            selector: row => {
                const val = row.CB_Net_Batched;
                if (
                    val !== null &&
                    val !== undefined &&
                    Number.isInteger(Number(val))
                ) {
                    return Number(val);
                }

                return "N/A";

            },
            width:"250px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Cantidad Batched Int',
            selector: row => {
                const val = row?.Int_Qty;
                // valida si es número real y finito
                if (typeof val === 'number' && Number.isFinite(val)) {
                    return val;
                }
                return "N/A";
            },
            width:"250px",
            sortable:true,
            grow:1,
        },
        {
            name: 'DIFERENCIA',
            selector: row => {
                const valCB = row?.CB_Net_Batched;
                // valida si es número real y finito
                if (typeof val === 'number' && Number.isFinite(val)) {
                    return val;
                }
                const valInt = row?.Int_Qty;
                // valida si es número real y finito
                if (typeof val === 'number' && Number.isFinite(val)) {
                    return val;
                }
                const dife = valCB - valInt
                return dife;
            },
            width:"200px",
            sortable:true,
            grow:1,
        },
        {
            name: 'Fecha',
            selector: row => {
                const fecha = row.FcaPC;
                if (fecha === null || fecha === undefined) {
                  return "No disponible";
                }
                if (typeof fecha === 'object') {
                  return "Sin Fecha";
                }
                const [fecha_, hora] = fecha.split("T");
                return fecha_+" "+ hora;
            },
            sortable:true,
            width:"150px",
        },
    ];
    const rowStyles = [
        {
        when: row => row.CB_Net_Batched < row.Int_Qty,
            style: {
                backgroundColor: '#F2BB16', // Color de fondo rojo claro
                color: '#262223', // Color de texto rojo oscuro
            },
        },
    ];
    useEffect(() => {

    }, []);

    const getAlmacenCommand_ = async () => {
        const auxFcaI = format(vFechaI, 'yyyy/MM/dd');
        const auxFcaF = format(vFechaF, 'yyyy/MM/dd');
        Swal.fire({
            title: 'Cargando...',
            text: 'Estamos obteniendo la información...',
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const OPList = await getAlmacenCommand(plantasSel, auxFcaI, auxFcaF);
            Swal.close();
            const almacen = OPList.PC;
            const almacenPC = almacen.filter(a => a.IdTicket && Object.keys(a.IdTicket).length > 0);
            const inventario = OPList.CB;
            const almacenCB = inventario.filter(a => a.TicketID && Object.keys(a.TicketID).length > 0);
            const intelisis = OPList.Intelisis;
            const almacenInt = intelisis.filter(a => a.Referencia && Object.keys(a.Referencia).length > 0);
            //************************************************************************************************************** */
            const groupedPC = almacenPC.reduce((acc, item) => {
                const key = `${item.Material}_${item.IdTicket}`;

                if (!acc[key]) {
                    acc[key] = {
                    Material: item.Material,
                    IdTicket: item.IdTicket,
                    Net_Batched: 0,
                    Net_Target: 0,
                    Qty: 0,
                    Fca:item.Fecha,
                    items: []
                    };
                }

                acc[key].Net_Batched += Number(item.CantCarga || 0);
                acc[key].Net_Target += Number(item.Objetivo || 0);
                acc[key].Qty += Number(item.Cantidad || 0);

                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultPC = Object.values(groupedPC);
            const groupedCB = almacenCB.reduce((acc, item) => {
                const key = `${item.Item_Code}_${item.TicketID}`;

                if (!acc[key]) {
                    acc[key] = {
                    Item_Code: item.Item_Code,
                    Ticket_LineID: item.TicketID,
                    Net_Batched: 0,
                    Net_Target: 0,
                    Qty: 0,
                    Fca:item.RecordDate,
                    items: []
                    };
                }

                acc[key].Net_Batched += Number(item.Net_Batched || 0);
                acc[key].Net_Target += Number(item.Net_Target || 0);
                acc[key].Qty += Number(item.Qty || 0);

                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            // Si lo quieres como array:
            const resultCB = Object.values(groupedCB);
            const groupedInt = almacenInt.reduce((acc, item) => {
                const key = `${item.Articulo}_${item.Referencia}`;
                if (!acc[key]) {
                    acc[key] = {
                    Material: item.Articulo,
                    IdTicket: item.Referencia,
                    Net_Batched: 0,
                    Net_Target: 0,
                    Qty: 0,
                    Fca:item.FechaRequerida,
                    items: []
                    };
                }

                acc[key].Net_Batched += Number(item.CantCarga || 0);
                acc[key].Net_Target += Number(item.Objetivo || 0);
                acc[key].Qty += Number(item.Cantidad || 0);

                acc[key].items.push(item); // si quieres conservar el detalle

                return acc;
            }, {});
            const resultInt = Object.values(groupedInt);
            //**************************************************************************************************************************** */
            const normalize = id => id?.toLowerCase();
            const mergeABC = (A, B, C) => {
            const map = {};

            // A --------------------------
            A.forEach(item => {
                const key = normalize(item.IdTicket) + "_" + item.Material;
                if (!map[key]) map[key] = { 
                IdTicket: normalize(item.IdTicket), 
                Material: item.Material, 
                FcaPC:item.Fca 
                };

                map[key].PC_Net_Batched = item.Net_Batched || 0;
                map[key].PC_Net_Target  = item.Net_Target  || 0;
                map[key].PC_Qty         = item.Qty         || 0;
            });

            // B --------------------------
            B.forEach(item => {
                const key = normalize(item.Ticket_LineID) + "_" + item.Item_Code;
                if (!map[key]) map[key] = { 
                IdTicket: normalize(item.Ticket_LineID), 
                Material: item.Item_Code,
                FcaCB:item.Fca  
                };

                map[key].CB_Net_Batched = item.Net_Batched || 0;
                map[key].CB_Net_Target  = item.Net_Target  || 0;
                map[key].CB_Qty         = item.Qty         || 0;
            });

            // C --------------------------
            C.forEach(item => {
                const key = normalize(item.IdTicket) + "_" + item.Material;
                if (!map[key]) map[key] = { 
                IdTicket: normalize(item.IdTicket), 
                Material: item.Material,
                FcaInt:item.Fca  
                };

                map[key].Int_Net_Batched = item.Net_Batched || 0;
                map[key].Int_Net_Target  = item.Net_Target  || 0;
                map[key].Int_Qty         = item.Qty         || 0;
            });

            // Rellenar faltantes
            Object.values(map).forEach(obj => {
                obj.PC_Net_Batched ??= 0;
                obj.PC_Net_Target  ??= 0;
                obj.PC_Qty         ??= 0;

                obj.CB_Net_Batched ??= 0;
                obj.CB_Net_Target  ??= 0;
                obj.CB_Qty         ??= 0;

                obj.Int_Net_Batched ??= 0;
                obj.Int_Net_Target  ??= 0;
                obj.Int_Qty         ??= 0;
            });

            return Object.values(map);
            };

            const result = mergeABC(resultPC, resultCB, resultInt);
            console.log("🐦‍🔥 resultado:", result);
            setDTAlmComm(Array.isArray(result) ? result : []);
        } catch (error) {
            Swal.close();
            Swal.fire("Error", "No se pudo obtener la información", "error");
        }
    };
    
    // Descargar CSV
    const downloadCSV = () => {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(exRemisiones);
        if (csv == null) return;
    
        const filename = 'Remisiones_Faltantes'+plantasSel+'_'+vFechaI+'_'+vFechaF+'.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
    
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    };
    
    // Búsqueda
    const onFindBusqueda = (e) => {
        setFText(e.target.value);
        setBPlanta(e.target.value);
    };

    const fBusqueda = () => {

    };

    // Filtrar por texto en Material o Fecha
    const fDAlmacenList = dtAlmComm.filter(item => {
        const mat = (item.Material || "").toLowerCase();
        const search = fText.toLowerCase();

        return (
            mat.includes(search)
        );
    });
    const fDComm = dtCommand.filter(item => {
        const ref = String(item.Estatus || "").toLowerCase();
        const search = fText.toLowerCase();

        return (
            ref.includes(search)
        );
    });

    return (
        <>
            <CContainer fluid>
                <h3>Command Vs Intelisis </h3>
                <CRow className='mt-2'>
                    <CCol xs={6} md={2}>
                        <Plantas  
                            mCambio={mCambio}
                            plantasSel={plantasSel}
                        />
                    </CCol>
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
                    <CCol xs={6} md={2} className='mt-4'>
                        <CButton color='primary' onClick={getAlmacenCommand_}> 
                            <CIcon icon={cilSearch} />
                            {' '}Buscar
                        </CButton>
                    </CCol>
                    <CCol xs={6} md={2} className='mt-4'>
                        <CButton color='danger' onClick={downloadCSV}>
                            <CIcon icon={cilCloudDownload} className="me-2" />
                            Exportar
                        </CButton>
                    </CCol>
                </CRow>
                <CRow className='mt-3'>
                    <CTabs activeItemKey="ticket">
                        <CTabList variant='tabs' layout='justified'>
                            <CTab itemKey='ticket'>Tickets</CTab>
                            <CTab itemKey='almacen'>Almacén</CTab>
                        </CTabList>
                        <CTabContent>
                            <CTabPanel itemKey="ticket">
                                <CCol xs={12} md={12}>
                                    <CCol xs={3} md={3}>
                                        <br />
                                        <BuscadorDT value={fText} onChange={onFindBusqueda} />
                                    </CCol>
                                </CCol>
                                <CRow>
                                    <CCol xs={12} md={12} lg={12}>
                                        <DataTable
                                            columns={colAlm}
                                            data={fDAlmacenList}
                                            pagination
                                            persistTableHead
                                            subHeader
                                            conditionalRowStyles={rowStyles}
                                        />
                                    </CCol>
                                </CRow>
                            </CTabPanel>
                            <CTabPanel itemKey="almacen">
                                <CCol xs={12} md={12}>
                                    <CCol xs={3} md={3}>
                                        <br />
                                        <BuscadorDT value={fText} onChange={onFindBusqueda} />
                                    </CCol>
                                </CCol>
                                <CCol>
                                    <DataTable
                                        columns={colAlm}
                                        data={fDAlmacenList}
                                        pagination
                                        persistTableHead
                                        subHeader
                                    />
                                </CCol>
                            </CTabPanel>                 
                        </CTabContent>
                    </CTabs>       
                </CRow>
                <br />
            </CContainer>
        </>
    )
}

export default CommandIntelisis;
