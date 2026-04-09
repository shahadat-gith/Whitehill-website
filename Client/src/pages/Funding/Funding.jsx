import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../Configs/axios";
import "./Styles/Funding.css";

const fundTypes = {
  startup: {
    label: "Startup Funding",
    description: "Seed capital for early-stage ventures, including product development, team growth, and market launch.",
    endpoint: "startup",
    fields: [
      { name: "name", label: "Company / Startup Name", placeholder: "Enter your company name" },
      { name: "sector", label: "Sector", placeholder: "E.g. fintech, healthtech" },
      { name: "description", label: "Startup Description", placeholder: "Briefly describe your startup", type: "textarea" },
      { name: "stage", label: "Business Stage", placeholder: "E.g. pre-seed, growth" },
      { name: "foundationYear", label: "Foundation Year", placeholder: "Year founded", type: "number" },
      { name: "teamSize", label: "Team Size", placeholder: "Total employees", type: "number" },
      { name: "businessModel", label: "Business Model", placeholder: "E.g. B2B SaaS" },
      { name: "website", label: "Website", placeholder: "https://example.com" },
    ],
    uploads: [
      { name: "incomeProof", label: "Income Proof" },
      { name: "bankStatement", label: "Bank Statement" },
      { name: "pitchDeck", label: "Pitch Deck" },
      { name: "additionalDocs", label: "Additional Documents", multiple: true, optional: true },
    ],
  },
  businessVenture: {
    label: "Business Funding",
    description: "Growth and working capital to expand operations, strengthen cash flow, and accelerate business performance.",
    endpoint: "business",
    fields: [
      { name: "name", label: "Business Name", placeholder: "Enter your business name" },
      { name: "type", label: "Business Type", placeholder: "E.g. Partnership, Pvt Ltd" },
      { name: "industry", label: "Industry", placeholder: "E.g. manufacturing, retail" },
      { name: "yearsInOperation", label: "Years in Operation", type: "number" },
      { name: "registrationNumber", label: "Registration Number" },
      { name: "gstNumber", label: "GST Number" },
      { name: "monthlyRevenue", label: "Monthly Revenue", type: "number" },
      { name: "monthlyProfit", label: "Monthly Profit", type: "number" },
      { name: "employees", label: "Number of Employees", type: "number" },
      { name: "purposeOfLoan", label: "Specific Loan Purpose", placeholder: "What will this specific loan achieve?", type: "textarea" },
    ],
    uploads: [
      { name: "incomeProof", label: "Income Proof" },
      { name: "bankStatement", label: "Bank Statement" },
      { name: "cashFlow", label: "Cash Flow Statement" },
      { name: "balanceSheet", label: "Balance Sheet" },
      { name: "profitLoss", label: "Profit & Loss Statement" },
      { name: "additionalDocs", label: "Additional Documents", multiple: true, optional: true },
    ],
  },
  property: {
    label: "Property Funding",
    description: "Finance secured by land, development projects or title assets with documentary verification and asset-grade evaluation.",
    endpoint: "property",
    fields: [
      { name: "type", label: "Property Type", type: "select", options: ["residential", "commercial", "land"] },
      { name: "subType", label: "Sub-Type", type: "select", options: ["apartment", "independent_house", "villa", "plot", "agricultural_land", "office", "shop", "warehouse"] },
      { name: "value", label: "Market Value", placeholder: "Estimated property value", type: "number" },
      { name: "builtUpArea", label: "Built-up Area", type: "number" },
      { name: "carpetArea", label: "Carpet Area", type: "number" },
      { name: "propertyAge", label: "Property Age (Years)", type: "number" },
      { name: "builder", label: "Builder Name" },
      { name: "landArea", label: "Land Area", type: "number" },
      { name: "landType", label: "Land Type" },
      { name: "ownershipType", label: "Ownership Type" },
    ],
    uploads: [
      { name: "incomeProof", label: "Income Proof" },
      { name: "bankStatement", label: "Bank Statement" },
      { name: "saleDeed", label: "Sale Deed" },
      { name: "titleDeed", label: "Title Deed" },
      { name: "taxReceipt", label: "Latest Tax Receipt" },
      { name: "encumbrance", label: "Encumbrance Certificate" },
      { name: "landRecords", label: "Land Records" },
      { name: "buildingApproval", label: "Building Approval" },
      { name: "additionalDocs", label: "Additional Documents", multiple: true, optional: true },
    ],
  },
};

const Funding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryType = searchParams.get("type") || "startup";
  const [fundingType, setFundingType] = useState(fundTypes[queryType] ? queryType : "startup");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    tenureMonths: "",
    purpose: "",
    disclosures: {
      hasExistingLoans: false,
      hasDefaultedBefore: false,
      hasLegalCases: false,
      hasCriminalRecord: false,
      politicallyExposed: false,
      details: "",
    },
    riskFactors: "",
    consent: {
      agreedToTerms: false,
      agreedToPrivacyPolicy: false,
      agreedToCreditCheck: false,
    },
    startup: {
      name: "", sector: "", description: "", stage: "", foundationYear: "", teamSize: "", businessModel: "", website: "",
      traction: { users: "", revenue: "", growthRate: "" },
      fundUsage: { product: "", marketing: "", hiring: "", operations: "" },
      founders: [{ name: "", role: "", experience: "", linkedin: "" }],
    },
    businessVenture: {
      name: "", type: "", industry: "", yearsInOperation: "", registrationNumber: "", gstNumber: "", monthlyRevenue: "", monthlyProfit: "", employees: "", purposeOfLoan: "",
      assets: [{ name: "", value: "" }],
      liabilities: [{ type: "", amount: "" }],
    },
    property: {
      type: "", subType: "", value: "", builtUpArea: "", carpetArea: "", propertyAge: "", builder: "", landArea: "", landType: "", ownershipType: "",
      location: { address: "", city: "", state: "", pincode: "" },
      legal: { isDisputed: false, titleClear: false, approvals: "" },
    },
  });

  const [files, setFiles] = useState({
    incomeProof: null, bankStatement: null, additionalDocs: [],
    pitchDeck: null, cashFlow: null, balanceSheet: null, profitLoss: null,
    saleDeed: null, titleDeed: null, taxReceipt: null, encumbrance: null, landRecords: null, buildingApproval: null,
  });

  useEffect(() => {
    if (fundTypes[queryType] && queryType !== fundingType) {
      setFundingType(queryType);
    }
  }, [queryType, fundingType]);

  const handleFundingTypeChange = (type) => {
    setFundingType(type);
    navigate(`/request-funds?type=${type}`, { replace: true });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (event, section, subSection = null) => {
    const { name, value, type, checked } = event.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({
      ...prev,
      [section]: subSection 
        ? { ...prev[section], [subSection]: { ...prev[section][subSection], [name]: val } }
        : { ...prev[section], [name]: val }
    }));
  };

  const handleArrayChange = (index, e, section, arrayName) => {
    const { name, value } = e.target;
    const updatedArray = [...form[section][arrayName]];
    updatedArray[index][name] = value;
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [arrayName]: updatedArray } }));
  };

  const addArrayItem = (section, arrayName, emptyObj) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [arrayName]: [...prev[section][arrayName], emptyObj] }
    }));
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles, multiple } = event.target;
    if (!selectedFiles) return;
    setFiles((prev) => ({
      ...prev,
      [name]: multiple ? Array.from(selectedFiles) : selectedFiles[0],
    }));
  };

  const buildFundingPayload = () => {
    const payload = new FormData();
    payload.append("amount", form.amount);
    payload.append("tenureMonths", form.tenureMonths);
    payload.append("purpose", form.purpose);
    payload.append("disclosures", JSON.stringify(form.disclosures));
    payload.append("riskFactors", form.riskFactors);
    payload.append("consent", JSON.stringify(form.consent));

    payload.append("incomeProof", files.incomeProof);
    payload.append("bankStatement", files.bankStatement);
    files.additionalDocs.forEach(f => payload.append("additionalDocs", f));

    if (fundingType === "startup") {
      payload.append("startup", JSON.stringify(form.startup));
      payload.append("pitchDeck", files.pitchDeck);
    } else if (fundingType === "businessVenture") {
      payload.append("business", JSON.stringify(form.businessVenture));
      payload.append("cashFlow", files.cashFlow);
      payload.append("balanceSheet", files.balanceSheet);
      payload.append("profitLoss", files.profitLoss);
    } else if (fundingType === "property") {
      payload.append("property", JSON.stringify(form.property));
      ["saleDeed", "titleDeed", "taxReceipt", "encumbrance", "landRecords", "buildingApproval"].forEach(k => {
        if (files[k]) payload.append(k, files[k]);
      });
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = fundTypes[fundingType].endpoint;
      const response = await api.post(`/api/funding/${endpoint}`, buildFundingPayload(), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Funding request submitted successfully.");
        navigate("/profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const currentType = fundTypes[fundingType];

  return (
    <main className="funding-page">
      <section className="funding-hero">
        <div className="funding-hero-copy">
          <span className="eyebrow">Funding Request</span>
          <h1>Request capital with clarity and confidence.</h1>
          <p>Whitehill helps founders, business owners and property holders submit professional funding requests.</p>
        </div>
        <div className="funding-hero-summary">
          <div className="hero-card accent-card"><strong>Turnaround</strong><p>Review in 48 hours</p></div>
          <div className="hero-card"><strong>Secure upload</strong><p>Document-backed approvals</p></div>
          <div className="hero-card"><strong>Decisions</strong><p>Approved, rejected, or info requested</p></div>
        </div>
      </section>

      <section className="funding-layout">
        <aside className="funding-sidebar">
          <div className="funding-sidebar-card">
            <h2>Choose your funding path</h2>
            <div className="funding-type-list">
              {Object.entries(fundTypes).map(([key, type]) => (
                <button key={key} type="button" className={`funding-type-pill ${fundingType === key ? "active" : ""}`} onClick={() => handleFundingTypeChange(key)}>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="funding-form-panel">
          <div className="funding-panel-header">
            <div>
              <p className="section-label">{currentType.label}</p>
              <h2>{currentType.description}</h2>
            </div>
            <div className="funding-badge">{fundingType === "businessVenture" ? "Business" : fundingType === "startup" ? "Startup" : "Property"}</div>
          </div>

          <form className="funding-form" onSubmit={handleSubmit}>
            {/* Section 1: Base Request */}
            <div className="funding-section">
              <div className="section-heading"><span className="section-number">1</span><div><h3>Funding request</h3><p>Tell us how much you need and the objective.</p></div></div>
              <div className="field-grid">
                <label className="field-group"><span>Requested amount</span><input name="amount" value={form.amount} onChange={handleTextChange} type="number" placeholder="Enter amount in INR" required /></label>
                <label className="field-group"><span>Tenure (months)</span><input name="tenureMonths" value={form.tenureMonths} onChange={handleTextChange} type="number" placeholder="e.g. 12" /></label>
              </div>
              <label className="field-group full-width"><span>Funding purpose</span><textarea name="purpose" value={form.purpose} onChange={handleTextChange} rows="3" placeholder="Describe how the funds will be used" required /></label>
            </div>

            {/* Section 2: Category Details */}
            <div className="funding-section">
              <div className="section-heading"><span className="section-number">2</span><div><h3>Category details</h3><p>Provide core information for the selected funding type.</p></div></div>
              <div className="field-grid">
                {currentType.fields.map((field) => (
                  <label key={field.name} className={`field-group ${field.type === "textarea" ? "full-width" : ""}`}>
                    <span>{field.label}</span>
                    {field.type === "select" ? (
                      <select name={field.name} value={form[fundingType][field.name]} onChange={(e) => handleNestedChange(e, fundingType)}>
                        <option value="">Select Option</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea name={field.name} value={form[fundingType][field.name]} onChange={(e) => handleNestedChange(e, fundingType)} rows="4" placeholder={field.placeholder} />
                    ) : (
                      <input name={field.name} type={field.type || "text"} value={form[fundingType][field.name]} onChange={(e) => handleNestedChange(e, fundingType)} placeholder={field.placeholder} />
                    )}
                  </label>
                ))}
              </div>

              {/* Startup Specific: Traction, Usage, Founders */}
              {fundingType === "startup" && (
                <div className="extra-fields">
                  <h4>Traction & Usage</h4>
                  <div className="field-grid">
                    {['users', 'revenue', 'growthRate'].map(k => (
                      <label key={k} className="field-group"><span>{k.toUpperCase()}</span><input type="number" name={k} value={form.startup.traction[k]} onChange={e => handleNestedChange(e, 'startup', 'traction')} /></label>
                    ))}
                    {['product', 'marketing', 'hiring', 'operations'].map(k => (
                      <label key={k} className="field-group"><span>Fund Usage: {k} (%)</span><input type="number" name={k} value={form.startup.fundUsage[k]} onChange={e => handleNestedChange(e, 'startup', 'fundUsage')} /></label>
                    ))}
                  </div>
                  <h4>Founders</h4>
                  {form.startup.founders.map((f, i) => (
                    <div key={i} className="field-grid array-item">
                      <input placeholder="Name" name="name" value={f.name} onChange={e => handleArrayChange(i, e, 'startup', 'founders')} />
                      <input placeholder="Role" name="role" value={f.role} onChange={e => handleArrayChange(i, e, 'startup', 'founders')} />
                      <input placeholder="LinkedIn" name="linkedin" value={f.linkedin} onChange={e => handleArrayChange(i, e, 'startup', 'founders')} />
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={() => addArrayItem('startup', 'founders', {name:"", role:"", experience:"", linkedin:""})}>+ Add Founder</button>
                </div>
              )}

              {/* Business Specific: Assets & Liabilities */}
              {fundingType === "businessVenture" && (
                <div className="extra-fields">
                  <h4>Assets & Liabilities</h4>
                  {form.businessVenture.assets.map((a, i) => (
                    <div key={i} className="field-grid array-item">
                      <input placeholder="Asset Name" name="name" value={a.name} onChange={e => handleArrayChange(i, e, 'businessVenture', 'assets')} />
                      <input placeholder="Value" name="value" type="number" value={a.value} onChange={e => handleArrayChange(i, e, 'businessVenture', 'assets')} />
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={() => addArrayItem('businessVenture', 'assets', {name:"", value:""})}>+ Add Asset</button>
                </div>
              )}

              {/* Property Specific: Location & Legal */}
              {fundingType === "property" && (
                <div className="extra-fields">
                  <h4>Property Location</h4>
                  <div className="field-grid">
                    {['address', 'city', 'state', 'pincode'].map(k => (
                      <label key={k} className="field-group"><span>{k}</span><input name={k} value={form.property.location[k]} onChange={e => handleNestedChange(e, 'property', 'location')} /></label>
                    ))}
                  </div>
                  <h4>Legal Verification</h4>
                  <div className="consent-grid">
                    <label className="consent-item"><input type="checkbox" name="isDisputed" checked={form.property.legal.isDisputed} onChange={e => handleNestedChange(e, 'property', 'legal')} /><span>Is Property Disputed?</span></label>
                    <label className="consent-item"><input type="checkbox" name="titleClear" checked={form.property.legal.titleClear} onChange={e => handleNestedChange(e, 'property', 'legal')} /><span>Is Title Clear?</span></label>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Documentation */}
            <div className="funding-section">
              <div className="section-heading"><span className="section-number">3</span><div><h3>Documentation</h3><p>Upload required files for verification.</p></div></div>
              <div className="upload-grid">
                {currentType.uploads.map((upload) => (
                  <label key={upload.name} className="upload-card">
                    <span>{upload.label}</span>
                    <input type="file" name={upload.name} accept="application/pdf,image/*" multiple={Boolean(upload.multiple)} onChange={handleFileChange} />
                    <div className="upload-meta"><span>{files[upload.name] ? (Array.isArray(files[upload.name]) ? `${files[upload.name].length} files selected` : files[upload.name].name) : (upload.optional ? "Optional" : "Required")}</span></div>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: Consent & Disclosures */}
            <div className="funding-section">
              <div className="section-heading"><span className="section-number">4</span><div><h3>Consent & risk disclosures</h3><p>Review and disclose details.</p></div></div>
              <div className="consent-grid">
                {['hasExistingLoans', 'hasDefaultedBefore', 'hasLegalCases', 'hasCriminalRecord', 'politicallyExposed'].map(k => (
                  <label key={k} className="consent-item">
                    <input type="checkbox" name={k} checked={form.disclosures[k]} onChange={e => handleNestedChange(e, 'disclosures')} />
                    <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
              <label className="field-group full-width"><span>Disclosure details</span><textarea name="details" value={form.disclosures.details} onChange={e => handleNestedChange(e, 'disclosures')} rows="3" placeholder="Provide more context on the above disclosures" /></label>
              <label className="field-group full-width"><span>Key risk factors</span><input name="riskFactors" value={form.riskFactors} onChange={handleTextChange} type="text" placeholder="Separate items with commas" /></label>
              <div className="consent-grid" style={{marginTop: '20px'}}>
                {['agreedToTerms', 'agreedToPrivacyPolicy', 'agreedToCreditCheck'].map(k => (
                  <label key={k} className="consent-item">
                    <input type="checkbox" name={k} checked={form.consent[k]} onChange={e => handleNestedChange(e, 'consent')} />
                    <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit funding request"}</button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Funding;