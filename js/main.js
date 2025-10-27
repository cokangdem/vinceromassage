// js/main.js
import { initTheme }   from './theme.js';
import { initVisits }  from './visits.js';
import { initPhone }   from './phone.js';
import { initComments } from './comments.js';

window.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initPhone();
  initVisits();
  initComments();
});
