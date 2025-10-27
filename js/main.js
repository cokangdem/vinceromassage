import { initVisits } from './visits.js';
import { initComments } from './comments.js';
import { initPhone } from './phone.js';

window.addEventListener('DOMContentLoaded', () => {
  initVisits();
  initComments();
  initPhone();
});
