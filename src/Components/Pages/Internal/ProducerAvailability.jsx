import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import { collection, addDoc, getDocs, deleteDoc, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from './firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './internalStyle.css';
// import emailjs from "@emailjs/browser";
import emailjs from "emailjs-com";
import Intheader from "./intheader";
import Intfooter from "./intfooter";
import Swal from "sweetalert2";



function ProducerAvailability() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromTime, setFromTime] = useState("08:00 am");
  const [toTime, setToTime] = useState("10:00 am");
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("calendar");
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState(""); // To store the signed-in user's name
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay visibility state

  const localizer = momentLocalizer(moment);

  const [bookings, setBookings] = useState([]);

  const [name, setName] = useState("");
  // const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [registeredArtists, setRegisteredArtists] = useState([]);

 // -------------------Search capability--------
 const [searchTerm, setSearchTerm] = useState("");
 const [bookingSearchTerm, setBookingSearchTerm] = useState("");


// State for Studio Name and selected slot
const [studioName, setStudioName] = useState(""); // Studio Name input
const [selectedSlot, setSelectedSlot] = useState(null); // Store selected slot details


const fetchBookings = async () => {
  const querySnapshot = await getDocs(collection(db, "consumerBookings"));

  const bookings = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        bookingDate: data.bookingDate ? new Date(data.bookingDate) : new Date(0), // ✅ Handle missing dates
      };
    })
    .sort((a, b) => b.bookingDate - a.bookingDate); // ✅ Sort latest to oldest

  setBookings(bookings);
};





// useEffect(() => {
//   if (activeTab === "artists" || searchTerm) {
//     const fetchRegisteredArtists = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "registeredArtists"));
//         const artists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
       
//              // Sort by registration date (latest first)
//             artists.sort((a, b) => b.registrationDate - a.registrationDate);

//         const filteredArtists = artists.filter((artist) =>
//           artist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           artist.studioName.toLowerCase().includes(searchTerm.toLowerCase()));
        
//         setRegisteredArtists(filteredArtists);
        

//         // setRegisteredArtists(artists);

        

//       } catch (error) {
//         console.error("Error fetching registered artists: ", error);
//       }
//     };



//     fetchRegisteredArtists();
//   }
// }, [activeTab , searchTerm]);


useEffect(() => {
  if (activeTab === "artists" || searchTerm) {
   const fetchRegisteredArtists = async () => {
    try {
      const snapshot = await getDocs(collection(db, "registeredArtists"));
      const artists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate ? new Date(doc.data().registrationDate) : null
      }));
      
      // Sort by registration date (latest first), handling invalid dates
      artists.sort((a, b) => {
        if (!a.registrationDate) return 1;
        if (!b.registrationDate) return -1;
        return b.registrationDate - a.registrationDate;
      });
      
      setRegisteredArtists(artists);
    } catch (error) {
      console.error("Error fetching registered artists: ", error);
    }
  };
    fetchRegisteredArtists();
  }
}, [activeTab, searchTerm]);


useEffect(() => {
  fetchBookings();
}, []);

  // Artist booking by producer

  const [availableSlots, setAvailableSlots] = useState([]);


  const fetchSlots = async (date) => {
    try {
      const startOfDay = moment(date).startOf("day").toISOString();
      const endOfDay = moment(date).endOf("day").toISOString();
  
      const snapshot = await getDocs(
        query(
          collection(db, "availabilities"),
          where("startTime", ">=", startOfDay),
          where("startTime", "<=", endOfDay)
        )
      );
  
      const slots = snapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Fetch all fields
        time: `${moment(doc.data().startTime).format("hh:mm A")} - ${moment(doc.data().endTime).format("hh:mm A")}`,
      }));
  
      console.log("Fetched Slots:", slots); // Debugging
      return slots;
    } catch (error) {
      console.error("Error fetching slots:", error);
      return [];
    }
  };
  


  const handleDateChange = async (date) => {
    setSelectedDate(date);
  
    try {
      const slots = await fetchSlots(date);
  
      // Filter available (unbooked) slots for the list
      const availableSlots = slots.filter((slot) => !slot.isBooked);
  
      // Convert all slots to calendar event format
      const calendarEvents = slots.map((slot) => ({
        id: slot.id,
        title: slot.isBooked ? `Booked by ${slot.bookedBy || "Unknown"}` : `${slot.producerName} Available`,
        start: new Date(slot.startTime),
        end: new Date(slot.endTime),
        allDay: false,
      }));
  
      setAvailableSlots(availableSlots); // Update the available slots list
      setEvents(calendarEvents); // Update the calendar events
    } catch (error) {
      console.error("Error fetching available slots:", error);
  
      // If there's an error, clear available slots and calendar events
      setAvailableSlots([]);
      setEvents([]);
    }
  };

  useEffect(() => {
    handleDateChange(selectedDate); // Populate slots and events when the component loads
  }, []); // Runs only once on mount
  
  
    // Fetch username of the signed-in user
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUsername(user.displayName || "Unknown User"); // Set username or fallback to "Unknown User"
        } else {
          navigate("/login"); // Redirect to login if not signed in
        }
      });
    }, [navigate]);

    // Fetch events from Firestore
    useEffect(() => {
      const fetchEvents = async () => {
        const fetchedEvents = [];
        const producerSnapshot = await getDocs(collection(db, "availabilities"));
        producerSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEvents.push({
            title: `${data.producerName} Available`,
            start: new Date(data.startTime),
            end: new Date(data.endTime),
            allDay: false,
          });
        });
        setEvents(fetchedEvents);
      };
      fetchEvents();
    }, []);


  const handleAvailabilityToggle = async () => {
    const newAvailabilityStatus = !isAvailable;
    setIsAvailable(newAvailabilityStatus);
  
    // Automatically save to Firestore
    if (newAvailabilityStatus) {
      handleSaveAvailability(); // Call save function to persist availability
    } else {
      // Handle unavailability (optional: remove slots if required)
      // alert("You have turned off availability.");
    }
  };
  

  const formatTo24Hour = (time) => {
    return moment(time, ["h:mm A", "HH:mm"]).format("HH:mm");
  };
  
  const handleSaveAvailability = async () => {
    if (!isAvailable) {
      return;
    }
  
    console.log("DEBUG: Selected Date ->", selectedDate);
    console.log("DEBUG: From Time ->", fromTime);
    console.log("DEBUG: To Time ->", toTime);
  
    // Ensure fromTime and toTime exist
    if (!fromTime || !toTime) {
      console.error("Error: fromTime or toTime is missing!", { fromTime, toTime });
      Swal.fire("Please select both start and end times.");
      return;
    }
  
    // Convert time to 24-hour format
    const formattedFromTime = formatTo24Hour(fromTime);
    const formattedToTime = formatTo24Hour(toTime);
  
    console.log("DEBUG: Converted From Time ->", formattedFromTime);
    console.log("DEBUG: Converted To Time ->", formattedToTime);
  
    // Validate converted time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm format
    if (!timeRegex.test(formattedFromTime) || !timeRegex.test(formattedToTime)) {
      console.error("Error: fromTime or toTime has an invalid format!", { formattedFromTime, formattedToTime });
      Swal.fire("Invalid time format. Please use HH:mm (e.g., 14:30).");
      return;
    }
  
    // Ensure selectedDate is valid
    const formattedDate = moment(selectedDate, "YYYY-MM-DD", true);
    if (!formattedDate.isValid()) {
      console.error("Error: selectedDate is invalid!", selectedDate);
      Swal.fire("Invalid date. Please select a valid date.");
      return;
    }
  
    // Create proper DateTime strings
    const startDateTime = new Date(`${formattedDate.format("YYYY-MM-DD")}T${formattedFromTime}:00`);
    const endDateTime = new Date(`${formattedDate.format("YYYY-MM-DD")}T${formattedToTime}:00`);
  
    // Validate date conversion
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error("Error: Invalid startTime or endTime!", { startDateTime, endDateTime });
      Swal.fire("Invalid date format. Please select a valid date and time.");
      return;
    }
  
    const newAvailability = {
      producerName: username || "Unknown Producer",
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      date: formattedDate.format("YYYY-MM-DD"),
      isBooked: false,
    };
  
    try {
      const docRef = await addDoc(collection(db, "availabilities"), newAvailability);
      console.log("Availability auto-saved with ID:", docRef.id);
  
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: docRef.id,
          title: `${username || "Unknown Producer"} Available`,
          start: startDateTime,
          end: endDateTime,
          allDay: false,
          type: "availability",
        },
      ]);
  
      handleCloseModal();
    } catch (error) {
      console.error("Error auto-saving availability:", error);
    }
  
    setIsOverlayOpen(!isOverlayOpen);
  };
  
  

  useEffect(() => {
    const fetchEvents = async () => {
      const producerEvents = [];
      const consumerEvents = [];
  
      // Fetch producer availability
      const producerSnapshot = await getDocs(collection(db, "availabilities"));
      producerSnapshot.forEach((doc) => {
        const data = doc.data();
        producerEvents.push({
          id: doc.id, // Include the document ID
          title: `${data.producerName} Available`,
          start: new Date(data.startTime),
          end: new Date(data.endTime),
          allDay: false,
        });
      });
  
      // Fetch consumer bookings
      const consumerSnapshot = await getDocs(collection(db, "consumerBookings"));
      consumerSnapshot.forEach((doc) => {
        consumerEvents.push({
          id: doc.id, // Optional, but include it if you need to delete or identify these events
          title: `Booked by ${doc.data().name}`,
          start: new Date(doc.data().startTime),
          end: new Date(doc.data().endTime),
          allDay: false,
          type: "booking",
        });
      });
  
      setEvents([...producerEvents, ...consumerEvents]); // Combine both lists
    };
  
    fetchEvents();
  }, []);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = [];
  
        // Fetch producer availability
        const producerSnapshot = await getDocs(collection(db, "availabilities"));
        producerSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEvents.push({
            id: doc.id,
            title: `${data.producerName} Available`,
            start: new Date(data.startTime),
            end: new Date(data.endTime),
            allDay: false,
            type: "availability",
          });
        });
  
        // Fetch consumer bookings
        const consumerSnapshot = await getDocs(collection(db, "consumerBookings"));
        consumerSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEvents.push({
            id: doc.id,
            title: `Booked by ${data.name || "Unknown Artist"}`,
            start: new Date(data.startTime),
            end: new Date(data.endTime),
            allDay: false,
            type: "booking",
          });
        });
  
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);
  

  // const updateApprovalStatus = async (id, newStatus) => {
  //   try {
  //     // Fetch the artist's details from Firestore
  //     const artistRef = doc(db, "artists", id);
  //     const artistSnapshot = await getDoc(artistRef);
  
  //     if (!artistSnapshot.exists()) {
  //       throw new Error("Artist not found");
  //     }
  
  //     const artistData = artistSnapshot.data();
  
  //     // Update the status in Firestore
  //     await updateDoc(artistRef, { approvalStatus: newStatus });
  
  //     // Send the email via EmailJS
  //     const templateParams = {
  //       to_name: artistData.fullName, // Replace with artist's full name
  //       to_email: artistData.email,  // Replace with artist's email
  //       status: newStatus,          // The updated status
  //     };
  
  //     const serviceId = "service_88pb8at"; // Replace with your EmailJS service ID
  //     const templateId = "template_bw4c6kc"; // Replace with your EmailJS template ID
  //     const userId = "RuNfOepyXun4cPwVI"; // Replace with your EmailJS user ID (public key)
  
  //     await emailjs.send(serviceId, templateId, templateParams, userId);
  
  //     console.log(`Approval status for artist ${id} updated to ${newStatus}`);
  //     alert("Email sent successfully!");
  //   } catch (error) {
  //     console.error("Error updating approval status or sending email:", error);
  //     alert("Failed to update status or send email. Please try again.");
  //   }
  // };

  // const updateApprovalStatus = async (id, newStatus) => {
  //   try {
  //     // Fetch the artist's details from Firestore
  //     const artistRef = doc(db, "artists", id);
  //     const artistSnapshot = await getDoc(artistRef);
  
  //     if (!artistSnapshot.exists()) {
  //       throw new Error("Artist not found");
  //     }
  
  //     const artistData = artistSnapshot.data();
  
  //     // Update the status in Firestore
  //     await updateDoc(artistRef, { approvalStatus: newStatus });
  
  //     // Define email parameters for dynamic content
  //     const emailParams = {
  //       to_name: artistData.fullName || "Artist", // Artist's full name or fallback
  //       to_email: artistData.email,              // Artist's email address
  //       status: newStatus,                       // Status to include in the message
  //     };
  
  //     // Define the message content dynamically based on the status
  //     let emailMessage = "";
  //     if (newStatus === "Approved") {
  //       emailMessage = `Dear ${artistData.fullName},\n\nWe are thrilled to inform you that your registration has been approved! Welcome to our platform.\n\nBest regards,\nYour Team`;
  //     } else if (newStatus === "Rejected") {
  //       emailMessage = `Dear ${artistData.fullName},\n\nWe regret to inform you that your registration has been rejected. For further assistance, feel free to contact us.\n\nBest regards,\nYour Team`;
  //     } else if (newStatus === "Waiting for Payment") {
  //       emailMessage = `Dear ${artistData.fullName},\n\nYour registration is pending payment. Kindly complete the payment process to proceed.\n\nBest regards,\nYour Team`;
  //     }
  
  //     // Add the dynamic message to the email parameters
  //     emailParams.message_content = emailMessage;
  
  //     // Send the email using EmailJS
  //     const serviceId = "service_88pb8at"; // Replace with your EmailJS service ID
  //     const templateId = "template_bw4c6kc"; // Use one EmailJS template ID
  //     const userId = "RuNfOepyXun4cPwVI";   // Replace with your EmailJS public key
  
  //     const emailResponse = await emailjs.send(serviceId, templateId, emailParams, userId);
  //     console.log("Email sent successfully:", emailResponse);
  
  //     console.log(`Approval status for artist ${id} updated to ${newStatus}`);
  //     alert(`Status updated to "${newStatus}" and email sent successfully!`);
  //   } catch (error) {
  //     console.error("Error updating approval status or sending email:", error);
  //     alert("Failed to update status or send email. Please try again.");
  //   }
  // };


const updateApprovalStatus = async (id, newStatus) => {
  // Show a SweetAlert2 confirmation popup
  const result = await Swal.fire({
    title: `Change status to "${newStatus}"?`,
    text: "This action will send an email to the user.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, change it!",
    cancelButtonText: "No, cancel",
  });

  if (!result.isConfirmed) {
    return; // Exit if the user cancels
  }

  try {
    // Fetch the artist's details from Firestore
    const artistRef = doc(db, "artists", id);
    const artistSnapshot = await getDoc(artistRef);

    if (!artistSnapshot.exists()) {
      throw new Error("Artist not found");
    }

    const artistData = artistSnapshot.data();

    // Update the status in Firestore
    await updateDoc(artistRef, { approvalStatus: newStatus });

    // Define email parameters for dynamic content
    const emailParams = {
      to_name: artistData.fullName || "Artist",
      to_email: artistData.email,
      status: newStatus,
    };


    emailParams.message_content = emailMessage;

    // Send the email using EmailJS
    const serviceId = "service_88pb8at"; // Replace with your EmailJS service ID
    const templateId = "template_bw4c6kc"; // Use one EmailJS template ID
    const userId = "RuNfOepyXun4cPwVI";   // Replace with your EmailJS public key

    const emailResponse = await emailjs.send(serviceId, templateId, emailParams, userId);
    console.log("Email sent successfully:", emailResponse);

    Swal.fire("Success", `Status updated to "${newStatus}" and email sent successfully!`, "success");
  } catch (error) {
    console.error("Error updating approval status or sending email:", error);
    Swal.fire("Error", "Failed to update status or send email. Please try again.", "error");
  }
};

  
  const handleSlotClick = (slot) => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  
    // Ensure slot has an `id` field (from Firestore) if it's required
    setSelectedSlot({
      ...slot,
      id: slot.id, // Ensure the `id` from Firestore is included
      date: formattedDate,
    });
  
    console.log("Selected Slot:", { ...slot, id: slot.id, date: formattedDate });
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = [];
      const snapshot = await getDocs(collection(db, "availabilities"));
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedEvents.push({
          id: doc.id, // Optional, but include it if you need to delete or identify these events
          title: `${data.producerName} Available`,
          start: new Date(data.startTime),
          end: new Date(data.endTime),
          allDay: false,
        });
      });
      setEvents(fetchedEvents);
    };
    fetchEvents();
  }, []);

  
  
  const handleOverlayToggle = () => {
    setIsOverlayOpen(!isOverlayOpen); // Toggle overlay visibility
       // Close modal and refresh calendar
       handleCloseModal();
  };
  
  const handleOverlayClose = () => {
    setIsOverlayOpen(false); // Close the overlay
  };

 const handleDeleteEvent = async (event) => {
    console.log("Event clicked:", event); // Debugging: log the event object
  
    if (!event.id) {
      alert("Unable to delete: Missing event ID.");
      return;
    }
  
    const confirmDelete = window.confirm(`Are you sure you want to delete this event?`);
    if (!confirmDelete) {
      return;
    }
  
    try {
      // Check if the event is a booking or availability
      if (event.title.startsWith("Booked by")) {
        // It's a booking; delete from consumerBookings collection
        await deleteDoc(doc(db, "consumerBookings", event.id));
      } else if (event.title.endsWith("Available")) {
        // It's an availability slot; delete from availabilities collection
        await deleteDoc(doc(db, "availabilities", event.id));
      } else {
        console.error("Unknown event type.");
        alert("Failed to determine the event type.");
        return;
      }
  
      // Remove the event from local state
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
  
      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete the event. Please try again.");
    }
  };
  

 // Handle booking

const handleBookSlot = async () => {
  if (!studioName || !selectedSlot) {
    // alert("Please select a slot and provide a Studio Name.");
    await Swal.fire("Please select a slot and provide a Studio Name.");
    return;
  }

  if (!selectedSlot.id) {
    // alert("Invalid slot selection. Please refresh and try again.");
    await Swal.fire("Invalid slot selection. Please refresh and try again.");
    return;
  }

  const bookingDetails = {
    bookingDate: new Date().toISOString(), // Store current date
    name: name || "Unknown Artist",
    studioName,
    email,
    phone,
    selectedSlot: `${selectedSlot.producerName || "Unknown"} - ${selectedSlot.time || "Unknown"}`,
    paymentStatus,
    startTime: selectedSlot.startTime,
    endTime: selectedSlot.endTime,
    selectedDate: selectedDate.toISOString().split("T")[0],
    bookingDate: new Date().toISOString(), // Stores a valid ISO date format
  };

  const slotRef = doc(db, "availabilities", selectedSlot.id);

  try {
    const slotSnapshot = await getDoc(slotRef);

    if (!slotSnapshot.exists()) {
      alert("The selected slot does not exist.");
      return;
    }

    const slotData = slotSnapshot.data();

    if (slotData?.isBooked) {
      // alert("This slot has already been booked.");
      await Swal.fire("This slot has already been booked.");
      return;
    }

    // Save booking in Firestore
    const docRef = await addDoc(collection(db, "consumerBookings"), bookingDetails);
    console.log("Booking saved with ID:", docRef.id);

    // Mark the slot as booked in Firestore
    await updateDoc(slotRef, { isBooked: true });

    // Add event to calendar
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        id: docRef.id,
        title: `Booked by ${name || "Unknown Artist"}`,
        start: moment(selectedSlot.startTime).toDate(),
        end: moment(selectedSlot.endTime).toDate(),
        allDay: false,
        type: "booking",
      },
    ]);

    // alert("Slot booked successfully!");
    await Swal.fire("Slot booked successfully!");

    // Send confirmation email
    const emailParams = {
      to_name: name || "Unknown Artist",
      to_email: email,
      studio_name: studioName,
      selected_slot: bookingDetails.selectedSlot,
      message_booking: `Dear ${name},\n\nYour booking for the slot "${bookingDetails.selectedSlot}" has been successfully submitted.\n\nBest regards,\nYour Team`,
    };

    try {
      const emailResponse = await emailjs.send(
        "service_88pb8at", // Replace with your Email.js service ID
        "template_2tonyga", // Replace with your Email.js template ID
        emailParams,
        "RuNfOepyXun4cPwVI" // Replace with your Email.js public key
      );
      console.log("Email sent successfully:", emailResponse.status, emailResponse.text);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // alert("The booking was successful, but the confirmation email could not be sent.");
      await Swal.fire("The booking was successful, but the confirmation email could not be sent");
    }

    // Reset form
    setStudioName("");
    setSelectedSlot(null);

    // Close modal and refresh calendar
    handleCloseModal();
  } catch (error) {
    console.error("Error booking slot:", error);
    // alert("Failed to book the slot. Please try again.");
    await Swal.fire("Failed to book the slot. Please try again.");
  }
};



useEffect(() => {
  if (activeTab === "artists" || searchTerm) {
    // const fetchRegisteredArtists = async () => {
    //   try {
    //     const snapshot = await getDocs(collection(db, "artists"));
    //     const artists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //     console.log("Fetched Artists Data:", artists); // Debugging line

    //     const filteredArtists = artists.filter((artist) =>
    //       artist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       artist.studioName.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
        
    //     setRegisteredArtists(filteredArtists);
        
    //     // setRegisteredArtists(artists);

    //      // ✅ Sort artists by newest registration date first
    //      const sortedArtists = artistsData.sort(
    //       (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
    //     );
    //     setRegisteredArtists(sortedArtists); // Update the state with sorted artists

    //   } catch (error) {
    //     console.error("Error fetching registered artists: ", error);
    //   }
    // };

    const fetchRegisteredArtists = async () => {
    try {
      const snapshot = await getDocs(collection(db, "artists"));
      const artists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate ? new Date(doc.data().registrationDate) : null
      }));
      
      // Sort by registration date (latest first), handling invalid dates
      artists.sort((a, b) => {
        if (!a.registrationDate) return 1;
        if (!b.registrationDate) return -1;
        return b.registrationDate - a.registrationDate;
      });
      
      setRegisteredArtists(artists);
    } catch (error) {
      console.error("Error fetching registered artists: ", error);
    }
  };
    fetchRegisteredArtists();
  }
}, [activeTab, searchTerm]);

const handleApprovalStatusChange = async (artistId, newStatus) => {
  try {
    // Show a SweetAlert2 confirmation popup
    const result = await Swal.fire({
      title: `Change status to "${newStatus}"?`,
      text: "This action will send an email to the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    });

    // If the user cancels, exit without making any changes
    if (!result.isConfirmed) {
      console.log("User canceled status change.");
      return; // Do not proceed
    }

    // Update the status in Firestore
    const artistRef = doc(db, "artists", artistId);
    await updateDoc(artistRef, { approvalStatus: newStatus });

    // Fetch the artist's details for the email
    const artistSnapshot = await getDoc(artistRef);
    if (!artistSnapshot.exists()) {
      throw new Error("Artist not found");
    }

    const artistData = artistSnapshot.data();

    // Define email parameters for dynamic content
    const emailParams = {
      to_name: artistData.fullName || "Artist",
      to_email: artistData.email,
      status: newStatus,
    };

    // Set email message dynamically with HTML format
    let emailMessage = "";
    if (newStatus === "Approved") {
      emailMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #28a745;">Congratulations, ${artistData.fullName}!</h2>
          <p>We are thrilled to inform you that your application for membership with M Junior Records International has been accepted! <br>
            We are excited about the potential of your music and the unique voice you bring to the industry.  </p>
          <p>We are committed to supporting artists like you in reaching new heights. Our team is eager to collaborate with you and provide the resources, <br>
          guidance, and platform needed to amplify your career.  </p>

          <p><strong>Next steps:</strong></p>
          <ul>
            <li>We will schedule an introductory meeting to discuss your goals, our partnership, and how we can best support your journey. </li>
            <li>Our contracts and agreements will be sent to you for review within the next 48 hours.  </li>
            <li>Once everything is finalized, we’ll begin planning your first steps with the label</li>
          </ul>

          <p>In the meanwhile,please feel free to reach out if you have any questions or need further information in the meantime. We’re here to help!  
          </p>

          <p>Once again, welcome to the M Junior Records International family. We’re excited to embark on this journey with you and can’t wait to see what we’ll achieve together.  </p>
          <hr />
          <p style="font-size: 14px; color: #666;">Best regards,<br>M Junior Records International</p>
        </div>
      `;
    } else if (newStatus === "Rejected") {
      emailMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #dc3545;">Dear ${artistData.fullName},</h2>
          <p>Thank you for taking the time to submit your application. We truly appreciate your interest in joining our <br>
          community and for sharing your music with us.</p>
          <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time. 
          <br>
          This decision was not made lightly, as we recognize the talent and effort behind your work. 
          <br>
          However, we feel that your music does not align with our current direction and priorities as a label. </p>

          <p>We wish you the very best in your musical journey and hope to cross paths again in the future. 
          <br>
          Thank you once more for considering us and we look forward to seeing your growth and success.</p>
          <hr />
          <p style="font-size: 14px; color: #666;">Best regards,<br>M Junior Records International</p>
        </div>
      `;
    } else if (newStatus === "Waiting for Payment") {
      emailMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #f39c12;">Hi ${artistData.fullName}!,</h2>
          <p>This email is to confirm that we have received your membership application. 
          <br>
          <br>
          To complete the process and activate your membership, we kindly ask you to proceed with the payment of the membership fee. <br>
          Below are the details for your reference:  
          </p>

          <ul>
          <li>Membership Fee : <strong>R1500</strong></li>
          <li>Bank Name: <strong> FNB (First National Bank)</strong></li>
          <li>Bank account: <strong> 63107377029</strong></li>
          <li>Account type: <strong> Business account</strong></li>
          <li>Branch code: <strong> 236505</strong></li>
          </ul>

          <p><strong>Please send the proof of payment to:</strong></p>
          <p><strong>060 330 8567</strong> on whatsapp, stating your name and surname as it appears on your ID.</p>

          <p>Once your payment has been processed, you will receive a confirmation email along with your membership benefits.</p>

          <p>If you have any questions or need assistance with the process, please feel free to reach out to us on whatsapp. 
            
              <br>

              We are here to help and ensure a smooth onboarding experience for you.
            </p>


           <p>Thank you for choosing M Junior Records International. 
            
            <br>
            
            We look forward to supporting your musical journey and creating great music together. </p>
            <hr />
            <p style="font-size: 14px; color: #666;">Best regards,<br>M Junior Records International</p>
        </div>
      `;
    }

    emailParams.message_content = emailMessage;

    // Send the email using EmailJS
    const serviceId = "service_88pb8at"; // Replace with your EmailJS service ID
    const templateId = "template_bw4c6kc"; // Use one EmailJS template ID
    const userId = "RuNfOepyXun4cPwVI";   // Replace with your EmailJS public key

    const emailResponse = await emailjs.send(serviceId, templateId, emailParams, userId);
    console.log("Email sent successfully:", emailResponse);

    // Update the UI after successful status change and email
    setRegisteredArtists((prevArtists) =>
      prevArtists.map((artist) =>
        artist.id === artistId ? { ...artist, approvalStatus: newStatus } : artist
      )
    );

    Swal.fire("Success", `Status updated to "${newStatus}" and email sent successfully!`, "success");
  } catch (error) {
    console.error("Error updating approval status or sending email:", error);
    Swal.fire("Error", "Failed to update status or send email. Please try again.", "error");
  }
};


const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // Number of items per page


// Calculate total pages
const totalPages = Math.ceil(bookings.length / itemsPerPage);

// Handle page navigation
const handlePreviousPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const [artistCurrentPage, setArtistCurrentPage] = useState(1);
const artistItemsPerPage = 10;

// Calculate the indexes for slicing
const artistIndexOfLastItem = artistCurrentPage * artistItemsPerPage;
const artistIndexOfFirstItem = artistIndexOfLastItem - artistItemsPerPage;
const currentArtists = registeredArtists.slice(artistIndexOfFirstItem, artistIndexOfLastItem);

// Calculate total pages
const artistTotalPages = Math.ceil(registeredArtists.length / artistItemsPerPage);

// Handle page navigation
const handleArtistPreviousPage = () => {
  if (artistCurrentPage > 1) setArtistCurrentPage(artistCurrentPage - 1);
};

const handleArtistNextPage = () => {
  if (artistCurrentPage < artistTotalPages) setArtistCurrentPage(artistCurrentPage + 1);
};


const handleSelectSlot = ({ start }) => {
  setSelectedDate(moment(start).toDate()); // Set the selected date in state
  setIsOverlayOpen(true); // Open the overlay with the producer availability view
};


const eventPropGetter = (event) => {
  let backgroundColor = "#F6EBBE";
  let borderColor = "";

  // Assign colors based on the type of event
  if (event.type === "availability") {
    backgroundColor = "#F6EBBE"; // Green for producer's availability
    borderColor = "#388e3c"; // Darker green border
  } else if (event.type === "booking") {
    backgroundColor = "#DFBA45"; // Red for booked slots
    borderColor = "#d32f2f"; // Darker red border
  }

  return {
    style: {
      backgroundColor,
      borderColor,
      color: "#0d0d0d", // White text color for better contrast
      borderRadius: "5px", // Rounded corners
      padding: "5px",
    },
  };
};



const handlePaymentStatusChange = async (bookingId, newStatus) => {
  try {
    // Show a confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the payment status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return; // Exit if the user cancels
    }

    // Update Firestore document
    const bookingRef = doc(db, "consumerBookings", bookingId);
    await updateDoc(bookingRef, { paymentStatus: newStatus });

    // Update local state for real-time UI update
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, paymentStatus: newStatus } : booking
      )
    );

    // Show success message
    Swal.fire("Success!", `Payment status updated to "${newStatus}".`, "success");
  } catch (error) {
    console.error("Error updating payment status:", error);
    Swal.fire("Error", "Failed to update payment status. Please try again.", "error");
  }
};




// ----------email sending logic --------



// -------------calander refresh ---

const [showModal, setShowModal] = useState(false); // For modal visibility
  const [refreshCalendar, setRefreshCalendar] = useState(false); // Trigger calendar refresh
  const [calendarData, setCalendarData] = useState([]); // Calendar data state

  // Fetch calendar data function
  const fetchCalendarData = async () => {
    try {
      const response = await fetch('/api/calendar-data'); // Replace with your actual endpoint
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  // Effect to fetch calendar data whenever `refreshCalendar` changes
  useEffect(() => {
    fetchCalendarData();
  }, [refreshCalendar]);

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setRefreshCalendar((prev) => !prev); // Toggle state to refresh calendar
  };


  // -------------------tab colours--------

 // Tab change handler
//  const handleTabChange = (tabName) => {
//   setActiveTab(tabName); // Update the active tab state
// };



 // -------------------Delete capability--------
const handleDeleteBooking = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This booking will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "consumerBookings", id)); // Deletes from Firestore

        // Remove from UI
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));

        Swal.fire("Deleted!", "The booking has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting booking:", error);
        Swal.fire("Error", "Failed to delete booking. Try again.", "error");
      }
    }
  });
};

const handleDeleteRegistration = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This booking will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "artists", id)); // Deletes from Firestore

        // Remove from UI
        setBookings((prevBookings) => prevBookings.filter((artist) => artist.id !== id));

        Swal.fire("Deleted!", "The booking has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting booking:", error);
        Swal.fire("Error", "Failed to delete booking. Try again.", "error");
      }
    }
  });
};




 // Filter registered artists based on search term
  const filteredArtists = registeredArtists.filter((artist) =>
    artist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artist.stageName && artist.stageName.toLowerCase().includes(searchTerm.toLowerCase()))
  );


// Apply search filter first
const filteredBookings = bookings.filter((booking) =>
  (booking.studioName && booking.studioName.toLowerCase().includes(bookingSearchTerm.toLowerCase())) ||
  (booking.consumerName && booking.consumerName.toLowerCase().includes(bookingSearchTerm.toLowerCase()))
);

// Apply pagination on the filtered results
const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
const indexOfLastItem = indexOfFirstItem + itemsPerPage;
const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  return (

    <div className="Producer-availability">

        <Intheader />
          
    <div className="jumbotron">
        <h2>Studio time management Dashboard</h2>
    </div>

  {/* Tabs */}
  <div className="tab-buttons">
        <button onClick={() => setActiveTab("calendar")} className={activeTab === "calendar" ? "tab-button active" : "tab-button"}>Calendar</button>
        <button onClick={() => setActiveTab("timeList")} className={activeTab === "timeList" ? "tab-button active" : "tab-button"}>Studio bookings</button>
        <button onClick={() => setActiveTab("artists")} className={activeTab === "artists" ? "tab-button active" : "tab-button"}>Registered artists</button>
  </div>

  {activeTab === "calendar" && (
  <div className="overlay-button">

    <button onClick={handleOverlayToggle}>
      <img src="assets/Internal/plusIcon.svg" alt="" />
      <p>Schedule</p>
    </button>
  </div>
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "calendar" && (
          
          <div className="calendar-container">

            {/* <div className="calendar-legend">
              <span style={{ backgroundColor: "#4caf50", color: "#fff", padding: "5px", marginRight: "10px" }}>
                Producer's Availability
              </span>
              <span style={{ backgroundColor: "#f44336", color: "#fff", padding: "5px" }}>
                Booked Slot
              </span>
            </div> */}

            <BigCalendar
                selectable
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                onSelectSlot={handleSelectSlot} // Handle slot clicks
                onSelectEvent={handleDeleteEvent} // Handle event clicks
                eventPropGetter={eventPropGetter} // Add the dynamic styling
              />
          </div>
        )}

        <div className="table-structure">

        {activeTab === "timeList" && (
           <div className="table-header-structur">

          <h3>Studio bookings</h3>

              <input
                  type="text"
                  placeholder="Search by Studio Name or Artist Name"
                  value={bookingSearchTerm}
                  onChange={(e) => setBookingSearchTerm(e.target.value)}
                  className="search-input"
                  style={{marginBottom: '15px', padding: '8px', width: '300px'}}
              />

         </div>

        )}

          {activeTab === "timeList" && (
            <div className="time-list-container dataTable">
              
              <table>
                <thead>
                  <tr>
                    <th>Booking Date</th>
                    <th>Name</th>
                    <th>Studio Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Booked Slot</th>
                    <th>Booked Date</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>

                  {/* {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => ( */}

                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                     
                      // <tr key={booking.id}>
                      <tr key={booking.id} onDoubleClick={() => handleDeleteBooking(booking.id)}>
                        <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "Invalid Date"}</td>
                        <td>{booking.name}</td>
                        <td>{booking.studioName}</td>
                        <td>{booking.email}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.selectedSlot}</td>
                        <td>{booking.selectedDate}</td>
                        {/* <td>{booking.paymentStatus}</td> */}
                        <td>
                          <select
                            value={booking.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Not Paid">Not Paid</option>
                          </select>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              
              {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
            </div>
          )}

        </div>

        <div className="table-structure">

          {activeTab === "artists" && (
            <div className="table-header-structur">

              <h3>Registered Artists</h3>

              <input
              type="text"
              placeholder="Search by Full Name or Stage Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{marginBottom: '15px', padding: '8px', width: '300px'}}
              />

            </div>

          )}

          {activeTab === "artists" && (
            <div className="registered-artists-container dataTable">
          

            {/* {registeredArtists.length > 0 ? ( */}
            {filteredArtists.length > 0 ? (
              <table>
                <thead>
                  <tr>
                  <th>Registered Date</th> {/* New column */}
                    <th>Full Name</th>
                    <th>Stage Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Country</th>
                    <th>City</th>
                    <th>Postal Code</th>
                    <th>ID/Passport</th>
                    <th>MP3 Reference</th>
                    <th>Social Media</th>
                    {/* <th>Proof of ID</th>
                    <th>Proof of Address</th>
                    <th>MP3 Sample</th> */}
                    <th>Approval Status</th>
                    <th>Payment Status</th>
                    <th>Member</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {currentArtists.map((artist) => ( */}
                  {filteredArtists.map((artist) => (
                    <tr key={artist.id} onDoubleClick={() => handleDeleteRegistration(artist.id)}>

                      <td>
                        {artist.registrationDate
                          ? new Date(artist.registrationDate).toLocaleDateString()
                          : "Invalid date"}
                      </td>
                      <td>{artist.fullName}</td>
                      <td>{artist.stageName}</td>
                      <td>{artist.email}</td>
                      <td>{artist.phone}</td>
                      <td>{artist.country}</td>
                      <td>{artist.city}</td>
                      <td>{artist.postalCode}</td>
                      <td>{artist.idPassport}</td>
                      <td>{artist.mp3Reference}</td>
                      <td>{artist.socialMedia}</td>
                      {/* <td>{artist.proofOfID}</td>
                      <td>{artist.proofOfAddress}</td>
                      <td>{artist.mp3Sample}</td> */}
                      <td>
                        <select
                          value={artist.approvalStatus || "Pending"}
                          onChange={(e) => handleApprovalStatusChange(artist.id, e.target.value)}
                          className="custom-dropdown"
                        >
                          <option value="Approved">Approved</option>
                          <option value="Pending">Pending</option>
                          <option value="Waiting for Payment">Waiting for payment</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>{artist.approvalStatus === "Approved" ? "Paid" : "Not Paid"}</td>
                      <td>{artist.approvalStatus === "Approved" ? "Yes" : "No"}</td>
                      <td>{artist.approvalStatus === "Approved" ? "R1500" : "R0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            ) : (
              <p>No registered artists found.</p>
            )}

            <div className="pagination-controls">
              <button onClick={handleArtistPreviousPage} disabled={artistCurrentPage === 1}>
                Previous
              </button>
              <span>
                Page {artistCurrentPage} of {artistTotalPages}
              </span>
              <button onClick={handleArtistNextPage} disabled={artistCurrentPage === artistTotalPages}>
                Next
              </button>
            </div>

          </div>
          )}
        </div>

      </div>

      {isOverlayOpen && (
        <>
          <div className="overlay">
            <div className="overlay-content">

            <div className="overlay-header">
              <h1>Bookings Calendar</h1>

              <div className="toggle-container">
                <p>Avail myself</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={handleAvailabilityToggle}
                  />
                  <span class="slider round"></span>
                </label>
              </div>

              <button onClick={handleOverlayToggle} className="close-overlay">
                X
              </button>
            </div>


              {isAvailable ? (
                // "producer-availability" view
                <div className="producer-availability">
                
                    <div className="left">
                      <Calendar value={selectedDate} onChange={setSelectedDate} className="Calendar"/>
                    </div>

                    
                    <div className="right">
                      <div className="times">
                        <div className="time-input">
                          <label htmlFor="fromTime">From</label>
                          <select value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
                            <option>06:00 AM</option>
                            <option>07:00 AM</option>
                            <option>08:00 AM</option>
                            <option>09:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                            <option>13:00 PM</option>
                            <option>14:00 PM</option>
                            <option>15:00 PM</option>
                            <option>16:00 PM</option>
                            <option>17:00 PM</option>
                            <option>18:00 PM</option>
                            <option>19:00 PM</option>
                            <option>20:00 PM</option>
                            <option>21:00 PM</option>
                            <option>22:00 PM</option>
                            <option>23:00 PM</option>
                          </select>
                        </div>
                        <div className="time-input">
                          <label htmlFor="toTime">To</label>
                          <select value={toTime} onChange={(e) => setToTime(e.target.value)}>
                            <option>06:00 AM</option>
                            <option>07:00 AM</option>
                            <option>08:00 AM</option>
                            <option>09:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                            <option>13:00 PM</option>
                            <option>14:00 PM</option>
                            <option>15:00 PM</option>
                            <option>16:00 PM</option>
                            <option>17:00 PM</option>
                            <option>18:00 PM</option>
                            <option>19:00 PM</option>
                            <option>20:00 PM</option>
                            <option>21:00 PM</option>
                            <option>22:00 PM</option>
                            <option>23:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={handleSaveAvailability} className="avail-self">
                        <p>
                          Avail myself
                        </p>
                      </button>
            
                  </div>
                </div>
              ) : (
                // "booking-for-artist" view
                <div className="booking-for-artist">

                  <div className="calendar-area">
                    <div className="left">
                      <Calendar value={selectedDate} onChange={handleDateChange} className="Calendar"/>
                    </div>

                    <div className="right">


                      <ul>
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot, index) => (
                            <li
                              key={index}
                              className="slot"
                              onClick={() => handleSlotClick(slot)} // Handle slot click
                            >
                              <div className="slot-info">
                                {/* <strong>{slot.name}</strong> */}
                                <strong>{slot.producerName || "Unknown Producer"}</strong> {/* Display producerName */}
                                <p>{slot.time}</p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p>No available slots for {selectedDate.toDateString()}</p>
                        )}
                      </ul>


                    </div>
                  </div>

                  
                  <div className="booking-details-wrapper">
                  <h3>Booking details</h3>
                    <form>

                      <div className="left field-area">
                      
                          <label htmlFor="name">Full Names</label>
                          <input
                            type="text"
                            placeholder="Your name(s) and surname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />

                          <label htmlFor="studioName">Studio Name</label>
                          <input
                            type="text"
                            placeholder="e.g. young rapper"
                            value={studioName}
                            onChange={(e) => setStudioName(e.target.value)}
                            required
                          />

                          <label htmlFor="Email">Email address</label>
                          <input
                            type="email"
                            placeholder="e.g. youremail@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                      </div>

                      <div className="right field-area">

                            <label htmlFor="tel">Phone number</label>
                            <input
                                type="tel"
                                placeholder="e.g. 012356789"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                              />

                            <label>Booked slot</label>
                            <input
                              type="text"
                              value={
                                selectedSlot
                                  ? `${selectedSlot.producerName} - ${selectedSlot.time} on ${selectedDate.toDateString()}`
                                  : ""
                              }
                              readOnly
                            />


                            <label>Payment status</label>
                            <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                          >
                            <option>Paid</option>
                            <option>Not Paid</option>
                          </select>
                      </div>
                      </form>
                  </div>
                    <button className="Book-slot-btn" onClick={handleBookSlot}>
                    <p>Book slot</p>
                    </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Intfooter />

    </div>
    
  );
}

export default ProducerAvailability;
