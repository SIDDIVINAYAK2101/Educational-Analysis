from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = 'data/students.json'

# Load data from file
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    return []

# Save data to file
def save_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# Route to get all students
@app.route('/students', methods=['GET'])
def get_students():
    students = load_data()
    return jsonify(students)

# Route to get one student by ID
@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    students = load_data()
    student = next((s for s in students if s['id'] == student_id), None)
    if student:
        return jsonify(student)
    return jsonify({'error': 'Student not found'}), 404

# Route to add a new student
@app.route('/students', methods=['POST'])
def add_student():
    new_student = request.json
    students = load_data()
    new_student['id'] = len(students) + 1  # Simple auto-increment ID
    students.append(new_student)
    save_data(students)
    return jsonify(new_student), 201

# Route for class performance analysis
@app.route('/performance', methods=['GET'])
def class_performance():
    students = load_data()
    if not students:
        return jsonify({'error': 'No data available'}), 404

    total_marks = sum(s['marks'] for s in students)
    average_marks = total_marks / len(students)

    pass_count = sum(1 for s in students if s['marks'] >= 40)
    pass_rate = (pass_count / len(students)) * 100

    return jsonify({
        'total_students': len(students),
        'average_marks': average_marks,
        'pass_rate': pass_rate
    })

if __name__ == '__main__':
    app.run(debug=True)
