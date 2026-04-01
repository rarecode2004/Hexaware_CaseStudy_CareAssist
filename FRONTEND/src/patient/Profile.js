import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Profile.css";

function Profile() {
  const userId = localStorage.getItem("userId");

  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patientId: "",
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
  });

  //  On mount: check if patient profile exists for this user
  useEffect(() => {
    if (userId) checkPatient();
  }, [userId]);

  const checkPatient = async () => {
    try {
      const res = await axios.get(`/patients/get/user/${userId}`);
      setForm(res.data);       // pre-filling the form 
      setIsCreated(true);
    } catch {
      setIsCreated(false);     // 1st time - show create
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    try {
      await axios.post("/patients/add", { ...form, userId: parseInt(userId) });
      alert("Profile Created!");
      checkPatient(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error creating profile");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put("/patients/update", {
        ...form,
        patientId: parseInt(form.patientId),
        userId: parseInt(userId),
      });
      alert("Profile Updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="profile-card"><p className="p-loading">Loading profile…</p></div>;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">{form.fullName?.[0] || "?"}</div>
        <div>
          <h2>{isCreated ? form.fullName || "Your Profile" : "New Patient"}</h2>
          <span className={`profile-badge ${isCreated ? "exists" : "new"}`}>
            {isCreated ? "Profile Active" : "Setup Required"}
          </span>
        </div>
      </div>

      {!isCreated && (
        <div className="info-banner">
          👋 Welcome! Please fill in your details to create your profile.
        </div>
      )}

      <div className="profile-form">
        <div className="field">
          <label>Full Name</label>
          <input name="fullName" placeholder="e.g. Ravi Kumar" value={form.fullName} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Age</label>
          <input name="age" type="number" placeholder="e.g. 28" value={form.age} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>MALE</option>
            <option>FEMALE</option>
            <option>OTHER</option>
          </select>
        </div>
        <div className="field">
          <label>Mobile</label>
          <input name="mobile" placeholder="e.g. 9876543210" value={form.mobile} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Address</label>
          <input name="address" placeholder="Street, City, State" value={form.address} onChange={handleChange} />
        </div>

        <div className="field full btn-row">
          {!isCreated
            ? <button onClick={handleCreate}>✅ Create Profile</button>
            : <button onClick={handleUpdate}>💾 Update Profile</button>
          }
        </div>   
      </div>
      
    </div>
  );
}

export default Profile;