const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require('../models')

const checkAuthStatus = request => {
    if (!request.headers.authorization) {
        return false
    }
    const token = request.headers.authorization.split(" ")[1]

    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return false
        }
        else {
            return data
        }
    });
    console.log(loggedInUser)
    return loggedInUser
}



router.get("/", (req, res) => {
    db.Fish.findAll().then(fishs => {
        res.json(fishs);
    }).catch(err => {
        console.log(err);
        res.status(500).send("something want wrong");
    })
})

router.get("/:id", (req, res) => {
    db.Fish.findOne({
        where: {
            id: req.params.id
        }
    }).then(dbfish => {
        res.json(dbfish);
    }).catch(err => {
        console.log(err);
        res.status(500).send("something want wrong");
    })
})

router.post("/", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("login first brotato")
    }
    console.log(loggedInUser);
    db.Tank.findOne({
        where:{
            id:req.body.tankId
        }
    }).then(tankData=>{
        if(tankData.UserId===loggedInUser.id){
            db.Fish.create({
                name: req.body.name,
                width: req.body.width,
                color:req.body.color,
                UserId: loggedInUser.id,
                TankId: req.body.tankId
            }).then(newfish => {
               return  res.json(newfish);
            }).catch(err => {
                console.log(err);
                return res.status(500).send("something want wrong");
            })
        } else{
            return res.status(401).send("not your tank")
        }
    })
})

router.put("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("login first brotato")
    }
    db.Fish.findOne({
        where: {
            id: req.params.id
        }
    }).then(fish => {
        if (loggedInUser.id === fish.UserId) {
            db.Fish.update({
                name: req.body.name,
                width: req.body.width,
                color:req.body.color,
                TankId: req.body.tankId
            }, {
                    where: {
                        id: fish.id
                    }
                }).then(editfish => {
                    res.json(editfish)
                }).catch(err => {
                    console.log(err);
                    res.status(500).send("something want wrong");
                })
        } else {
            return res.status(401).send("not your fish!")
        }
    })
})
router.delete("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("login first brotato")
    }
    db.Fish.findOne({
        where: {
            id: req.params.id
        }
    }).then(fish => {
        if (loggedInUser.id === fish.UserId) {
            db.Fish.destroy({
                where: {
                    id: fish.id
                }
            }).then(delfish => {
                res.json(delfish)
            }).catch(err => {
                console.log(err);
                res.status(500).send("something want wrong");
            })
        } else {
            return res.status(401).send("not your fish!")
        }
    })
})



module.exports = router