import { Router } from "express"
import { getCollection } from "../database/connection.js"
import { ObjectId } from "mongodb"

const router = Router()

// GET - /nights
// Retrieve all nights
router.get("/", async (req, res) => {
    let nightsCollection = getCollection("nights")
    let nights = await nightsCollection.find({}).toArray()

    res.send(nights).status(200)
});

// GET - /nights/:id
// Retrieves a single night
router.get("/:id", async(req, res) => {
    let nightsCollection = getCollection("nights")
    let query = { _id: new ObjectId(req.params.id) }
    let retrievedNight = await nightsCollection.findOne(query)

    if(!retrievedNight) res.send("Specified night not found.").status(404)
    else res.send(retrievedNight).status(200)
})

// POST - /
// Creates a new night
router.post("/", async (req, res) => {
    try {
        let newNight = {
            date: req.body.date,
            theme: req.body.theme,
            noOfGuests: req.body.noOfGuests,
            timeStarted: req.body.timeStarted,
            timeEnded: req.body.timeEnded
        }

        let nightsCollection = getCollection("nights")
        let result = await nightsCollection.insertOne(newNight)

        res.send(result).status(204)

        // TODO: calc for how many minutes we partied, order of people who left, which food we ate, which drinks were ordered
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered creating a night.").status(500)
    }
})

// PATCH - /nights/:id
// Updates the information of a single night
router.patch("/:id", async(req, res) => {
    try {
        let nightsCollection = getCollection("nights")
        let query = { _id: new ObjectId(req.params.id) }

        const updatedInfo = {
            $set: {
                date: req.body.date,
                theme: req.body.theme,
                noOfGuests: req.body.noOfGuests,
                timeStarted: req.body.timeStarted,
                timeEnded: req.body.timeEnded  
            },
        }

        let result = await nightsCollection.updateOne(query, updatedInfo)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a night.").status(500)   
    }
})

// DELETE - /nights/:id
// Deletes a single night
router.patch("/:id", async(req, res) => {
    try {
        let nightsCollection = getCollection("nights")
        let query = { _id: new ObjectId(req.params.id) }
        let result = await nightsCollection.deleteOne(query)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a night.").status(500)   
    }
})