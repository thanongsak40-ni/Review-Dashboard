// Mock Data สำหรับ Local Development
const moment = require('moment');

const projects = [
    'โครงการ A',
    'โครงการ B',
    'โครงการ C',
    'โครงการ D',
    'โครงการ E'
];

const pendingReviews = [
    {
        jobNumber: 'JOB001',
        project: 'โครงการ A',
        houseNumber: '101',
        rowIndex: 1,
        reviewDate: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
        scores: {
            adminCoordination: 4,
            schedulingSpeed: 4.5,
            technicianManner: 5,
            cleanliness: 4,
            repairSatisfaction: 4.5
        },
        comment: 'บริการดีมาก ช่างเชื่อมั่นได้'
    },
    {
        jobNumber: 'JOB002',
        project: 'โครงการ B',
        houseNumber: '202',
        rowIndex: 2,
        reviewDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        scores: {
            adminCoordination: 3.5,
            schedulingSpeed: 3.5,
            technicianManner: 4,
            cleanliness: 3.5,
            repairSatisfaction: 4
        },
        comment: 'ปกติ แต่ช่างมาได้นิดช้า'
    },
    {
        jobNumber: 'JOB003',
        project: 'โครงการ C',
        houseNumber: '303',
        rowIndex: 3,
        reviewDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        scores: {
            adminCoordination: 5,
            schedulingSpeed: 5,
            technicianManner: 5,
            cleanliness: 5,
            repairSatisfaction: 5
        },
        comment: 'ยอดเยี่ยมมากครับ ต้องเพิ่มเติมครั้งต่อไป'
    }
];

const completedReviews = [
    {
        jobNumber: 'JOB101',
        project: 'โครงการ A',
        houseNumber: '105',
        rowIndex: 101,
        reviewDate: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
        completedAt: moment().subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss'),
        scores: {
            adminCoordination: 4.5,
            schedulingSpeed: 4,
            technicianManner: 4.5,
            cleanliness: 4,
            repairSatisfaction: 4.5
        },
        comment: 'ดี มีความเป็นมืออาชีพ',
        image: 'https://via.placeholder.com/300'
    },
    {
        jobNumber: 'JOB102',
        project: 'โครงการ B',
        houseNumber: '206',
        rowIndex: 102,
        reviewDate: moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss'),
        completedAt: moment().subtract(9, 'days').format('YYYY-MM-DD HH:mm:ss'),
        scores: {
            adminCoordination: 3.5,
            schedulingSpeed: 3,
            technicianManner: 3.5,
            cleanliness: 3,
            repairSatisfaction: 3.5
        },
        comment: 'ผลงานยอดนะครับ',
        image: 'https://via.placeholder.com/300'
    }
];

const dashboardData = {
    totalJobs: 150,
    totalUnits: 200,
    avgScore: 4.2,
    reviewed: {
        jobs: 95,
        units: 135,
        rate: 63,
        unitRate: 68
    },
    remaining: {
        jobs: 40,
        units: 50,
        rate: 27,
        unitRate: 25
    },
    unable: {
        jobs: 15,
        units: 15,
        rate: 10,
        unitRate: 7
    },
    jobShare: {
        callCenter: {
            count: 85,
            rate: 57
        },
        fm: {
            count: 65,
            rate: 43
        }
    },
    unitShare: {
        callCenter: {
            count: 115,
            rate: 58
        },
        fm: {
            count: 85,
            rate: 42
        }
    },
    scores: {
        adminCoordination: 4.3,
        speedAndNotification: 4.1,
        dressingAndPoliteness: 4.4,
        cleanliness: 4.0,
        repairSatisfaction: 4.2
    },
    projects: projects,
    feedback: [
        {
            serialNumber: 'JOB001',
            projectName: 'โครงการ A',
            houseNumber: '101',
            comment: 'บริการดีมาก ช่างเชื่อมั่นได้',
            createdAt: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            serialNumber: 'JOB002',
            projectName: 'โครงการ B',
            houseNumber: '202',
            comment: 'ปกติ แต่ช่างมาได้นิดช้า',
            createdAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            serialNumber: 'JOB003',
            projectName: 'โครงการ C',
            houseNumber: '303',
            comment: 'ยอดเยี่ยมมากครับ ต้องเพิ่มเติมครั้งต่อไป',
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    ]
};

module.exports = {
    projects,
    pendingReviews,
    completedReviews,
    dashboardData
};
