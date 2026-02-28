import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var bgColor    = "rgb(255, 209, 134)";
var mainOrange = "#ff6600";
var textColor  = "#333333";
var lightOrange = "rgb(255, 153, 51)";
var bodyFont   = "'Lato', sans-serif";
var titleFont  = "'Times New Roman', serif";

var globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: rgb(255, 170, 0);
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
    color: #cc6600;
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


export default function App() {

  var [profileData, setProfileData]         = useState(null);
  var [selectedRegion, setSelectedRegion]   = useState("");
  var [contactName, setContactName]         = useState("");
  var [contactPhone, setContactPhone]       = useState("");
  var [contactMessage, setContactMessage]   = useState("");
  var [formSubmitted, setFormSubmitted]     = useState(false);


  useEffect(function() {
    fetch("https://nfc-businesscard-website-backend.onrender.com/profile")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        setProfileData(data);
        var regionNames = Object.keys(data.locations);
        setSelectedRegion(regionNames[0]);
      });
  }, []);


  function downloadContactFile() {
    window.location.href = "https://nfc-businesscard-website-backend.onrender.com/downloadClientContact?region=" + encodeURIComponent(selectedRegion);
  }


  async function handleContactSubmit(event) {
    event.preventDefault();

    var formData = {
      name:     contactName,
      phone:    contactPhone,
      message:  contactMessage,
      location: selectedRegion,
    };

    var response = await fetch("https://nfc-businesscard-website-backend.onrender.com/submitNumber", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormSubmitted(true);
      setContactName("");
      setContactPhone("");
      setContactMessage("");
    }
  }


  if (profileData === null) {
    return <div>Loading...</div>;
  }


  return (
    <div style={{ backgroundColor: bgColor, fontFamily: bodyFont }}>
      <style>{globalStyles}</style>

      <nav style={{
        backgroundColor: bgColor,
        borderBottom: "1px solid #999999",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: titleFont, fontSize: "17px", color: mainOrange }}>
          {profileData.company || profileData.name}
        </span>
        <div style={{ display: "flex", gap: "22px" }}>
          <Link to="/chatbuddy"    className="navLink">Chat</Link>
          <Link to="/appointments" className="navLink">Schedule</Link>
          <Link to="/admin"        className="navLink">Admin</Link>
        </div>
      </nav>

      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        gap: "10px",
      }}>

        {/*Profile*/}
        <div style={{
          backgroundColor: lightOrange,
          padding: "23px",
          width: "100%",
          maxWidth: "475px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>

          {/* photo and name */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {profileData.photo_url && (
              <img
                src={profileData.photo_url}
                alt={profileData.name}
                style={{ width: 72, height: 72 }}
              />
            )}
            <div>
              <h1 style={{ fontFamily: titleFont, fontSize: "21px", color: "#f5f0e8", lineHeight: 1.3 }}>
                {profileData.company || profileData.name}
              </h1>
              <p style={{ fontSize: "15px", color: "#9a4000" }}>
                {profileData.name}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p style={{ fontSize: "14px", color: "#3c3935" }}>
            {profileData.bio}
          </p>

          {/* Region picker and download */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "15px", color: "#7a6067" }}>
              Save My Contact
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={selectedRegion}
                onChange={function(e) { setSelectedRegion(e.target.value); }}
                style={{
                  flex: 1,
                  padding: "11px 13px",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backgroundColor: "rgb(239, 165, 75)",
                  color: textColor,
                  fontSize: "14px",
                }}
              >
                {Object.keys(profileData.locations).map(function(regionName) {
                  return (
                    <option key={regionName} value={regionName}>
                      {regionName}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={downloadContactFile}
                style={{
                  padding: "9px 16px",
                  backgroundColor: lightOrange,
                  color: "#fffefe",
                  fontSize: "14px",
                }}
              >
                Download
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "#794b00" }}>
              {"Number for location: " + profileData.locations[selectedRegion]}
            </p>
          </div>
        </div>


        {/* contact Form */}
        <div style={{
          backgroundColor: "#fff",
          padding: "25px",
          width: "100%",
          maxWidth: "475px",
          display: "flex",
          flexDirection: "column",
          gap: "13px",
        }}>
          <h2 style={{ fontFamily: titleFont, fontSize: "20px", color: mainOrange }}>Leave your number</h2>
          <p style={{ fontSize: "14px", color: "#7d756f" }}>So I can reach out to you directly.</p>

          {formSubmitted ? (
            <div style={{ backgroundColor: "#f0f9f4", padding: "14px 16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 500 }}>Got it — I\'ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <label style={{ fontSize: "14px", fontWeight: 500, color: "#cd6600" }}>Your name</label>
              <input
                placeholder="Type Your Name"
                value={contactName}
                onChange={function(e) { setContactName(e.target.value); }}
                style={inputStyle}
                required
              />

              <label style={{ fontSize: "14px", fontWeight: 500, color: "#b55c03" }}>Phone number</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                value={contactPhone}
                onChange={function(e) { setContactPhone(e.target.value); }}
                style={inputStyle}
                required
              />

              <label style={{ fontSize: "14px", fontWeight: 500, color: "#a55200" }}>
                Anything you need to say?{" "}
                <span style={{ color: "#ff9730", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                placeholder="Say something to help me prepare for our meeting"
                value={contactMessage}
                onChange={function(e) { setContactMessage(e.target.value); }}
                style={{ ...inputStyle, minHeight: "75px", resize: "vertical" }}
              />

              <button
                type="submit"
                style={{
                  padding: "13px",
                  border: "none",
                  backgroundColor: mainOrange,
                  color: bgColor,
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send
              </button>

            </form>
          )}
        </div>

      </main>
    </div>
  );
}
