# Local Development Setup - SENA Repair Review System

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "/Volumes/PortableSSD/SENA/Repair Review"
npm install
```

### 2. Start the Server
```bash
npm start
```

หรือ:
```bash
node server.js
```

Server จะเปิดที่ `http://localhost:3000`

### 3. Access the Applications

#### 🔧 Back Office Dashboard
```
http://localhost:3000/dashboard
```
- Dashboard Page: ดูภาพรวมข้อมูล KPI Cards, Status Cards, Feedback
- Review List Page: จัดการรีวิว (Pending/Completed)
- Edit & Status Change: แก้ไขข้อมูลและเปลี่ยนสถานะ

#### 📋 Review Form
```
http://localhost:3000/review-form
```
- ฟอร์มรีวิวความพึงพอใจงานซ่อม
- Multi-page form system
- QR Code generation
- Rating survey (5 questions)

#### 🏠 Development Dashboard
```
http://localhost:3000/
```
- Quick access links
- API documentation
- Status monitoring

---

## 📡 API Endpoints

### Back Office API (POST)

```
POST http://localhost:3000
Content-Type: application/json

{
  "action": "getProjectsByStatus",
  "status": "Skip" // or "Success"
}
```

#### Available Actions:

1. **getProjectsByStatus**
   ```json
   {
     "action": "getProjectsByStatus",
     "status": "Skip"  // Skip = Pending, Success = Completed
   }
   ```

2. **getPendingReviews**
   ```json
   {
     "action": "getPendingReviews"
   }
   ```

3. **getCompletedReviews**
   ```json
   {
     "action": "getCompletedReviews"
   }
   ```

4. **updateReview**
   ```json
   {
     "action": "updateReview",
     "rowIndex": 1,
     "jobNumber": "JOB001",
     "project": "โครงการ A",
     "houseNumber": "101"
   }
   ```

5. **updateReviewStatus**
   ```json
   {
     "action": "updateReviewStatus",
     "rowIndex": 1,
     "status": "completed",
     "imageUrl": "https://..."
   }
   ```

6. **addNote**
   ```json
   {
     "action": "addNote",
     "rowIndex": 1,
     "note": "แก้ไขข้อมูล..."
   }
   ```

### Dashboard API (GET)

```
GET http://localhost:3000?action=getDashboardData&period=this-month&month=3&year=2569&projects=โครงการ%20A,โครงการ%20B
```

#### Parameters:
- `action`: `getDashboardData`
- `period`: `this-month`, `this-year`, `by-month`, `by-year`
- `month`: 1-12 (required if period is `by-month`)
- `year`: e.g., 2569
- `projects`: comma-separated project names (optional)

#### Response:
```json
{
  "status": "success",
  "data": {
    "totalJobs": 150,
    "totalUnits": 200,
    "avgScore": 4.2,
    "reviewed": {...},
    "remaining": {...},
    "unable": {...},
    "jobShare": {...},
    "unitShare": {...},
    "scores": {...},
    "feedback": [...]
  },
  "projects": ["โครงการ A", "โครงการ B", ...]
}
```

---

## 📝 Mock Data

### Pending Reviews (3 items)
- JOB001 - โครงการ A - บ้าน 101
- JOB002 - โครงการ B - บ้าน 202
- JOB003 - โครงการ C - บ้าน 303

### Completed Reviews (2 items)
- JOB101 - โครงการ A - บ้าน 105
- JOB102 - โครงการ B - บ้าน 206

### Dashboard Data
- Total Jobs: 150
- Total Units: 200
- Average Score: 4.2/5.0
- Sample Projects: 5 items

*All mock data is stored in memory. Changes will reset on server restart.*

---

## 🔧 File Structure

```
Repair Review/
├── server.js                      # Express server (main backend)
├── mock-data.js                   # Mock data storage
├── package.json                   # Node.js dependencies
├── index.html                     # Development dashboard (entry point)
├── Back Office - Review Management V.1.1.html
├── ระบบประเมินความพึงพอใจงานซ่อม V.1.5.html
└── node_modules/                 # Dependencies
```

---

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Dependencies not installed
```bash
npm install
npm install moment
```

### Server crashes
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules
npm install
```

### CORS issues
- Server includes CORS headers automatically
- Make sure to use `http://localhost:3000` not `http://127.0.0.1:3000`

---

## 🌐 Production Deployment

To switch to production (Google Apps Script), update these URLs in HTML:

```javascript
// From localhost:
const API_URL = 'http://localhost:3000';
const DASHBOARD_API_URL = 'http://localhost:3000';

// To Google Apps Script:
const API_URL = 'https://script.google.com/macros/s/AKfycbzM4ZezRlTP82EdMPgcaQE1Rf1ZWgyjFEShxPLKHFtIoax6XD-NyZfM9mqhe9x3w5-c/exec';
const DASHBOARD_API_URL = 'https://script.google.com/macros/s/AKfycbyS06vsMqH7W2zFWI-NDZegAgbPtKnub1YvtmUZcQYQCzajXWZzsmMa8K_nZC3uzGfk/exec';
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Choices.js](https://choices-js.github.io/choices/)
- [GitHub Repository](https://github.com/thanongsak40-ni/Review-Dashboard)

---

## 📋 Notes

- ✅ Mock data updates are not persisted (in-memory only)
- ✅ All CORS headers are configured
- ✅ Supports both JSON and text/plain request body
- ✅ Console logging for debugging API calls
- ✅ Ready for production migration

**Last Updated:** 12 มีนาคม 2569
**Version:** 1.0.0
