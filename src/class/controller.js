import { insertClass } from "./model.js";

export const addClass = async(req,res) =>{
    const {classname} = req.body;
     if (typeof classname !== 'string' || classname.trim() === '') {
    return res.status(400).json({ message: 'Class name is required' });
  }
    const data = await insertClass(classname.trim())
    return res.status(200).json({message:"Class added successfully",class:data.rows[0]})
}