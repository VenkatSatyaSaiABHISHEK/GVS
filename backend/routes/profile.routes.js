import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getProfileStatus,
  completeProfile,
  getProfile,
  updateProfile,
  getRequiredFields,
  getProfileStrength
} from '../controllers/profileCompletion.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get profile completion status
router.get('/status', getProfileStatus);

// Get profile data
router.get('/', getProfile);

// Get required fields for user's role
router.get('/required-fields', getRequiredFields);

// Get profile strength meter data
router.get('/strength', getProfileStrength);

// Complete profile (first time)
router.put('/complete', completeProfile);

// Update profile (anytime)
router.put('/update', updateProfile);

export default router;
