import VaccineChecker from './vaccineChecker';

const tasks = [
  VaccineChecker(),
];

tasks.forEach((task) => {
  task.start();
});
