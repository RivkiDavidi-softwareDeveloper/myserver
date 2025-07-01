const { literal } = require("sequelize");
const { SharerForProject, Project, Sharer, GuideForProject, StudiesForSharer, Parent, City } = require("../models");
const { clean } = require('../utils/cleaner');
const fs = require('fs');
const path = require('path');
const XLSX = require("xlsx");
const { Op, Sequelize, DATE } = require('sequelize');

// שליפה של כל השורות
exports.getAllSharerForProjects = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);
        if (projectCode !== -1) {

            let SharersForProject = await SharerForProject.findAll({
                where: { SFP_code_project: projectCode },
                include: [

                    { model: Sharer },
                    { model: GuideForProject }
                ]
            });
            SharersForProject.sort((a, b) => {
                return a.Sharer.Sh_name.localeCompare(b.Sharer.Sh_name);
            });
            res.json(SharersForProject);
        }
        else {
            res.status(404).json({ error: "לא נמצא" });

        }

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};
// שליפה של כל הפרויקטים למשתתף
exports.getAllProjectsForSharer = async (req, res) => {
    try {
        const { codeSharer } = req.query;
        const SharerCode = Number(codeSharer);
        if (SharerCode !== -1) {

            let sharerForProject = await SharerForProject.findAll({
                where: { SFP_code_Sharer: SharerCode },
                include: [

                    { model: Sharer },
                    { model: Project },

                    { model: GuideForProject }
                ]
            });
            sharerForProject.sort((a, b) => {
                return b.Project.Pr_date.localeCompare(a.Project.Pr_date);
            });
            res.json(sharerForProject);
        }
        else {
            res.status(404).json({ error: "לא נמצא" });

        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};
//העלאת קובץ אקסל משתתפים
exports.importFromExcel = async (req, res) => {
    const t = await Sharer.sequelize.transaction();

    try {
        if (!req.file) {
            return res.status(400).json({ message: "לא נשלח קובץ" });
        }
        const { codeProject } = req.params;

        const imageDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
        /*         const filePath = path.join(imageDir, `${req.file.originalname}.xlsx`);
                fs.writeFileSync(filePath, req.file.buffer);
                const workbook = XLSX.readFile(filePath);
        
                const filePath = path.join(imageDir, `${req.file.originalname}.xlsx`);
                fs.writeFileSync(filePath, req.file.buffer);
                const workbook = XLSX.readFile(filePath); */

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });


        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 0 }); // skip first row

        //מדריך לא ידוע
        let unknownguideRecord = await GuideForProject.findOne({ where: { GFP_code_project: codeProject, GFP_name: "לא משויך למדריך" } });
        if (!unknownguideRecord) {
            unknownguideRecord = await GuideForProject.create({
                GFP_code_project: codeProject, GFP_name: "לא משויך למדריך"
            }, { transaction: t });
        }
        //עיר לא ידוע
        let unknowncityRecord = await City.findOne({ where: { Ci_name: "לא ידוע" } });
        if (!unknowncityRecord) {
            unknowncityRecord = await City.create({ Ci_name: "לא ידוע" }, { transaction: t });
        }
        let father = await Parent.findOne({});
        let mother = await Parent.findOne({});

        for (const row of rows) {
            let Sh_ID = row["ת.ז."];
            if (Sh_ID == null) {
                Sh_ID = "0000000000"
            }
            let sharerCode = 0;
            //בדיקה אם קיים כבר משתתף כזה
            let sharerExists = await Sharer.findOne({ where: { Sh_ID: Sh_ID } });
            if (sharerExists == null) {
                let Pa_name = row["שם האב"];
                if (Pa_name == undefined) {
                    Pa_name = ""
                }
                let Pa_ID = row["ת.ז. האב"];

                let Pa_work = ""
                let Pa_cell_phone = row["פל' אב"];
                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אב
                    father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (father) {
                        await Parent.update(
                            {
                                Pa_ID, Pa_name, Pa_cell_phone, Pa_work
                            },
                            {
                                where: { Pa_code: father.Pa_code },
                                transaction: t
                            }
                        );
                        father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });

                        console.log(father.Pa_ID + " " + father.Pa_code + "הורה קיים")

                    }
                    else {
                        father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                        console.log(father.Pa_ID + " " + father.Pa_code + " הורה לא קיים")

                    }
                }
                else {
                    Pa_ID = "";
                    father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    console.log(father.Pa_ID + " " + father.Pa_code + "אין ת.ז")

                }
                console.log(father.Pa_ID + " " + father.Pa_code + "בסוף")

                Pa_name = row["שם האם"];
                if (Pa_name == undefined) {
                    Pa_name = ""
                }
                Pa_ID = row["ת.ז. האם"];
                Pa_work = "";
                Pa_cell_phone = row["פל' אם"];
                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אם
                    mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (mother) {
                        await Parent.update({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, {
                            where: { Pa_code: mother.Pa_code },
                            transaction: t
                        });
                        mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });

                    }
                    else {
                        mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });

                    }
                }
                else {
                    Pa_ID = ""
                    mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }

                const Sh_father_code = father.Pa_code;
                const Sh_mother_code = mother.Pa_code;
                //פריט משתתף
                const Sh_name = row["שם פרטי"];
                const Sh_Fname = row["שם משפחה"];
                let Sh_gender = 1
                const rawDate = row["ת.לידה לועזי"];
                let Sh_birthday = "";

                let street = row["רחוב"]
                let number = row["מספר"];
                if (!street) { street = "" }
                if (!number) { number = "" }
                const Sh_address = street + " " + number
                const Sh_cell_phone = row["פל' בחור"];
                const Sh_phone = row["טלפון בית"];
                const Sh_nusah_tfila = row["נוסח תפילה"];

                const nameCity = row["עיר"];
                let Sh_city_code = 1;
                if (nameCity) {
                    let cityRecord = await City.findOne({ where: { Ci_name: nameCity.trim() } });
                    if (cityRecord) {
                        Sh_city_code = cityRecord.Ci_code;
                    }
                    else {
                        Sh_city_code = unknowncityRecord.Ci_code;
                    }
                }
                else {
                    Sh_city_code = unknowncityRecord.Ci_code;
                }
                if (!Sh_ID || !Sh_name || !Sh_Fname) continue;

                // יצירת משתתף עם קודי ההורים
                const sharer = await Sharer.create({
                    Sh_ID: Sh_ID, Sh_gender: Sh_gender, Sh_name: Sh_name, Sh_Fname: Sh_Fname,
                    Sh_birthday: Sh_birthday, Sh_father_code: Sh_father_code,
                    Sh_mother_code: Sh_mother_code, Sh_city_code: Sh_city_code, Sh_address: Sh_address, Sh_cell_phone: Sh_cell_phone,
                    Sh_phone: Sh_phone,
                    Sh_nusah_tfila: Sh_nusah_tfila

                }, { transaction: t });

                sharerCode = sharer.Sh_code;

                const SFS_Sharer_code = sharerCode;
                const SFS_current_school = row["סוג ישיבה"];
                const SFS_current_class = row["שיעור"];
                const SFS_current_school_ame = row["שם הישיבה"];
                const SFS_previous_school = row["למד בתלמוד תורה"];
                const SFS_reception_class = row["שיעור"];
                const SFS_previous_institutions = ""
                const currentYear = new Date().getFullYear();

                // יצירת פרטי לימודים
                await StudiesForSharer.create({
                    SFS_Sharer_code: SFS_Sharer_code, SFS_current_school: SFS_current_school, SFS_current_school_ame: SFS_current_school_ame,
                    SFS_reception_class: SFS_reception_class, SFS_current_class: SFS_current_class,
                    SFS_previous_institutions: SFS_previous_institutions, SFS_previous_school: SFS_previous_school, SFS_last_upgrade_year: currentYear - 1

                }, { transaction: t });
            }
            else {
                let Pa_name = row["שם האב"];
                if (Pa_name == undefined) {
                    Pa_name = ""
                }
                let Pa_ID = row["ת.ז. האב"];
                let Pa_work = ""
                let Pa_cell_phone = row["פל' אב"];
                let father = await Parent.findOne();

                if (Pa_ID !== undefined) {
                    // יצירת/עדכון הורה אב
                    father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (father) {
                        await Parent.update({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, {
                            where: { Pa_code: father.Pa_code },
                            transaction: t
                        });
                        father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });

                    }
                    else {
                        father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    Pa_ID = ""
                    father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }

                Pa_name = row["שם האם"];
                if (Pa_name == undefined) {
                    Pa_name = ""
                }
                Pa_ID = row["ת.ז. האם"];
                Pa_work = "";
                Pa_cell_phone = row["פל' אם"];
                let mother = await Parent.findOne();

                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אם
                    mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (mother) {
                        mother = await Parent.update({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, {
                            where: { Pa_code: mother.Pa_code },
                            transaction: t
                        });
                        mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });

                    }
                    else {
                        mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    Pa_ID = ""
                    mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }
                //פריט משתתף
                const Sh_name = row["שם פרטי"];
                const Sh_Fname = row["שם משפחה"];
                let Sh_gender = 1
                const rawDate = row["ת.לידה לועזי"];
                let Sh_birthday = "";

                const Sh_address = row["רחוב"] + " " + row["מספר"];
                const Sh_cell_phone = row["פל' בחור"];
                const Sh_phone = row["טלפון בית"];

                const Sh_nusah_tfila = row["נוסח תפילה"];

                const Sh_father_code = father.Pa_code;
                const Sh_mother_code = mother.Pa_code;
                const nameCity = row["עיר"];
                let Sh_city_code = 1;
                if (nameCity) {
                    let cityRecord = await City.findOne({ where: { Ci_name: nameCity.trim() } });
                    if (cityRecord) {
                        Sh_city_code = cityRecord.Ci_code;
                    }
                    else {
                        Sh_city_code = unknowncityRecord.Ci_code;
                    }
                }
                else {
                    Sh_city_code = unknowncityRecord.Ci_code;
                }

                if (!Sh_ID || !Sh_name || !Sh_Fname) continue;

                // עדכון משתתף
                await Sharer.update({
                    Sh_ID: Sh_ID, Sh_gender: Sh_gender, Sh_name: Sh_name, Sh_Fname: Sh_Fname,
                    Sh_birthday: Sh_birthday, Sh_father_code: Sh_father_code,
                    Sh_mother_code: Sh_mother_code, Sh_city_code: Sh_city_code, Sh_address: Sh_address, Sh_cell_phone: Sh_cell_phone,
                    Sh_phone: Sh_phone,
                    Sh_nusah_tfila: Sh_nusah_tfila
                }, {
                    where: { Sh_code: sharerExists.Sh_code },
                    transaction: t
                });
                sharerCode = sharerExists.Sh_code;
                const SFS_Sharer_code = sharerCode;
                const SFS_current_school = row["סוג ישיבה"];
                const SFS_current_class = row["שיעור"];
                const SFS_current_school_ame = row["שם הישיבה"];
                const SFS_previous_school = row["למד בתלמוד תורה"];
                const SFS_reception_class = row["שיעור"];
                const SFS_previous_institutions = ""
                const currentYear = new Date().getFullYear();

                // עדכון פרטי לימודים
                await StudiesForSharer.update({
                    SFS_Sharer_code: SFS_Sharer_code, SFS_current_school: SFS_current_school, SFS_current_school_ame: SFS_current_school_ame,
                    SFS_reception_class: SFS_reception_class, SFS_current_class: SFS_current_class,
                    SFS_previous_institutions: SFS_previous_institutions, SFS_previous_school: SFS_previous_school, SFS_last_upgrade_year: currentYear - 1

                }, {
                    where: { SFS_Sharer_code: sharerExists.Sh_code },
                    transaction: t
                });

            }
            const SFP_name_school_bein_hazmanim = row["שם ישיבת בן הזמנים"]
            const SFP_veshinantem = row['"ושננתם"'];

            const nameGuide = row["שם המדריך"];
            let SFP_code_guide = 1;
            if (nameGuide) {
                const guideRecord = await GuideForProject.findOne({ where: { GFP_code_project: codeProject, GFP_name: nameGuide } });
                if (guideRecord) {
                    SFP_code_guide = guideRecord.GFP_code;
                }
                else {
                    /*   const guide = await GuideForProject.create({
                          GFP_code_project: codeProject, GFP_name: nameGuide
                      }, { transaction: t });
                      SFP_code_guide = guide.GFP_code; */
                    SFP_code_guide = unknownguideRecord.GFP_code;

                }
            }
            else {
                SFP_code_guide = unknownguideRecord.GFP_code;
            }
            const sharerForProject = await SharerForProject.findOne({
                where: {
                    SFP_code_project: codeProject,
                    SFP_code_Sharer: sharerCode,
                }
            });
            if (sharerForProject == null) {
                // יצירת משתתף לפרויקט
                await SharerForProject.create({
                    SFP_code_project: codeProject,
                    SFP_code_Sharer: sharerCode,
                    SFP_code_guide: SFP_code_guide,
                    SFP_name_school_bein_hazmanim: SFP_name_school_bein_hazmanim,
                    SFP_veshinantem: SFP_veshinantem
                }, { transaction: t });
            }
            else {
                // עדכון משתתף לפרויקט
                await SharerForProject.update({
                    SFP_code_guide: SFP_code_guide,
                    SFP_name_school_bein_hazmanim: SFP_name_school_bein_hazmanim,
                    SFP_veshinantem: SFP_veshinantem

                }, {
                    where: {
                        SFP_code_project: codeProject,
                        SFP_code_Sharer: sharerCode,
                    },
                    transaction: t
                });
            }




        }
        await t.commit();

/*         const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות */
/*         fs.unlinkSync(filePath); // clean up
 */        res.json({ message: "הייבוא הושלם בהצלחה" });
    } catch (error) {
        console.error("Error in addSharers:", error);
        res.status(500).json({ message: "שגיאה בייבוא" });
    }
};
// יצירה חדשה
exports.createSharerForProject = async (req, res) => {
    try {
        const { SFP_code, ...data } = req.body;
        const newRow = await SharerForProject.create(data);
        res.status(201).json(newRow);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
// מחיקה
exports.deleteSharerForProject = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await SharerForProject.findByPk(id);
        if (!row) return res.status(404).json({ error: "המשתתף לא נמצא" });
        await row.destroy();
 /*        const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות */
        res.json({ message: "נמחק בהצלחה" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// עדכון  
exports.updateSharerForProject = async (req, res) => {
    try {
        const { SFP_code } = req.params;
        const { SFP_code_project, SFP_code_Sharer, SFP_code_guide, SFP_name_school_bein_hazmanim, SFP_veshinantem } = req.body;

        const sharerForProject = await SharerForProject.findByPk(SFP_code);
        if (!sharerForProject) return res.status(404).json({ error: "project not found" });
        sharerForProject.SFP_code_project = SFP_code_project;
        sharerForProject.SFP_code_Sharer = SFP_code_Sharer;
        sharerForProject.SFP_code_guide = SFP_code_guide;
        sharerForProject.SFP_name_school_bein_hazmanim = SFP_name_school_bein_hazmanim;
        sharerForProject.SFP_veshinantem = SFP_veshinantem;
        await sharerForProject.save();
        const updatedsharerForProject = await SharerForProject.findByPk(SFP_code);
/*         const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות */
        res.json(updatedsharerForProject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating project" });
    }
};
/*
  קוד לא תקין עבור קובץ האקסל שמתקבל
  if (typeof rawDate === 'number') {
       // תאריך בפורמט Excel מספרי
       const jsDate = XLSX.SSF.parse_date_code(rawDate);
       const year = jsDate.y;
       const month = String(jsDate.m).padStart(2, '0');
       const day = String(jsDate.d).padStart(2, '0');
       Sh_birthday = `${year}-${month}-${day}`;
   } else if (typeof rawDate === 'string') {
       let day, month, year;

       // רגקס גמיש שתומך גם ב-dd/mm/yyyy וגם ב-d/m/yyyy וכו'
       const regexDMY = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/;
       const regexYMD = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

       if (regexDMY.test(rawDate)) {
           const match = rawDate.match(regexDMY);
           day = String(match[1]).padStart(2, '0');
           month = String(match[2]).padStart(2, '0');
           year = match[3];
           Sh_birthday = `${year}-${month}-${day}`;
       } else if (regexYMD.test(rawDate)) {
           const match = rawDate.match(regexYMD);
           year = match[1];
           month = String(match[2]).padStart(2, '0');
           day = String(match[3]).padStart(2, '0');
           Sh_birthday = `${year}-${month}-${day}`;
       } else {
           console.error("פורמט תאריך לא נתמך:", rawDate);
       }
   } else {
       console.error("פורמט לא מזוהה:", rawDate);
   } */