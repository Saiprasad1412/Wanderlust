const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.create = async (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.addListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path:"reviews", populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!");
        res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", { listing });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save(); 
    }
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Sucessfully!");
    res.redirect("/listing");
}