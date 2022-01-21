const verifyBilletHasCharacter = (codeBillet) => {
  //! If the codeBillet has any character or special character, replace with @
  //! If the const 'hasCharacter' has an @ on any position, the code is invalid
  const hasCharacter = codeBillet.replace(/[^0-9]/g, '@')
  return hasCharacter.includes('@') ? true : false;
}

const getCodeFederalInstitution = (code) => {
  let codeFederalInstitution = []
  
  for(let i = 0 ; i < 3 ; i++)
    codeFederalInstitution.push(code[i]);

  //!Join all array positions to a string, remove all virgules from string and convert the number to int type
  return codeFederalInstitution.join().replace(/[,]/g, '');
}

const getCoinCode = (code) => {
  let coinCode = [];
  coinCode.push(code[3]);
  
  //! Join all array positions to a string, remove all virgules from string and convert the number to int type
  return coinCode.join().replace(/[,]/g, '');
}

const daysPassed = (code) => {
  let codeDaysPassed = []
  
  for(let i = 33 ; i < 37 ; i++)
  codeDaysPassed.push(code[i]);

  //! Join all array positions to a string, remove all virgules from string and convert the number to int type
  return parseInt(codeDaysPassed.join().replace(/[,]/g, ''));
}

const getExpirationData = (code) => {
  const days = daysPassed(code);

  const expirationData = new Date(1997, 9, 7);
  expirationData.setDate(expirationData.getDate() + days)

  // Substring to return only the data format from the new string
  return JSON.stringify(expirationData).substring(1, 11);
}

const verifyBillet = (code) => {
  const codeFederalInstitution = getCodeFederalInstitution(code);
  const coinCode = getCoinCode(code);
  const expirationData = getExpirationData(code);
  console.log(codeFederalInstitution)
  console.log(coinCode)
  console.log(expirationData)
};

module.exports = { verifyBilletHasCharacter, verifyBillet };