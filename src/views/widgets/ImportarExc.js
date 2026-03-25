import { useRef } from "react"
import { CButton } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilCloudDownload, cilCloudUpload, cilFile } from "@coreui/icons"

const AccionesTabla = ({ onImport, onExport, onPlantilla }) => {

  const fileInputRef = useRef(null)

  const handleImportClick = () => {
    fileInputRef.current.click()
  }

  return (
    <>
      <CButton color="warning" onClick={handleImportClick} className="me-2 cW" style={{color:"white",marginRight:"10px"}}>
        <CIcon icon={cilCloudDownload} className="me-2" />
        Importar
      </CButton>

      <CButton color="danger" onClick={onExport} className="me-2 cW" style={{color:"white",marginRight:"10px"}}>
        <CIcon icon={cilCloudUpload} className="me-2" />
        Exportar
      </CButton>

      <CButton color="success" onClick={onPlantilla} className="me-2 cW" style={{color:"white",marginRight:"10px"}}>
        <CIcon icon={cilFile} className="me-2" />
        Plantilla
      </CButton>

      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={onImport}
        style={{ display: "none" }}
      />
    </>
  )
}

export default AccionesTabla
