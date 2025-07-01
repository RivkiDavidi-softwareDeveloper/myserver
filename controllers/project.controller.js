
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
            where: whereClause,
            order: [['Pr_date', 'DESC']] // מיון יורד לפי תאריך

        }
        );
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
exports.addProject = async (req, res) => {
    try {
        const { Pr_code, ...data } = req.body;
        const newProject = await Project.create(data);
      /*   const io = req.app.get("socketio");
        io.emit("projects-updated"); // משדר לכל הלקוחות */
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// עדכון פרויקט קיים
exports.updateProject = async (req, res) => {
    try {
        const { Pr_code } = req.params;
        const { Pr_name, Pr_content, Pr_description, Pr_Place, Pr_date, Pr_gender } = req.body;

        const project = await Project.findByPk(Pr_code);
        if (!project) return res.status(404).json({ error: "project not found" });
        project.Pr_name = Pr_name;
        project.Pr_content = Pr_content;
        project.Pr_description = Pr_description;
        project.Pr_Place = Pr_Place;
        project.Pr_date = Pr_date;
        project.Pr_gender = Pr_gender;
        await project.save();
        const updatedproject = await Project.findByPk(Pr_code);
      /*   const io = req.app.get("socketio");
        io.emit("projects-updated"); // משדר לכל הלקוחות */
        res.json(updatedproject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating project" });
    }
};


// מחיקת פרויקט
exports.deleteProject = async (req, res) => {
    try {
        const { Pr_code } = req.params;
        const project = await Project.findByPk(Pr_code);
        if (!project) return res.status(404).json({ error: "project not found" });

        await project.destroy();
/*         const io = req.app.get("socketio");
        io.emit("projects-updated"); // משדר לכל הלקוחות */
        res.json({ message: "project deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};
