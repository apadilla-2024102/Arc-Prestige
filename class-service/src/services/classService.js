import Class from '../models/class.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { load, append } from '../utils/demoStorage.js';

class ClassService {
    static async createClass(data, instructorId) {
        const payload = {
            _id: uuidv4(),
            ...data,
            instructorId,
            status: data.maxCapacity > 0 ? 'active' : 'full',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (!mongoose.connection || mongoose.connection.readyState !== 1) {
            console.warn('classService createClass fallback to demo storage');
            await append('classes.json', payload);
            return payload;
        }

        try {
            const newClass = new Class({
                ...data,
                instructorId,
                status: data.maxCapacity > 0 ? 'active' : 'full',
            });
            return await newClass.save();
        } catch (err) {
            console.warn('classService createClass DB save failed, fallback to demo storage', err.message);
            await append('classes.json', payload);
            return payload;
        }
    }

    static async getAllClasses() {
        try {
            return await Class.find();
        } catch (err) {
            console.warn('classService getAllClasses fallback to demo storage:', err.message);
            return await load('classes.json');
        }
    }

    static async getClassById(id) {
        return await Class.findById(id);
    }

    static async updateClass(id, data) {
        return await Class.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    static async deleteClass(id) {
        return await Class.findByIdAndDelete(id);
    }

    static async assignStudentToClass(classId, studentId, studentName) {
        const classItem = await Class.findById(classId);
        if (!classItem) {
            throw new Error('Class not found');
        }

        if (classItem.currentEnrollment >= classItem.maxCapacity) {
            throw new Error('Class is full');
        }

        const participant = {
            studentId,
            studentName,
            status: 'active',
        };

        classItem.participants.push(participant);
        classItem.currentEnrollment += 1;

        if (classItem.currentEnrollment >= classItem.maxCapacity) {
            classItem.status = 'full';
        }

        return await classItem.save();
    }

    static async approveStudent(classId, participantId) {
        const classItem = await Class.findById(classId);
        if (!classItem) {
            throw new Error('Class not found');
        }

        const participant = classItem.participants.find(p => p.studentId === participantId);
        if (participant) {
            participant.status = 'active';
        }

        return await classItem.save();
    }

    static async rejectStudent(classId, participantId) {
        const classItem = await Class.findById(classId);
        if (!classItem) {
            throw new Error('Class not found');
        }

        classItem.participants = classItem.participants.filter(p => p.studentId !== participantId);
        classItem.currentEnrollment = Math.max(0, classItem.currentEnrollment - 1);
        classItem.status = classItem.currentEnrollment >= classItem.maxCapacity ? 'full' : 'active';

        return await classItem.save();
    }
}

export default ClassService;