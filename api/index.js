// index.js
const geoip = require('geoip-lite');

module.exports = async (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let geo = geoip.lookup(ip);
    let logStr = `IP Address: ${ip}, Geo: ${JSON.stringify(geo)}`;

    let geoJsonStr =  logStr.split('Geo: ')[1];
    let geoObj = JSON.parse(geoJsonStr);
    if(geoObj !== null && geoObj.hasOwnProperty('city') && geoObj.hasOwnProperty('region')) {
        let city = geoObj.city;
        let region = geoObj.region;
        console.log(`<<----- User is from ${city}, ${region}. ----->>`);
    } else {
        console.log('<<----- User\'s location is unknown. ----->>');
    }

    res.send({message: 'This is the root route.'});
};
