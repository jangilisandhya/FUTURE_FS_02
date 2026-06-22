const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  source: { type: String, enum: ['website', 'email', 'referral', 'social', 'other'],Default:any },
  status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], Default:any },
  notes: String,
  followUps: [{
    date: Date,
    note: String,
    createdBy: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
const Lead = mongoose.model('Lead', leadSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    
    res.json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Lead Routes
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const { status, source, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

app.get('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, company, source, notes } = req.body;
    
    const lead = new Lead({ name, email, phone, company, source, notes });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

app.put('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, company, source, status, notes } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, source, status, notes, updatedAt: new Date() },
      { new: true }
    );
    
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

app.post('/api/leads/:id/followup', authenticateToken, async (req, res) => {
  try {
    const { note } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: { followUps: { date: new Date(), note, createdBy: req.user.username } },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add follow-up', error: error.message });
  }
});

app.delete('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
});

app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const converted = await Lead.countDocuments({ status: 'converted' });
    const lost = await Lead.countDocuments({ status: 'lost' });
    
    const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(2) : 0;
    
    res.json({
      totalLeads,
      newLeads,
      contacted,
      converted,
      lost,
      conversionRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mini CRM Server running on port ${PORT}`);
});