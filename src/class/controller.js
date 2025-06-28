import { AssignTecherToClass, insertClass } from "./model.js";

export const addClass = async(req,res) =>{
    const {classname} = req.body;
     if (typeof classname !== 'string' || classname.trim() === '') {
    return res.status(400).json({ message: 'Class name is required' });
  }
    const data = await insertClass(classname.trim())
    return res.status(200).json({message:"Class added successfully",class:data.rows[0]})
}

export const assignClass = async(req,res) =>{
  const { teacher_id, class_id } = req.body;
  if (!teacher_id || !class_id) {
    return res.status(400).json({ message: 'Teacher ID and Class ID are required' });
  }
  const result = await AssignTecherToClass(teacher_id, class_id);
  res.status(201).json({ message: "Teacher assigned successfully", data: result.rows[0] });
}