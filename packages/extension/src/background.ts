import { getGHSDate } from 'ghs-time';

// Funktion zum Aktualisieren des Badge-Textes
const updateBadge = () => {
    const ghs = getGHSDate(new Date());
    // Wir zeigen nur die Beats ohne das '@' im Badge an (Platzmangel)
    const badgeText = ghs.beats.replace('@', '');

    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: '#EAB308' }); // Ein warmes GHS-Gelb
};

// Alarm alle 1 Minute erstellen (Browser-Minimum für Background)
chrome.alarms.create('ghs-update', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'ghs-update') {
        updateBadge();
    }
});

// Initial beim Start aufrufen
updateBadge();