const qs = require("qs");

class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }
  filter() {
    const queryObj = { ...this.queryStr };
    //  Remove special fields that are not part of filtering
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let filters = qs.parse(qs.stringify(queryObj));

    for (const field in filters) {
      if (typeof filters[field] === "object" && filters[field] !== null) {
        for (const op in filters[field]) {
          if (["gte", "gt", "lte", "lt"].includes(op)) {
            filters[field][`$${op}`] = filters[field][op];
            delete filters[field][op];
          }
        }
      }
    }
    this.mongooseQuery = this.mongooseQuery.find(filters);

    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }
    return this;
  }
  fields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  search(modleName) {
    if (this.queryStr.keyword) {
      const queryFilters = {};
      if (modleName === "product") {
        queryFilters.$or = [
          { title: { $regex: this.queryStr.keyword, $options: "i" } },
          { description: { $regex: this.queryStr.keyword, $options: "i" } },
        ];
      } else {
        queryFilters.$or = [
          { name: { $regex: this.queryStr.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(queryFilters);
    }
    return this;
  }
  pagination(documentsCount) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //pagination resulte 
    const paginationResulte = {
      currentPage: page,
      limit: limit,
      numOfPaginat: Math.ceil(documentsCount / limit), //  24 / 5 = 3
      //next and prev
      nextPage: (endIndex < documentsCount) ? page + 1 : null,
      prevPage: (skip > 0) ? page - 1 : null
    };
    

    // Build and prepar Query
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit).lean();
    this.paginationResulte = paginationResulte;
    return this;
  }
};
module.exports = ApiFeatures;

