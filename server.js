import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contactdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema for contact submissions
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Received contact form submission:', { name, email, message });

    // Save the submission to the database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 