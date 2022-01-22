require('dotenv').config();
const port = process.env.PORT || 3000;
const app = require('../config/app');

const { verifyBilletHasCharacter, verifyBillet } = require('../routes/boleto');


app.get('/boleto/:code', (req, res) => {
  const { code } = req.params;

  const codeBillet = verifyBilletHasCharacter(code);

  if(!codeBillet) {  //! If codeBillet is 'false' it has only numbers
    
    if(code.length === 47) {  //? Boleto Financeiro
      try {
        const { barCode, amount, expirationData } = verifyBillet(code);
        
        res.status(200).send({
          barCode: barCode, 
          amount: amount, 
          expirationData: expirationData
        });
      }
      catch (err) {
        console.log(err);
        res.status(400).send({error: 'Código inválido'});
      }
    }
    else if(code.length === 48) {  //? Boleto de concessionária

    }
    else {
      res.status(404).send({status: 'Código de boleto inválido'});
    }
  }

  else 
    res.status(404).send({status: 'Código de boleto inválido'});

});


app.get('/', (req, res) => {
  res.status(200).send({status: 'Tudo ok!'})
});


app.listen(port, () => 
  console.log(`Executando na porta ${port}`)
);