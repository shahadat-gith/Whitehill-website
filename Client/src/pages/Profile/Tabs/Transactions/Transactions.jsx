import React, { useState, useEffect } from "react";
import "./Transactions.css";
import api from "../../../../Configs/axios";
import { useAppContext } from "../../../../Context/AppContext";
import toast from "react-hot-toast";
import Loader from "../../../../components/Loader/Loader";
import { formatCurrency, formatDate } from "../../../../Utils/utility";

const Transactions = () => {
  const { user, setUser } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState("");

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/api/transaction/get-transactions");
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Create Razorpay order
  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }

    setPaymentLoading(true);

    try {
      // Create order
      const { data } = await api.post("/api/transaction/create-order", {
        amount: Number(amount),
      });

      if (!data.success) {
        throw new Error("Failed to create order");
      }

      // Razorpay options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Whitehilll",
        description: "Add Funds to Wallet",
        order_id: data.order.id,
        handler: async (response) => {
          await verifyPayment(response);
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#2d3547",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
        setPaymentLoading(false);
      });
    } catch (error) {
      toast.error(error.message || "Failed to initiate payment");
      setPaymentLoading(false);
    }
  };

  // Verify payment
  const verifyPayment = async (response) => {
    try {
      const { data } = await api.post("/api/transaction/verify-payment", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: Number(amount),
      });

      if (data.success) {
        toast.success("Payment successful!");
        setAmount("");
        setShowAddFunds(false);
        fetchTransactions();
        
        // Update user's total invested
        setUser({
          ...user,
          totalInvested: user.totalInvested + Number(amount),
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment verification failed");
    } finally {
      setPaymentLoading(false);
    }
  };



  if (loading) return <Loader />;

  return (
    <div className="txn-container">
      {/* Header */}
      <div className="txn-header">
        <div className="txn-header-content">
          <h1>Transactions</h1>
          <p>View and manage your investment transactions</p>
        </div>
        <button
          className="txn-btn-primary"
          onClick={() => setShowAddFunds(!showAddFunds)}
        >
          <i className="fas fa-plus-circle"></i>
          Add Funds
        </button>
      </div>

      {/* Add Funds Form */}
      {showAddFunds && (
        <div className="txn-add-funds">
          <h3>Add Funds to Your Account</h3>
          <form onSubmit={handleAddFunds}>
            <div className="txn-input-group">
              <label>Enter Amount</label>
              <input
                type="number"
                placeholder="₹ 1,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="txn-form-actions">
              <button
                type="button"
                className="txn-btn-secondary"
                onClick={() => {
                  setShowAddFunds(false);
                  setAmount("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="txn-btn-primary"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i> Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="txn-stats">
        <div className="txn-stat-card">
          <div className="txn-stat-icon txn-stat-total">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="txn-stat-content">
            <p className="txn-stat-label">Total Invested</p>
            <p className="txn-stat-value">
              {formatCurrency(user.totalInvested || 0)}
            </p>
          </div>
        </div>

        <div className="txn-stat-card">
          <div className="txn-stat-icon txn-stat-count">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="txn-stat-content">
            <p className="txn-stat-label">Total Transactions</p>
            <p className="txn-stat-value">{transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="txn-list-container">
        <div className="txn-list-header">
          <h2>Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="txn-empty-state">
            <i className="fas fa-inbox"></i>
            <p>No transactions yet</p>
            <span>Start investing to see your transactions here</span>
          </div>
        ) : (
          <div className="txn-list">
            {transactions.map((txn) => (
              <div key={txn._id} className="txn-item">
                <div className="txn-item-icon">
                  <i className="fas fa-arrow-down"></i>
                </div>
                <div className="txn-item-details">
                  <p className="txn-item-title">Investment Added</p>
                  <p className="txn-item-date">{formatDate(txn.date)}</p>
                  <p className="txn-item-id">
                    Payment ID: {txn.razorpay_payment_id}
                  </p>
                </div>
                <div className="txn-item-amount">
                  <p className="txn-amount-value">
                    +{formatCurrency(txn.amount)}
                  </p>
                  <span className="txn-status-badge">
                    <i className="fas fa-check-circle"></i> Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;