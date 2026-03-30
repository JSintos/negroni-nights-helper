// Imports
import express from "express"
import cors from "cors"

// Routes
// import nights from "./routes/api"

const PORT = process.env.PORT || 5050
const app = express()

app.use(express.json())
app.use(cors())
// app.use("/nights", nights)

app.get("/", () => {
    console.log("/////")
})

app.listen(PORT, () => console.log("Server started on port 5001."))