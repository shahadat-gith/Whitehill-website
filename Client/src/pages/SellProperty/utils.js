
export const initialData = {
    sellRequest: {

        type: "land",
        priceAsked: "",
        description: "",
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
    },
    location: {
        village: "",
        block: "",
        city: "",
        district: "",
        state: "",
        po: "",
        ps: "",
        pincode: "",
    },
    documents: {
        landOwnershipProof: null,
        khajnaReceipt: null,
        ownershipProof: null,
        buildingPlan: null,
    },
    media: {
        landImages: [],
        propertyImages: [],
    },
};

export const stepTitles = [
    "Basic Information",
    "Property Details",
    "Location",
];


