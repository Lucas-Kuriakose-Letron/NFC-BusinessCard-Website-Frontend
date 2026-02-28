import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var bgColor = "rgb(255, 209, 134)";
var mainOrange = "#ff6600";
var textColor = "#333333";
var lightOrange = "rgb(255, 153, 51)";
var borderColor = "#999999";
var bodyFont       = "'Lato', sans-serif";
var titleFont      = "'Times New Roman', serif";

var globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #ffaa00;
  }
  input, button {
    font-family: Arial;
  }
  a {
    text-decoration: none;
  }
  .navLink {
    color: #ff8000;
    font-size: 14px;
    padding: 4px 0;
  }
  .navLink:hover {
    color: #be5600;
  }
`;

var inputStyle = {
  padding: "11px 13px",
  border: "1.5px solid #d4c9b8",
  fontSize: "14px",
  color: "#1c1917",
  backgroundColor: "#fdfcfa",
  width: "100%",
};

export default function Appointments() {
  var [profileData, setProfileData] = useState(null);
  var [fullName,    setFullName]    = useState("");
  var [phoneNumber, setPhoneNumber] = useState("");
  var [emailAddress, setEmailAddress] = useState("");
  var [preferredDate, setPreferredDate] = useState("");
  var [preferredTime, setPreferredTime] = useState("");
  var [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(function() {
    fetch("http://localhost:5000/profile")
      .then(function(response) { return response.json(); })
      .then(function(data) { setProfileData(data); });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    var appointmentData = {
      name:  fullName,
      phone: phoneNumber,
      email: emailAddress,
      date:  preferredDate,
      time:  preferredTime,
    };

    var response = await fetch("http://localhost:5000/requestAppointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    });

    if (response.ok) {
      setFormSubmitted(true);
    }
  }

  return (
    <div style={{backgroundColor: bgColor, fontFamily: bodyFont }}>
      <style>{globalStyles}</style>

      <nav style={{ backgroundColor: bgColor, borderBottom: "1px solid " + borderColor, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontFamily: titleFont, fontSize: "17px", color: mainOrange }}>Schedule</span>
        <div style={{ display: "flex", gap: "22px" }}>
          <Link to="/" className="navLink">Home</Link>
          <Link to="/chatbuddy" className="navLink">Chat</Link>
        </div>
      </nav>

      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 48px", gap: "14px" }}>

        {profileData && profileData.pricing && (
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px 20px", width: "100%", maxWidth: "480px", border: "1px solid " + borderColor }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#9c9189", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>
              Pricing
            </p>
            <p style={{ fontSize: "14px", color: "#4a4540", lineHeight: "1.6" }}>
              {profileData.pricing}
            </p>
          </div>
        )}

        <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "22px", width: "100%", maxWidth: "480px", border: "1px solid " + borderColor, boxShadow: "0 2px 10px rgba(28, 25, 23, 0.05)", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h1 style={{ fontFamily: titleFont, fontSize: "22px", color: mainOrange }}>Book an appointment</h1>
          <p style={{ fontSize: "14px", color: "#7a7067", lineHeight: "1.55" }}>
            Fill this out and I'll confirm by email. If I need to reschedule, you'll hear from me right away.
          </p>

          {formSubmitted ? (
            <div style={{ backgroundColor: "#f0f9f4", border: "1px solid #b8dfc8", borderRadius: "8px", padding: "16px" }}>
              <p style={{ color: "#2d6a4a", fontSize: "14px", fontWeight: 500 }}>
                Request sent — I'll be in touch to confirm.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              <label style={{ fontSize: "13px", fontWeight: 500, color: "#4a4540" }}>Your name</label>
              <input placeholder="Name" value={fullName} onChange={function(e) { setFullName(e.target.value); }} style={inputStyle} required />

              <label style={{ fontSize: "13px", fontWeight: 500, color: "#4a4540" }}>Phone number</label>
              <input type="tel" placeholder="123-456-7890" value={phoneNumber} onChange={function(e) { setPhoneNumber(e.target.value); }} style={inputStyle} required />

              <label style={{ fontSize: "13px", fontWeight: 500, color: "#4a4540" }}>Email address</label>
              <input type="email" placeholder="example@gmail.com" value={emailAddress} onChange={function(e) { setEmailAddress(e.target.value); }} style={inputStyle} required />
              <p style={{ fontSize: "12px", color: "#9c9189", marginTop: "-6px" }}>
                You'll get an email if your request can or can't be approved.
              </p>

              <label style={{ fontSize: "13px", fontWeight: 500, color: "#4a4540" }}>Preferred date</label>
              <input type="date" value={preferredDate} onChange={function(e) { setPreferredDate(e.target.value); }} style={inputStyle} required />

              <label style={{ fontSize: "13px", fontWeight: 500, color: "#4a4540" }}>Preferred time</label>
              <input type="time" value={preferredTime} onChange={function(e) { setPreferredTime(e.target.value); }} style={inputStyle} required />

              <button type="submit" style={{ padding: "13px", borderRadius: "8px", border: "none", backgroundColor: mainOrange, color: bgColor, fontSize: "14px", fontWeight: 600, cursor: "pointer", marginTop: "4px" }}>
                Send request
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}