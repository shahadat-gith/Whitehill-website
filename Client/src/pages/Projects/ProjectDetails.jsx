import React, { useState, useEffect } from "react";
import "./ProjectDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import api from "../../Configs/axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { formatCurrency, getRiskClass } from "../../Utils/utility";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /* ================= FETCH PROJECT ================= */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/project/get-project/${id}`);
        if (data.success) {
          setProject(data.project);
        } else {
          toast.error("Project not found");
          navigate("/projects");
        }
      } catch (error) {
        toast.error("Project not found");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading || !project) {
    return <Loader />;
  }

  /* ================= INVESTMENT HANDLER ================= */
  const handleInvest = async (e) => {
    e.preventDefault();

    if(!user){
      toast.error("Please login to invest!")
      setTimeout(()=>{
        navigate("/login")
      },2000)

      return;
    }
    const investAmount = Number(amount);

    if (!investAmount || investAmount < project.minCommitment) {
      toast.error(
        `Minimum investment is ${formatCurrency(project.minCommitment)}`
      );
      return;
    }

    setPaymentLoading(true);

    try {
      const { data } = await api.post("/api/transaction/create-order", {
        amount: investAmount,
      });

      if (!data.success) throw new Error("Failed to create order");

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: project.name,
        description: `Investment in ${project.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          await verifyPayment(response, investAmount);
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: "#2d3547" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPaymentLoading(false);
      });
    } catch (error) {
      toast.error(error.message || "Failed to initiate payment");
      setPaymentLoading(false);
    }
  };

  /* ================= VERIFY PAYMENT ================= */
  const verifyPayment = async (response, investAmount) => {
    try {
      const { data } = await api.post("/api/transaction/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: investAmount,
        projectId: project._id,
      });

      if (data.success) {
        toast.success("Investment successful!");
        setAmount("");

        setUser({
          ...user,
          totalInvested: user.totalInvested + investAmount,
        });

        setTimeout(() => navigate("/profile"), 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment verification failed"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="pd-container">
      {/* Main Content */}
      <div className="pd-content">
        {/* Left Column */}
        <div className="pd-left">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              <img
                src={
                  project.images?.[activeImageIndex]?.url ||
                  project.images?.[activeImageIndex]
                }
                alt={project.name}
              />
              <div className={`pd-risk-badge ${getRiskClass(project.risk)}`}>
                {project.risk} Risk
              </div>
            </div>

            {project.images?.length > 1 && (
              <div className="pd-gallery-thumbs">
                {project.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url || img}
                    alt={`Thumbnail ${index + 1}`}
                    className={activeImageIndex === index ? "active" : ""}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="pd-info-card">
            <div className="pd-header">
              <div>
                <h1>{project.name}</h1>
                <div className="pd-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {project.city}, {project.state}
                </div>
              </div>
              <span className="pd-type-badge">{project.type}</span>
            </div>

            {project.rera && (
              <div className="pd-rera">
                <i className="fas fa-certificate"></i>
                RERA: {project.rera}
              </div>
            )}

            <p className="pd-description">{project.description}</p>

            <div className="pd-details-grid">
              <div className="pd-detail-item">
                <i className="fas fa-flag"></i>
                <div>
                  <span className="pd-detail-label">Stage</span>
                  <span className="pd-detail-value">{project.stage}</span>
                </div>
              </div>

              <div className="pd-detail-item">
                <i className="fas fa-clock"></i>
                <div>
                  <span className="pd-detail-label">Target Hold</span>
                  <span className="pd-detail-value">{project.targetHold}</span>
                </div>
              </div>

              <div className="pd-detail-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <span className="pd-detail-label">Target Return</span>
                  <span className="pd-detail-value pd-highlight-success">
                    {project.targetReturn}
                  </span>
                </div>
              </div>

              <div className="pd-detail-item">
                <i className="fas fa-wallet"></i>
                <div>
                  <span className="pd-detail-label">Min. Investment</span>
                  <span className="pd-detail-value pd-highlight-primary">
                    {formatCurrency(project.minCommitment)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pd-highlights">
              <h3>Key Highlights</h3>
              <ul>
                {project.highlights?.map((highlight, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i>
                    {highlight.text || highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="pd-right">
          <div className="pd-invest-card">
            <h2>Invest in this Project</h2>
            <p className="pd-invest-subtitle">
              Start building your portfolio with as low as{" "}
              {formatCurrency(project.minCommitment)}
            </p>

            <form onSubmit={handleInvest}>
              <div className="pd-input-group">
                <label>Investment Amount</label>
                <div className="pd-input-wrapper">
                  <span className="pd-input-prefix">₹</span>
                  <input
                    type="number"
                    placeholder={project.minCommitment.toLocaleString()}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={project.minCommitment}
                    required
                  />
                </div>
                <span className="pd-input-hint">
                  Minimum: {formatCurrency(project.minCommitment)}
                </span>
              </div>

              <div className="pd-quick-amounts">
                <button
                  type="button"
                  onClick={() =>
                    setAmount(project.minCommitment.toString())
                  }
                >
                  {formatCurrency(project.minCommitment)}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAmount((project.minCommitment * 2).toString())
                  }
                >
                  {formatCurrency(project.minCommitment * 2)}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAmount((project.minCommitment * 5).toString())
                  }
                >
                  {formatCurrency(project.minCommitment * 5)}
                </button>
              </div>

              {amount && Number(amount) >= project.minCommitment && (
                <div className="pd-summary">
                  <div className="pd-summary-item">
                    <span>Investment Amount</span>
                    <span>{formatCurrency(Number(amount))}</span>
                  </div>
                  <div className="pd-summary-item">
                    <span>Expected Return</span>
                    <span className="pd-summary-highlight">
                      {project.targetReturn}
                    </span>
                  </div>
                  <div className="pd-summary-item">
                    <span>Target Duration</span>
                    <span>{project.targetHold}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="pd-invest-btn"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Invest Securely
                  </>
                )}
              </button>

              <div className="pd-security-note">
                <i className="fas fa-shield-alt"></i>
                Secured by Razorpay. Your payment is safe and encrypted.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
