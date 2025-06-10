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

//העלאת קובץ אקסל משתתפים
exports.importFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "לא נשלח קובץ" });
        }
        const { codeProject } = req.params;

        const imageDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
  /*קבייעת שם תמונה עם תאריך ושעה  
       const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
        const timestamp = `${formattedDate}_${formattedTime}`;
 */
        const filePath = path.join(imageDir, `${req.file.originalname}.xlsx`);
        fs.writeFileSync(filePath, req.file.buffer);

        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 0 }); // skip first row

        for (const row of rows) {
            const t = await Sharer.sequelize.transaction();
            let Sh_ID = row["ת.ז."];
            if (Sh_ID == null) {
                Sh_ID = "0000000000"
            }
            let sharerCode = 0;
            //בדיקה אם קיים כבר משתתף כזה
            const sharerExists = await Sharer.findOne({ where: { Sh_ID: Sh_ID } });
            if (sharerExists == null) {
                let Pa_name = row["שם האב"];
                if (Pa_name == null) {
                    Pa_name = ""
                }
                let Pa_ID = row["ת.ז. האב"];
                let Pa_work = ""
                let Pa_cell_phone = row["פל' אב"];
                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אב
                    const father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (father) {
                        father = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                            where: { Pa_code: father.Pa_code },
                            transaction: t
                        });
                    }
                    else {
                        father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }

                Pa_name = row["שם האם"];
                if (Pa_name == null) {
                    Pa_name = ""
                }
                Pa_ID = row["ת.ז. האם"];
                Pa_work = "";
                Pa_cell_phone = row["פל' אם"];
                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אב
                    const mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (mother) {
                        mother = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                            where: { Pa_code: mother.Pa_code },
                            transaction: t
                        });
                    }
                    else {
                        mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }
                //פריט משתתף
                const Sh_name = row["שם פרטי"];
                const Sh_Fname = row["שם משפחה"];
                const gender = row["מגדר"];
                let Sh_gender = 1
                if (gender == "בת") { Sh_gender = 2 }
                /*  const rawDate = row["ת.לידה לועזי"];
                 let Sh_birthday = "";
                 let jsDate;
                 if (typeof rawDate === 'number') {
                     jsDate = XLSX.SSF.parse_date_code(rawDate);
                     const year = jsDate.y;
                     const month = String(jsDate.m).padStart(2, '0');
                     const day = String(jsDate.d).padStart(2, '0');
                     Sh_birthday = `${year}-${month}-${day}`;
                 }
                 else {
                     console.error("פורמט לא מזוהה:", rawDate);
                 } */
                const Sh_birthday = "2003-11-11"
                const Sh_address = row["רחוב"] + " " + row["מספר"];
                const Sh_cell_phone = row["פל' בחור"];
                const Sh_phone = row["טלפון בית"];
                const Sh_name_school_bein_hazmanim = row["שם ישיבת בין הזמנים"];
                const Sh_nusah_tfila = row["נוסח תפילה"];
                const Sh_veshinantem = row['"ושננתם"'];

                const Sh_father_code = father.Pa_code;
                const Sh_mother_code = mother.Pa_code;
                const nameCity = row["עיר"];
                let Sh_city_code = 1;
                if (nameCity) {
                    const cityRecord = await City.findOne({ where: { Ci_name: nameCity.trim() } });
                    if (cityRecord) {
                        Sh_city_code = cityRecord.Ci_code;
                    }
                    else {
                        const cityRecord = await City.findOne({ where: { Ci_name: "לא ידוע" } });
                        if (cityRecord) {
                            Sh_city_code = cityRecord.Ci_code;
                        }
                    }
                }
                if (!Sh_ID || !Sh_name || !Sh_Fname) continue;


                // יצירת משתתף עם קודי ההורים
                const sharer = await Sharer.create({
                    Sh_ID: Sh_ID, Sh_gender: Sh_gender, Sh_name: Sh_name, Sh_Fname: Sh_Fname,
                    Sh_birthday: Sh_birthday, Sh_father_code: Sh_father_code,
                    Sh_mother_code: Sh_mother_code, Sh_city_code: Sh_city_code, Sh_address: Sh_address, Sh_cell_phone: Sh_cell_phone,
                    Sh_phone: Sh_phone, Sh_name_school_bein_hazmanim: Sh_name_school_bein_hazmanim,
                    Sh_nusah_tfila: Sh_nusah_tfila ,Sh_veshinantem:Sh_veshinantem

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
                if (Pa_name == null) {
                    Pa_name = ""
                }
                let Pa_ID = row["ת.ז. האב"];
                let Pa_work = ""
                let Pa_cell_phone = row["פל' אב"];
                if (Pa_ID !== undefined) {
                    // יצירת/עדכון הורה אב
                    const father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (father) {
                        father = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                            where: { Pa_code: father.Pa_code },
                            transaction: t
                        });
                    }
                    else {
                        father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }

                Pa_name = row["שם האם"];
                if (Pa_name == null) {
                    Pa_name = ""
                }
                Pa_ID = row["ת.ז. האם"];
                Pa_work = "";
                Pa_cell_phone = row["פל' אם"];
                if (Pa_ID !== undefined) {

                    // יצירת/עדכון הורה אם
                    const mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                    if (mother) {
                        mother = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                            where: { Pa_code: mother.Pa_code },
                            transaction: t
                        });
                    }
                    else {
                        mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                    }
                }
                else {
                    mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }
                //פריט משתתף
                const Sh_name = row["שם פרטי"];
                const Sh_Fname = row["שם משפחה"];
                const gender = row["מגדר"];
                let Sh_gender = 1
                if (gender == "בת") { Sh_gender = 2 }
                /*  const rawDate = row["ת.לידה לועזי"];
                 let Sh_birthday = "";
                 let jsDate;
                 if (typeof rawDate === 'number') {
                     jsDate = XLSX.SSF.parse_date_code(rawDate);
                     const year = jsDate.y;
                     const month = String(jsDate.m).padStart(2, '0');
                     const day = String(jsDate.d).padStart(2, '0');
                     Sh_birthday = `${year}-${month}-${day}`;
                 }
                 else {
                     console.error("פורמט לא מזוהה:", rawDate);
                 } */
                const Sh_birthday = "2003-11-11"
                const Sh_address = row["רחוב"] + " " + row["מספר"];
                const Sh_cell_phone = row["פל' בחור"];
                const Sh_phone = row["טלפון בית"];
                const Sh_name_school_bein_hazmanim = row["שם ישיבת בין הזמנים"];
                const Sh_nusah_tfila = row["נוסח תפילה"];
                const Sh_veshinantem = row['"ושננתם"'];

                const Sh_father_code = father.Pa_code;
                const Sh_mother_code = mother.Pa_code;
                const nameCity = row["עיר"];
                let Sh_city_code = 1;
                if (nameCity) {
                    const cityRecord = await City.findOne({ where: { Ci_name: nameCity.trim() } });
                    if (cityRecord) {
                        Sh_city_code = cityRecord.Ci_code;
                    }
                    else {
                        const cityRecord = await City.findOne({ where: { Ci_name: "לא ידוע" } });
                        if (cityRecord) {
                            Sh_city_code = cityRecord.Ci_code;
                        }
                    }
                }
                if (!Sh_ID || !Sh_name || !Sh_Fname) continue;

                // עדכון משתתף
                await Sharer.update({
                    Sh_ID: Sh_ID, Sh_gender: Sh_gender, Sh_name: Sh_name, Sh_Fname: Sh_Fname,
                    Sh_birthday: Sh_birthday, Sh_father_code: Sh_father_code,
                    Sh_mother_code: Sh_mother_code, Sh_city_code: Sh_city_code, Sh_address: Sh_address, Sh_cell_phone: Sh_cell_phone,
                    Sh_phone: Sh_phone, Sh_name_school_bein_hazmanim: Sh_name_school_bein_hazmanim,
                    Sh_nusah_tfila: Sh_nusah_tfila,Sh_veshinantem:Sh_veshinantem
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
            const nameGuide = row["שם המדריך"];
            let SFP_code_guide = 1;
            if (nameGuide) {
                const guideRecord = await GuideForProject.findOne({ where: { GFP_code_project: codeProject, GFP_name: nameGuide } });
                if (guideRecord) {
                    SFP_code_guide = guideRecord.GFP_code;
                }
                else {
                    const guide = await GuideForProject.create({
                        GFP_code_project: codeProject, GFP_name: nameGuide
                    }, { transaction: t });
                    SFP_code_guide = guide.GFP_code;
                }
            }
            else {
                const guideRecord = await GuideForProject.findOne({ where: { GFP_code_project: codeProject, GFP_name: "לא משויך למדריך" } });
                if (guideRecord) {
                    SFP_code_guide = guideRecord.GFP_code;
                }
                else {
                    const guide = await GuideForProject.create({
                        GFP_code_project: codeProject, GFP_name: "לא משויך למדריך"
                    }, { transaction: t });
                    SFP_code_guide = guide.GFP_code;
                }
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
                    SFP_code_guide: SFP_code_guide
                }, { transaction: t });
            }
            else {
                // עדכון משתתף לפרויקט
                await SharerForProject.update({
                    SFP_code_guide: SFP_code_guide
                }, {
                    where: {
                        SFP_code_project: codeProject,
                        SFP_code_Sharer: sharerCode,
                    },
                    transaction: t
                });
            }



            await t.commit();

        }

        fs.unlinkSync(filePath); // clean up
        res.json({ message: "הייבוא הושלם בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאה בייבוא" });
    }
};