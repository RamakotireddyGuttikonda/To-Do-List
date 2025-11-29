// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";

// const app = express();
// const port = 3000;

// mongoose.connect("mongodb://localhost:27017/to-do-list")
//   .then(() => console.log("-> MongoDB Connected"))
//   .catch(err => console.error("MongoDB Error", err));

// const taskSchema = new mongoose.Schema({
//   Task: { type: String, required: true },
//   Date: { type: Date, default: Date.now },
//   Status: { type: String, default: "Pending" }
// });

// const taskModel = mongoose.model("tasks", taskSchema);

// app.use(cors());
// app.use(express.json());

// /* ADD TASK */
// app.post("/addTask", async (req, res) => {
//   try {
//     const { Task } = req.body;

//     const newTask = await taskModel.create({ Task });

//     if (!newTask) {
//       return res.json({ success:false });
//     }

//     res.json({ success:true });

//   } catch (err) {
//     console.error(err);
//     res.json({ success:false, error:"Internal error" });
//   }
// });

// /* GET TODAY TASKS */
// app.get("/getTasks", async (req, res) => {
//   try {
//     const start = new Date();
//     start.setHours(0,0,0,0);

//     const end = new Date();
//     end.setHours(23,59,59,999);

//     const tasks = await taskModel.find({
//       Date: { $gte:start, $lte:end }
//     });

//     res.json({ success:true, tasks });

//   } catch (err) {
//     console.error(err);
//     res.json({ success:false, error:"Internal error" });
//   }
// });

// /* UPDATE TASK STATUS */
// app.put("/updateTaskStatus", async (req, res) => {
//   try {
//     const { id } = req.body;

//     const updated = await taskModel.findByIdAndUpdate(
//       id,
//       { $set:{ Status:"Completed" } },
//       { new:true }
//     );

//     if (!updated) return res.json({ success:false });

//     res.json({ success:true });

//   } catch (err) {
//     console.error(err);
//     res.json({ success:false, error:"Internal error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`-> Server running at http://localhost:${port}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app= express()

const port = 3000;

mongoose.connect("mongodb://localhost:27017/to-do-list")
.then(()=>console.log("-> Mongodb Connected"))
.catch((err)=>console.error("Error connecting to mgdb"))

const taskSchema = new mongoose.Schema({
    Task:{type:String , required:true},
    Date :{type:Date, required:true,default:Date.now},
    Status:{type:String,default:"Pending"}
})

const taskModel = mongoose.model("tasks",taskSchema);

app.use(cors())
app.use(express.json())

app.post("/addTask",async (req,res)=>{
    try{
        const {Task} = req.body;
        const newTask = taskModel.create({Task})
    
        if(!newTask){
            return res.json({success:false,error:"Failed to create Task"})
        }
    
        return res.json({success:true})
    }
    catch(err){
        return res.json({success:false,error:"Internal Error"})
    }
})

app.get("/getTasks", async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await taskModel.find({
      Date: { $gte: start, $lte: end }
    });

    return res.json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: "Internal Error" });
  }
});

app.get("/previousTasks", async (req, res) => {
  try {
    const today = new Date();

    // Start of today (00:00:00)
    const startToday = new Date(today);
    startToday.setHours(0, 0, 0, 0);

    // Start of yesterday (00:00:00)
    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);

    const tasks = await taskModel.find({
      Date: {
        $gte: startYesterday,
        $lt: startToday
      }
    });

    return res.json({
      success: true,
      tasks
    });

  } catch (err) {
    console.error("previousTasks error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});



app.listen(port,()=>{
    console.log(`-> App running on port:${port}`)
})