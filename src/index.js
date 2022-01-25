require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('../config/app');

const { verifyBilletHasCharacter, checkBankSlip } = require('../routes/boleto_bancario');
const { checkTicketDealership } = require('../routes/boleto_concessionaria');


app.get('/boleto/:code', (req, res) => {
  const { code } = req.params;

  const codeBillet = verifyBilletHasCharacter(code);

  if(!codeBillet) {  //? If codeBillet is 'false' it has only numbers

  //------------------------------------------------------------------------------------------------------
  //******************************************************************************************************
  //------------------------------------------------------------------------------------------------------
    if(code.length === 47) {  //? financial slip
      try {
        const { barCode, amount, expirationData } = checkBankSlip(code);
        
        if(!barCode || !amount || !expirationData) {
          res.status(400).send({error: 'Código inválido'});
        }
        else {
          res.status(200).send({
            barCode: barCode, 
            amount: amount, 
            expirationData: expirationData
          });
        }
      }
      catch (err) {
        console.log(err);
        res.status(400).send({error: 'Código inválido'});
      }
    }

  //------------------------------------------------------------------------------------------------------
  //******************************************************************************************************
  //------------------------------------------------------------------------------------------------------
    else if (code.length === 48) {  //? ticket dealer
      try {
        const { barCode, amount, expirationData } = checkTicketDealership(code);
  
        if(!barCode || !amount) {
          res.status(400).send({error: 'Código inválido'});
        }
        else {
          res.status(200).send({
            barCode: barCode, 
            amount: amount, 
            expirationData: expirationData
          });
        }
      }
      catch (e) {
        console.log('error:', e);
        res.status(500).send({error: 'Algo de errado aconteceu, tente novamente!'});
      }
    }

    else {
      res.status(400).send({status: 'Tamanho do boleto inválido'});
    }
  }

  else 
    res.status(400).send({status: 'Código de boleto inválido, digite apenas números'});

});


app.get('/', (req, res) => res.status(200).send({status: 'Tudo ok!'}) );

app.listen(port, () => console.log(`Executando na porta ${port}`) );