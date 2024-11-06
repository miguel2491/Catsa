import React, {useImperativeHandle, forwardRef, useState} from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";
import {FormatoFca} from '../../../Utilidades/Tools.js'

import {
  CContainer,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'

import {CIcon} from '@coreui/icons-react'
import { cilLoopCircular, cilSearch } from '@coreui/icons'

const cookies = new Cookies();
const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl2="http://localhost:2548/api/";

const ResSalidasD = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [visible, setVisible] = useState(false)

    const getSalidasD = () => {
        setSalidasD(props.planta, props.fechaI, props.fechaF);
        // Aquí puedes añadir la lógica que necesites
    };
    useImperativeHandle(ref, () => ({
        getSalidasD,
    }));
    async function setSalidasD(planta, FI, FF) {
        try
        {
            let confi_ax = {
                headers:
                {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer "+cookies.get('token'),
                },
            };
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            console.log(FI);
            const fcaI = FormatoFca(FI);
            const fcaF = FormatoFca(FF);
            //------------------------------------------------------------------------------------------------------------------------------------------------------
            const response = await axios.get(baseUrl2+'Operaciones/GetResumen/'+planta+','+fcaI+','+fcaF+',SD', confi_ax);
            var obj =  response.data[0].Rows;
            //console.log(obj);           
        } 
        catch(error)
        {
            console.log(error);
        }finally{
           
        }
    }
    return (
        <>
            <CContainer fluid>
                <h2>Resumen Salidas Diversas</h2>
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
            </CContainer>
        </>
    );
});
export default ResSalidasD