import { checkExistingGrade, deleteGrade, giveGrades, updateGrades } from "./model.js";

export const addGrades = async(req,res) =>{
    try {
    const{student_id,teacher_id,subject, grade, comments} = req.body;
     const existing = await checkExistingGrade(student_id, teacher_id, subject);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Grade for this student, teacher, and subject already exists.",
      });
    }
    const result = await giveGrades(student_id,teacher_id,subject, grade, comments);
     res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

export const updateGrade = async(req,res) =>{
    try {
    const {grade_id} = req.query;
    const { grade, comments } = req.body;
    const result = await updateGrades(grade_id,grade, comments);
    console.log(result)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grade not found." });
    }
    res.status(200).json(result.rows[0]);
    } catch (error) {
         console.log(error)
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

export const removeGrade = async (req, res) => {
  try {
    const { gradeId } = req.query; // expects /api/grades/:gradeId

    const result = await deleteGrade(gradeId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grade not found." });
    }

    res.status(200).json({ message: "Grade deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};