import express from 'express';
import ClassController from '../controllers/classController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { checkValidators } from '../middlewares/check-validators.js';
import { validateClassCreation, validateStudentAssignment, validateParticipantAction } from '../middlewares/class-validators.js';

const router = express.Router();

/**
 * @openapi
 * /classes:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Create a new class
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassCreation'
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post('/', authMiddleware, validateClassCreation, checkValidators, ClassController.create);

/**
 * @openapi
 * /classes:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get all classes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *       401:
 *         description: Authentication required
 */
router.get('/', authMiddleware, ClassController.getAll);

/**
 * @openapi
 * /classes/{id}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Get class by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details
 *       404:
 *         description: Class not found
 */
router.get('/:id', authMiddleware, ClassController.getById);

/**
 * @openapi
 * /classes/{id}:
 *   put:
 *     tags:
 *       - Classes
 *     summary: Update class by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassCreation'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Class not found
 */
router.put('/:id', authMiddleware, validateClassCreation, checkValidators, ClassController.update);

/**
 * @openapi
 * /classes/{id}:
 *   delete:
 *     tags:
 *       - Classes
 *     summary: Delete class by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete('/:id', authMiddleware, ClassController.delete);

/**
 * @openapi
 * /classes/{id}/assign-student:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Assign a student to a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentAssignment'
 *     responses:
 *       200:
 *         description: Student assigned successfully
 *       400:
 *         description: Validation error or class full
 *       404:
 *         description: Class not found
 */
router.post('/:id/assign-student', authMiddleware, validateStudentAssignment, checkValidators, ClassController.assignStudent);

/**
 * @openapi
 * /classes/{id}/approve-student:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Approve a pending student in a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantAction'
 *     responses:
 *       200:
 *         description: Student approved successfully
 *       404:
 *         description: Class not found
 */
router.post('/:id/approve-student', authMiddleware, validateParticipantAction, checkValidators, ClassController.approveStudent);

/**
 * @openapi
 * /classes/{id}/reject-student:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Reject a student from a class
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantAction'
 *     responses:
 *       200:
 *         description: Student rejected successfully
 *       404:
 *         description: Class not found
 */
router.post('/:id/reject-student', authMiddleware, validateParticipantAction, checkValidators, ClassController.rejectStudent);

export default router;
