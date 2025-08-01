import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body

    const docData = await doctorModel.findById(docId)

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available
    })

    res.status(200).json({ success: true, message: 'Availability Changed!' })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.status(201).json({ success: true, doctors })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

// Api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body

    // For the demo, we ensure the doctor exists. In a real app, they would register.
    let doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("lakshita@123", salt)
      doctor = new doctorModel({
        name: "Dr. Lakshita",
        email: "lakshita@gmail.com",
        password: hashedPassword,
        speciality: "General Physician",
        fees: 500,
        address: {
          line1: "123 Health St",
          city: "Wellness City",
          state: "Statelife",
          pincode: "12345"
        }
      })
      await doctor.save()
      console.log("Demo doctor created.")
    }

    // Check password
    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // Create token
    const token = jwt.sign({ id: doctor._id, isDoctor: true }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.status(200).json({ success: true, message: 'Login successful', token })
  } catch (error) {
    console.error("Doctor login error:", error)
    res.status(500).json({ success: false, message: 'Server error during doctor login' })
  }
}

// API to get doctor appointments for doctor panal
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })

    res.json({ success: true, appointments })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

// API to mark appointment as completed from doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true
      })
      res.json({ success: true, message: 'Appointment Completed. 🎉' })
    } else {
      res.json({ success: false, message: 'Mark Failed !!' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: `Server error: ${error.message}` })
  }
}

// API to cancel appointment from doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true
      })
      res.json({ success: true, message: 'Appointment Cancelled.' })
    } else {
      res.json({ success: false, message: 'Cancellation Failed !!' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: `Server error: ${error.message}` })
  }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body

    const appointments = await appointmentModel.find({ docId })

    const docName = await doctorModel.findById(docId).select('name')

    let earnings = 0

    appointments.map(item => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    let patients = []
    appointments.map(item => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      docName,
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.status(201).json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body
    const profileData = await doctorModel.findById(docId).select('-password')
    res.status(201).json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

// API to update doctor profile for doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, address, fees, experience, available } = req.body

    await doctorModel.findByIdAndUpdate(docId, {
      address,
      fees,
      experience,
      available
    })

    res.status(201).json({ success: true, message: 'Profile Updated. 🎉' })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` })
  }
}

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
}
