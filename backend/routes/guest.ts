import { Router } from "express"
import { getCollection } from "../database/connection.js"
import { ObjectId } from "mongodb"

const router = Router()

// GET - /guests
// Retrieve all guests
router.get("/", async (req, res) => {
    let guestsCollection = getCollection("guests")
    let guests = await guestsCollection.find({}).toArray()

    res.send(guests).status(200)
});

// GET - /guests/:id
// Retrieves a single guest
router.get("/:id", async(req, res) => {
    let guestsCollection = getCollection("guests")
    let query = { _id: new ObjectId(req.params.id) }
    let retrievedGuest = await guestsCollection.findOne(query)

    if(!retrievedGuest) res.send("Specified guest not found.").status(404)
    else res.send(retrievedGuest).status(200)
})

// POST - /
// Creates a new guest
router.post("/", async (req, res) => {
    try {
        let newGuest = {
            name: req.body.name,
            timeArrived: req.body.timeArrived,
            hostGift: req.body.hostGift
        }

        let guestsCollection = getCollection("guests")
        let result = await guestsCollection.insertOne(newGuest)

        res.send(result).status(204)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered creating a guest.").status(500)
    }
})

// PATCH - /guests/:id
// Updates the information of a single guest
router.patch("/:id", async(req, res) => {
    try {
        let guestsCollection = getCollection("guests")
        let query = { _id: new ObjectId(req.params.id) }

        const updatedInfo = {
            $set: {
                name: req.body.name,
                timeArrived: req.body.timeArrived,
                hostGift: req.body.hostGift
            },
        }

        let result = await guestsCollection.updateOne(query, updatedInfo)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a guest.").status(500)   
    }
})

// DELETE - /guests/:id
// Deletes a single guest
router.patch("/:id", async(req, res) => {
    try {
        let guestsCollection = getCollection("guests")
        let query = { _id: new ObjectId(req.params.id) }
        let result = await guestsCollection.deleteOne(query)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a guest.").status(500)   
    }
})