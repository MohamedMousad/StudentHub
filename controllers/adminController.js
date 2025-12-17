const User = require('../models/User');
const BannedWord = require('../models/BannedWord');

const GetStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingCount = await User.countDocuments({ status: 'pending' });
        const approvedCount = await User.countDocuments({ status: 'approved', role: 'student' });
        const rejectedCount = await User.countDocuments({ status: 'rejected' });
        const flaggedUsers = await User.find({ flaggedContentAttempts: { $gt: 0 } })
            .sort({ flaggedContentAttempts: -1 })
            .limit(10);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                total: totalStudents,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount
            },
            flaggedUsers
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}

const GetPending = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.render('admin/pending', {
            title: 'Pending Requests',
            users: pendingUsers
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

const GetAprroved = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: 'approved' });
        req.session.success_msg = 'User approved successfully';
        res.redirect('/admin/pending');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to approve user';
        res.redirect('/admin/pending');
    }
}

const GetRejected = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: 'rejected' });
        req.session.success_msg = 'User rejected';
        res.redirect('/admin/pending');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to reject user';
        res.redirect('/admin/pending');
    }
}

const GetAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        res.render('admin/students', {
            title: 'All Students',
            students
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

const DeleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        req.session.success_msg = 'Student deleted successfully';
        res.redirect('/admin/students');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to delete student';
        res.redirect('/admin/students');
    }
}

const GetBannedWords = async (req, res) => {
    try {
        const bannedWords = await BannedWord.find().sort({ word: 1 });
        res.render('admin/banned-words', {
            title: 'Banned Words',
            words: bannedWords
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

const AddBannedWords = async (req, res) => {
    try {
        const { word } = req.body;
        await BannedWord.create({ word: word.toLowerCase().trim() });
        req.session.success_msg = 'Banned word added successfully';
        res.redirect('/admin/banned-words');
    } catch (error) {
        if (error.code === 11000) {  // duplicated
            req.session.error_msg = 'Word already exists in banned list';
        } else {
            req.session.error_msg = 'Failed to add banned word';
        }
        res.redirect('/admin/banned-words');
    }
}

const DeleteBannedWords = async (req, res) => {
    try {
        await BannedWord.findByIdAndDelete(req.params.id);
        req.session.success_msg = 'Banned word removed successfully';
        res.redirect('/admin/banned-words');
    } catch (error) {
        console.error(error);
        req.session.error_msg = 'Failed to remove banned word';
        res.redirect('/admin/banned-words');
    }
}

module.exports = {
    GetStats,
    GetPending,
    GetAprroved,
    GetRejected,
    GetAllStudents,
    DeleteStudent,
    GetBannedWords,
    AddBannedWords,
    DeleteBannedWords
}