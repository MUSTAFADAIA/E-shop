const { query } = require("express");

class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    console.log(mongooseQuery);
    console.log(queryString);
  }
  filter() {
    //1(Fltering
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fileds"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    // Apply filteration using [get, gt, lte, lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(get|gt|lte|lt)\b/g, (match) => "$${match}");

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //3) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    //4) Fields Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(moduleName) {
    //5) Search
    if (this.queryString.keyWord) {
      let query = {};
      if(moduleName =='products'){
      query.$or = [
        { title: { $regex: this.queryString.keyWord, $options: "i" } },
        { description: { $regex: this.queryString.keyWord, $options: "i" } }
      ];
    }else{
    query={ name: { $regex: this.queryString.keyWord, $options: "i" } }
    }
      this.mongooseQuery = this.mongooseQuery.find(query);
    
    }
    return this;
  }
  paginate(countDocuments) {
    //2) pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.page * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}
module.exports = ApiFeatures;
