const initialLocation = {
    village: "",
    block: "",
    town: "",
    city: "",
    district: "",
    state: "",
    po: "",
    ps: "",
    pincode: "",
    googleMapLocation: "",
};

const initialSellRequest = {
    type: "land",
    priceAsked: "",
    landDetails: {
        area: "",
        dagNumber: "",
        pattaNumber: "",
        landType: "residential",
    },
    propertyDetails: {
        bedrooms: "",
        bathrooms: "",
        parkingSpaces: "",
    },
};

const initialDocuments = {
    landOwnershipProof: null,
    khajnaReceipt: null,
    ownershipProof: null,
    buildingPlan: null,
};

const initialMedia = {
    landImages: [],
    propertyImages: [],
    outsideView: null,
    insideView: null,
};

const stepTitles = [
    "Basic Information",
    "Property Details",
    "Location",
];


export {
    initialLocation,
    initialSellRequest,
    initialDocuments,
    initialMedia,
    stepTitles,
};