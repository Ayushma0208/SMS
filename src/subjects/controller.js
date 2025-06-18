import { createSubject } from "./model.js";

export const addSubject = async(req,res) =>{
    try {
    const {subject} = req.body;
    if(!subject || subject.trim() === ""){
        return res.status(400).json({ message: "Subject is required" });
    }
    try {
        const result = await createSubject(subject)
    return res.status(201).json({
      message: "Subject added successfully",
      subject: result.rows[0],
    });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: "Subject already exists" });
      }
      throw error; 
    }
     } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}