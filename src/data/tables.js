const tables =  [{
    name: "configurations",
    title: "Configurations",
    header: {
        "append": ["modelId", "vinModelNumber", "modelYear", "sizeClassId"],
        // "update": ["configurationId", "modelId", "vinModelNumber", "modelYear", "sizeClassId"]
    }
}, {
    name: "models",
    title: "Models",
    header: {
        "append": ["modelName", "manufacturerId"],
        "update": ["modelId", "modelName", "manufacturerId"]
    }
}, {
    name: "manufacturers",
    title: "Manufacturers",
    header: {
        "append": ["manufacturerName"],
        // "update": ["manufacturerId", "manufacturerName"]
    }
}, {
    name: "sizeclasses",
    title: "Size Classes",
    header: {
        "append": ["sizeClassName", "sizeClassMin", "sizeClassMax", "sizeClassUom", "subtypeId"],
        // "update": ["sizeClassId", "sizeClassName", "sizeClassMin", "sizeClassMax", "sizeClassUom", "subtypeId"]
    }
}, {
    name: "subtypes",
    title: "Subtypes",
    header: {
        "append": ["subtypeName", "categoryId"],
        // "update": ["subtypeId", "subtypeName", "categoryId"]
    }
}, {
    name: "categories",
    title: "Categories",
    header: {
        "append": ["categoryName", "classificationId"],
        // "update": ["categoryId", "categoryName", "classificationId"]
    }
}, {
    name: "classifications",
    title: "Classifications",
    header: {
        "append": ["classificationName"],
        // "update": ["classificationId", "classificationName"]
    }
}, {
    name: "modelAliases",
    title: "Model Aliases",
    header: {
        "append": ["modelId", "modelAlias"]
    }
}, {
    name: "manufacturerAliases",
    title: "Manufacturer Aliases",
    header: {
        "append": ["manufacturerId", "manufacturerAlias"]
    }
}, {
    name: "manufacturerVins",
    title: "Manufacturer Vins",
    header: {
        "append": ["manufacturerId", "vinManufacturerCode", "vinYearCode", "modelYear", "shortVin", "cicCode"]
    }
}, {
    name: "specs",
    title: "Specs",
    header: {
        "append": ["configurationId", "specName", "specNameFriendly", "specValue", "specUom", "specFamily", "specDescription"],
        "update": ["id", "configurationId", "specName", "specNameFriendly", "specValue", "specUom", "specFamily", "specDescription"]
    }
}, {
    name: "options",
    title: "Options",
    header: {
        "append": ["sizeClassId", "optionFamilyId", "modelYear", "optionName", "optionValue"]
    }
}, {
    name: "optionFamilies",
    title: "Option Familes",
    header: {
        "append": ["optionFamilyName"]
    }
}, {
    name: "values",
    title: "Values",
    header: {
        "append": ["configurationId", "askingPrice", "auctionPrice", "msrp", "low", "high", "finance", "wholesale", "retail", "tradeIn", "revisionDate"]
    }
}, {
    name: "displaySpecs",
    title: "Display Specs",
    header: {
        "replace": ["subtypeId", "specName"]
    }
}, {
    name: "residualValuesModels",
    title: "Residual Values - Models",
    header: {
        "replace": ["modelId", "sizeClassId", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]
    }
}, {
    name: "residualValuesSizes",
    title: "Residual Values - Sizes",
    header: {
        "replace": ["sizeClassId", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]
    }
}, {
    name: "residualValuesSubtypes",
    title: "Residual Values - Subtypes",
    header: {
        "replace": ["subtypeId", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]
    }
}, {
    name: "conditionAdjustments",
    title: "Condition Adjustments",
    header: {
        "replace": ["sizeClassId", "condition", "adjustmentFactor"]
    }
}, {
    name: "regionAdjustments",
    title: "Region Adjustments",
    header: {
        "replace": ["sizeClassId", "country", "state", "adjustmentValue"]
    }
}, {
    name: "utilizationAdjustments",
    title: "Utilization Adjustments",
    header: {
        "replace": ["sizeClassId", "fuelType", "modelYear", "lowValue", "highValue", "uom", "retailAdjustment", "financeAdjustment", "wholesaleAdjustment", "tradeinAdjustment", "lowAdjustment", "highAdjustment"]
    }
}, {
    name: "waterAdjustments",
    title: "Water Adjustments",
    header: {
        "replace": ["sizeClassId", "manufacturerId", "modelYear", "fwAdj", "swAdj"]
    }
}, {
    name: "usage",
    title: "Usage",
    header: {
        "replace": ["modelId", "modelYear", "age", "benchmarkLevel", "meanAnnualUsage", "recordCount", "percentile25", "percentile45", "percentile55", "percentile75", "percentile99", "distribution25", "distribution45", "distribution55", "distribution75", "distribution99"]
    }
}, {
    name: "popularity",
    title: "Popularity",
    header: {
        "replace": ["modelId", "recordCount", "marketPopularityIndex", "benchmarkGroup", "marketPopularityLabel", "twenty", "forty", "sixty", "eighty", "hundred", "twentyPercent", "fortyPercent", "sixtyPercent", "eightyPercent", "hundredPercent"]
    }
}, {
    name: "truckBodies",
    title: "Truck Bodies",
    header: {
        "replace": ["assetSizeClassId", "bodySizeClassId"],
        "append": ["assetSizeClassId", "bodySizeClassId"]
    }
}, {
    name: "naicsCodes",
    title: "NAICS Codes",
    header: {
        "replace": ["bodySubtypeId", "naicsCode", "naicsDescription"],
        "append": ["bodySubtypeId", "naicsCode", "naicsDescription"]
    }
}, {
    name: "sicCodes",
    title: "SIC Codes",
    header: {
        "replace": ["bodySubtypeId", "sicCode", "sicDescription", "sicCompanyType"],
        "append": ["bodySubtypeId", "sicCode", "sicDescription", "sicCompanyType"]
    }
}, {
    name: "attachments",
    title: "Attachments",
    header: {
        "replace": ["attachmentCategoryId", "subtypeId"]
    }
}];

export default tables;