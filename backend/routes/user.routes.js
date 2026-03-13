import express from "express";
import {
  fetchCurrentUser,
  changePassword,
  deleteUserAccount,
  getUserProfile,
  toggleBookmarkJob,
  updateProfile,
  updateUserAuth,
  updateProfilePic,
} from "../controllers/user/user.controller.js";
import {
  getEducations,
  addEducation,
  removeEducation,
  updateEducation,
} from "../controllers/user/education.controller.js";
import {
  getExperiences,
  addExperience,
  removeExperience,
  updateExperience,
} from "../controllers/user/experience.controller.js";
import {
  getProjects,
  addProject,
  removeProject,
  updateProject,
} from "../controllers/user/projects.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

const router = express.Router();
router.use(protect);

router.put("/profile-pic", updateProfilePic);

/**
 * @swagger
 * /api/user/current-user:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched current user data, including user details without password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Current user data fetched successfully!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, recruiter, jobSeeker]
 *                       default: jobSeeker
 *                     isVerified:
 *                       type: boolean
 *                       default: false
 *                     inviteCodeUsed:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                     yoe:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     contact:
 *                       type: string
 *                     contactEmail:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     address:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     profileLinks:
 *                       type: object
 *                       properties:
 *                         linkedIn:
 *                           type: string
 *                         github:
 *                           type: string
 *                         other:
 *                           type: object
 *                           properties:
 *                             platform:
 *                               type: string
 *                             url:
 *                               type: string
 *                     companies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           skills:
 *                             type: array
 *                             items:
 *                               type: string
 *                           endDate:
 *                             type: string
 *                             format: date
 *                           description:
 *                             type: string
 *                           url:
 *                             type: string
 *                           repository:
 *                             type: string
 *                     experience:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           jobTitle:
 *                             type: string
 *                           employer:
 *                             type: string
 *                           startDate:
 *                             type: string
 *                             format: date
 *                           endDate:
 *                             type: string
 *                             format: date
 *                           description:
 *                             type: string
 *                           location:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [Full-time, Part-time, Internship, Contract]
 *                     education:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           institution:
 *                             type: string
 *                           degree:
 *                             type: string
 *                           yearOfGraduation:
 *                             type: string
 *                     bookmarkedJobs:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/current-user", fetchCurrentUser);

/**
 * @swagger
 * /api/user/auth-update:
 *   put:
 *     summary: Update user's authentication data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *               inviteCodeUsed:
 *                 type: string
 *     responses:
 *       200:
 *         description: User auth data updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/auth-update", updateUserAuth);

/**
 * @swagger
 * /api/user/profile-update:
 *   put:
 *     summary: Update user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *               contact:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               designation:
 *                 type: string
 *               address:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               profileLinks:
 *                 type: object
 *               company:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     profilePic:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     contact:
 *                       type: string
 *                     contactEmail:
 *                       type: string
 *                     designation:
 *                       type: string
 *                     address:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     profileLinks:
 *                       type: object
 *                     company:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/profile-update", updateProfile);

/**
 * @swagger
 * /api/user/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", deleteUserAccount);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User password changed successfully!"
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/change-password", changePassword);

/**
 * @swagger
 * /api/user/{jobId}/toggle-bookmark:
 *   put:
 *     summary: Toggle job bookmark status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: Action to perform on the bookmark (add or remove)
 *     responses:
 *       200:
 *         description: Job bookmark status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Job bookmarked successfully or Job unbookmarked successfully!"
 *                 bookmarkedJobs:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User or Job not found
 *       500:
 *         description: Server error
 */
router.put("/:jobId/toggle-bookmark", toggleBookmarkJob);

// Education routes
/**
 * @swagger
 * /api/user/get-educations:
 *   get:
 *     summary: Get user's education records
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched education records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Education records fetched successfully."
 *                 education:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       institution:
 *                         type: string
 *                       degree:
 *                         type: string
 *                       yearOfGraduation:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/get-educations", getEducations);

/**
 * @swagger
 * /api/user/add-education:
 *   post:
 *     summary: Add new education record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               yearOfGraduation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Education record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Education record added successfully."
 *                 education:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/add-education", addEducation);

/**
 * @swagger
 * /api/user/update-education/{eduId}:
 *   put:
 *     summary: Update education record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eduId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               yearOfGraduation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Education record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Education record updated successfully."
 *                 education:
 *                   type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Education record not found
 *       500:
 *         description: Server error
 */
router.put("/update-education/:eduId", updateEducation);

/**
 * @swagger
 * /api/user/delete-education/{eduId}:
 *   delete:
 *     summary: Delete education record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eduId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Education record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Education record removed successfully."
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Education record not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-education/:eduId", removeEducation);

// Experience routes
/**
 * @swagger
 * /api/user/get-experiences:
 *   get:
 *     summary: Get user's experience records
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched experience records
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/get-experiences", getExperiences);

/**
 * @swagger
 * /api/user/add-experience:
 *   post:
 *     summary: Add new experience record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               employer:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Internship, Contract]
 *     responses:
 *       201:
 *         description: Experience record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Experience added successfully"
 *                 experiences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                       employer:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       location:
 *                         type: string
 *                       type:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/add-experience", addExperience);

/**
 * @swagger
 * /api/user/update-experience/{expId}:
 *   put:
 *     summary: Update experience record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               employer:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Internship, Contract]
 *     responses:
 *       200:
 *         description: Experience record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Experience updated successfully"
 *                 experience:
 *                   type: object
 *                   properties:
 *                     jobTitle:
 *                       type: string
 *                     employer:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     location:
 *                       type: string
 *                     type:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Experience record not found
 *       500:
 *         description: Server error
 */
router.put("/update-experience/:expId", updateExperience);

/**
 * @swagger
 * /api/user/experience/{expId}:
 *   delete:
 *     summary: Delete experience record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Experience record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Experience removed successfully"
 *                 experiences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                       employer:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       location:
 *                         type: string
 *                       type:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Experience record not found
 *       500:
 *         description: Server error
 */
router.delete("/experience/:expId", removeExperience);

// Projects routes
/**
 * @swagger
 * /api/user/get-projects:
 *   get:
 *     summary: Get user's project records
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched project records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       url:
 *                         type: string
 *                       repository:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/get-projects", getProjects);

/**
 * @swagger
 * /api/user/add-project:
 *   post:
 *     summary: Add new project record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               repository:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *                       url:
 *                         type: string
 *                       repository:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/add-project", addProject);

/**
 * @swagger
 * /api/user/update-project/{projectId}:
 *   put:
 *     summary: Update project record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               repository:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *                     url:
 *                       type: string
 *                     repository:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Project record not found
 *       500:
 *         description: Server error
 */
router.put("/update-project/:projectId", updateProject);

/**
 * @swagger
 * /api/user/delete-project/{projectId}:
 *   delete:
 *     summary: Delete project record
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Project record deleted successfully."
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Project record not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-project/:projectId", removeProject);

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user's profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
// IMPORTANT: This wildcard route must be LAST to avoid catching named routes like /get-educations
router.get("/:userId", authorize("recruiter"), getUserProfile);

export default router;
