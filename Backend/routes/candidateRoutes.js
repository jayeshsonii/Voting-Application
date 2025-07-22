const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware } = require('../jwt');
const mongoose = require('mongoose'); // Import mongoose to validate ObjectIDs

// Helper function to check for admin role
const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        // Ensure user exists and their role is 'admin'
        if (user && user.role === 'admin') {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

// POST route to add a candidate (Admin only)
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();

        console.log('Candidate data saved');
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to update a candidate (Admin only)
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const candidateID = req.params.candidateID;
        //Add validation for the ID
        if (!mongoose.Types.ObjectId.isValid(candidateID)) {
            return res.status(400).json({ error: 'Invalid Candidate ID format' });
        }

        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE route to delete a candidate (Admin only)
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }

        const candidateID = req.params.candidateID;
        //Add validation for the ID
        if (!mongoose.Types.ObjectId.isValid(candidateID)) {
            return res.status(400).json({ error: 'Invalid Candidate ID format' });
        }

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate deleted');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route for voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        //Add validation for the ID to prevent the CastError
        if (!mongoose.Types.ObjectId.isValid(candidateID)) {
            return res.status(400).json({ error: 'Invalid Candidate ID format' });
        }

        // Find the candidate
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Find the user who is voting
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is an admin or has already voted
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin is not allowed to vote' });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        // Update the user document to mark them as voted
        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET route to get vote counts
router.get('/vote/counts', async (req, res) => { 
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount,
            };
        });
        res.status(200).json(voteRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET route to get a list of all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party');
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
