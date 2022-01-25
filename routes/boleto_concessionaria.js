//? UTILS FUNCTIONS
const multiplyValues = (arr, weigths) => arr.map((value, i) => parseInt(value) * weigths[i] );

const sumValues = (array) => {
  let contador = 0;
  for (let i in array) {
    if(array[i] >= 10) {
      const stringValue = `${array[i]}`.split('');
      const newValue = stringValue.reduce((acc, value) => parseInt(acc) + parseInt(value));
      contador += newValue
    }
    else {
      contador += parseInt(array[i]);
    }
  }

  return contador;
}


//? GET DATA
const getBarCode = (firstPart, secondPart, thirdPart, fourthPart) => {
  //! Formato do código de barras
  //? Código digitável: AAAAA.AAAAAX BBBBB.BBBBBY CCCCC.CCCCCZ DDDDD.DDDDDß
  //? Código a ser gerado: AAAAAAAAAABBBBBBBBBBCCCCCCCCCCDDDDDDDDDD
  
  //? primeira parte (AAAAA.AAAAA)
  let codeBar = firstPart.substring(0, 11);
  
  //? segunda parte (BBBBB.BBBBB)
  codeBar += secondPart.substring(0, 11);
  
  //? terceira parte sem o DV (CCCCC.CCCCC)
  codeBar += thirdPart.substring(0, 11);
  
  //? quarta parte sem o DV (DDDDD.DDDDD)
  codeBar += fourthPart.substring(0, 11);

  return codeBar;
}

const getAmount = (part1, part2) => {
  const value = parseFloat(
    part1.substring(4, 11) 
      +
    part2.substring(0, 2));

  const cents = parseFloat(part2.substring(2, 4)) / 100;

  const amount = value + cents

  // console.log(amount);
  
  return String(amount);
}

const getExpirationData = (code) => {
  // const days = daysPassed(code);

  // const expirationData = new Date(1997, 9, 7);
  // expirationData.setDate(expirationData.getDate() + days)

  // // Substring to return only the data format from the new string
  // return JSON.stringify(expirationData).substring(1, 11);
}

const getDv = (rest) => {
  if (rest === 1 || rest === 0) {
    return 0;
  }
  else {
    return 11 - rest;
  }
}


//? FUNCIONALITIES
const validateDacsMod10 = (part1, part2, part3, part4) => {
  const dacPart1 = parseInt(part1.pop());
  const dacPart2 = parseInt(part2.pop());
  const dacPart3 = parseInt(part3.pop());
  const dacPart4 = parseInt(part4.pop());

  const weights = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

  const multipliedValuesPart1 = multiplyValues(part1, weights);
  const multipliedValuesPart2 = multiplyValues(part2, weights);
  const multipliedValuesPart3 = multiplyValues(part3, weights);
  const multipliedValuesPart4 = multiplyValues(part4, weights);

  const summedValuesPart1 = sumValues(multipliedValuesPart1);
  const summedValuesPart2 = sumValues(multipliedValuesPart2);
  const summedValuesPart3 = sumValues(multipliedValuesPart3);
  const summedValuesPart4 = sumValues(multipliedValuesPart4);

  const rest1 = summedValuesPart1 % 10;
  const rest2 = summedValuesPart2 % 10;
  const rest3 = summedValuesPart3 % 10;
  const rest4 = summedValuesPart4 % 10;

  const DAC1 = 10 - rest1;
  const DAC2 = 10 - rest2;
  const DAC3 = 10 - rest3;
  const DAC4 = 10 - rest4;
  
  const isDac1Validated = DAC1 === dacPart1
  const isDac2Validated = DAC2 === dacPart2
  const isDac3Validated = DAC3 === dacPart3
  const isDac4Validated = DAC4 === dacPart4

  return (isDac1Validated && isDac2Validated && isDac3Validated && isDac4Validated) ? true : false;
}

const validateDacsMod11 = (part1, part2, part3, part4) => {
  const dacPart1 = parseInt(part1.pop());
  const dacPart2 = parseInt(part2.pop());
  const dacPart3 = parseInt(part3.pop());
  const dacPart4 = parseInt(part4.pop());

  const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const multipliedValuesPart1 = multiplyValues(part1, weights);

  const multipliedValuesPart2 = multiplyValues(part2, weights);
  const multipliedValuesPart3 = multiplyValues(part3, weights);
  const multipliedValuesPart4 = multiplyValues(part4, weights);

  const summedValuesPart1 = multipliedValuesPart1.reduce((acc, value) => parseInt(acc) + parseInt(value));
  const summedValuesPart2 = multipliedValuesPart2.reduce((acc, value) => parseInt(acc) + parseInt(value));
  const summedValuesPart3 = multipliedValuesPart3.reduce((acc, value) => parseInt(acc) + parseInt(value));
  const summedValuesPart4 = multipliedValuesPart4.reduce((acc, value) => parseInt(acc) + parseInt(value));

  const rest1 = summedValuesPart1 % 11;
  const rest2 = summedValuesPart2 % 11;
  const rest3 = summedValuesPart3 % 11;
  const rest4 = summedValuesPart4 % 11;

  const DAC1 = getDv(rest1);
  const DAC2 = getDv(rest2);
  const DAC3 = getDv(rest3);
  const DAC4 = getDv(rest4);
  
  const isDac1Validated = DAC1 === dacPart1
  const isDac2Validated = DAC2 === dacPart2
  const isDac3Validated = DAC3 === dacPart3
  const isDac4Validated = DAC4 === dacPart4

  return (isDac1Validated && isDac2Validated && isDac3Validated && isDac4Validated) ? true : false;
}

const verifyDvMode10 = (barCode) => {
  const weights = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
  
  const codeDvGeral = parseInt(barCode.splice(3, 1));
  
  const multipliedValues = multiplyValues(barCode, weights);
  
  const summedValues = sumValues(multipliedValues);
  
  const rest = summedValues % 10;
  
  const DvGeral = 10 - rest;
  
  return (DvGeral === codeDvGeral) ? true : false;
}

const verifyDvMode11 = (barCode) => {
  const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  const codeDvGeral = parseInt(barCode.splice(3, 1)); //? pega o dac para verificar se está igual ao valor calculado
  
  const multipliedValues = multiplyValues(barCode, weights);
  
  const allValuesSummed = multipliedValues.reduce((acc, value) => parseInt(acc) + parseInt(value));
  
  const restBy11 = allValuesSummed % 11;
  
  let dvGeral = getDv(restBy11);
  
  return dvGeral === codeDvGeral ? true : false;
}

const removeDVs = (code) => {
  code.splice(11, 1);
  code.splice(22, 1);
  code.splice(33, 1);
  code.splice(44, 1);

  return code;
}


//? GET OTHER'S INFO'S
const daysPassed = (code) => parseInt(code.substring(0,4));

const separateCode = (code) => {
  const firstPart = code.substring(0, 12);
  const secondPart = code.substring(12, 24);
  const thirdPart = code.substring(24, 36);
  const fourthPart = code.substring(36, 48);

  return { firstPart, secondPart, thirdPart, fourthPart };
}


//? RETURN BILLET RESPONSE
const checkTicketDealership = (code) => {
  const { firstPart, secondPart, thirdPart, fourthPart } = separateCode(code);

  const mode = firstPart[2];

  //! Módulo 10
  if(mode === '6' || mode === '7') {
    console.log('mode 10');

    const isDacsValidated = validateDacsMod10(firstPart.split(''), secondPart.split(''), thirdPart.split(''), fourthPart.split(''));
    const isDvValidated = verifyDvMode10( removeDVs(code.split('')) );

    if (isDacsValidated && isDvValidated) {
      const barCode = getBarCode(firstPart, secondPart, thirdPart, fourthPart);
      const amount = getAmount(firstPart, secondPart);
      
      return {
        barCode,
        amount,
        expirationData: ' '
      }
    }
    else {
      return {};
    }
  }
  
  //! Módulo 11
  else if (mode === '8' || mode === '9') {
    console.log('mode 11');

    const isDacsValidated = validateDacsMod11(firstPart.split(''), secondPart.split(''), thirdPart.split(''), fourthPart.split(''));
    const isDvValidated = verifyDvMode11( removeDVs(code.split('')) );
    
    if (isDacsValidated && isDvValidated) {
      const barCode = getBarCode(firstPart, secondPart, thirdPart, fourthPart);
      const amount = getAmount(firstPart, secondPart);

      return {
        barCode,
        amount,
        expirationData: ' '
      }
    }
  }

  else {
    return {};
  }
};


module.exports = {
  getBarCode, 
  getAmount, 
  getExpirationData, 
  daysPassed,
  separateCode,
  checkTicketDealership
};