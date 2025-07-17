const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc'; // החלף למפתח שלך

exports.getDistance = async (req, res) => {
    const { originLat, originLng, destLat, destLng } = req.query;
    console.log("originLat" + originLat)
    console.log("originLng" + originLng)
    console.log("destLat" + destLat)
    console.log("destLng" + destLng)

    if (!originLat || !originLng || !destLat || !destLng) {
        return res.status(400).json({ error: 'חסרים פרמטרים: originLat, originLng, destLat, destLng' });
    }
    const origin = `${originLat},${originLng}`;
    const destination = `${destLat},${destLng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const route = response.data.routes[0];
        console.log(route)
        console.log(route.legs[0] + "legs[0]")

        if (!route || !route.legs || !route.legs[0]) {
            //  return res.status(404).json({ error: 'לא נמצאה דרך בין שתי הנקודות' });
            return res.json({
                distanceKm: (0).toString(),
                durationMin: (0).toString(),
                distanceText: ("").toString(),
                durationText: ("").toString(),
                originAddress: ("").toString(),
                destinationAddress: ("").toString()
            });
        }

        const leg = route.legs[0];
        res.json({
            distanceKm: leg.distance.value / 1000,
            durationMin: leg.duration.value / 60,
            distanceText: leg.distance.text,
            durationText: leg.duration.text,
            originAddress:await translateAddressToHebrew(leg.start_address) ,
            destinationAddress:await translateAddressToHebrew(leg.end_address) 
        });
    } catch (error) {
        console.error('שגיאה:', error.message);
        res.status(500).json({ error: 'שגיאה בשירות המרחקים' });
    }
};

// translate-address.js
async function translateAddressToHebrew(address) {
    // const apiKey = 'YOUR_GOOGLE_API_KEY'; // הכנס מפתח תקף
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&language=iw&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;
        if (results.length > 0) {
            return results[0].formatted_address;
        } else {
            return null;
        }
    } catch (err) {
        console.error('שגיאה מה-API של גוגל:', err.message);
        return null;
    }
}



