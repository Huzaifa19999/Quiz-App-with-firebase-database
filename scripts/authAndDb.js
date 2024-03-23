// // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6NaZiqLw_IEBSNg8omm2iXji9zQufuII",
  authDomain: "quiz-app-897d1.firebaseapp.com",
  databaseURL: "https://quiz-app-897d1-default-rtdb.firebaseio.com",
  projectId: "quiz-app-897d1",
  storageBucket: "quiz-app-897d1.appspot.com",
  messagingSenderId: "941358527987",
  appId: "1:941358527987:web:8d500b1c9a9a465f5b8e86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
var db = getDatabase();

window.goToQuiz = function () {
  window.location.href = "../pages/quiz.html";
};

window.goTosignIn = function () {
  window.location.href = "../pages/adminPanel.html";
};


function renderQuestions() {
  var parent = document.getElementById("parent");
  parent.innerHTML = "";
  for (var i = 0; i < questions.length; i++) {
    parent.innerHTML += `<div class="container">
    <div class="row">
      <div class="offset-md-3 col-md-6">
        <div class="bg-light my-3 p-3 rounded shadow">
          <p class = 'fs-5'><strong class ='text-primary'>Question no. </strong> ${questions[i].numb} </p>
          <p class = 'fs-5'><strong>Question : </strong> ${questions[i].question} </p>
          <p class = 'fs-5'><strong>Options : </strong> ${questions[i].option} </p>
          <p class = 'fs-5'><strong>Answer : </strong> ${questions[i].correctOption} </p>
        </div>
      </div>
    </div>
  </div>`;
  }
  // console.log("In render Function");
  // console.log(questions.length);
}

var questions = [];
function getQuestions() {
  var reference = ref(db, "questions/");
  var showQuestions = [];

  onValue(reference, function (data) {
    showQuestions = Object.values(data.val());
    questions.length = 0;
    for (var i = 0; i < showQuestions.length; i++) {
      showQuestions[i].numb = i + 1;
      questions.push(showQuestions[i]);
    }
    renderQuestions();
  });
}

window.addQuestions = function () {
  var newQuestion = document.getElementById("newQuestion");
  var newOption1 = document.getElementById("newOption1");
  var newOption2 = document.getElementById("newOption2");
  var newOption3 = document.getElementById("newOption3");
  var newOption4 = document.getElementById("newOption4");
  var newCorrectAnswer = document.getElementById("newCorrectAnswer");
  var option = [];
  var flag = false;

  if (newOption1.value !== "") {
    option.push(newOption1.value);
  }

  if (newOption2.value !== "") {
    option.push(newOption2.value);
  }

  if (newOption3.value !== "") {
    option.push(newOption3.value);
  }

  if (newOption4.value !== "") {
    option.push(newOption4.value);
  }

  for (var i = 0; i < option.length; i++) {
    if (option[i] == newCorrectAnswer.value) {
      flag = true;
    }
  }

  var questionObj = {
    question: newQuestion.value,
    option,
    correctOption: newCorrectAnswer.value,
  };

  if (newQuestion.value == "" || newCorrectAnswer.value == "") {
    alert("Fields Cannot be empty");
  } else {
    if (flag == true) {
      var reference = ref(db, "questions/");
      var newRef = push(reference);
      questionObj.id = newRef.key;
      set(newRef, questionObj);
      newQuestion.value = "";
      newOption1.value = "";
      newOption2.value = "";
      newOption3.value = "";
      newOption4.value = "";
      newCorrectAnswer.value = "";
      console.log(questions);
      getQuestions();
    } else {
      alert("Answer Must match one of the options");
    }
  }
};
getQuestions();
