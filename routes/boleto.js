//? GET DATA
const getBarCode = (firstPart, secondPart, thirdPart, fifthPart) => {
  let codeBar = ''
  
  //! Formato do código de barras
  // Código digitável: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
  // Código a ser gerado: AAABXUUUUVVVVVVVVVVCCCCDDDDDDDDDDEEEEEEEEEE

  //? 4 primeiros digitos (AAAB)
  codeBar += firstPart.substring(0, 4);
  
  //? 10º digito (X)
  codeBar += firstPart.substring(9, 10);
  
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


//? VERIFYS
const verifyBilletHasCharacter = (codeBillet) => {
  //! If the codeBillet has any character or special character, replace with @
  //! If the const 'hasCharacter' has an @ on any position, the code is invalid
  const hasCharacter = codeBillet.replace(/[^0-9]/g, '@')
  return hasCharacter.includes('@') ? true : false;
}

const daysPassed = (code) => {
  const numberDays = code.substring(0, 4);
  return parseInt(numberDays);
}

const separateCode = (code) => {
  const firstPart = code.substring(0, 10);
  const secondPart = code.substring(10, 21);
  const thirdPart = code.substring(21, 32);
  const fourthPart = code.substring(32, 33);
  const fifthPart = code.substring(33);

  return { firstPart, secondPart, thirdPart, fourthPart, fifthPart };
}


//? RETURN BILLET RESPONSE
const verifyBillet = (code) => {
  const { firstPart, secondPart, thirdPart, fourthPart, fifthPart } = separateCode(code);
  
  const amount = getAmount(fifthPart);
  const barCode = getBarCode(firstPart, secondPart, thirdPart, fifthPart);
  const expirationData = getExpirationData(fifthPart);
  
  return { barCode, amount, expirationData };
};


module.exports = {
  getBarCode, 
  getAmount, 
  getExpirationData, 
  verifyBilletHasCharacter,
  daysPassed,
  verifyBillet,
  separateCode,
  verifyBillet
};