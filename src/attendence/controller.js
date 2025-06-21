import { markAttendance} from "./model.js";

export const markStudentAttendance = async(req,res) =>{
    const{student_id, class_id, date, status } = req.body;
    console.log("req.body>>>",req.body)
    if (!student_id || !class_id || !date || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const data = await markAttendance(student_id, class_id, date, status);
  res.status(200).json({ message: "Attendance marked", attendance: data.rows });
}