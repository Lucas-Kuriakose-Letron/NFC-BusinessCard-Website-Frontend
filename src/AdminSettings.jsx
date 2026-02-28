import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

var ADMIN_PASSWORD = "JamesWesleyCSIA";

var bgColor     = "rgb(255, 209, 134)";
var mainOrange  = "#ff6600";
var lightOrange = "rgb(255, 153, 51)";
var accentColor = "#be5600";
var borderColor = "#999999";
var bodyFont    = "'Lato', sans-serif";
var titleFont   = "'Times New Roman', serif";

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

var cardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};


export default function AdminSettings() {
  var [passwordInput, setPasswordInput] = useState("");
  var [isLoggedIn, setIsLoggedIn]       = useState(false);
  var [profileSettings, setProfileSettings] = useState(null);
  var [chatbotSettings, setChatbotSettings] = useState(null);
  var [changesSaved, setChangesSaved] = useState(false);
  var [newRegionName,   setNewRegionName]   = useState("");
  var [newRegionNumber, setNewRegionNumber] = useState("");
  var [senderEmail,    setSenderEmail]    = useState("");
  var [senderPassword, setSenderPassword] = useState("");
  var [emailSaved,     setEmailSaved]     = useState(false);


  useEffect(function() {
    if (isLoggedIn === false) {
      return;
    }
    fetch("http://localhost:5000/profile").then(function(r) { return r.json(); }).then(function(data) { setProfileSettings(data); });
    fetch("http://localhost:5000/chatbotSettings").then(function(r) { return r.json(); }).then(function(data) { setChatbotSettings(data); });
    fetch("http://localhost:5000/admin/email-config").then(function(r) { return r.json(); }).then(function(data) { setSenderEmail(data.sender_email || ""); });
  }, [isLoggedIn]);


  function handleLogin() {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Wrong password.");
    }
  }

  if (isLoggedIn === false) {
    return (
      <div style={{ backgroundColor: bgColor, fontFamily: bodyFont, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <style>{globalStyles}</style>
        <div style={{ ...cardStyle, maxWidth: "380px", gap: "14px" }}>
          <h2 style={{ fontFamily: titleFont, fontSize: "22px", color: mainOrange }}>Admin access</h2>
          <p style={{ fontSize: "14px", color: "#7a4000" }}>Enter your password to continue.</p>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={function(e) { setPasswordInput(e.target.value); }}
            style={inputStyle}
            onKeyDown={function(e) { if (e.key === "Enter") { handleLogin(); } }}
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

  async function saveAllChanges() {
    await fetch("http://localhost:5000/admin/updateAll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: profileSettings, chatbot: chatbotSettings }),
    });
    setChangesSaved(true);
    setTimeout(function() { setChangesSaved(false); }, 3000);
  }

  async function saveEmailCredentials() {
    await fetch("http://localhost:5000/admin/updateEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_email: senderEmail, sender_password: senderPassword }),
    });
    setSenderPassword("");
    setEmailSaved(true);
    setTimeout(function() { setEmailSaved(false); }, 3000);
  }

  function addNewRegion() {
    if (newRegionName.trim() === "" || newRegionNumber.trim() === "") {
      return;
    }
    var updatedLocations = { ...profileSettings.locations };
    updatedLocations[newRegionName] = newRegionNumber;
    setProfileSettings({ ...profileSettings, locations: updatedLocations });
    setNewRegionName("");
    setNewRegionNumber("");
  }

  function removeRegion(regionName) {
    var updatedLocations = { ...profileSettings.locations };
    delete updatedLocations[regionName];
    setProfileSettings({ ...profileSettings, locations: updatedLocations });
  }

  if (profileSettings === null || chatbotSettings === null) {
    return (
      <div style={{ backgroundColor: bgColor, fontFamily: bodyFont, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgColor, fontFamily: bodyFont }}>
      <style>{globalStyles}</style>

      <nav style={{ backgroundColor: bgColor, borderBottom: "1px solid " + borderColor, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: titleFont, fontSize: "17px", color: mainOrange }}>Settings</span>
        <div style={{ display: "flex", gap: "22px" }}>
          <Link to="/" className="navLink">Home</Link>
          <Link to="/admin" className="navLink">Dashboard</Link>
        </div>
      </nav>

      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", gap: "10px" }}>

        {/* profile */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Your profile</h2>

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Display name</label>
          <input
            value={profileSettings.name}
            onChange={function(e) { setProfileSettings({ ...profileSettings, name: e.target.value }); }}
            style={inputStyle}
          />

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Business / company name</label>
          <input
            value={profileSettings.company || ""}
            onChange={function(e) { setProfileSettings({ ...profileSettings, company: e.target.value }); }}
            style={inputStyle}
            placeholder="Leave blank to use your name"
          />

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Bio</label>
          <textarea
            value={profileSettings.bio}
            onChange={function(e) { setProfileSettings({ ...profileSettings, bio: e.target.value }); }}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
          />

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Profile photo URL</label>
          <input
            value={profileSettings.photo_url || ""}
            onChange={function(e) { setProfileSettings({ ...profileSettings, photo_url: e.target.value }); }}
            style={inputStyle}
            placeholder="https://..."
          />
          {profileSettings.photo_url && (
            <img
              src={profileSettings.photo_url}
              alt=""
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginTop: "8px" }}
            />
          )}
        </div>

        {/* regions */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Regions & numbers</h2>
          <p style={{ fontSize: "13px", color: "#7a4000" }}>
            Each region gets its own phone number. Users pick their region to download the right contact. You can add more numbers and regions.
          </p>

          {Object.keys(profileSettings.locations).map(function(regionName) {
            return (
              <div key={regionName} style={{ display: "flex", gap: "10px", alignItems: "flex-end", backgroundColor: lightOrange, padding: "12px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#3c1a00", textTransform: "uppercase", marginBottom: "5px" }}>
                    {regionName}
                  </p>
                  <input
                    value={profileSettings.locations[regionName]}
                    onChange={function(e) {
                      var updatedLocations = { ...profileSettings.locations };
                      updatedLocations[regionName] = e.target.value;
                      setProfileSettings({ ...profileSettings, locations: updatedLocations });
                    }}
                    style={inputStyle}
                    placeholder="Phone number"
                  />
                </div>
                <button
                  onClick={function() { removeRegion(regionName); }}
                  style={{ padding: "8px 12px", border: "none", backgroundColor: "#fce8e8", color: "#8b2020", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", alignSelf: "flex-end" }}
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div style={{ border: "1.5px dashed " + accentColor, padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: mainOrange }}>Add a region</p>

            <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Region name</label>
            <input
              placeholder="location or neighborhood name, e.g. 'Suffolk County'"
              value={newRegionName}
              onChange={function(e) { setNewRegionName(e.target.value); }}
              style={inputStyle}
            />

            <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Phone number</label>
            <input
              placeholder="123-456-7890"
              value={newRegionNumber}
              onChange={function(e) { setNewRegionNumber(e.target.value); }}
              style={inputStyle}
            />

            <button
              onClick={addNewRegion}
              style={{ padding: "12px", border: "none", backgroundColor: accentColor, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            >
              + Add region
            </button>
          </div>
        </div>

        {/* chatbot */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Chatbot script</h2>
          <p style={{ fontSize: "13px", color: "#7a4000" }}>
            Write this like instructions for an assistant — who you are, what you do, how to respond.
          </p>

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>System prompt</label>
          <textarea
            value={chatbotSettings.script || ""}
            onChange={function(e) { setChatbotSettings({ ...chatbotSettings, script: e.target.value }); }}
            style={{ ...inputStyle, minHeight: "130px", resize: "vertical" }}
            placeholder="Summary... I do these things... I don't do these things...Use my bio... I like these... Recommendations based on situation... ect"
          />

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>FAQ (optional)</label>
          <textarea
            value={chatbotSettings.faq || ""}
            onChange={function(e) { setChatbotSettings({ ...chatbotSettings, faq: e.target.value }); }}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
            placeholder={"Q: What areas do you cover?\nA: Suffolk and Nassau county."}
          />
        </div>

        {/* pricing */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Pricing text</h2>
          <p style={{ fontSize: "13px", color: "#7a4000" }}>Shown on the appointments page.</p>

          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Pricing info</label>
          <textarea
            value={profileSettings.pricing || ""}
            onChange={function(e) { setProfileSettings({ ...profileSettings, pricing: e.target.value }); }}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
            placeholder="Pricing information to show on the appointments page."
          />
        </div>

        {/* email */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily: titleFont, fontSize: "18px", color: mainOrange }}>Email credentials</h2>
          <p style={{ fontSize: "13px", color: "#7a4000" }}>
            Used to send denial/acceptance emails. Get an App Password at myaccount.google.com. You have to go to Security and enable 2FA. Then search app password and create one. 
          </p>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>Gmail address</label>
          <input
            type="email"
            placeholder="youremail@gmail.com"
            value={senderEmail}
            onChange={function(e) { setSenderEmail(e.target.value); }}
            style={inputStyle}
          />
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#7a4000" }}>App password</label>
          <input
            type="password"
            placeholder="Leave blank to keep existing password"
            value={senderPassword}
            onChange={function(e) { setSenderPassword(e.target.value); }}
            style={inputStyle}
          />
          <p style={{ fontSize: "12px", color: "#9a4000", marginTop: "-4px" }}>
            This is not your regular Gmail password. Follow the given steps to get an app password. 
          </p>
          <button
            onClick={saveEmailCredentials}
            style={{ padding: "12px", border: "none", backgroundColor: accentColor, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            {emailSaved ? "Email saved" : "Save email credentials"}
          </button>
        </div>

        <button
          onClick={saveAllChanges}
          style={{ padding: "13px", border: "none", backgroundColor: mainOrange, color: bgColor, fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", maxWidth: "480px" }}
        >
          {changesSaved ? "Saved" : "Save all changes"}
        </button>

      </main>
    </div>
  );
}