
const { Project, TypeGender } = require("../models");


// שליפת כל הפרויקטים עם סינון לפי gender
exports.getAllProjects = async (req, res) => {
    try {
        const { genderF, valueSearch } = req.query;
        const genderFilter = Number(genderF);
        const searchValue = valueSearch ? valueSearch.toLowerCase() : null;

        let whereClause = {};
        if (genderFilter === 1) {
            whereClause.Pr_gender = 1;
        } else if (genderFilter === 2) {
            whereClause.Pr_gender = 2;
        }

        let projects = await Project.findAll({
            where: whereClause
        });
        // סינון לפי טקסט
        if (searchValue) {
            projects = projects.filter(p =>
                p.Pr_name.toLowerCase().includes(searchValue) ||
                p.Pr_content.toLowerCase().includes(searchValue) ||
                p.Pr_description.toLowerCase().includes(searchValue) 

            );
        }

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// שליפת פרויקט לפי קוד
exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByPk(id, {
            include: [{ model: TypeGender }]
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// יצירת פרויקט חדש
exports.createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// עדכון פרויקט קיים
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Project.update(req.body, {
            where: { Pr_code: id }
        });
        if (updated) {
            const updatedProject = await Project.findByPk(id);
            return res.json(updatedProject);
        }
        res.status(404).json({ message: "Project not found" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// מחיקת פרויקט
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Project.destroy({
            where: { Pr_code: id }
        });
        if (deleted) {
            return res.json({ message: "Project deleted" });
        }
        res.status(404).json({ message: "Project not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
