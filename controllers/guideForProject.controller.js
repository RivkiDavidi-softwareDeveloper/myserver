
const { GuideForProject, StudentForProject, SharerForProject, Student, Sharer } = require('../models');
//שליפה כולל חניכים ומשתתפים
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
            order: [[Student, 'St_Fname', 'ASC'], [Student, 'St_name', 'ASC']]
        });

        const sharers = await SharerForProject.findAll({
            where: { SFP_code_project: projectCode },
            include: [{ model: Sharer }],
            order: [[Sharer, 'Sh_Fname', 'ASC'], [Sharer, 'Sh_name', 'ASC']]
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
            let guidesForProject = await GuideForProject.findAll();
            guidesForProject.sort((a, b) => {
                return a.GFP_name.localeCompare(b.GFP_name);
            });
            res.status(200).json(guidesForProject);
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
/*         const io = req.app.get("socketio");
        io.emit("guides-updated"); // משדר לכל הלקוחות */
        res.status(201).json(guide);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "שגיאה ביצירת מדריך לפרויקט", error });
    }
};

//עדכון
exports.updateGuideForProject = async (req, res) => {
    try {
        const { GFP_code_project, GFP_name, GFP_ID } = req.body;
        const guide = await GuideForProject.findByPk(req.params.id);
        if (!guide) return res.status(404).json({ message: "לא נמצא מדריך לעדכון" });

        await guide.update({ GFP_code_project, GFP_name, GFP_ID });
        const io = req.app.get("socketio");
   /*      io.emit("guides-updated"); // משדר לכל הלקוחות
        res.status(200).json(guide); */
    } catch (error) {
        res.status(500).json({ message: "שגיאה בעדכון מדריך", error });
    }
};
//מחיקה
exports.deleteGuideForProject = async (req, res) => {
    try {
        const guide = await GuideForProject.findByPk(req.params.id);
        if (!guide) return res.status(404).json({ error: "לא נמצא מדריך למחיקה" });

        await guide.destroy();
/*         const io = req.app.get("socketio");
        io.emit("guides-updated"); // משדר לכל הלקוחות */
        res.status(204).json({ message: "נמחק בהצלחה", });
    } catch (error) {
        res.status(500).json({ error: "שגיאה במחיקת מדריך", });
    }
};
