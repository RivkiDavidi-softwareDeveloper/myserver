// controllers/community.controller.js

const { Community } = require("../models");

// שליפת כל הקהילות
exports.getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.findAll();
        communities.sort((a, b) => {
            return a.Com_name.localeCompare(b.Com_name);
        });
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: "Error fetching communities" });
    }
};


// הוספת קהילה חדשה
exports.addCommunity = async (req, res) => {
    try {
         const { Com_code, ...data } = req.body; 
        const community = await Community.create(data);
        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error adding community" });
    }
};

// עדכון שם קהילה
exports.updateCommunity = async (req, res) => {
    try {
        const { Com_code } = req.params;
        const { Com_name } = req.body;

        const community = await Community.findByPk(Com_code);
        if (!community) return res.status(404).json({ error: "Community not found" });

        community.Com_name = Com_name;
        await community.save();

        res.json(community);
    } catch (error) {
        res.status(500).json({ error: "Error updating community" });
    }
};

// מחיקת קהילה
exports.deleteCommunity = async (req, res) => {
    try {
        const { Com_code } = req.params;
        const community = await Community.findByPk(Com_code);
        if (!community) return res.status(404).json({ error: "Community not found" });

        await community.destroy();
        res.json({ message: "Community deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting community" });
    }
};
