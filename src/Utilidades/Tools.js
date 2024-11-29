
export const baseUrl="http://apicatsa.catsaconcretos.mx:2543/api/";
export const baseUrl2="http://localhost:2548/api/";

export function FormatoFca(fca){
    const fcaIni = fca.split('/');
    return fcaIni[0]+"-"+fcaIni[1]+"-"+fcaIni[2];
}

export function Fnum(num)
{
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

export function TiempoT(seconds)
{
     // Calcula las horas, minutos y segundos
    const hours = Math.floor(seconds / 3600); // Dividir por 3600 para obtener las horas
    const minutes = Math.floor((seconds % 3600) / 60); // Restar las horas y luego dividir por 60 para los minutos
    const secs = seconds % 60; // Obtener el resto para los segundos

    // Asegúrate de que siempre tenga 2 dígitos (por ejemplo, "05" en lugar de "5")
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return formattedTime;
}


