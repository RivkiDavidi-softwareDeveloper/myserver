
const db = require("../models");
const GuideForProject = db.GuideForProject;
//הוספה
exports.createGuideForProject = async (req, res) => {
    try {
        const { GFP_code_project, GFP_name } = req.body;

        if (!GFP_code_project) {
            return res.status(400).json({ message: "חובה לציין קוד פרויקט" });
        }

        const guide = await GuideForProject.create({ GFP_code_project, GFP_name });
        res.status(201).json(guide);
    } catch (error) {
        res.status(500).json({ message: "שגיאה ביצירת מדריך לפרויקט", error });
    }
};
//שליפה לפי קוד פרויקט
exports.getAllGuidesForProject = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);
        if (projectCode !== -1) {

            let studentsForProject = await StudentForProject.findAll({
                where: { SFP_code_project: projectCode },
                include: [

                    { model: Student },
                    { model: GuideForProject }
                ]
            });
            studentsForProject.sort((a, b) => {
                return a.Student.St_name.localeCompare(b.Student.St_name);
            });
            res.json(studentsForProject);
        }
        else{
         res.status(404).json({ error: "לא נמצא" });

        }

        
        const guides = await GuideForProject.findAll();
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת מדריכים", error });
    }
};
exports.getAllStudentForProjects = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};
//שליפה
exports.getAllGuidesForProject = async (req, res) => {
    try {
        const guides = await GuideForProject.findAll();
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת מדריכים", error });
    }
};

//עדכון
exports.updateGuideForProject = async (req, res) => {
    try {
        const { GFP_code_project, GFP_name } = req.body;
        const guide = await GuideForProject.findByPk(req.params.id);
        if (!guide) return res.status(404).json({ message: "לא נמצא מדריך לעדכון" });

        await guide.update({ GFP_code_project, GFP_name });
        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בעדכון מדריך", error });
    }
};
//מחיקה
exports.deleteGuideForProject = async (req, res) => {
    try {
        const guide = await GuideForProject.findByPk(req.params.id);
        if (!guide) return res.status(404).json({ message: "לא נמצא מדריך למחיקה" });

        await guide.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "שגיאה במחיקת מדריך", error });
    }
};
