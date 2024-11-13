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