import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop } from '@coreui/icons'
import {GetCotizacionesR} from '../../Utilidades/Funciones'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const navigate = useNavigate();
  const [tCotizacionA, setTotalA] = useState(0);
  const [tCotizacionCA, setTotalCA] = useState(0);
  const [tCotizacionP, setTotalCP] = useState(0);
  const [tCotizacionPRO, setTotalCPRO] = useState(0);
  const [tCotizacionPER, setTotalCPER] = useState(0);
  const [tCotizacionNEG, setTotalCNEG] = useState(0);


  //ChartDataD
  const [chartDataD, setChartDataD] = useState({
      labels: [],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'transparent',
          borderColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
          data: [],
        },
      ],
  })
  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
    getCotizaciones_();
  }, [widgetChartRef1, widgetChartRef2])

  const getCotizaciones_ = async() =>
  {
    try
    {
      //------------------------------------------------------------------------------------------------------------------------------------------------------
      const ocList = await GetCotizacionesR();
      if(ocList){
        const obj = ocList;
        const labels = [];
        const dataSet = [];
        var totalA = 0;
        var totalCA = 0;
        var totalP = 0;// TOTAL PEDIDOS
        var totalP = 0;
        var totalPROS = 0;
        var totalN = 0;
        var totalPR = 0;
        obj.forEach(item => {
          totalA += item.TA;
          totalCA+=item.TCA;
          totalP += item.TC;
          totalPROS += item.TP;
          totalN += item.TN;
          totalPR += item.TPRD;
          labels.push(item.Planta);
          dataSet.push(item.TC);
        });
        setTotalA(totalA);
        setTotalCA(totalCA);
        setTotalCP(totalP);
        setTotalCPRO(totalPROS);
        setTotalCPER(totalPR);
        setTotalCNEG(totalN);
        // Actualiza el estado con los nuevos datos
        setChartDataD({
          labels: labels,
          datasets: [
            {
              data: dataSet,
              backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB','#042940','#005C53'],
            },
          ],
        });
      }
    }
    catch(error)
    {
      console.log(error);
    }finally{

    }
  }
  const navVCot = () => {
    navigate('/reportes/RCotizaciones');
  }


  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={12} xl={12} xxl={12}>
        <CWidgetStatsA
          onClick={navVCot}
          color="primary"
          value={
            <>
              {tCotizacionP} Cotizaciones{' '}
              <span className="fs-6 fw-normal">
                ({tCotizacionA} Aceptadas <CIcon icon={cilArrowTop} />)
              </span>
              <span className="fs-6 fw-normal">
                ({tCotizacionCA} Canceladas <CIcon icon={cilArrowBottom} />)
              </span>
              <span className="fs-6 fw-normal">
                ({tCotizacionPRO} Prospectos <CIcon icon={cilArrowBottom} />)
              </span>
              <span className="fs-6 fw-normal">
                ({tCotizacionPER} Perdidas <CIcon icon={cilArrowBottom} />)
              </span>
              <span className="fs-6 fw-normal">
                ({tCotizacionNEG} Negociando <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Cotizaciones al mes en curso"
          chart={
            <CChart
              type='pie'
              ref={widgetChartRef1}
              className="mt-2 mx-2"
              style={{ height: '70px' }}
              data={chartDataD}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
