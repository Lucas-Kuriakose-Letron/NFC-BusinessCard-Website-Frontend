import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var ADMIN_PASSWORD = "CSIA";
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
  input, select, textarea, button {
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
  }`;
var inputStyle = {
  padding: "11px 13px",
  border: "1.5px solid #d4c9b8",
  fontSize: "14px",
  color: "#1c1917",
  backgroundColor: "#fdfcfa",
  width: "100%",
};
var cardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export default function AdminDashboard() {
  var [passwordInput, setPasswordInput] = useState("");
  var [isLoggedIn, setIsLoggedIn] = useState(false);
  var [contactsList, setContactsList] = useState([]);
  var [appointmentsList, setAppointmentsList] = useState([]);

  useEffect(function() {
    if (isLoggedIn === false) {
      return;
    }
    fetch("https://nfc-businesscard-website-backend.onrender.com/admin/numbers").then(function(response) { return response.json(); }).then(function(data) { setContactsList(data); });
    fetch("https://nfc-businesscard-website-backend.onrender.com/admin/appointments").then(function(response) { return response.json(); }).then(function(data) { setAppointmentsList(data); });
  }, [isLoggedIn]);

  async function updateAppointmentStatus(appointmentIndex, newStatus) {
    await fetch("https://nfc-businesscard-website-backend.onrender.com/admin/updateAppointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: appointmentIndex, status: newStatus }),
    });
    fetch("https://nfc-businesscard-website-backend.onrender.com/admin/appointments")
      .then(function(response) { return response.json(); })
      .then(function(data) { setAppointmentsList(data); });
  }

  function handleLogin() {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Wrong password.");
    }
  }

  function getBadgeStyle(status) {
    if (status === "approved") {
      return { backgroundColor: "#e6f4ed", color: "#2d6a4a" };
    }
    if (status === "denied") {
      return { backgroundColor: "#fce8e8", color: "#8b2020" };
    }
    return { backgroundColor: "#fef3e2", color: "#7a4f1a" };
  }


  if (isLoggedIn === false) {
    return (
      <div style={{ backgroundColor: bgColor, fontFamily: bodyFont, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <style>{globalStyles}</style>
        <div style={{ ...cardStyle, maxWidth: "380px", gap: "14px" }}>
          <h2 style={{ fontFamily: titleFont, fontSize: "22px", color: mainOrange }}>Admin access</h2>
          <p style={{ fontSize: "14px", color: "#7a7067" }}>Enter your password to continue.</p>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={function(e) { setPasswordInput(e.target.value); }}
            style={inputStyle}
            onKeyDown={function(e) {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <button
            onClick={handleLogin}
            style={{ padding: "12px", border: "none", backgroundColor: mainOrange, color: bgColor, fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={{ backgroundColor: bgColor, fontFamily: bodyFont }}>
      <style>{globalStyles}</style>

      <nav style={{ backgroundColor: bgColor, borderBottom: "1px solid " + borderColor, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: titleFont, fontSize: "17px", color: mainOrange }}>Dashboard</span>
        <div style={{ display: "flex", gap: "22px" }}>
          <Link to="/" className="navLink">Home</Link>
          <Link to="/admin/settings" className="navLink">Settings</Link>
        </div>
      </nav>

      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", gap: "10px" }}>

        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Submitted contacts</h2>
          {contactsList.length === 0 && (
            <p style={{ fontSize: "13px", color: "#b0a898", fontStyle: "italic" }}>Nothing here yet.</p>
          )}
          {contactsList.map(function(contact, index) {
            return (
              <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid #f0ebe3" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: mainOrange }}>{contact.name}</p>
                  <p style={{ fontSize: "12px", color: "#6b625a", marginTop: "2px" }}>{contact.phone} · {contact.location}</p>
                  {contact.message && (
                    <p style={{ fontSize: "12px", color: "#9c9189", fontStyle: "italic", marginTop: "3px" }}>"{contact.message}"</p>
                  )}
                </div>
                <button
                  onClick={function() { window.open("https://nfc-businesscard-website-backend.onrender.com/admin/download/" + index); }}
                  style={{ padding: "6px 11px", border: "1px solid " + borderColor, backgroundColor: bgColor, cursor: "pointer", fontSize: "12px", color: mainOrange, flexShrink: 0 }}
                >
                  ⬇ .vcf
                </button>
              </div>
            );
          })}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Appointment requests</h2>
          {appointmentsList.length === 0 && (
            <p style={{ fontSize: "13px", color: "#b0a898", fontStyle: "italic" }}>Nothing here yet.</p>
          )}
          {appointmentsList.map(function(appointment, index) {
            return (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid #f0ebe3" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: mainOrange }}>{appointment.name}</p>
                  <p style={{ fontSize: "12px", color: "#6b625a", marginTop: "2px" }}>
                    {appointment.phone}
                    {appointment.email ? " · " + appointment.email : ""}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b625a", marginTop: "2px" }}>
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "10px", ...getBadgeStyle(appointment.status) }}>
                    {appointment.status}
                  </span>
                  {appointment.status === "pending" && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={function() { updateAppointmentStatus(index, "approved"); }}
                        style={{ padding: "6px 10px", borderRadius: "6px", border: "none", backgroundColor: "#e6f4ed", color: "#2d6a4a", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={function() { updateAppointmentStatus(index, "denied"); }}
                        style={{ padding: "6px 10px", borderRadius: "6px", border: "none", backgroundColor: "#fce8e8", color: "#8b2020", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
