class Question {
    uid;
    answers = {};
    constructor(u) {
      this.uid = u;
    }

    addAnswer(answer, score) {
      this.answers[answer.content] = score;
    }

    getID() {
      return this.uid;
    }
    getAnswers() {
      var questions = "";
      for(var ans in this.answers) {
        questions += ans + "\n";
        console.log(ans);
      }
      return questions;
    }
  }
  module.exports = {
    Question: Question
}