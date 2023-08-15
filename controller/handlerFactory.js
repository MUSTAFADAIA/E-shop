const ApiError = require("../middleware/errorMiddleware");
const ApiFeatures = require("../utils/apiFeatures");
const asyncHandler = require("express-async-handler");

exports.deleteOne = (module) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await module.findByIdAndDelete(id);
    if (!document) {
      // res.status(404).json({msg:`No category for this id ${id}`})
      return next(ApiError(`No document for this id ${id}`, 400));
    }
    // document.remove();
    res.status(200).send();
  });

exports.updateOne = (module) =>
  asyncHandler(async (req, res, next) => {
    const document = await module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      // res.status(404).json({msg:`No category for this id ${id}`})
      return next(ApiError(`No document for this id ${req.params.id}`, 400));
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.creatOne = (module) =>

  asyncHandler(async (req, res) => {
    const document = await module.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOneId = (module, populationopt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1)Build query
    let query = module.findById(id);
    if (populationopt) {
      query = query.populate(populationopt);
    }
    //2)Execute query
    const document = await query;

    if (!document) {
      // res.status(404).json({msg:`No category for this id ${id}`})
      return next(ApiError(`No document for this id ${id}`, 400));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (module, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filteObj) {
      filter = req.filteObj;
    }
    //Build query
    const countDocuments = await module.countDocuments();
    console.log(req.query);
    const apiFeatures = new ApiFeatures(module.find(filter), req.query)
      .paginate(countDocuments)
      .limitFields()
      .search(modelName)
      .sort()
      .filter();

    //Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;

    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });
