const { City } = require("../models");

// שליפת כל הערים
exports.getAllCities = async (req, res) => {

    try {
        const cities = await City.findAll();
        cities.sort((a, b) => {
            return a.Ci_name.localeCompare(b.Ci_name);
        });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: "Error fetching cities"});
    }
};

// הוספת עיר חדשה
exports.addCity = async (req, res) => {
    try {
        const city = await City.create(req.body);
        res.status(201).json(city);
    } catch (error) {
        res.status(500).json({ error: "Error adding city" });
    }
};

// עדכון שם עיר
exports.updateCity = async (req, res) => {
    try {
        const { Ci_code } = req.params;
        const { Ci_name } = req.body;

        const city = await City.findByPk(Ci_code);
        if (!city) return res.status(404).json({ error: "City not found" });

        city.Ci_name = Ci_name;
        await city.save();

        res.json(city);
    } catch (error) {
        res.status(500).json({ error: "Error updating city" });
    }
};

// מחיקת עיר
exports.deleteCity = async (req, res) => {
    try {
        const { Ci_code } = req.params;
        const city = await City.findByPk(Ci_code);
        if (!city) return res.status(404).json({ error: "City not found" });

        await city.destroy();
        res.json({ message: "city deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting city" });
    }
};
