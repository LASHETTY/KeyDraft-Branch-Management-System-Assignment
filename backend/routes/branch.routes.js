const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Branch = require('../models/branch.model');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all branches with pagination and search
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sort = req.query.sort || 'branchName';
        const order = req.query.order || 'asc';

        const query = search
            ? {
                $or: [
                    { branchName: { $regex: search, $options: 'i' } },
                    { branchCode: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const sortQuery = { [sort]: order === 'asc' ? 1 : -1 };

        const branches = await Branch.find(query)
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Branch.countDocuments(query);

        res.json({
            branches,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new branch
router.post('/', async (req, res) => {
    try {
        const branch = new Branch(req.body);
        const newBranch = await branch.save();
        res.status(201).json(newBranch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update branch
router.put('/:id', async (req, res) => {
    try {
        const branch = await Branch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(branch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete branch
router.delete('/:id', async (req, res) => {
    try {
        await Branch.findByIdAndDelete(req.params.id);
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Import branches from Excel
router.post('/import', upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const branches = await Branch.insertMany(data);
        res.status(201).json(branches);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export branches to Excel
router.get('/export', async (req, res) => {
    try {
        const branches = await Branch.find({});
        const worksheet = xlsx.utils.json_to_sheet(branches);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Branches');
        
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Disposition', 'attachment; filename=branches.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
