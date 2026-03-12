const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const { projects, pendingReviews, completedReviews, dashboardData } = require('./mock-data');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static('.'));

// ตัวแปร state สำหรับจำลองการบันทึก
let mockPendingReviews = JSON.parse(JSON.stringify(pendingReviews));
let mockCompletedReviews = JSON.parse(JSON.stringify(completedReviews));
let mockDashboardData = JSON.parse(JSON.stringify(dashboardData));

// ==========================================
// Back Office API (API_URL)
// ==========================================

app.post('/api', (req, res) => {
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const action = body.action;

        console.log(`[${new Date().toLocaleString()}] Action: ${action}`);

        switch (action) {
            case 'getProjectsByStatus':
                return handleGetProjectsByStatus(body, res);
            case 'getPendingReviews':
                return handleGetPendingReviews(res);
            case 'getCompletedReviews':
                return handleGetCompletedReviews(res);
            case 'updateReview':
                return handleUpdateReview(body, res);
            case 'updateReviewStatus':
                return handleUpdateReviewStatus(body, res);
            case 'addNote':
                return handleAddNote(body, res);
            default:
                return res.json({ success: false, message: 'Unknown action' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, message: error.message });
    }
});

function handleGetProjectsByStatus(body, res) {
    const status = body.status; // 'Skip' or 'Success'
    // Skip = pending, Success = completed
    const data = status === 'Skip' ? mockPendingReviews : mockCompletedReviews;
    const uniqueProjects = [...new Set(data.map(d => d.project))];
    
    console.log(`  Projects for status "${status}": ${uniqueProjects.join(', ')}`);
    
    return res.json({
        success: true,
        data: {
            projects: uniqueProjects
        }
    });
}

function handleGetPendingReviews(res) {
    console.log(`  Returning ${mockPendingReviews.length} pending reviews`);
    
    return res.json({
        success: true,
        data: {
            reviews: mockPendingReviews.map(r => ({
                jobNumber: r.jobNumber,
                project: r.project,
                houseNumber: r.houseNumber,
                rowIndex: r.rowIndex,
                reviewDate: r.reviewDate,
                scores: r.scores,
                comment: r.comment,
                image: r.image || ''
            }))
        }
    });
}

function handleGetCompletedReviews(res) {
    console.log(`  Returning ${mockCompletedReviews.length} completed reviews`);
    
    return res.json({
        success: true,
        data: {
            reviews: mockCompletedReviews.map(r => ({
                jobNumber: r.jobNumber,
                project: r.project,
                houseNumber: r.houseNumber,
                rowIndex: r.rowIndex,
                reviewDate: r.reviewDate,
                scores: r.scores,
                comment: r.comment,
                image: r.image || '',
                completedAt: r.completedAt || ''
            }))
        }
    });
}

function handleUpdateReview(body, res) {
    const { rowIndex, jobNumber, project, houseNumber } = body;
    const review = mockPendingReviews.find(r => r.rowIndex === rowIndex);
    
    if (review) {
        review.jobNumber = jobNumber;
        review.project = project;
        review.houseNumber = houseNumber;
        console.log(`  Updated review ${rowIndex}: ${jobNumber} | ${project} | ${houseNumber}`);
        return res.json({ success: true, message: 'Review updated' });
    }
    
    return res.json({ success: false, message: 'Review not found' });
}

function handleUpdateReviewStatus(body, res) {
    const { rowIndex, status, imageUrl } = body;
    const review = mockPendingReviews.find(r => r.rowIndex === rowIndex);
    
    if (review) {
        const completedReview = {
            ...review,
            image: imageUrl,
            completedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        
        mockCompletedReviews.push(completedReview);
        mockPendingReviews = mockPendingReviews.filter(r => r.rowIndex !== rowIndex);
        
        console.log(`  Review ${rowIndex} moved to completed with image: ${imageUrl}`);
        return res.json({ success: true, message: 'Status updated' });
    }
    
    return res.json({ success: false, message: 'Review not found' });
}

function handleAddNote(body, res) {
    const { rowIndex, note } = body;
    console.log(`  Added note to review ${rowIndex}: ${note}`);
    
    return res.json({ success: true, message: 'Note added' });
}

// ==========================================
// Dashboard API (DASHBOARD_API_URL)
// ==========================================

app.get('/api/dashboard', (req, res) => {
    const action = req.query.action;
    
    console.log(`[${new Date().toLocaleString()}] Dashboard Action: ${action}`);

    if (action === 'getDashboardData') {
        return handleGetDashboardData(req.query, res);
    }
    
    return res.json({ status: 'error', message: 'Unknown action' });
});

function handleGetDashboardData(query, res) {
    const { period, month, year, projects: projectsParam } = query;
    
    console.log(`  Period: ${period}, Month: ${month}, Year: ${year}, Projects: ${projectsParam}`);
    
    // Simulated data variation based on filters
    let data = JSON.parse(JSON.stringify(mockDashboardData));
    
    // If specific projects selected, adjust data
    if (projectsParam && projectsParam.trim() !== '') {
        const selectedProjects = projectsParam.split(',').filter(p => p.trim());
        console.log(`  Selected projects: ${selectedProjects.join(', ')}`);
        
        // Adjust data for demo (in real world would filter from database)
        const factor = selectedProjects.length === 1 ? 0.4 : 0.7;
        data.totalJobs = Math.floor(data.totalJobs * factor);
        data.totalUnits = Math.floor(data.totalUnits * factor);
        data.reviewed.jobs = Math.floor(data.reviewed.jobs * factor);
        data.reviewed.units = Math.floor(data.reviewed.units * factor);
        data.remaining.jobs = Math.floor(data.remaining.jobs * factor);
        data.remaining.units = Math.floor(data.remaining.units * factor);
        data.unable.jobs = Math.floor(data.unable.jobs * factor);
        data.unable.units = Math.floor(data.unable.units * factor);
        
        // Recalculate rates
        const total = data.reviewed.jobs + data.remaining.jobs + data.unable.jobs;
        if (total > 0) {
            data.reviewed.rate = Math.round((data.reviewed.jobs / total) * 100);
            data.remaining.rate = Math.round((data.remaining.jobs / total) * 100);
            data.unable.rate = Math.round((data.unable.jobs / total) * 100);
        }
    }
    
    return res.json({
        status: 'success',
        data,
        projects: mockDashboardData.projects
    });
}

// ==========================================
// Serve HTML Files
// ==========================================

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'Back Office - Review Management V.1.1.html'));
});

app.get('/review-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'ระบบประเมินความพึงพอใจงานซ่อม V.1.5.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🚀 Backend Server Running on Port ${PORT}             ║
╚════════════════════════════════════════════════════════════════╝

📋 Available Endpoints:

Back Office API (POST):
  • getProjectsByStatus
  • getPendingReviews
  • getCompletedReviews
  • updateReview
  • updateReviewStatus
  • addNote

Dashboard API (GET):
  • getDashboardData

🌐 Local URLs:
  • Back Office: http://localhost:${PORT}/dashboard
  • Review Form: http://localhost:${PORT}/review-form
  • API (POST):  http://localhost:${PORT}
  • API (GET):   http://localhost:${PORT}?action=getDashboardData

📝 Mock Data Ready:
  • Pending Reviews: ${mockPendingReviews.length}
  • Completed Reviews: ${mockCompletedReviews.length}
  • Projects: ${mockDashboardData.projects.length}

⚠️  Press Ctrl+C to stop the server
    `);
});
