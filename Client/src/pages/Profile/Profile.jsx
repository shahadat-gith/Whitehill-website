// Profile.js
import React, { useState } from 'react';
import './Profile.css';
import { useAppContext } from '../../Context/AppContext';
import Loader from '../../components/Loader/Loader';
import { formatCurrency, getStatusColor } from "./utility"
import Personal from './Tabs/Personal';
import KycDetails from './Tabs/KycDetails';
import Bank from './Tabs/Bank';
import Security from './Tabs/Security';
import Preferences from './Tabs/Preferences';
import { useSearchParams } from 'react-router-dom';

const Profile = () => {
    const { loading, user } = useAppContext()

    const [userData, setUserData] = useState({
        fullName: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        image: '/profile_demo_pic.jpg',
        role: 'Investor',
        accountStatus: 'Active',
        isVerified: true,
        mfaEnabled: false,
        lastLogin: '2024-12-15T10:30:00',
        kyc: {
            panNumber: 'ABCDE1234F',
            addressProofType: 'Aadhaar',
            aadhaarVerified: true,
            status: 'Verified',
            verifiedAt: '2024-11-20T14:00:00'
        },
        bankDetails: {
            accountHolderName: 'Rajesh Kumar',
            accountNumber: '1234567890',
            ifsc: 'SBIN0001234',
            bankName: 'State Bank of India',
            branch: 'Guwahati Main Branch'
        },
        totalInvested: 500000,
        portfolioValue: 575000,
        totalDistributions: 45000,
        nextPayoutDate: '2025-01-15',
        notificationPrefs: {
            email: true,
            sms: false,
            whatsapp: true
        }
    });


    const [searchParams, setSearchParams] = useSearchParams();
    const TABS = ['personal', 'kyc', 'bank', 'security', 'preferences'];
    const activeTab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'personal';

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };


    if (loading) return <Loader />

    return (
        <div className="prf-profile-container">
            {/* Header Section */}
            <div className="prf-profile-header">
                <div className="prf-profile-header-content">
                    <div className="prf-profile-avatar-section">
                        <div className="prf-profile-avatar">
                            {user.image ? (
                                <img src={user.image} alt={user.fullName} />
                            ) : (
                                <span className="prf-avatar-initials">
                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                            )}
                        </div>
                        <button className="prf-btn-upload">
                            {user.image ?
                                <>
                                    <i className="fas fa-upload"></i> Change Photo
                                </>
                                :
                                <>
                                    <i className="fas fa-upload"></i> Upload Photo
                                </>

                            }

                        </button>
                    </div>

                    <div className="prf-profile-header-info">
                        <h1>{user.fullName}</h1>
                        <p className="prf-profile-email">{user.email}</p>
                        <div className="prf-profile-badges">
                            <span className={`prf-badge ${getStatusColor(user.accountStatus)}`}>
                                {user.accountStatus}
                            </span>
                            {user.kyc &&
                                <span className={`prf-badge ${getStatusColor(user.kyc?.status)}`}>
                                    KYC: {user.kyc?.status}
                                </span>

                            }
                        </div>
                    </div>
                </div>

                <div className="prf-profile-stats">
                    <div className="prf-stat-card prf-stat-invested">
                        <div className="prf-stat-icon">
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="prf-stat-content">
                            <p className="prf-stat-label">Total Invested</p>
                            <p className="prf-stat-value">{formatCurrency(user.totalInvested)}</p>
                        </div>
                    </div>
                    <div className="prf-stat-card prf-stat-portfolio">
                        <div className="prf-stat-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="prf-stat-content">
                            <p className="prf-stat-label">Portfolio Value</p>
                            <p className="prf-stat-value">{formatCurrency(user.portfolioValue)}</p>
                        </div>
                    </div>
                    <div className="prf-stat-card prf-stat-distributions">
                        <div className="prf-stat-icon">
                            <i className="fas fa-hand-holding-usd"></i>
                        </div>
                        <div className="prf-stat-content">
                            <p className="prf-stat-label">Total Distributions</p>
                            <p className="prf-stat-value">{formatCurrency(user.totalDistributions)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="prf-profile-tabs">
                <button
                    className={`prf-tab ${activeTab === 'personal' ? 'prf-active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <i className="fas fa-user"></i> Personal Info
                </button>

                <button
                    className={`prf-tab ${activeTab === 'kyc' ? 'prf-active' : ''}`}
                    onClick={() => setActiveTab('kyc')}
                >
                    <i className="fas fa-id-card"></i> KYC Details
                </button>

                <button
                    className={`prf-tab ${activeTab === 'bank' ? 'prf-active' : ''}`}
                    onClick={() => setActiveTab('bank')}
                >
                    <i className="fas fa-university"></i> Bank Details
                </button>

                <button
                    className={`prf-tab ${activeTab === 'security' ? 'prf-active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    <i className="fas fa-shield-alt"></i> Security
                </button>

                <button
                    className={`prf-tab ${activeTab === 'preferences' ? 'prf-active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                >
                    <i className="fas fa-cog"></i> Preferences
                </button>
            </div>





            {/* Content Area */}
            <div className="prf-profile-content">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                    <Personal user={user} />
                )}

                {/* KYC Details Tab */}
                {activeTab === 'kyc' && (
                    <KycDetails user={user} />
                )}

                {/* Bank Details Tab */}
                {activeTab === 'bank' && (
                    <Bank userData={userData} />
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <Security userData={userData} setUserData={setUserData} />
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <Preferences userData={userData} setUserData={setUserData} />
                )}
            </div>
        </div>
    );
};

export default Profile;