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


//? GET OTHER'S INFO'S
const daysPassed = (code) => parseInt(code.substring(0,4));

const separateCode = (code) => {
  const firstPart = code.substring(0, 12);
  const secondPart = code.substring(12, 24);
  const thirdPart = code.substring(24, 36);
  const fourthPart = code.substring(36, 48);

  // console.log(code);
  // console.log(firstPart, secondPart, thirdPart, fourthPart);
  // console.log(firstPart.length, secondPart.length, thirdPart.length, fourthPart.length);

  return { firstPart, secondPart, thirdPart, fourthPart };
}


//? RETURN BILLET RESPONSE
const checkTicketDealership = (code) => {
  // console.log(code);
  // console.log(code.length);

  // separateCode(code);
  const { firstPart, secondPart, thirdPart, fourthPart } = separateCode(code);
  
  const amount = getAmount(firstPart, secondPart);
  const barCode = getBarCode(firstPart, secondPart, thirdPart, fourthPart);
  // const expirationData = getExpirationData(fifthPart);
  
  // return { barCode, amount, expirationData };
};

module.exports = {
  getBarCode, 
  getAmount, 
  getExpirationData, 
  daysPassed,
  separateCode,
  checkTicketDealership
};