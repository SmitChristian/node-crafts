const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
var crafts = [];



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  mongoose
    .connect("mongodb+srv://crs29:UFkJsYh8sh1oQVQy@mongodb.hqyistc.mongodb.net/")
    .then(() => console.log("Connected to mongodb"))
    .catch(error => console.log("Couldn't connect to mongodb", error))


    const craftSchema = mongoose.Schema({
        //_id: mongoose.SchemaTypes.ObjectId,
        name: String,
        description: String,
        supplies: [String],
        image: String
    })

    const Craft = mongoose.model("Craft", craftSchema);


  

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})



app.get('/api/crafts', (req, res)=>{
    getCrafts(res)
})

app.get(`/api/crafts/:id`, (req, res) => {
    getCraft(res, req.params.id);
})

async function getCrafts (res) {
    const crafts = await Craft.find()
    res.send(crafts);
}

async function getCraft (res, id) {
    const craft = await Craft.findOne({_id:id})
    res.send(craft);
}


app.post("/api/crafts", upload.single("image"), (req, res)=> {
    console.log("Posting");
    const result = validateCraft(req.body);

    if(result.error) {
        console.log("result error");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log("Getting craft info");
    const craft = new Craft({
        name:req.body.name,
        description:req.body.description,
        image:req.file.filename,
        supplies:req.body.supplies.split(",")
    })
    console.log("Got craft info");

    console.log("pushing and sending");
    createCraft(res, craft);
    console.log("pushing and sending completed");
    //console.log({...crafts})
})

async function createCraft (res, craft) {
    console.log("Creating Craft!");
    const result = await craft.save();
    console.log("Craft Created!");
    res.send(result);
}


app.put("/api/crafts/:id", upload.single("image"), (req, res) => {

    if (req.files) {
        const result = validateCraft(req.body);
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }

    }

    updateCrafts(req, res);
    
})

async function updateCrafts (req, res) {
    console.log("Starting to update crafts");
    let fieldsToUpate = {
        name:req.body.name,
        description:req.body.description,
        supplies:req.body.supplies.split(",")
    }

    if(req.file) {
        fieldsToUpate.image = req.file.filename;
    }

    console.log("Grabbed Field to Update");

    console.log("Updating");
    const result = await Craft.updateOne({_id:req.params.id}, fieldsToUpate);
    console.log("Updating Complete");
    res.send(result);
    console.log("Sent result");
}


app.delete("/api/crafts/:id", (req, res) => {
    removeCraft(res, req.params.id);
})

async function removeCraft (res, id) {
    const craft = await Craft.findByIdAndDelete(id);
    res.send(craft);
}

function validateCraft (craft) {
    console.log("begin validation");
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        supplies: Joi.allow("")

    });

    return schema.validate(craft);
}


app.listen(3000, ()=>{
    console.log("Server Runnin");
})