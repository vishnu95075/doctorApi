const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
// Sample doctor data (for demonstration purposes)
const doctors = [
  {
    id: 1,
    name: 'Dr. vishnu Kumar Prajapati',
    schedule: {
      days: ['Monday', 'Wednesday', 'Friday'],
      maxPatientsPerDay: 10,
    },
  },
  //We can Add more doctor data as needed
];

const appointments = [];
 
app.get('/', (req, res) => {
  res.send("Hello Doctor API ");
});

// Route to list all doctors
app.get('/doctors', (req, res) => {
  res.json(doctors);
});

// Route to get doctor details by ID
app.get('/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
});

app.post('/appointments', (req, res) => {
  const { doctorId, patientName } = req.body;
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'Monday' }); // Get the current day
  if (!doctor.schedule.days.includes(today)) {
    return res.status(400).json({ message: 'Doctor is not available today' });
  }

  const todaysAppointments = appointments.filter(
    (appt) => appt.doctorId === doctorId && appt.date === today
  );

  if (todaysAppointments.length >= doctor.schedule.maxPatientsPerDay) {
    return res.status(400).json(
      {
        message: 'Doctor is fully booked for today'
      }
    );
  }

  // Book the appointment
  const appointment = {
    doctorId,
    patientName,
    date: today,
  };

  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
