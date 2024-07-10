import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CompanyImage from "../images/comviva_logo.png";
import { ConfigContext } from "../index";

const Home = () => {
  const navigate = useNavigate();
  const config = useContext(ConfigContext);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <div className="home-container">
        <img
          src={CompanyImage}
          alt="Company Logo"
          className="company-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }} // Add cursor pointer style for better UX
        />
        <div className="button-container">
          <button onClick={handleLoginClick}>Login</button>
          <button onClick={handleRegisterClick}>Register</button>
        </div>
      </div>
      <div className="company-details">
        <h2>
          <strong>{config.project_title}</strong>
        </h2>
        <p>
          The MobiLytix™ Rewards (MR) platform is an end-to-end engagement
          marketing solution designed to create reward-based promotional
          campaigns and loyalty programs. These, in turn, are aimed at enabling
          enterprises to achieve their business KPIs throughout the consumer’s
          lifecycle journey.
        </p>
      </div>

      <div className="text-blocks">
        <div className="text-block">
          <h3>Member Management</h3>
          <p>
            Register and control the end-user status and eligibility in the
            system <br />
            Subscriber profiling <br /> Enrolment / de-enrolment
          </p>
        </div>
        <div className="text-block">
          <h3>Hierarchy Maintenance</h3>
          <p>
            Automated and flexible maintenance of customer hierarchy <br />
            Customized rule configuration
            <br /> Tier management <br /> Badges
          </p>
        </div>
        <div className="text-block">
          <h3>Program Administration</h3>
          <p>
            End-to-end loyalty program management right from target association,
            definition to run stage <br />
            Workflow Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
