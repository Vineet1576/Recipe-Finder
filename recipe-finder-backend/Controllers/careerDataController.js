const Position = require('../Models/Position');
const InterviewStep = require('../Models/InterviewStep');

exports.getPositions = async (req, res) => {
    try {
        const positions = await Position.find();
        res.json(positions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching positions', error: err });
    }
};

exports.getInterviewSteps = async (req, res) => {
    try {
        const steps = await InterviewStep.find().sort({ step: 1 });
        res.json(steps);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching interview steps', error: err });
    }
};
