import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { db } from "../Internal/firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
import Nav from "../Landing/Nav";
import Footer from "../Landing/Footer";
import './AboutStyle.css'


import Calendar from "react-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import { collection, addDoc, getDocs, deleteDoc, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

import { motion, useScroll, useTransform } from "framer-motion";
import { Parallax } from "react-parallax";

function Bookings() {
  const [activeTab, setActiveTab] = useState("studio-booking");// Default active tab is 'calendar'

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, [field]: file }));
    }
  };



  const [formData, setFormData] = useState({
    fullName: "",
    stageName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
    idPassport: "",
    mp3Reference: "",
    socialMedia: "",
    proofOfID: "",
    proofOfAddress: "",
    mp3Sample: "",
  });

  const [errors, setErrors] = useState({});


  // Tab change handler
  const handleTabChange = (tabName) => {
    setActiveTab(tabName); // Update the active tab state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  // const handleRegister = async (event) => {
  //   event.preventDefault();

  //   try {

  //      // Add the registration date to the formData before saving to Firestore
  //       const newArtist = {
  //         ...formData,
  //         registrationDate: new Date().toISOString(), // Save the current date in Firestore
  //       };

  //      // ✅ Save the newArtist (including date) to Firestore
  //       await addDoc(collection(db, "artists"), newArtist);
      

  //     // Send an email using email.js
  //     // const emailParams = {
  //     //   to_name: formData.fullName,
  //     //   to_email: formData.email,
  //     //   message: `Hi ${formData.fullName},\n\nThank you for registering with us! We have received your details, and we’ll be in touch soon.\n\nBest regards,\nYour Team`,
  //     // };

  //     const emailParams = {
  //       to_name: formData.fullName,
  //       to_email: formData.email,
  //       html_message: `
  //         <div style="font-family: Arial, sans-serif; color: #333;">
  //           <h2 style="color: #dfba45;">Hello ${formData.fullName},</h2>
  //           <p>Thank you for registering with us! We have received your details, and we’ll be in touch soon.</p>
  //           <p>Meanwhile, feel free to explore and reach out if you have any questions.</p>
  //           <hr />
  //           <p style="font-size: 14px; color: #666;">Best regards,<br>Your Team</p>
  //         </div>
  //       `,
  //     };
      
      

  //     emailjs
  //       .send(
  //         "service_88pb8at", // Replace with your Email.js service ID
  //         "template_2tonyga", // Replace with your Email.js template ID
  //         emailParams,
  //         "RuNfOepyXun4cPwVI" // Replace with your Email.js public key
  //       )
  //       .then(
  //         (response) => {
  //           console.log("Email sent successfully:", response.status, response.text);
  //           // alert("Registration successful! A confirmation email has been sent.");
  //           Swal.fire("Registration successful! A confirmation email has been sent.");

  //         },
  //         (error) => {
  //           console.error("Failed to send email:", error);
  //           // alert("Registration successful! However, we couldn't send a confirmation email.");
  //           Swal.fire("Registration successful! However, we couldn't send a confirmation email.");
  //         }
  //       );

  //     // Reset form fields
  //     setFormData({
  //       fullName: "",
  //       stageName: "",
  //       email: "",
  //       phone: "",
  //       country: "",
  //       city: "",
  //       postalCode: "",
  //       idPassport: "",
  //       mp3Reference: "",
  //       socialMedia: "",
  //       proofOfID: "",
  //       proofOfAddress: "",
  //       mp3Sample: "",
  //     });
  //   } catch (error) {
  //     console.error("Error registering artist:", error);
  //     // alert("Registration failed. Please try again.");
  //     Swal.fire("Registration failed. Please try again.");
  //   }
  // }

  const handleRegister = async (event) => {
    event.preventDefault();
  
    let validationErrors = {};
  
    if (!formData.fullName) validationErrors.fullName = "Full name is required.";
    if (!formData.stageName) validationErrors.stageName = "Stage name is required.";
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.phone) validationErrors.phone = "Phone number is required.";
    if (!formData.country) validationErrors.country = "Country is required.";
    if (!formData.city) validationErrors.city = "City is required.";
    if (!formData.postalCode) validationErrors.postalCode = "Postal code is required.";
    if (!formData.idPassport) validationErrors.idPassport = "ID/Passport is required.";
    if (!formData.mp3Reference) validationErrors.mp3Reference = "MP3 reference is required.";
    if (!formData.socialMedia) validationErrors.socialMedia = "Social media link is required.";
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }
  
    try {
      const newArtist = {
        ...formData,
        registrationDate: new Date().toISOString(), // Save registration date
      };
  
      await addDoc(collection(db, "artists"), newArtist);
  
      Swal.fire("Registration successful!");
  
      const emailParams = {
        to_name: formData.fullName,
        to_email: formData.email,
        html_message: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #dfba45;">Hi ${formData.fullName},</h2>
            <p>We are delighted to inform you that your application to become a member of has been successfully received and awaiting approval.</p>
            <p>To complete your membership process, we require a payment of <strong>R1500</strong> of which will be requested once we have approved you.</p> 
            <p><strong>For the time being, please provide the following:</strong></p>
                <ul>
                  <li>Proof of address.</li>
                  <li>Proof of Identification</li>
                  <li>Sample of your music in .mp3 /.mov</li>
                </ul>

            <p><strong>Please send the above items to:</strong></p>
            <p><strong>060 330 8567</strong> on whatsapp, stating your name and surname as it appears on your ID</p>

            <p>If you have any questions or need assistance with the process, please feel free to reach out to us on whatsapp. 
            
              <br>

              We are here to help and ensure a smooth onboarding experience for you.
            </p>

            <p>Thank you for choosing M Junior Records International. 
            
            <br>
            
            We look forward to supporting your musical journey and creating great music together. </p>
            <hr />

            <div className="email-footer">
             
              <img src="Assets/Logo/Profile Banner (1).png" alt="" />

            </div>
            <p style="font-size: 14px; color: #666;">Best regards,<br>M Junior Records International</p>
          </div>
        `,
      };
  
      emailjs.send("service_88pb8at", "template_2tonyga", emailParams, "RuNfOepyXun4cPwVI")
        .then((response) => {
          console.log("Email sent successfully:", response.status, response.text);
          Swal.fire("Registration successful! A confirmation email has been sent.");
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          Swal.fire("Registration successful! However, we couldn't send a confirmation email.");
        });
  
      setFormData({
        fullName: "",
        stageName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        postalCode: "",
        idPassport: "",
        mp3Reference: "",
        socialMedia: "",
        proofOfID: "",
        proofOfAddress: "",
        mp3Sample: "",
      });
    } catch (error) {
      console.error("Error registering artist:", error);
      Swal.fire("Registration failed. Please try again.");
    }
  };
  
  const [events, setEvents] = useState([]);

  // const handleDateChange = async (date) => {
  //   setSelectedDate(date);
  
  //   const startOfDay = moment(date).startOf("day").toISOString();
  //   const endOfDay = moment(date).endOf("day").toISOString();
  
  //   try {
  //     const producerSnapshot = await getDocs(
  //       query(
  //         collection(db, "availabilities"),
  //         where("startTime", ">=", startOfDay),
  //         where("startTime", "<=", endOfDay)
  //       )
  //     );
  
  //     const slots = [];
  //       producerSnapshot.forEach((doc) => {
  //         const data = doc.data();
  //         slots.push({
  //           name: data.producerName,
  //           time: `${moment(data.startTime).format("hh:mm A")} - ${moment(data.endTime).format("hh:mm A")}`,
  //           startTime: data.startTime,
  //           endTime: data.endTime,
  //         });
  //       });

  
  //     setAvailableSlots(slots);
  //   } catch (error) {
  //     console.error("Error fetching available slots: ", error);
  //     setAvailableSlots([]); // Ensure no stale data is displayed
  //   }
  // };

  // const handleDateChange = async (date) => {
  //   setSelectedDate(date);
  
  //   const startOfDay = moment(date).startOf("day").toISOString();
  //   const endOfDay = moment(date).endOf("day").toISOString();
  
  //   try {
  //     const snapshot = await getDocs(
  //       query(
  //         collection(db, "availabilities"),
  //         where("startTime", ">=", startOfDay),
  //         where("startTime", "<=", endOfDay)
  //       )
  //     );
  
  //     const slots = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       time: `${moment(doc.data().startTime).format("hh:mm A")} - ${moment(doc.data().endTime).format("hh:mm A")}`,
  //     }));
  
  //     // Filter only unbooked slots for the list
  //     const unbookedSlots = slots.filter((slot) => !slot.isBooked);
  
  //     setAvailableSlots(unbookedSlots); // Only show unbooked slots in the available slots list
  //   } catch (error) {
  //     console.error("Error fetching available slots:", error);
  //     setAvailableSlots([]); // Clear slots on error
  //   }
  // };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
  
    const startOfDay = moment(date).startOf("day").toISOString();
    const endOfDay = moment(date).endOf("day").toISOString();
  
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "availabilities"),
          where("startTime", ">=", startOfDay),
          where("startTime", "<=", endOfDay)
        )
      );
  
      // Map slots and include all necessary fields
      const slots = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        time: `${moment(doc.data().startTime).format("hh:mm A")} - ${moment(doc.data().endTime).format("hh:mm A")}`,
      }));
  
      // Filter out booked slots for the available slots list
      const availableSlots = slots.filter((slot) => !slot.isBooked);
  
      // Prepare events for the big calendar
      const events = slots.map((slot) => ({
        id: slot.id,
        title: slot.isBooked ? `Booked by ${slot.bookedBy || "Unknown"}` : `${slot.producerName} Available`,
        start: new Date(slot.startTime),
        end: new Date(slot.endTime),
        allDay: false,
      }));
  
      setAvailableSlots(availableSlots); // Only unbooked slots appear in the available list
      setEvents(events); // Both booked and unbooked slots appear in the calendar
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]); // Clear slots on error
      setEvents([]); // Clear calendar events on error
    }
  };
  
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [studioBookingData, setStudioBookingData] = useState({
    name: "",
    studioName: "",
    email: "",
    phone: "",
    selectedSlot: "",
    paymentStatus: "Not Paid",

  });

   // Handle input changes for Studio Booking form
   const handleStudioInputChange = (e) => {
    const { name, value } = e.target;
    setStudioBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


const handleSlotClick = async (slot) => {
  try {
    const slotRef = doc(db, "availabilities", slot.id);
    const slotSnapshot = await getDoc(slotRef);

    if (!slotSnapshot.exists()) {
      // alert("The selected slot does not exist.");
      Swal.fire("The selected slot does not exist.");
      return;
    }

    const slotData = slotSnapshot.data();

    if (slotData.isBooked) {
      // alert("This slot is already booked. Please select another slot.");
      Swal.fire("This slot is already booked. Please select another slot.");
      return;
    }

    setSelectedSlot({
      id: slot.id,
      producerName: slotData.producerName,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
    });

    setStudioBookingData((prevData) => ({
      ...prevData,
      selectedSlot: `${slotData.producerName}, ${moment(slotData.startTime).format(
        "hh:mm A"
      )} - ${moment(slotData.endTime).format("hh:mm A")}`,
      selectedDate: moment(slotData.startTime).format("YYYY-MM-DD"),
    }));
  } catch (error) {
    console.error("Error fetching slot data:", error);
    // alert("Failed to fetch slot data. Please try again.");
    Swal.fire("Failed to fetch slot data. Please try again.");
  }
};

  

const handleStudioBookingSubmit = async (e) => {
  e.preventDefault();

  let validationErrors = {};

  if (!studioBookingData.name) validationErrors.name = "Full name is required.";
  if (!studioBookingData.studioName) validationErrors.studioName = "Studio name is required.";
  if (!studioBookingData.email) validationErrors.email = "Email is required.";
  if (!studioBookingData.phone) validationErrors.phone = "Phone number is required.";
  if (!selectedSlot || !selectedSlot.id) validationErrors.selectedSlot = "You must select a slot.";

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    Swal.fire("Error", "Please fill in all required fields.", "error");
    return;
  }

  try {
    const slotRef = doc(db, "availabilities", selectedSlot.id);
    const slotSnapshot = await getDoc(slotRef);

    if (!slotSnapshot.exists()) {
      Swal.fire("The selected slot does not exist.");
      return;
    }

    const slotData = slotSnapshot.data();

    if (slotData.isBooked) {
      Swal.fire("This slot is already booked. Please select another slot.");
      return;
    }

    const bookingDetails = {
      ...studioBookingData,
      selectedSlot: `${selectedSlot.producerName}, ${moment(selectedSlot.startTime).format(
        "hh:mm A"
      )} - ${moment(selectedSlot.endTime).format("hh:mm A")}`,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      bookingDate: new Date().toISOString(), // Store booking date
    };

    await addDoc(collection(db, "consumerBookings"), bookingDetails);
    await updateDoc(slotRef, { isBooked: true });

    Swal.fire("Booking successfully submitted!");

    const emailParams = {
      to_name: studioBookingData.name,
      to_email: studioBookingData.email,
      studio_name: studioBookingData.studioName,
      selected_slot: bookingDetails.selectedSlot,
      selectedDate:studioBookingData.selectedDate,
      html_message_booking: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #dfba45;">Hi ${studioBookingData.name},</h2>
          <p>Your studio booking for the slot <strong>"${bookingDetails.selectedSlot}" on "${bookingDetails.selectedDate}"</strong> has been successfully submitted.</p>

          </br>

          <p>Please make your payment of R1300 to:</p>
          <ul>
            <li>Bank Name: <strong> FNB (First National Bank)</strong></li>
            <li>Bank account: <strong> 63107377029</strong></li>
            <li>Account type: <strong> Business account</strong></li>
            <li>Branch code: <strong> 236505</strong></li>
          </ul>

          </br>

          <p>This payment should be made 48 hours (2 Days) before the booked date.</p>
          </br>
          <p>Please send proof of payment to this whatsapp number for quick response:</p>

          </br>
          <p><strong>060 330 8567 / +255 752 765 968 </strong></p>

          </br>

          <p>Please arrive at least 15 minutes before your scheduled time to ensure everything runs smoothly. 
          If you have any specific requirements or if there's anything else we can assist you with, do not hesitate to let us know on 060 330 8567 or queries@mjuniorrecordsinterational.co.za
          </p>
          
          <p>We’re excited to have you, and we’ll see you soon!</p>
          
          <hr />

              <img src="Assets/Logo/Profile Banner (1).png" alt="" />

          <p style="font-size: 14px; color: #666;">Best regards,<br>M Junior Records International</p>

        </div>
      `,
    };

    emailjs.send("service_88pb8at", "template_2tonyga", emailParams, "RuNfOepyXun4cPwVI")
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text);
        Swal.fire("A confirmation email has been sent to your inbox.");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
        Swal.fire("Booking successful! However, we couldn't send a confirmation email.");
      });

    setStudioBookingData({
      name: "",
      studioName: "",
      email: "",
      phone: "",
      selectedSlot: "",
      paymentStatus: "Not Paid",
    });
    setSelectedSlot(null);
  } catch (error) {
    console.error("Error saving booking:", error);
    Swal.fire("Failed to save booking. Please try again.");
  }
};



  

useEffect(() => {
    console.log("Updated studioBookingData:", studioBookingData); // Monitor changes
  }, [studioBookingData]);
  

  // ----------email sending logic --------



  const [availableDates, setAvailableDates] = useState(new Set()); // Store available dates

// Fetch all available dates when component mounts
useEffect(() => {
  const fetchAvailableDates = async () => {
    try {
      const snapshot = await getDocs(collection(db, "availabilities"));
      const dates = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const dateStr = moment(data.startTime).format("YYYY-MM-DD");
        dates.add(dateStr); // Store only unique dates
      });

      setAvailableDates(dates); // Store dates in state
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  fetchAvailableDates();
}, []);




     // 🔹 Capture Scroll Progress
     const { scrollYProgress } = useScroll();

     // 🔹 Create Transform Animations
     const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
     const textMove = useTransform(scrollYProgress, [0, 0.5], ["0%", "-30%"]);
     const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
   


  return (
    <div className="Bookings">
      

      <div className="Landing-header">
      <Nav/>
     
        <div className="tab-buttons">
          <button
            className={activeTab === "studio-booking" ? "tab-button active" : "tab-button"}
            onClick={() => handleTabChange("studio-booking")}
          >
            Studio Booking
          </button>
          <button
            className={activeTab === "register-as-member" ? "tab-button active" : "tab-button"}
            onClick={() => handleTabChange("register-as-member")}
          >
            Register as Member
          </button>
        </div>

        {activeTab === "studio-booking" && (
          <h1 className="Tab-headers">Book your session with us</h1>
        )}

        {activeTab === "register-as-member" && (
          <h1 className="Tab-headers">Register to join our membership</h1>
        )}
          
        <div className="booking-wrapper">

          {activeTab === "studio-booking" && (
            <div className="studio-booking">
              <h2>Studio Booking</h2>
              <p className="fee"><strong>NOTE! </strong> Studio Booking fee <strong>R 1300.00</strong> per session.<br></br>Payemnt details will be sent to your email.</p>
         
              <div className="calendar-area">
                <div className="left">
                  <Calendar value={selectedDate} onChange={handleDateChange} className="Calendar"
                  tileClassName={({ date }) => {
                    const dateStr = moment(date).format("YYYY-MM-DD");
                    return availableDates.has(dateStr) ? "highlight-available-date" : "";
                  }}
                  />
                </div>

                <div className="right">

                  <ul>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => (
                        <li
                          key={index}
                          className={`slot available ${selectedSlot && selectedSlot.id === slot.id ? "selected-slot" : ""}`}
                          onClick={() => handleSlotClick(slot)} // Handle slot click only for unbooked slots
                        >
                          <div className="slot-info">
                            <p>Producer</p>
                            <strong>{slot.producerName}</strong>
                            <p>{slot.time}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="emptySlot">Slots for {selectedDate.toDateString()} are either not available or <strong> already booked</strong></p>
                    )}
                  </ul>

                </div>
              </div>

            
            <div className="booking-details-wrapper">
            <h3>Booking details</h3>
              <form >

                <div className="left field-area">
                
                    <label htmlFor="fullName">Full Names</label>
                    <input
                      type="text"
                      name="name"
                      value={studioBookingData.name}
                      onChange={handleStudioInputChange}
                      placeholder="Your name(s) and surname"
                      required
                     
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}

                    <label htmlFor="studioName">Studio Name</label>
                    <input
                      type="text"
                      name="studioName"
                      value={studioBookingData.studioName}
                      onChange={handleStudioInputChange}
                      placeholder="e.g. Young Rapper"
                      required
                    />
                    {errors.studioName && <p className="error-message">{errors.studioName}</p>}

                    <label htmlFor="Email">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={studioBookingData.email}
                      onChange={handleStudioInputChange}
                      placeholder="e.g. youremail@mail.com"
                      required
                    />
                     {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="right field-area">

                      <label htmlFor="tel">Phone number</label>
                      <input
                          type="number"
                          name="phone"
                          value={studioBookingData.phone}
                          onChange={handleStudioInputChange}
                          placeholder="e.g. 0123456789"
                          required
                        />
                        {errors.phone&& <p className="error-message">{errors.phone}</p>}

                      <label>Booked slot</label>
                      {/* <input type="text" name="selectedSlot" value={selectedSlot} readOnly /> */}

                      <input
                        type="text"
                        name="selectedSlot"
                        value={
                          selectedSlot
                            ? `${selectedSlot.producerName}, ${moment(selectedSlot.startTime).format(
                                "hh:mm A"
                              )} - ${moment(selectedSlot.endTime).format("hh:mm A")}`
                            : ""
                        }
                        readOnly
                      />

                      {/* {errors.selectedSlot&& <p className="error-message">{errors.selectedSlot}</p>} */}

                      <label>Selected Date</label>
                      <input type="text" name="selectedDate" value={studioBookingData.selectedDate || ""} readOnly />

                      <label className="payment-status">Payment status</label>
                      <select
                      name="paymentStatus"
                      value={studioBookingData.paymentStatus}
                      onChange={handleStudioInputChange}
                      className="payment-status"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Not Paid">Not Paid</option>
                    </select>
                </div>
                </form>
            </div>
              <button className="Book-slot-btn"onClick={handleStudioBookingSubmit} >
              <p>Book slot</p>
              </button>


            </div>
          )}

          {activeTab === "register-as-member" && (
            <div className="register-as-member Details">
              <h2>Registration details</h2>
              <form >

                <div className="datacapture">

                  <div className="left field-area">

                  <label htmlFor="fullName">Full Names</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your name(s) and surname"
                    required
                  />

                  <label htmlFor="stageName">Stage Name</label>
                  <input
                    type="text"
                    name="stageName"
                    value={formData.stageName}
                    onChange={handleInputChange}
                    placeholder="e.g. Young Rapper"
                    required
                  />

                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. youremail@gmail.com"
                    required
                  />

                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 012356789"
                    required
                  />

                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. America"
                    required
                  />

                

                  </div>

                  <div className="right field-area">

                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. New York"
                    required
                  />

                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 12345"
                    required
                  />

                  <label htmlFor="idPassport">ID | Passport</label>
                  <input
                    type="text"
                    name="idPassport"
                    value={formData.idPassport}
                    onChange={handleInputChange}
                    placeholder="e.g. 0301011386184"
                    required
                  />

                  <label htmlFor="mp3Reference">MP3 Reference</label>
                  <input
                    type="text"
                    name="mp3Reference"
                    value={formData.mp3Reference}
                    onChange={handleInputChange}
                    placeholder="e.g. SoundCloud / Spotify / YouTube"
                    required
                  />

                  <label htmlFor="socialMedia">Social Media Link</label>
                  <input
                    type="text"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleInputChange}
                    placeholder="e.g. Instagram / Facebook / Twitter / TikTok"
                    required
                  />

                  </div>

                </div>


                {/* <div className="media-files">

                    <div className="file-area"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "proofOfID")}
                    >
                   
                      <label htmlFor="proofOfID">Proof of ID</label>
                      <label htmlFor="proofOfID" className="custom-file-label">
                        {formData.proofOfID ? formData.proofOfID.name : "Choose Proof of ID"}
                      </label>

                      <input
                        type="file"
                        name="proofOfID"
                        accept="pdf,image"
                        onChange={handleFileChange}
                        required
                        // style={{ display: "none" }} // Hide the default file input
                      
                      />
                    </div>

                    <div className="file-area"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "proofOfAddress")}
                    >
                        <label htmlFor="proofOfAddress">Proof of Address</label>
                        <input
                          type="file"
                          name="proofOfAddress"
                          accept="pdf,image"
                          onChange={handleFileChange}
                          required
                        />
                    </div>  

                    <div className="file-area"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "mp3Sample")}
                    >
                      <label htmlFor="mp3Sample">MP3 Sample</label>
                      <input
                        type="file"
                        name="mp3Sample"
                        accept=".mp3,.mov"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                </div> */}
                
              </form>
              <button onClick={handleRegister}>
                
                <p>Register</p>
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="mid-section"></div>
      
      <div className="contact">
        <h2>Contact us</h2>
        <p>Contact info for queries or come check us out, walk-ins are welcome.</p>

        <div className="contacts-wrapper">
          <div className="left">
            <div className="info">
              <div className="icon">
                <img src="assets/Icons/Phone iphone.svg" alt="" />
              </div>
              <p>060 330 8567</p>
            </div>

            <div className="info">
              <div className="icon">
                <img src="assets/Icons/Email.svg" alt="" />
              </div>
              <p>Email address</p>
            </div>


            <div className="info">
              <div className="icon">
                <img src="assets/Icons/WhatsApp.svg" alt="" />
              </div>
              <p>+27 60 330 8567 / +255 752 765 968</p>
            </div>

            <div className="info">
              <div className="icon">
                <img src="assets/Icons/Map Marker.svg" alt="" />
              </div>
              <p>148 Bellavista Rd, Turf Club, Johannesburg <br></br>South, 2091</p>
            </div>

            
          </div>
          <div className="gmaps">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4193.487804010091!2d28.02778907601962!3d-26.24728107705002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950f316a502429%3A0x73e9425d275250c4!2sMJunior%20Records%20international!5e1!3m2!1sen!2sza!4v1735422349430!5m2!1sen!2sza"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>

        </div>
      </div>

      <Footer/>

    </div>
  );
}

export default Bookings;
