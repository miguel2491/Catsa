export function FormatoFca(fca){
    const fcaIni = fca.split('/');
    return fcaIni[0]+"-"+fcaIni[1]+"-"+fcaIni[2];
}