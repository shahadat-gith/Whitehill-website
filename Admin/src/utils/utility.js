export const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
};

export const formatAmount = (amt) => {
    if (amt === null || amt === undefined) return "-";
    // if you store paise, change this to amt/100
    return `₹${Number(amt).toLocaleString("en-IN")}`;
};

export const getRiskClass = (risk) => {
    const r = (risk || "").toLowerCase();
    if (r === "low") return "inv-badge low";
    if (r === "medium") return "inv-badge medium";
    if (r === "high") return "inv-badge high";
    return "inv-badge";
};