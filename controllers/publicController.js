const User = require('../models/User');

const GetHome = async (req, res) => {
    try {
        // Get recent approved students with public profiles
        const recentStudents = await User.find({
            role: 'student',
            status: 'approved',
            visibility: 'public'
        })
            .sort({ createdAt: -1 })
            .limit(6);

        res.render('index', {
            title: 'Student Portal',
            recentStudents
        });
    } catch (error) {
        console.error(error);
        res.render('index', {
            title: 'Student Portal',
            recentStudents: []
        });
    }
}

const directory = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';

        let query = {
            role: 'student',
            status: 'approved'
        };

        // Apply visibility filter
        if (!req.session.user) {  // Guest 
            query.visibility = 'public';
        } else if (req.session.user.role !== 'admin') {
            query.visibility = { $in: ['public', 'university'] };
        }

        // Apply search filter
        if (searchQuery) {
            query.$or = [
                { name: new RegExp(searchQuery, 'i') },
                { bio: new RegExp(searchQuery, 'i') },
                { interests: new RegExp(searchQuery, 'i') }
            ];
        }

        const students = await User.find(query).sort({ name: 1 });

        res.render('directory', {
            title: 'Students Directory',
            students,
            searchQuery
        });
    } catch (error) {
        console.error(error);
        res.render('directory', {
            title: 'Students Directory',
            students: [],
            searchQuery: ''
        });
    }
}

module.exports = {
    GetHome,
    directory
}