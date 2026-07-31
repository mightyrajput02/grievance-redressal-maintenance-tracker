import http.server
import socketserver
import json
import sqlite3
import os
from datetime import datetime
from urllib.parse import parse_qs, urlparse

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(os.path.dirname(BASE_DIR), "Database")
DB_PATH = os.path.join(DB_DIR, "grievance.db")

os.makedirs(DB_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'General',
            priority TEXT DEFAULT 'Medium',
            status TEXT DEFAULT 'Pending',
            staff TEXT DEFAULT 'Unassigned',
            date TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            rating INTEGER DEFAULT 5,
            comments TEXT,
            date TEXT NOT NULL
        )
    ''')
    
    # Check if complaints table is empty to insert initial seed data
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_complaints = [
            ("CMP-2094", "22BCS001", "AC not cooling in Room 402", "The AC unit in hostel room 402 is blowing warm air.", "Electrical", "High", "Pending", "Ravi", "2026-07-28"),
            ("CMP-2081", "22BCS014", "Broken projector in Lab 3", "Projector display is flickering repeatedly during class.", "IT", "Medium", "In Progress", "Kiran", "2026-07-29"),
            ("CMP-1955", "22BCS029", "Leaking tap in 2nd Floor Washroom", "Water is leaking continuously causing floor slipperiness.", "Plumbing", "Low", "Resolved", "Arjun", "2026-07-30")
        ]
        cursor.executemany('''
            INSERT INTO complaints (id, student_id, title, description, category, priority, status, staff, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', seed_complaints)
        
    conn.commit()
    conn.close()

init_db()

class RequestHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query = parse_qs(parsed_path.query)

        if path == '/apex-data':
            self._send_json({"status": "online", "message": "Backend operational", "timestamp": datetime.now().isoformat()})
            return

        if path == '/api/stats':
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM complaints")
            total = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'Pending'")
            pending = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'In Progress'")
            in_progress = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM complaints WHERE status = 'Resolved'")
            resolved = cursor.fetchone()[0]
            conn.close()

            self._send_json({
                "total": total,
                "pending": pending,
                "in_progress": in_progress,
                "resolved": resolved
            })
            return

        if path == '/api/complaints':
            conn = get_db()
            cursor = conn.cursor()
            student_id = query.get('student_id', [None])[0]
            search = query.get('search', [None])[0]

            sql = "SELECT * FROM complaints WHERE 1=1"
            params = []

            if student_id:
                sql += " AND UPPER(student_id) = UPPER(?)"
                params.append(student_id)
            if search:
                sql += " AND (UPPER(id) LIKE UPPER(?) OR UPPER(title) LIKE UPPER(?) OR UPPER(student_id) LIKE UPPER(?))"
                term = f"%{search}%"
                params.extend([term, term, term])

            sql += " ORDER BY date DESC, id DESC"
            cursor.execute(sql, params)
            rows = [dict(row) for row in cursor.fetchall()]
            conn.close()
            self._send_json(rows)
            return

        if path.startswith('/api/complaints/'):
            cid = path.split('/api/complaints/')[1]
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM complaints WHERE id = ?", (cid,))
            row = cursor.fetchone()
            conn.close()
            if row:
                self._send_json(dict(row))
            else:
                self._send_json({"error": "Complaint not found"}, status=404)
            return

        if path == '/api/feedback':
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM feedback ORDER BY date DESC, id DESC")
            rows = [dict(row) for row in cursor.fetchall()]
            conn.close()
            self._send_json(rows)
            return

        self._send_json({"error": "Not Found"}, status=404)

    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8')) if post_data else {}
        except Exception:
            self._send_json({"error": "Invalid JSON format"}, status=400)
            return

        if path == '/api/complaints':
            student_id = payload.get('student_id', '').strip()
            title = payload.get('title', '').strip()
            description = payload.get('description', '').strip()
            category = payload.get('category', 'General').strip()
            priority = payload.get('priority', 'Medium').strip()

            if not student_id or not title:
                self._send_json({"error": "student_id and title are required"}, status=400)
                return

            conn = get_db()
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM complaints")
            count = cursor.fetchone()[0]
            new_id = f"CMP-{(count + 2000 + 1)}"

            today = datetime.now().strftime("%Y-%m-%d")

            cursor.execute('''
                INSERT INTO complaints (id, student_id, title, description, category, priority, status, staff, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (new_id, student_id, title, description, category or 'General', priority or 'Medium', 'Pending', 'Unassigned', today))

            conn.commit()

            cursor.execute("SELECT * FROM complaints WHERE id = ?", (new_id,))
            created_row = dict(cursor.fetchone())
            conn.close()

            self._send_json(created_row, status=201)
            return

        if path == '/api/feedback':
            student_id = payload.get('student_id', 'Anonymous').strip()
            rating = payload.get('rating', 5)
            comments = payload.get('comments', '').strip()

            today = datetime.now().strftime("%Y-%m-%d")

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO feedback (student_id, rating, comments, date)
                VALUES (?, ?, ?, ?)
            ''', (student_id, rating, comments, today))
            conn.commit()

            feedback_id = cursor.lastrowid
            cursor.execute("SELECT * FROM feedback WHERE id = ?", (feedback_id,))
            created_row = dict(cursor.fetchone())
            conn.close()

            self._send_json(created_row, status=201)
            return

        self._send_json({"error": "Not Found"}, status=404)

    def do_PUT(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path.startswith('/api/complaints/'):
            cid = path.split('/api/complaints/')[1]
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8')) if post_data else {}
            except Exception:
                self._send_json({"error": "Invalid JSON format"}, status=400)
                return

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM complaints WHERE id = ?", (cid,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                self._send_json({"error": "Complaint not found"}, status=404)
                return

            existing = dict(row)
            new_title = payload.get('title', existing['title'])
            new_description = payload.get('description', existing['description'])
            new_category = payload.get('category', existing['category'])
            new_priority = payload.get('priority', existing['priority'])
            new_status = payload.get('status', existing['status'])
            new_staff = payload.get('staff', existing['staff'])

            cursor.execute('''
                UPDATE complaints
                SET title = ?, description = ?, category = ?, priority = ?, status = ?, staff = ?
                WHERE id = ?
            ''', (new_title, new_description, new_category, new_priority, new_status, new_staff, cid))

            conn.commit()

            cursor.execute("SELECT * FROM complaints WHERE id = ?", (cid,))
            updated_row = dict(cursor.fetchone())
            conn.close()

            self._send_json(updated_row)
            return

        self._send_json({"error": "Not Found"}, status=404)

    def do_DELETE(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path.startswith('/api/complaints/'):
            cid = path.split('/api/complaints/')[1]
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM complaints WHERE id = ?", (cid,))
            row = cursor.fetchone()
            if not row:
                conn.close()
                self._send_json({"error": "Complaint not found"}, status=404)
                return

            cursor.execute("DELETE FROM complaints WHERE id = ?", (cid,))
            conn.commit()
            conn.close()

            self._send_json({"message": f"Complaint {cid} deleted successfully"})
            return

        self._send_json({"error": "Not Found"}, status=404)

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run():
    server_address = ('127.0.0.1', PORT)
    httpd = ThreadedHTTPServer(server_address, RequestHandler)
    print(f"Server starting on http://127.0.0.1:{PORT} with SQLite database at {DB_PATH}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    run()
