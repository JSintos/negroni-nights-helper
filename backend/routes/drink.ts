import { Router } from "express"
import { getCollection } from "../database/connection.js"
import { ObjectId } from "mongodb"

const router = Router()

// GET - /drinks
// Retrieve all drinks
router.get("/", async (req, res) => {
    let drinksCollection = getCollection("drinks")
    let drinks = await drinksCollection.find({}).toArray()

    res.send(drinks).status(200)
});

// GET - /drinks/:id
// Retrieves a single drink
router.get("/:id", async(req, res) => {
    let drinksCollection = getCollection("drinks")
    let query = { _id: new ObjectId(req.params.id) }
    let retrievedDrink = await drinksCollection.findOne(query)

    if(!retrievedDrink) res.send("Specified drink not found.").status(404)
    else res.send(retrievedDrink).status(200)
})

// POST - /
// Creates a new drink
router.post("/", async (req, res) => {
    try {
        let newDrink = {
            name: req.body.name,
            firstServed: req.body.firstServed,
            description: req.body.description,
            tags: req.body.tags
        }

        let drinksCollection = getCollection("drinks")
        let result = await drinksCollection.insertOne(newDrink)

        res.send(result).status(204)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered creating a drink.").status(500)
    }
})

// PATCH - /drinks/:id
// Updates the information of a single drink
router.patch("/:id", async(req, res) => {
    try {
        let drinksCollection = getCollection("drinks")
        let query = { _id: new ObjectId(req.params.id) }

        const updatedInfo = {
            $set: {
                name: req.body.name,
                firstServed: req.body.firstServed,
                description: req.body.description,
                tags: req.body.tags
            },
        }

        let result = await drinksCollection.updateOne(query, updatedInfo)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a drink.").status(500)   
    }
})

// DELETE - /drinks/:id
// Deletes a single drink
router.patch("/:id", async(req, res) => {
    try {
        let drinksCollection = getCollection("drinks")
        let query = { _id: new ObjectId(req.params.id) }
        let result = await drinksCollection.deleteOne(query)

        res.send(result).status(200)
    } catch(error) {
        console.error(error)
        
        res.send("There was an error encountered updating a drink.").status(500)   
    }
})