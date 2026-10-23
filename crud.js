const express = require("express");
const mongoose = require("mongoose");
const { type } = require("node:os");
const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/patientDB").then(() => console.log("Mongodb connected succesfully")).catch((err) => console.log(err));

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name must required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "name must required"],
        min: [6, "minimum age 6"],
        max: [80, "maximum age 80"]
    },
    gender: {
        type: String,
        required: [true, "gender must required"],
        enum: ["male", "female"]
    },
    moblie: {
        type: Number,
        required: [true, "moblie must required"],
        maxlength: [10, "maximin 10 digit mobile allowed"]
    }
})

const Patient = mongoose.model("Patient", patientSchema);

app.get("/Patients", async (req, res) => {
    try {
        const patient = await Patient.find();
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


app.post("/Patients", async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
});

app.put("/Patients/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if(!patient){
            res.status(404).json({message : "Patient Not Found"})
        }
        res.json(patient);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
});


app.delete("/Patients/:id", async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if(!patient){
            res.status(404).json({message : "Patient Not Found"})
        }

        res.json({ message: "Patient deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
});



app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
