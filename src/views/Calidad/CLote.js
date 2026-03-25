import React, { useEffect,useState } from "react";
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { ReactSearchAutocomplete} from 'react-search-autocomplete';
import '../../estilos.css';
import '../ventas/ObjCom/AddObjCom.css'
import Plantas from '../base/parametros/Plantas'
import FechaI from '../base/parametros/FechaInicio';
import { formatResult, fNumber, getConcretos, getMuestreo, getTipoMuestra, getRemision, getConsumos, getMurvyca, 
  GetCalendarMR, GetCalendarCilMR,GetCalendarCilindro, GetCalendarCubo , suLote, suCal
} from '../../Utilidades/Funciones';
import {
    CContainer,
    CButton,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormTextarea,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CTab, CTabContent, CTabList, CTabPanel, CTabs
} from '@coreui/react'
import {CIcon} from '@coreui/icons-react'
import { cilPen, cilSave, cilSearch, cilTrash } from '@coreui/icons'
function CLote() {
  // ------------------------------------------------------------------------------------------------------------------------
  // ESTADOS
  // ------------------------------------------------------------------------------------------------------------------------
  // Campos principales
  const [vOC, setVOC] = useState(false);
  const [vOCil, setVOCil] = useState(false);
  const [btnG, setBtnTxt] = useState('Guardar');
  const [plantasSel , setPlantas] = useState('');
  const [remisionB , setRemisionB] = useState('');
  const [tipoB , setTipoB] = useState('CUBO');
  const [activoItem , setItem] = useState('cubo');
  //----------------------------------------------------
  const [TxtPlanta , setPlantaTxt] = useState('');
  const [TxtConcreto , setConcretoTxt] = useState('');
  //----------------------------------------------------
  const [vFechaI, setFechaIni] = useState(new Date());
  const [TxtNoMuestra, setNoMuestra] = useState('');
  const [TxtCliente, setCliente] = useState('');
  const [TxtObra, setObra] = useState('');
  const [TxtCodCon, setCodCon] = useState('');
  const [TxtTCemento, setTCemento] = useState('');
  //----------------------------------------------------
  const [TxtCemento, setCemento] = useState('');
  const [TxtAspecto, setAspecto] = useState('');
  const [TxtApariencia, setApariencia] = useState('');
  const [TxtTra, setTra] = useState('');
  const [TxtObservacion, setObs] = useState('');
  const [TxtCohesion, setCohesion] = useState('');
  const [TxtTMuestra, setTMuestra] = useState('');
  //----------------------------------------------------
  const [TxtRes, setRes] = useState('');
  const [TxtEG, setEG] = useState('');
  const [TxtTMA, setTMA] = useState('');
  const [TxtRTeo, setRTeo] = useState('');
  const [TxtTServ, setTServ] = useState('');
  const [TxtVar, setVar] = useState('');
  const [TxtVolM, setVolM] = useState('');
  const [TxtVolD, setVolD] = useState('');
  const [TxtVolA, setVolA] = useState('');
  //----------------------------------------------------
  const [TxtRvReal, setRevReal] = useState('');
  const [TxtTConcreto, setTConcreto] = useState('');
  const [TxtHraMuestra, setHraMuestra] = useState('');
  const [TxtEColado, setEColado] = useState('');
  //-------------------- MODAL CALENDARIO--------------------------------
  const [TxtMMuestra, setMMuestra] = useState('');
  const [TxtMEspecimen, setMEspecimen] = useState('');
  const [TxtMCarga, setMCarga] = useState('');
  const [TxtMLado1, setMLado1] = useState('');
  const [TxtMLado2, setMLado2] = useState('');
  const [TxtMFactor, setMFactor] = useState('');
  const [TxtMAltura1, setMAltura1] = useState('');
  const [TxtMAltura2, setMAltura2] = useState('');
  const [TxtMMasa, setMMasa] = useState('');
  const [TxtMFc, setMFc] = useState('');
  const [TxtMPFC, setMPFC] = useState('');
  const [TxtMDiametro1, setMDiametro1] = useState('');
  const [TxtMDiametro2, setMDiametro2] = useState('');
  //----------------------------------------------------
  const [TxtPTaraC, setPTaraC] = useState('');
  const [TxtPTara, setPTara] = useState('');
  const [TxtVolTara, setVolTara] = useState('');
  const [TxtPConcreto, setPConcreto] = useState('');
  const [TxtFTara, setFTara] = useState('');
  const [TxtCAire, setCAire] = useState('');
  const [TxtMU, setMUnitaria] = useState('');
  const [TxtRVol, setRVol] = useState('');
  const [TxtRVolP, setRVolP] = useState('');
  const [TxtRVolL, setRVolL] = useState('');
  const [TxtRelAC, setRelAC] = useState('');
  const [TxtRGA, setRGA] = useState('');
  //----------------------------------------------------
  const [TipoCal, setTipoCal] = useState('');
  const [TipoBtn, setTipoBtn] = useState('');
  //----------------------------------------------------
  const [dtMP, setDTMP] = useState([]);
  const [dtCal, setDTCal] = useState([]);
  const [dtCil, setDTCil] = useState([]);
  //----------------------------------------------------
  const [showMCF, setShowMCF] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [showBtnCal, setShowBtnCal] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [showPri, setShowPri] = useState(true);
  const [showCubo, setShowCubo] = useState(false);
  const [showCil, setShowCil] = useState(false);

  //Buscador
  const [fText, setFText] = useState(''); // Estado para el filtro de búsqueda
  const [vBPlanta, setBPlanta] = useState('');
  // ARRAYS
  const [dtCalendario, setDTCalendario] = useState([]);
  const [optCem, setOPCem] = useState([]);
  //----------------------------- USE EFFECT ---------------------------------------------------------------------------------
  useEffect(() => {
    const obtCon = async()=>{
      try{
        const ocList = await getConcretos();
        if(ocList){
          setOPCem(ocList)
        }
      }catch(error){
        console.log(error)
      }
    };
    obtCon();
  }, []);
  useEffect(() => {
    //S.log('OBJMP',dtMP)
  }, [dtMP]);
  //------------------------------ FUNCIONES ---------------------------------------------------------------------------------
  const mCambio = (event) => {
    const pla = event.target.value; 
    const text = event.target.options[event.target.selectedIndex].text;
    if(pla != "")
    {
      setPlantas(pla);
      setShowBtnCal(true)
      setPlantaTxt(text)
    }
  };
  const cFechaI = (fecha) => {
    setFechaIni(fecha.toLocaleDateString('en-US',opcionesFca));
  };
  const mCemento = (event) => {
    const cmn = event.target.value; 
    setCemento(cmn);
  };
  const mAspecto = (event) => {
    const asp = event.target.value; 
    setAspecto(asp);
  };
  const mTraba = (event) => {
    const traba = event.target.value; 
    setTra(traba);
  };
  const mCohesion = (event) => {
    const coh = event.target.value; 
    setCohesion(coh);
  };
  //-------------------------------------------------------------------------------------------------------------------------
  const fPPlanta = async (pla) => {
    try{
      const datosFiltrados = dtObjCom.filter(item => item.Planta === pla);
      setDTAss(Object.values(datosFiltrados));
    }catch(error){
      console.log(error)
      setShowDT(true);
      setShowDTP(false);
    }
  };
  const gMuestras = async()=>{
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    try{
      const ocList = await getMuestreo(plantasSel,remisionB,tipoB);
      if(ocList){
        setShowMCF(true)
        setShowPri(false)
        //console.log(ocList)
        const ocList2 = await getTipoMuestra(plantasSel,remisionB,tipoB);
        if(ocList2){
          //console.log(ocList2)
          setTMuestra(ocList2[0].TIPO)
        }
        let descPlanta = ocList[0].DescripcionPlanta;
        let QTYDia = ocList[0].QTYDia;
        let QTYAc = ocList[0].QTYAcumulado;
        let PesoT = ocList[0].PesoTotalMP;
        const ocList3 = await getRemision(plantasSel, remisionB, descPlanta, QTYDia, QTYAc, PesoT);
        if(ocList3){
          //console.log(ocList3)
          setNoMuestra(ocList3[0].NoMuestra)
          setCliente(ocList3[0].Cliente)
          setObra(ocList3[0].Obra)
          setCodCon(ocList3[0].CodigoConcreto)
          setRes(ocList3[0].Resistencia)
          setEG(ocList3[0].EdadGarantia)
          setTMA(ocList3[0].TMA)
          setRTeo(ocList3[0].RevenimientoTeorico)
          setTServ(ocList3[0].TipoServicio)
          setVar(ocList3[0].Variante)
          setVolM(ocList3[0].VolumenMuestreado)
          setVolD(ocList3[0].VolumenDiario)
          setVolA(ocList3[0].VolumenAcumulado)
          setRevReal(ocList3[0].RevenimientoReal)
          setCemento(ocList3[0].TipoCemento)
          setTConcreto(ocList3[0].TemperaturaConcreto)
          setTCemento(ocList3[0].TipoCemento)
          setAspecto(ocList3[0].Aspecto)
          setHraMuestra(ocList3[0].HoraMuestra)
          setTra(ocList3[0].Trabajabilidad)
          setEColado(ocList3[0].ElementoColado)
          setCohesion(ocList3[0].Cohesion)
          setApariencia(ocList3[0].Apariencia)
          setObs(ocList3[0].Observaciones)
        }
        const ocList4 = await getConsumos(plantasSel, remisionB, QTYDia);
        if(ocList4)
        {
          //console.log(ocList4)  
          setDTMP(ocList4)
        }
        const ocList5 = await getMurvyca(plantasSel, remisionB, descPlanta);
        if(ocList5){
          //console.log(ocList5)
          setPTaraC(ocList5[0].PesoTaraConcreto)
          setPTara(ocList5[0].PesoTara)
          setFTara(ocList5[0].VolumenTara)
          setCAire(ocList5[0].ContenidoAire)
          setVolTara(ocList5[0].VolumenTara)
          let PesoConcreto = parseFloat(ocList5[0].PesoTaraConcreto) - parseFloat(ocList5[0].PesoTara)
          setPConcreto(PesoConcreto.toFixed(2))
          let MasaUnitario = parseFloat(ocList5[0].PesoConcreto) * parseFloat(ocList5[0].VolumenTara)
          setMUnitaria(MasaUnitario.toFixed(2))
          let RendVolM3 = parseFloat(ocList3[0].PesoTotalMP) / parseFloat(MasaUnitario)
          setRVol(RendVolM3.toFixed(2))
          let RendVolP = (RendVolM3 / parseFloat(ocList3[0].VolumenMuestreado)) * 100;
          setRVolP(RendVolP.toFixed(2))
          let RendVolKg = RendVolP * 10;
          setRVolL(RendVolKg.toFixed(2))
          let RelAC = 0;
          let RelGA = 0; 
          let Agua = 0;
          let CPC = 0;
          let Grava = 0;
          let Arena = 0;
          ocList4.forEach((item, index) => {
            if(item.Material == 'H2O')
            {
              Agua += parseFloat(item.MasasReales)
            }
            if(item.Material == 'CPC')
            {
              CPC += parseFloat(item.MasasReales)
            }
            if(item.Grava == 'GR')
            {
              Grava += parseFloat(item.MasasReales)
            }
            if(item.Grava == 'AR')
            {
              Arena += parseFloat(item.MasasReales)
            }
          })
          RelAC = (Agua === 0 && CPC === 0) ? 0:Agua / CPC;
          setRelAC(RelAC.toFixed(2))
          RelGA = (Grava === 0 && Arena === 0) ? 0 : Grava / Arena;
          setRGA(RelGA.toFixed(2))
        }
      }else{
        setShowMCF(false)
        setShowPri(true)
      }
    }catch(error){
      console.log(error)
    }
  };
  const getCalendario_ = async () => {
    Swal.fire({
        title: 'Cargando...',
        text: 'Estamos obteniendo la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    try{
      //console.log(tipoB)
      if(tipoB == "CUBO"){
        setItem('cubos')
        const ocList = await GetCalendarCubo(remisionB, plantasSel);
        //console.log(ocList)
        setDTCal(ocList)
        setShowCubo(true)
      }else if(tipoB == "CILINDRO"){
        setItem('cilindros')
        const ocList = await GetCalendarCilindro(remisionB, plantasSel);
        //console.log(ocList)
        setDTCil(ocList)
        setShowCil(true)
      }else{
        const ocList = await GetCalendarCilindro(remisionB, plantasSel);
        const ocListC = await GetCalendarCubo(remisionB, plantasSel);
        const merged = [...ocList, ...ocListC]
        setDTCal(merged)
        setShowCubo(true)
        setShowCil(true)
        //console.log(ocList, ocListC)
      }
      const ocList = await getMuestreo(plantasSel,remisionB,tipoB);
      //console.log(ocList)
      let descPlanta = ocList[0].DescripcionPlanta;
      let QTYDia = ocList[0].QTYDia;
      let QTYAc = ocList[0].QTYAcumulado;
      let PesoT = ocList[0].PesoTotalMP;
      const ocList3 = await getRemision(plantasSel, remisionB, descPlanta, QTYDia, QTYAc, PesoT);
      if(ocList3){
        //console.log(ocList3)
        setConcretoTxt(ocList3[0].CodigoConcreto)
        setRes(ocList3[0].Resistencia)
        setNoMuestra(ocList3[0].NoMuestra)
      }
      Swal.close();
    }catch(error){
      Swal.close();
      Swal.fire("Error", "No se pudo obtener la información", "error");
    }
  };
  // ------------------------------------------------------------------------------------------------------------------------
  // FUNCIONES DE AUTOCOMPLETADO
  // ------------------------------------------------------------------------------------------------------------------------
  const hRemisionB = (e) =>{
    setRemisionB(e.target.value);
  };
  const hTipoB = (e) =>{
    setTipoB(e.target.value);
  };
  const hObs = (e) =>{
    setObs(e.target.value);
  };
  const hPTaraC = (e) =>{
    setPTaraC(e.target.value);
  };
  const hPTara = (e) =>{
    setPTara(e.target.value);
  };
  const hFTara = (e) =>{
    setFTara(e.target.value);
  };
  const hCAire = (e) =>{
    setCAire(e.target.value);
  };
  const hCarga = (e) =>{
    setMCarga(e.target.value);
  };
  const hLado1 = (e) =>{
    setMLado1(e.target.value);
  };
  const hLado2 = (e) =>{
    setMLado2(e.target.value);
  };
  const hAltura1 = (e) =>{
    setMAltura1(e.target.value);
  };
  const hAltura2 = (e) =>{
    setMAltura2(e.target.value);
  };
  const hMasa = (e) =>{
    setMMasa(e.target.value);
  };
  // ------------------------------------------------------------------------------------------------------------------------
  // BOTON
  // ------------------------------------------------------------------------------------------------------------------------
  const getBack = (id) =>{
    if(id=='mcf'){
      setShowMCF(false)
      setShowPri(true)
      setPlantas('')
      setMuestra('CUBO')
    }else if(id=='pt2'){
      setShowP2(false)
      setShowCal(false)
      setShowMCF(true)
    }else if(id=='pCalendarioF'){
      setShowP2(true)
      setShowCal(false)
    }
    
  };
  const getNext = () =>{
    setShowMCF(false)
    setShowCal(false)
    setShowP2(true)
  };
  const btnPCalendar = () => {
    setShowCal(false)
    setShowMCF(false)
  };
  const vHist = (id) =>{
    setMEspecimen(id);
    setVOC(true)
    setTipoCal(tipoB)
    const fCal = dtCal.filter(item => {
      return item.Especimen == id;
    });
    setMCarga(fCal[0].Carga)
    setMLado1(fCal[0].Lado1)
    setMLado2(fCal[0].Lado2)
    setMFactor(fCal[0].Factor)
    setMAltura1(fCal[0].Altura1)
    setMAltura2(fCal[0].Altura2)
    setMMasa(fCal[0].MASA)
    setNoMuestra(fCal[0].NOMUESTRA)
  };
  const vHistCil = (id) =>{
    setMEspecimen(id);
    setVOCil(true)
    setTipoCal(tipoB)
    const fCil = dtCil.filter(item => {
      return item.ESPECIMEN == id;
    });
    setMCarga(fCil[0].CARGA)
    setMDiametro1(fCil[0].DIAMETRO1)
    setMDiametro2(fCil[0].DIAMETRO2)
    setMAltura1(fCil[0].ALTURA1)
    setMAltura2(fCil[0].ALTURA2)
    setMMasa(fCil[0].Masa)
  };
  // ----------------- GUARDAR ---------------------------------------------------------------------------------------------
  const onSaveCal = async() =>{
    if(tipoB == 'CUBO')
    {
      let ladoPro = (parseFloat(TxtMAltura1) + parseFloat(TxtMAltura2))/2;
      let fc = parseFloat(TxtMCarga) / ladoPro;
          fc = parseFloat(fc) *  parseFloat(TxtMFactor);
          fc = parseFloat(fc).toFixed(2)
      let pfcmr = (fc / parseFloat(TxtRes)) * 100; 
          pfcmr = pfcmr.toFixed(2)
      const fDataCubo = {
        CARGA:TxtMCarga,
        LADO1:TxtMLado1,
        LADO2:TxtMLado2,
        ALTURA1:parseFloat(TxtMAltura1),
        ALTURA2:TxtMAltura2,
        FACTOR:TxtMFactor,
        MASA:TxtMFactor,
        AREA:TxtMFactor,
        FC:parseFloat(fc),
        PFC:parseFloat(pfcmr),
        NOMUESTRA:TxtNoMuestra,
        ESPECIMEN:TxtMEspecimen,
        Tipo:'CU'
      }
      const res = await suCal(fDataCubo,'CU')
      if(res){
        Swal.close();
        Swal.fire("Éxito", "Se Agrego Correctamente", "success");
      }else{
        Swal.close();
        Swal.fire("Aviso", "Ocurrio un error, vuelve a intentar", "error");
      }
    }
    else if(tipoB == 'CILINDRO')
    {
      let diametroP = (parseFloat(TxtMDiametro1) + parseFloat(TxtMDiametro2))/2;
      let alturaP = (parseFloat(TxtMAltura1) + parseFloat(TxtMAltura2))/2;
      let area = (parseFloat(3.1416) * parseFloat(diametroP))/4;
        area = area.toFixed(2);
      let fc = parseFloat(TxtMCarga) / area;
      fc = fc.toFixed(2)
      let pfc = (fc / parseFloat(TxtRes)) * 100; 
        pfc = pfc.toFixed(2)
      const fDataCilindro = {
        NoMuestra:TxtNoMuestra,
        Especimen:TxtMEspecimen,
        CARGA:parseFloat(TxtMCarga),
        Tipo:"CI",
        DIAMETRO1:TxtMDiametro1,
        DIAMETRO2:TxtMDiametro2,
        DISTANCIAL: 0,
        ANCHOP:0,
        PERALTEP: 0,
				DISTANCIAA: 0,
        ALTURA1:TxtMAltura1,
        ALTURA2:TxtMAltura2,
        ALTURAP:alturaP,
        MASA:TxtMMasa,
        FC:parseFloat(fc),
        PFC:parseFloat(pfc),
        PROMEDIO:diametroP,
        RESISTENCIA:parseFloat(TxtRes),
        AREA:parseFloat(area),
      }
      const res = await suCal(fDataCilindro,'CI');
      if(res == "OK"){
        Swal.close();
        Swal.fire("Éxito", "Se Agrego Correctamente", "success");
      }else{
        Swal.close();
        Swal.fire("Aviso", "Ocurrio un error, vuelve a intentar", "error");
      }
    }
    //saveCal(fDataEspecimen, fDataCubo)
  }
  const onSaveLote = async(tipo) =>{
    Swal.fire({
        title: 'Guardar...',
        text: 'Estamos guardando la información...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    // Crear un objeto FormData
    if(tipo == "MC"){
      const fDMC = {
        NoMuestra:TxtNoMuestra,
        RevenimientoReal:TxtRvReal,
        TemperaturaConcreto: TxtTConcreto,
        HoraMuestra:TxtHraMuestra,
        ElementoColado:TxtEColado,
        Observaciones:TxtObservacion,
        TipoCemento:TxtCemento,
        Aspecto:TxtAspecto,
        Apariencia:TxtApariencia,
        Trabajabilidad:TxtTra,
        Cohesion:TxtCohesion,
        TipoMuestra:TxtTMuestra
      };
      const ocList = await suLote(fDMC,'MC');
      if(ocList){
        Swal.close();
        Swal.fire("Éxito", "Se Agrego Correctamente", "success");
      }else{
        Swal.close();
        Swal.fire("Aviso", "Ocurrio un error, vuelve a intentar", "error");
      }
    }else{
      const fDMyrca = {
        NoMuestra:TxtNoMuestra,
        PesoTaraConcreto:TxtPTaraC,
        PesoTara:TxtPTara,
        VolumenTara:TxtVolTara,
        ContenidoAire:parseFloat(TxtCAire),
      };
      const ocList = await suLote(fDMyrca,'MY');
      if(ocList){
        Swal.close();
        Swal.fire("Éxito", "Se Agrego Correctamente", "success");
      }else{
        Swal.close();
        Swal.fire("Aviso", "Ocurrio un error, vuelve a intentar", "error");
      }
    }
  };
  // ------------------------------------------------------------------------------------------------------------------------
  // COLUMNAS
  // ------------------------------------------------------------------------------------------------------------------------
  const colCal = [
        {
          name: '',
          selector:row => row.especimen,
          cell: (row) => (
            <div>
              <CRow>
                <CCol xs={6} md={2} lg={2}>
                  <CButton
                      color="warning"
                      onClick={() => vHist(row.Especimen)}
                      size="sm"
                      className="me-2"
                      title="EDITAR"
                  >
                  <CIcon icon={cilPen} />
                  </CButton>
                </CCol>
              </CRow>
            </div>
                  ),
          width:"50px",
          sortable:true,
          grow:1,
        },
        {
          name: 'FECHA',
          selector: row => {
              let aux = row.Fecha;
              if(!aux) return "Sin Fecha";
              return aux.split("T")[0];
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'ESPECIMEN',
          selector: row => {
              const aux = row.Especimen;
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
          name: 'CARGA',
          selector: row => {
              const aux = row.Carga;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'LADO 1',
          selector: row => {
              const aux = row.Lado1;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"100px",
          sortable:true,
          grow:1,
        },
        {
          name: 'LADO 2',
          selector: row => {
              const aux = row.Lado2;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'ALTURA 1',
          selector: row => {
              const aux = row.Altura1;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'ALTURA 2',
          selector: row => {
              const aux = row.Altura2;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'Área',
          selector: row => {
              let lado1 = parseFloat(row.Lado1) || 0;
              let lado2 = parseFloat(row.Lado2) || 0;
              let promedio = (lado1 + lado2) / 2;
              if (!promedio || isNaN(promedio)) return "Sin Datos";
              let area = Math.pow(promedio, 2);
              area = Math.round(area * 100) / 100;
              return fNumber(area.toFixed(2));
          },
          width:"150px",
          sortable:true,
          grow:1,
        },
        {
          name: 'FACTOR',
          selector: row => {
              const aux = row.Factor;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'FC',
          selector: row => {
              const aux = row.FC;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'PFC',
          selector: row => {
              const aux = row.PFC;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
        {
          name: 'MASA',
          selector: row => {
              const aux = row.MASA;
              if (aux === null || aux === undefined) {
                  return "No disponible";
              }
              if (typeof aux === 'object') {
              return "Sin Datos"; // O cualquier mensaje que prefieras
              }
              return fNumber(aux.toFixed(2));
          },
          width:"120px",
          sortable:true,
          grow:1,
        },
  ];
  const colCil = [
    {
      name: '',
      selector:row => row.especimen,
      cell: (row) => (
        <div>
          <CRow>
            <CCol xs={6} md={2} lg={2}>
              <CButton
                  color="warning"
                  onClick={() => vHistCil(row.ESPECIMEN)}
                  size="sm"
                  className="me-2"
                  title="EDITAR"
              >
              <CIcon icon={cilPen} />
              </CButton>
            </CCol>
          </CRow>
        </div>
              ),
      width:"50px",
      sortable:true,
      grow:1,
    },
    {
      name: 'FECHA',
      selector: row => {
          let aux = row.FECHA;
          if(!aux) return "Sin Fecha";
          return aux.split("T")[0];
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'ESPECIMEN',
      selector: row => {
          const aux = row.ESPECIMEN;
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
      name: 'CARGA',
      selector: row => {
          const aux = row.CARGA;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Altura P',
      selector: row => {
          const aux = row.ALTURAP;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"100px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Diametro 1',
      selector: row => {
          const aux = row.DIAMETRO1;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Diametro 2',
      selector: row => {
          const aux = row.DIAMETRO2;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Promedio',
      selector: row => {
          const aux = row.Promedio;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'Área',
      selector: row => {
          const aux = row.Area;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
    {
      name: 'FC',
      selector: row => {
        const aux = row.FC;
        if (aux === null || aux === undefined) {
            return "No disponible";
        }
        if (typeof aux === 'object') {
        return "Sin Datos"; // O cualquier mensaje que prefieras
        }
        return fNumber(aux.toFixed(2));
      },
      width:"150px",
      sortable:true,
      grow:1,
    },
    {
      name: '% FC',
      selector: row => {
          const aux = row.PFC;
          if (aux === null || aux === undefined) {
              return "No disponible";
          }
          if (typeof aux === 'object') {
          return "Sin Datos"; // O cualquier mensaje que prefieras
          }
          return fNumber(aux.toFixed(2));
      },
      width:"120px",
      sortable:true,
      grow:1,
    },
];
  const onFindBusqueda = (e) => {
    setBPlanta(e.target.value);
    setFText(e.target.value);
  };
  const fBusqueda = () => {
    if(vBPlanta.length != 0){
        const valFiltrados = dtCal.filter(dtCal => 
          dtCal.Especimen.includes(vBPlanta) // Filtra los clientes por el número de cliente
        );
        setDTCal(valFiltrados);
    }else{
      //getAcObjCom_()
    }
  };
  const fBCal = dtCal.filter(item => {
    // Filtrar por planta, interfaz y texto de búsqueda
    return item.Fecha.includes(fText);
  });
  const fBCil = dtCil.filter(item => {
    // Filtrar por planta, interfaz y texto de búsqueda
    return item.FECHA.includes(fText);
  });
// ------------------------------------------------------------------------------------------------------------------------
// RENDERIZADO
// ------------------------------------------------------------------------------------------------------------------------
  return (
    <>
      <CContainer fluid>
        {showPri && (
          <>
            <h3>Toma de Muestras </h3>
            <CRow className='mt-3 mb-3'>
              <CCol xs={6} md={2}>
                <CFormInput
                    type="text"
                    label="Remisión"
                    placeholder="0"
                    value={remisionB}
                    onChange={hRemisionB}
                />
              </CCol>
              <CCol xs={6} md={2}>
                <Plantas  
                    mCambio={mCambio}
                    plantasSel={plantasSel}
                />
              </CCol>
              <CCol xs={6} md={2}>
                <label>Tipo de Muestra</label>
                <div className='mt-2'>
                <CFormSelect aria-label="Selecciona" id="cmbMuestra" value={tipoB} onChange={hTipoB}>
                    <option value="CUBO">CUBO</option>
                    <option value="CILINDRO">CILINDRO</option>
                    <option value="AMBOS">AMBOS</option>
                </CFormSelect>
                </div>
              </CCol>
              <CCol xs={6} md={2} lg={2} className='mt-4'>
                <CButton color='primary' onClick={gMuestras} style={{'color':'white'}} > 
                  <CIcon icon={cilSearch} />
                  Buscar
                </CButton>
              </CCol>
              {showBtnCal && (
                <CCol xs={6} md={2} lg={2} className='mt-4'>
                  <CButton color='warning' onClick={() =>{setShowCal(true); setShowMCF(false);setShowPri(false); getCalendario_()}} style={{'color':'white'}} > 
                    <CIcon icon={cilSearch} />
                    Ir a Calendario
                  </CButton>
                </CCol>
              )}
            </CRow>
          </>
        )}
        {showMCF && (
        <>
        <h2>Muestreo Concreto Fresco</h2>
            <CRow className="mt-3 mb-3">
                <CCol xs={3} md={3}>
                    <CFormInput
                        type="text"
                        label="No. Muestra"
                        placeholder="0"
                        value={TxtNoMuestra}
                        disabled
                    />
                </CCol>
                <CCol xs={3} md={3}>
                    <CFormInput
                        type="text"
                        label="Remisión"
                        placeholder="0"
                        value={remisionB}
                        disabled
                    />
                </CCol>
                <CCol xs={3} md={3}>
                    <Plantas  
                        mCambio={mCambio}
                        plantasSel={plantasSel}
                        disabled
                    />
                </CCol>
                <CCol xs={3} md={3}>
                    <FechaI 
                        vFechaI={vFechaI} 
                        cFechaI={cFechaI} 
                        className='form-control'
                        disabled
                    />
                </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
                <CCol xs={12} md={6}>
                    <CFormInput
                      type="text"
                      label="Cliente"
                      placeholder="0"
                      value={TxtCliente}
                      disabled
                    />        
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                      type="text"
                      label="Obra"
                      placeholder="0"
                      value={TxtObra}
                      disabled
                    />
                </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
                <CCol xs={12} md={2}>
                    <CFormInput
                      type="text"
                      label="Código Concreto"
                      placeholder="0"
                      value={TxtCodCon}
                      disabled
                    />        
                </CCol>
            </CRow>
            {/************  TABLAS ***********/}
            <CRow className="mt-3 mb-3">
                <CTable>
                    <CTableHead>
                        <CTableRow>
                        <CTableHeaderCell scope="col">Remisión</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Resistencia</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Edad Garantía</CTableHeaderCell>
                        <CTableHeaderCell scope="col">TMA</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Rev Teórico</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tipo Servicio</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Variante</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vol Muestreado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vol Diario</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Vol Acumulado</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow color="primary">
                            <CTableHeaderCell scope="row">{remisionB}</CTableHeaderCell>
                            <CTableDataCell>{TxtRes}</CTableDataCell>
                            <CTableDataCell>{TxtEG}</CTableDataCell>
                            <CTableDataCell>{TxtTMA}</CTableDataCell>
                            <CTableDataCell>{TxtRTeo}</CTableDataCell>
                            <CTableDataCell>{TxtTServ}</CTableDataCell>
                            <CTableDataCell>{TxtVar}</CTableDataCell>
                            <CTableDataCell>{fNumber(TxtVolM)}</CTableDataCell>
                            <CTableDataCell>{fNumber(TxtVolD)}</CTableDataCell>
                            <CTableDataCell>{fNumber(TxtVolA)}</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Material</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Masas Reales</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Unidad</CTableHeaderCell>
                      <CTableHeaderCell scope="col">M3</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Masas Teóricas</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Porcentaje Desviación</CTableHeaderCell>
                      </CTableRow>
                  </CTableHead>
                  <CTableBody>
                  {dtMP.map((item, index) => (
                    <CTableRow color="primary" key={index}>
                      <CTableHeaderCell scope="row">{item.Material}</CTableHeaderCell>
                        <CTableDataCell>{item.Descripcion}</CTableDataCell>
                        <CTableDataCell>{fNumber(item.MasasReales)}</CTableDataCell>
                        <CTableDataCell>{item.Unidad}</CTableDataCell>
                        <CTableDataCell>{fNumber(item.M3)}</CTableDataCell>
                        <CTableDataCell>{fNumber(item.MasasTeoricas)}</CTableDataCell>
                        <CTableDataCell>{fNumber(item.PorcentajeDesviacion)}</CTableDataCell>
                      </CTableRow>
                  ))}
                  </CTableBody>
                </CTable>
            </CRow>
            {/**************************** */}
            <CRow className="mt-3 mb-3">
                <CCol xs={12} md={3}>
                    <CFormInput
                      type="text"
                      label="Revenimiento Real*"
                      placeholder="0"
                      value={TxtRvReal}
                    />        
                </CCol>
                <CCol xs={12} md={3}>
                    <label>Tipo Cemento</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbCemento" value={TxtCemento} onChange={mCemento}>
                          <option value="" >Selecciona...</option>
                            {optCem.map(item => (
                              <option key={item.id} value={item.valor}>
                                {item.descripcion}
                              </option>
                            ))}
                        </CFormSelect>
                    </div>
                </CCol>
                <CCol xs={12} md={3}>
                    <CFormInput
                      type="text"
                      label="Temperatura del Concreto"
                      placeholder="0"
                      value={TxtTConcreto}
                    />        
                </CCol>
                <CCol xs={12} md={3}>
                    <label>Aspecto</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbAspecto" value={TxtAspecto} onChange={mAspecto}>
                          <option value="" >Selecciona...</option>
                          <option value="Balanceada">Balanceada</option>
                          <option value="Gravuda">Gravuda</option>
                          <option value="Arenosa">Arenosa</option>
                        </CFormSelect>
                    </div>
                </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
                <CCol xs={12} md={3}>
                    <CFormInput
                      type="text"
                      label="Hora Muestra"
                      placeholder="0"
                      value={TxtHraMuestra}
                    />        
                </CCol>
                <CCol xs={12} md={3}>
                    <label>Trabajabilidad</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbTra" value={TxtTra} onChange={mTraba}>
                          <option value="" >Selecciona...</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Regular">Regular</option>
                        </CFormSelect>
                    </div>
                </CCol>
                <CCol xs={12} md={3}>
                    <CFormInput
                      type="text"
                      label="Elemento Colado"
                      placeholder="0"
                      value={TxtEColado}
                    />        
                </CCol>
                <CCol xs={12} md={3}>
                    <label>Cohesión</label>
                    <div className='mt-2'>
                        <CFormSelect aria-label="Selecciona" id="cmbCoehsion" value={TxtCohesion} onChange={mCohesion}>
                          <option value="" >Selecciona...</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Regular">Regular</option>
                        </CFormSelect>
                    </div>
                </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
                <CCol xs={12} md={12}>
                    <CFormTextarea
                        placeholder="Observaciones"
                        aria-label="Observaciones"
                        value={TxtObservacion}
                        onChange={hObs}
                    ></CFormTextarea>
                </CCol>
            </CRow>
            {/* BOTON GUARDAR FORMULARIO */}
            <CRow className="mt-2 mb-2">
                <CCol xs={6} md={2}>
                    <CButton color="light" onClick={()=>{getBack('mcf')}} className="mr-2 ml-2">Previo</CButton>
                </CCol>
                <CCol xs={6} md={2}>
                    <CButton color="primary" onClick={()=>onSaveLote('MC')}><CIcon icon={cilSave} /> Guardar</CButton>
                </CCol>
                <CCol xs={6} md={2}>
                    <CButton color="light" className="mr-2 ml-2" onClick={getNext}>Siguiente</CButton>
                </CCol>
            </CRow>
        </>
        )}
        {showP2 && (
          <>
            <CRow className="mt-3 mb-3">
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="No. Muestra"
                  placeholder="0"
                  value={TxtNoMuestra}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <Plantas  
                  mCambio={mCambio}
                  plantasSel={plantasSel}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Remisión"
                  placeholder="0"
                  value={remisionB}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Código Concreto"
                  placeholder="0"
                  value={TxtCodCon}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Peso Tara Concreto (Kg)"
                  placeholder="0"
                  value={TxtPTaraC}
                  onChange={hPTaraC}
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Peso Tara (Kg)"
                  placeholder="0"
                  value={TxtPTara}
                  onChange={hPTara}
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Peso Concreto (Kg)"
                  placeholder="0"
                  value={TxtPConcreto}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Factor de Tara (1/m3)"
                  placeholder="0"
                  value={TxtFTara}
                  onChange={hFTara}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Contenido de Aire (%)"
                  placeholder="0"
                  value={TxtCAire}
                  onChange={hCAire}
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Masa Unitaria (Kg/m3)"
                  placeholder="0"
                  value={TxtMU}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Rendimiento Vol. (m3)"
                  placeholder="0"
                  value={TxtRVol}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Rendimiento Vol. (%)"
                  placeholder="0"
                  value={TxtRVolP}
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mt-3 mb-3">
              <CCol xs={3} md={3}>
              <CFormInput
                  type="text"
                  label="Rendimiento Vol. (L)"
                  placeholder="0"
                  value={TxtRVolL}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Rel. Agua/Cemento (a/c)"
                  placeholder="0"
                  value={TxtRelAC}
                  disabled
                />
              </CCol>
              <CCol xs={3} md={3}>
                <CFormInput
                  type="text"
                  label="Rel. Grava/Arena (g/a)"
                  placeholder="0"
                  value={TxtRGA}
                  disabled
                />
              </CCol>
            </CRow>
            {/* BOTON GUARDAR FORMULARIO */}
            <CRow className="mt-3 mb-3">
              <CCol xs={6} md={2}>
                    <CButton color="light" onClick={()=>getBack('pt2')} className="mr-2 ml-2">Previo</CButton>
                </CCol>
                <CCol xs={6} md={2}>
                  <CButton color="primary" onClick={() =>onSaveLote('CI')}><CIcon icon={cilSave} />Guardar</CButton>
                </CCol>
                <CCol xs={6} md={2}>
                    <CButton color="warning" onClick={()=>{ setShowP2(false);setShowCal(true);getCalendario_() }}>Ver Calendario</CButton>
                </CCol>
            </CRow>
          </>
        )}
        {showCal && (
          <>
          <h2>Calendario</h2>
          <CRow className="mt-3 mb-3">
            <CCol xs={3} md={2}>
              <CFormInput
                type="text"
                label="Planta"
                placeholder="0"
                disabled
                value={TxtPlanta}
              />
            </CCol>
            <CCol xs={3} md={2}>
              <CFormInput
                type="text"
                label="Concreto"
                placeholder="0"
                value={TxtConcreto}
                disabled
              />
            </CCol>
            <CCol xs={3} md={2}>
              <CFormInput
                type="text"
                label="Remisión"
                placeholder="0"
                value={remisionB}
              />
            </CCol>
            <CCol xs={3} md={3}>
              <CFormInput
                type="text"
                label="Tipo Muestra"
                placeholder="0"
                disabled
                value={tipoB}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3 mb-3">
            <CTabs activeItemKey={activoItem}>
              <CTabList variant="tabs">
                <CTab itemKey="cubos" disabled={!showCubo}>CUBOS</CTab>
                <CTab itemKey="cilindros" disabled={!showCil}>CILINDRO</CTab>
              </CTabList>
              <CTabContent>
                {showCubo && (
                  <CTabPanel className="p-3" itemKey="cubos">
                    <DataTable
                      columns={colCal}
                      data={fBCal}
                      pagination
                      persistTableHead
                      subHeader
                    />
                  </CTabPanel>
                )}
                {showCil && (
                  <CTabPanel className="p-3" itemKey="cilindros">
                    <DataTable
                      columns={colCil}
                      data={fBCil}
                      pagination
                      persistTableHead
                      subHeader
                    />
                  </CTabPanel>
                )}
              </CTabContent>
            </CTabs>
            <CCol xs={12} md={12}>
              
            </CCol>
          </CRow>
          <CRow className="mt-3 mb-3">
            <CCol xs={6} md={2}>
              <CButton color="light" onClick={()=>{getBack('pCalendarioF')}} className="mr-2 ml-2">Previo</CButton>
            </CCol>
          </CRow>
          </>
        )}
        <CModal 
          backdrop="static"
          visible={vOC}
          onClose={() => setVOC(false)}
          className='c-modal-80'>
          <CModalHeader>
              <CModalTitle id="oc_" className='tCenter'>{TipoCal}</CModalTitle>
          </CModalHeader>
          <CModalBody>
              <CRow className='mt-4 mb-4'>
                <CCol xs={6} md={3}>
                  <CFormInput
                      type="text"
                      label="Remisión"
                      placeholder="0"
                      value={remisionB}
                      disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="No Muestra"
                    placeholder="0"
                    value={TxtNoMuestra}
                    disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Concreto"
                    placeholder="0"
                    value={TxtConcreto}
                    disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Especimen"
                    placeholder="0"
                    disabled
                    value={TxtMEspecimen}
                  />
                </CCol>
              </CRow>
              <CRow className='mt-4 mb-4'>
                <CCol xs={6} md={3}>
                  <CFormInput
                      type="text"
                      label="Carga"
                      placeholder="0"
                      value={TxtMCarga}
                      onChange={hCarga}
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Lado 1"
                    placeholder="0"
                    value={TxtMLado1}
                    onChange={hLado1}
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Lado 2"
                    placeholder="0"
                    value={TxtMLado2}
                    onChange={hLado2}
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Factor"
                    placeholder="0"
                    disabled
                    value={TxtMFactor}
                  />
                </CCol>
              </CRow>
              <CRow className='mt-4 mb-4'>
                <CCol xs={6} md={3}>
                  <CFormInput
                      type="text"
                      label="Altura 1"
                      placeholder="0"
                      value={TxtMAltura1}
                      onChange={hAltura1}
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Altura 2"
                    placeholder="0"
                    value={TxtMAltura2}
                    onChange={hAltura2}
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Masa"
                    placeholder="0"
                    value={TxtMMasa}
                    onChange={hMasa}
                  />
                </CCol>
              </CRow>
          </CModalBody>
          <CModalFooter>
              <CCol xs={4} md={4}></CCol>
              <CCol xs={4} md={2}>
                  <CButton color='primary' onClick={onSaveCal} style={{'color':'white'}} > 
                      <CIcon icon={cilSave} /> {btnG}
                  </CButton>
              </CCol>
              <CCol xs={4} md={2}>
                  <CButton color='danger' onClick={() => setVOC(false)} style={{'color':'white'}} > 
                      <CIcon icon={cilTrash} />   Cerrar
                  </CButton>
              </CCol>
          </CModalFooter>
        </CModal>
        <CModal 
          backdrop="static"
          visible={vOCil}
          onClose={() => setVOCil(false)}
          className='c-modal-80'>
          <CModalHeader>
              <CModalTitle id="oc_" className='tCenter'>{TipoCal}</CModalTitle>
          </CModalHeader>
          <CModalBody>
              <CRow className='mt-4 mb-4'>
                <CCol xs={6} md={3}>
                  <CFormInput
                      type="text"
                      label="Remisión"
                      placeholder="0"
                      value={remisionB}
                      disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="No Muestra"
                    placeholder="0"
                    value={TxtNoMuestra}
                    disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Concreto"
                    placeholder="0"
                    value={TxtConcreto}
                    disabled
                  />
                </CCol>
                <CCol xs={6} md={3}>
                  <CFormInput
                    type="text"
                    label="Especimen"
                    placeholder="0"
                    disabled
                    value={TxtMEspecimen}
                  />
                </CCol>
              </CRow>
              <CRow className='mt-4 mb-4'>
                <CCol xs={6} md={3}>
                  <CFormInput
                      type="text"
                      label="Carga"
                      placeholder="0"
                      value={TxtMCarga}
                      onChange={hCarga}
                  />
                </CCol>
                <CCol xs={6} md={2}>
                  <CFormInput
                    type="text"
                    label="Diametro 1"
                    placeholder="0"
                    value={TxtMDiametro1}
                    onChange={hLado1}
                  />
                </CCol>
                <CCol xs={6} md={2}>
                  <CFormInput
                    type="text"
                    label="Diametro 2"
                    placeholder="0"
                    value={TxtMDiametro2}
                    onChange={hLado2}
                  />
                </CCol>
                <CCol xs={6} md={2}>
                  <CFormInput
                      type="text"
                      label="Altura 1"
                      placeholder="0"
                      value={TxtMAltura1}
                      onChange={hAltura1}
                  />
                </CCol>
                <CCol xs={6} md={2}>
                  <CFormInput
                    type="text"
                    label="Altura 2"
                    placeholder="0"
                    value={TxtMAltura2}
                    onChange={hAltura2}
                  />
                </CCol>
              </CRow>
          </CModalBody>
          <CModalFooter>
              <CCol xs={4} md={4}></CCol>
              <CCol xs={4} md={2}>
                  <CButton color='primary' onClick={onSaveCal} style={{'color':'white'}} > 
                      <CIcon icon={cilSave} /> {btnG}
                  </CButton>
              </CCol>
              <CCol xs={4} md={2}>
                  <CButton color='danger' onClick={() => setVOCil(false)} style={{'color':'white'}} > 
                      <CIcon icon={cilTrash} />   Cerrar
                  </CButton>
              </CCol>
          </CModalFooter>
        </CModal>
      </CContainer>
    </>
  );
}

export default CLote;
