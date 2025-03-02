function saveData() {
    const student = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        attendance: parseInt(document.getElementById('attendance').value),
        studyHours: parseInt(document.getElementById('studyHours').value),
        maths: parseInt(document.getElementById('maths').value),
        science: parseInt(document.getElementById('science').value),
        english: parseInt(document.getElementById('english').value),
    };

    let students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    
    alert('Student data saved successfully!');
    document.getElementById('studentForm').reset();
}
window.onload = function() {
    const students = JSON.parse(localStorage.getItem('students')) || [];

    if (students.length === 0) {
        alert("No student data available. Please enter data first.");
        return;
    }

    // Calculate Total Scores
    students.forEach(student => {
        student.totalScore = student.maths + student.science + student.english;
    });

    // Attendance vs Total Score Chart
    const attendanceVsScoreCtx = document.getElementById('attendanceVsScoreChart').getContext('2d');
    new Chart(attendanceVsScoreCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Attendance vs Total Score',
                data: students.map(s => ({x: s.attendance, y: s.totalScore})),
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        },
        options: {
            scales: {
                x: {title: {display: true, text: 'Attendance (%)'}},
                y: {title: {display: true, text: 'Total Score'}}
            }
        }
    });

    // Study Hours vs Total Score Chart
    const studyHoursVsScoreCtx = document.getElementById('studyHoursVsScoreChart').getContext('2d');
    new Chart(studyHoursVsScoreCtx, {
        type: 'line',
        data: {
            labels: students.map(s => s.name),
            datasets: [{
                label: 'Study Hours vs Total Score',
                data: students.map(s => s.totalScore),
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.2
            }]
        },
        options: {
            plugins: {
                legend: {display: true}
            }
        }
    });

    // Subject-wise Average Scores Chart
    const subjectWiseCtx = document.getElementById('subjectWiseChart').getContext('2d');
    const avgMaths = (students.reduce((sum, s) => sum + s.maths, 0) / students.length).toFixed(2);
    const avgScience = (students.reduce((sum, s) => sum + s.science, 0) / students.length).toFixed(2);
    const avgEnglish = (students.reduce((sum, s) => sum + s.english, 0) / students.length).toFixed(2);

    new Chart(subjectWiseCtx, {
        type: 'bar',
        data: {
            labels: ['Maths', 'Science', 'English'],
            datasets: [{
                label: 'Average Scores',
                data: [avgMaths, avgScience, avgEnglish],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });
};

function clearStudentData() {
    if (confirm("Are you sure you want to clear all student data?")) {
        localStorage.removeItem('students');
        alert("All student data cleared!");
        location.reload();
    }
}
