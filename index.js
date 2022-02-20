const express = require('express');
const app = express();

require('dotenv').config()

const port = process.env.PORT || 3000;

////// Configuracion de cors
const cors = require('cors');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

/////////////////////////////////////////////
const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

// Solicitar telefono
app.get('/number', (req, res) => 
{
    if (req.query.phonenumber) 
    {

       client
       .verify
       .services(process.env.SERVICEID)
       .verifications
       .create({
           to: `+${req.query.phonenumber}`,
           channel: 'sms'
       })
       .then(data => {
           res.status(200).send({
               message: "Verification code sent.",
               phonenumber: req.query.phonenumber,
               data
           })
       }) 

    } else {
       res.status(400).send({
           message: "Error in the phone number.",
           phonenumber: req.query.phonenumber,
           data
       })
    }
})

// Verificar codigo recibido
app.get('/verify', (req, res) => {

    if (req.query.phonenumber) 
    {    

        client
        .verify
        .services(process.env.SERVICEID)
        .verificationChecks
        .create({
            to: `+${req.query.phonenumber}`,
            code: req.query.code
        })
        .then(data => {
            res.status(200).send({data})
        })

    } else {
        res.status(400).send({
            message: "Error in the phone number or code.",
            phonenumber: req.query.phonenumber,
            data
        })
     }

})

////////////////////////////////
app.get('/', (req, res) => {
    res.send('Verificación de teléfono con Twilio.')
})


////////////////////////////////
app.listen(port, () => {
    console.log('El servidor esta corriendo en:', port)
})