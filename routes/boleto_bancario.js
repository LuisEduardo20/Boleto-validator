//? UTILS FUNCTIONS
const multiplyValues = (arr, weigths) => arr.map((value, i) => parseInt(value) * weigths[i] );

const sumValues = (arr) => {
  return arr.reduce((acumulator, value) => {
    if(value >= 10) {
      const stringValue = `${value}`.split('');
      const newValue = stringValue.reduce((acc, value) => parseInt(acc) + parseInt(value));

      return acumulator + newValue;
    }

    else
      return acumulator + value
  });
}


//? GET DATA
const getBarCode = (firstPart, secondPart, thirdPart, fourthPart, fifthPart) => {
  let codeBar = ''
  
  //! Formato do código de barras
  // Código digitável: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
  // Código a ser gerado: AAABXUUUUVVVVVVVVVVCCCCDDDDDDDDDDEEEEEEEEEE

  //? 4 primeiros digitos (AAAB)
  codeBar += firstPart.substring(0, 4);
  
  //? digito verificador geral (K)
  codeBar += fourthPart;
  
  //? digitos de vencimento e valor do documento (UUUUVVVVVVVVVV)
  codeBar += fifthPart;
  
  //? restante da primeira parte (C.CCCC)
  codeBar += firstPart.substring(4, 9);

  //? campo 2 sem o DV (DDDDD.DDDDD)
  codeBar += secondPart.substring(0, 10);
  
  //? campo 3 sem o DV (EEEEE.EEEEE)
  codeBar += thirdPart.substring(0, 10);
  
  return codeBar;
}

const getAmount = (code) => {
  let amount = parseFloat(code.substring(4));
  amount = (amount / 100.00).toFixed(2);
  
  return String(amount);
}

const getExpirationData = (code) => {
  const days = daysPassed(code);

  const expirationData = new Date(1997, 9, 7);
  expirationData.setDate(expirationData.getDate() + days)

  // Substring to return only the data format from the new string
  return JSON.stringify(expirationData).substring(1, 11);
}

const getDV = (addedValue, rest) => {
  //TODO achar o valor da próxima dezena
  const nextTen = (addedValue / 10).toFixed(0)  * 10 + 10;
  // console.log('proxima dezena:', nextTen);

  //TODO subtrair pelo resto da disivisão
  const value = nextTen - rest;
  // console.log(value);

  //TODO excluir a dezena e pegar a unidade
  const DV = parseInt(`${value}`.split('').pop());

  return DV;
}

const getDvModule11 = (rest) => {
  const DV = 11 - rest

  if(DV === 0 || DV === 10 || DV === 11)
    return 1

  else
    return DV;
}


//? VERIFYS
const verifyModule10 = (part1, part2, part3) => {
  const weigths = {
    part1: [2, 1, 2, 1, 2, 1, 2, 1, 2],
    part2: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    part3: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
  }

  //? Remove os DV do código para comparar depois
  const codeDV1 = parseInt(part1.pop());
  const codeDV2 = parseInt(part2.pop());
  const codeDV3 = parseInt(part3.pop());

  const part1Multiplied = multiplyValues(part1, weigths.part1); //? multiplicar cada posição de acordo com seu peso
  const part2Multiplied = multiplyValues(part2, weigths.part2);
  const part3Multiplied = multiplyValues(part3, weigths.part3);
  
  const part1Summed = sumValues(part1Multiplied); //? somar todas as posições
  const part2Summed = sumValues(part2Multiplied);
  const part3Summed = sumValues(part3Multiplied);

  const part1Divided = part1Summed % 10; //? divide all values from 10
  const part2Divided = part2Summed % 10;
  const part3Divided = part3Summed % 10;
  
  const DV1 = getDV(part1Summed, part1Divided); //? subtrair o resto da divisão com a próxima dezena
  const DV2 = getDV(part2Summed, part2Divided);
  const DV3 = getDV(part3Summed, part3Divided);

  if (DV1 === codeDV1 && DV2 === codeDV2 && DV3 === codeDV3){
    return true;
  }
  else {
    return false;
  }
}

const verifyModule11 = (barCode) => {
  const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const codeDvGeral = parseInt(barCode.splice(4, 1));

  const multipliedNumbers = barCode.map((value, i) => parseInt(value) * weights[i] );

  const allValuesSummed = multipliedNumbers.reduce((acc, value) => parseInt(acc) + parseInt(value));

  const restBy11 = allValuesSummed % 11;


  let dvGeral = getDvModule11(restBy11);

  return dvGeral === codeDvGeral ? true : false;
}

const verifyBilletHasCharacter = (codeBillet) => {
  //! If the codeBillet has any character or special character, replace with @
  //! If the const 'hasCharacter' has an @ on any position, the code is invalid
  const hasCharacter = codeBillet.replace(/[^0-9]/g, '@')
  return hasCharacter.includes('@') ? true : false;
}

const separateCode = (code) => {
  const firstPart = code.substring(0, 10);
  const secondPart = code.substring(10, 21);
  const thirdPart = code.substring(21, 32);
  const fourthPart = code.substring(32, 33);
  const fifthPart = code.substring(33);
  
  return { firstPart, secondPart, thirdPart, fourthPart, fifthPart };
}

const daysPassed = (code) => parseInt(code.substring(0,4));


//? RETURN BILLET RESPONSE
const checkBankSlip = (code) => {
  const { firstPart, secondPart, thirdPart, fourthPart, fifthPart } = separateCode(code);
  
  const module10 = verifyModule10(firstPart.split(''), secondPart.split(''), thirdPart.split(''));
  
  if (module10) {
    const amount = getAmount(fifthPart);
    const barCode = getBarCode(firstPart, secondPart, thirdPart, fourthPart, fifthPart);
    const expirationData = getExpirationData(fifthPart);
    
    const module11 = verifyModule11(barCode.split(''));

    return module11 ? { barCode, amount, expirationData } : {};
  }
  else {
    return {};
  }

};


module.exports = {
  getBarCode, 
  getAmount, 
  getExpirationData, 
  verifyBilletHasCharacter,
  daysPassed,
  separateCode,
  checkBankSlip
};