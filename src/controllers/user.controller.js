import { clerkClient, getAuth } from '@clerk/express';
import { Teacher } from '../models/teacher.model.js';
import { User } from '../models/user.model.js';

const approveTeacher = async (req, res) => {
    try {
        const { userId, subject, experience, heading } = req.body;

        

        if (!userId) {
            return res.status(400).json({ message: "User ID is mandatory" });
        }

        // Find the existing user in the User collection
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({
                message: 'No user found associated with this userId'
            });
        }

        

        if (!subject || !experience) {
            return res.status(400).json({
                message: "Subject and experience are required"
            });
        }

        if (user.role === 'Teacher') {
            return res.status(400).json({
                message: 'User is already a teacher'
            });
        }

        // Update role in Clerk
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: 'Teacher' }
        });

        // Convert User to Teacher by creating a new Teacher document
        const teacherData = {
            ...user.toObject(), // Copy base user fields
            __t: 'Teacher', // Mark it as a Teacher for Mongoose
            role: 'Teacher',
            subject,
            experience,
            heading
        };

        // Delete old user and create a new Teacher entry
        await User.deleteOne({ clerkId: userId }); // Remove old user entry
        const teacher = await Teacher.create(teacherData); // Create teacher

       ;
        


        return res.status(200).json({
            success: true,
            data: teacher,
            message: 'Teacher approved successfully'
        });

    } catch (error) {
        console.error('Error in approving teacher:', error);
        return res.status(500).json({
            success: false,
            message: 'Error in approving teacher'
        });
    }
};



export { approveTeacher };
