export const initialData = {
    sellRequest: {

        type: "land",
        priceAsked: "",
        description: "",
        landDetails: {
            area: {
                bigha: "",
                kattha: "",
                lessa: "",
            },
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
        mouza: "",
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
    "Documents & Images",
];

export const getStepError = ({
    currentStep,
    isLand,
    sellRequest,
    location,
    documents,
    media,
}) => {
    if (currentStep === 1) {
        if (!sellRequest.priceAsked || Number(sellRequest.priceAsked) <= 0) {
            return "Enter a valid asking price.";
        }

        if (!sellRequest.description || !sellRequest.description.trim()) {
            return "Description is required.";
        }
    }

    if (currentStep === 2 && isLand) {
        if (
            sellRequest.landDetails.area?.bigha === "" ||
            sellRequest.landDetails.area?.kattha === "" ||
            sellRequest.landDetails.area?.lessa === "" ||
            !sellRequest.landDetails.dagNumber ||
            !sellRequest.landDetails.pattaNumber ||
            !sellRequest.landDetails.landType
        ) {
            return "Fill all required land details.";
        }
    }

    if (currentStep === 2 && !isLand) {
        if (
            sellRequest.propertyDetails.bedrooms === "" ||
            sellRequest.propertyDetails.bathrooms === "" ||
            sellRequest.propertyDetails.parkingSpaces === ""
        ) {
            return "Fill all required property details.";
        }
    }

    if (currentStep === 3) {
        if (
            !location.state ||
            !location.district ||
            !location.city ||
            !location.pincode ||
            !location.village ||
            !location.mouza ||
            !location.po ||
            !location.ps
        ) {
            return "All location fields are required.";
        }

        if (!/^\d{6}$/.test(location.pincode)) {
            return "Pincode must be 6 digits.";
        }
    }

    if (currentStep === 4) {
        const hasAllDocuments = isLand
            ? Boolean(documents?.landOwnershipProof && documents?.khajnaReceipt)
            : Boolean(documents?.ownershipProof && documents?.buildingPlan);

        const imageCount = isLand
            ? (media?.landImages?.length || 0)
            : (media?.propertyImages?.length || 0);

        if (!hasAllDocuments) {
            return "Please upload all required documents before continuing";
        }

        if (imageCount < 1) {
            return "At least 1 image is required";
        }
    }

    return null;
};






 