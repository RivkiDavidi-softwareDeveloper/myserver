const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc'; // החלף למפתח שלך

exports.getDistance = async (req, res) => {
    const { originLat, originLng, destLat, destLng } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
        return res.status(400).json({ error: 'חסרים פרמטרים: originLat, originLng, destLat, destLng' });
    }

    const origin = `${originLat},${originLng}`;
    const destination = `${destLat},${destLng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const route = response.data.routes[0];

        if (!route || !route.legs || !route.legs[0]) {
            return res.status(404).json({ error: 'לא נמצאה דרך בין שתי הנקודות' });
        }

        const leg = route.legs[0];

        res.json({
            distanceKm: leg.distance.value / 1000,
            durationMin: leg.duration.value / 60,
            distanceText: leg.distance.text,
            durationText: leg.duration.text,
            originAddress: leg.start_address,
            destinationAddress: leg.end_address
        });
    } catch (error) {
        console.error('שגיאה:', error.message);
        res.status(500).json({ error: 'שגיאה בשירות המרחקים' });
    }
};
