const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
.then(() => {
    console.log("succesfully");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("hi this is project");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    console.log("succesful Index Route");
    res.render("./listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log("Read succesfully");
    res.render("./listings/show.ejs", { listing });
});

//Cretae a new Route
app.post("/listings", async (req, res) => {
    let listing = req.body;
    console.log(listing);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("./listings");
});

//Edit
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

//Update 
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});

// app.post('/listings', async (req, res) => {
//   const listing = new Listing(req.body.listing);
//   await listing.save();
//   res.redirect("/listings");
// });

// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "MY new villa",
//         description: "visit this new amazing place",
//         price: 1299,
//         location: "Delhi",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("test of listing is succesfull");
// });

app.listen(8080, (req, res) => {
    console.log("server listen");
});