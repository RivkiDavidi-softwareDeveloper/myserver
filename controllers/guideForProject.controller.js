
const { GuideForProject, StudentForProject, SharerForProject, Student, Sharer } = require('../models');

exports.getAllGuidesForProjectWithSudentsAndSharers = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);

        if (projectCode === -1) {
            return res.status(404).json({ error: "לא נמצא" });
        }

        // שליפת כל המדריכים בפרויקט
        const guides = await GuideForProject.findAll({
            where: { GFP_code_project: projectCode },
            order: [['GFP_name', 'ASC']]
        });

        // שליפת כל החניכים והמשתתפים בפרויקט (למיפוי לפי מדריך)

        const students = await StudentForProject.findAll({
            where: { SFP_code_project: projectCode },
            include: [{
                model: Student
            }],
        order: [[Student, 'St_name', 'ASC'], [Student, 'St_Fname', 'ASC']]
        });

        const sharers = await SharerForProject.findAll({
            where: { SFP_code_project: projectCode },
            include: [{ model: Sharer }],
        order: [[Sharer, 'Sh_name', 'ASC'], [Sharer, 'Sh_Fname', 'ASC']]
        });

        // מיפוי מדריכים עם רשימות תואמות של חניכים ומשתתפים
        const result = guides.map(g => {
            const guideStudents = students.filter(s => s.SFP_code_guide === g.GFP_code);
            const guideSharers = sharers.filter(s => s.SFP_code_guide === g.GFP_code);

            return {
                guide: g,
                students: guideStudents,
                sharers: guideSharers
            };
        });

        res.status(200).json(result);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "שגיאה בשליפת מדריכים", error });
    }
};

//שליפה לפי קוד פרויקט
exports.getAllGuidesForProject = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);
        if (projectCode !== -1) {

            let guidesForProject = await GuideForProject.findAll({
                where: { GFP_code_project: projectCode }
            });
            guidesForProject.sort((a, b) => {
                return a.GFP_name.localeCompare(b.GFP_name);
            });
            res.status(200).json(guidesForProject);
        }
        else {
            res.status(404).json({ error: "לא נמצא" });
        }
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת מדריכים", error });
    }
};

//הוספה
exports.createGuideForProject = async (req, res) => {
    try {
        const { GFP_code, ...data } = req.body;
        const guide = await GuideForProject.create(data);
        res.status(201).json(guide);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "שגיאה ביצירת מדריך לפרויקט", error });
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
