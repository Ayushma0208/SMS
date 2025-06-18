import { assignSuject, createSubject } from "./model.js";

export const addSubject = async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject || subject.trim() === "") {
      return res.status(400).json({ message: "Subject is required" });
    }
    try {
      const result = await createSubject(subject);
      return res.status(201).json({
        message: "Subject added successfully",
        subject: result.rows[0],
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Subject already exists" });
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const subjectAssign = async (req, res) => {
  try {
    const { subject_id, teacher_id } = req.body;
    if (!subject_id || !teacher_id) {
      return res.status(400).json({ message: "Both subject_id and teacher_id are required" });
    }
    const result = await assignSuject(subject_id, teacher_id);
    res.status(201).json({ message: "Subject assigned successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error assigning subject:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
