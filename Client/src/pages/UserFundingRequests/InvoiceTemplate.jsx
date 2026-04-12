
import {
  Page,
  View,
  Text,
  StyleSheet,
  Document,
  Image,
} from "@react-pdf/renderer";
import logo from "/logo.png";

// ─── Company Details ──────────────────────────────────────────────────────────
const COMPANY_DETAILS = {
  name: "WHITEHILL CAPITAL",
  tagline: "INSTITUTIONAL FUNDING SOLUTIONS",
  address: "123 Finance Avenue, Suite 500, New York, NY 10001",
  contact: "info@whitehillcapital.com | +1 212-555-7890",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#334155",
    backgroundColor: "#ffffff",
  },

  // Brand Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottom: "2pt solid #1e3a8a",
    paddingBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
    textTransform: "uppercase",
  },

  // Document Meta
  docMeta: {
    textAlign: "right",
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 5,
  },
  metaLabel: {
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Section Layouts
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  col: {
    width: "45%",
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1pt solid #e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
  },

  // Financial Table
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: "#1e3a8a",
  },
  colDesc: { flex: 3 },
  colAmt: { flex: 1, textAlign: "right", fontWeight: "bold" },

  // Settlement Proof Box
  paymentBox: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 10,
    borderLeft: "4pt solid #0ea5e9",
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 8,
  },
  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    lineHeight: 1.5,
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────
const InvoiceTemplate = ({ data }) => {
  if (!data) return null;

  const {
    invoiceNumber,
    invoiceDate,
    approvalDate,
    customer,
    funding,
    financials,
    payment,
  } = data;


  const formatCurrency = (amount) => {
    const num = Number(amount);

    if (isNaN(num)) return "₹0";

    return `Rs. ${num.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };



  return (
    <Document title={`Invoice-${invoiceNumber}`}>
      <Page size="A4" style={styles.page}>

        {/* BRAND HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image src={logo} style={styles.logo} />
            <View>
              <Text style={styles.brandName}>{COMPANY_DETAILS.name}</Text>
              <Text style={styles.tagline}>{COMPANY_DETAILS.tagline}</Text>
              <Text style={{ fontSize: 8, color: "#64748b", marginTop: 4 }}>
                {COMPANY_DETAILS.address}
              </Text>
            </View>
          </View>

          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>Invoice</Text>
            <View>
              <Text style={styles.metaLabel}>Invoice No</Text>
              <Text style={styles.metaValue}>{invoiceNumber}</Text>
              <Text style={styles.metaLabel}>Settlement Date</Text>
              <Text style={styles.metaValue}>{new Date(invoiceDate).toLocaleDateString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* DETAILS GRID */}
        <View style={styles.grid}>
          <View style={styles.col}>
            <Text style={styles.sectionHeading}>Beneficiary Information</Text>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: "#1e293b" }}>{customer.name}</Text>
            <Text style={{ marginTop: 2 }}>{customer.email}</Text>
            <Text style={{ marginTop: 2 }}>{customer.phone}</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.sectionHeading}>Application Summary</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
              <Text style={{ color: "#64748b" }}>Funding for:</Text>
              <Text style={{ fontWeight: "bold" }}>{funding.type}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
              <Text style={{ color: "#64748b" }}>Tenure:</Text>
              <Text style={{ fontWeight: "bold" }}>{funding.tenure}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#64748b" }}>Approval Status:</Text>
              <Text style={{ fontWeight: "bold", color: "#059669" }}>Approved</Text>
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Financial Breakdown</Text>
            <Text style={styles.colAmt}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>Requested Amount</Text>
            <Text style={styles.colAmt}>{formatCurrency(financials.requestedAmount)}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.colDesc}>Approved Amount</Text>
            <Text style={styles.colAmt}>{formatCurrency(financials.approvedAmount)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>
              Interest Rate
            </Text>
            <Text style={styles.colAmt}>{financials.interestRate}%</Text>
          </View>
        </View>

        {/* SETTLEMENT PROOF */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Digital Settlement Proof</Text>
          <View style={styles.paymentGrid}>
            <View>
              <Text style={styles.metaLabel}>Transaction Hash / ID</Text>
              <Text style={{ fontWeight: "bold", fontSize: 9 }}>{payment.transactionId}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Payment Channel</Text>
              <Text style={{ fontWeight: "bold", fontSize: 9 }}>{payment.method || "Direct Bank Transfer"}</Text>
            </View>

          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            WHITEHILL CAPITAL MANAGEMENT - COMPLIANCE DIVISION
          </Text>
          <Text style={styles.footerText}>
            This is a computer-generated Advice of Disbursement and does not require a physical signature.
            The funds described above have been authorized for release to the beneficiary's registered account.
            For any discrepancies, please contact our support team quoting the Certificate Number.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplate;