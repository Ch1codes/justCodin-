let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;

  // Show your custom install button
  const installButton = document.createElement('button');
  installButton.textContent = 'Install Herna Jaam';
  installButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #ff8c42; color: white; border: none; border-radius: 5px; cursor: pointer;';
  document.body.appendChild(installButton);

  installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Reset the deferred prompt variable
      deferredPrompt = null;
    });

    // Remove the install button after prompting
    installButton.remove();
  });
});

// Optionally: Handle the appinstalled event
window.addEventListener('appinstalled', () => {
  console.log('Herna Jaam has been installed');
});

document.addEventListener('DOMContentLoaded', () => {
  const sosButton = document.querySelector('.sos-button');

  // Replace these with your EmailJS credentials
  const EMAILJS_SERVICE_ID = 'service_4cmopod';
  const EMAILJS_TEMPLATE_ID = 'template_15fl6mj';
  const EMAILJS_PUBLIC_KEY = 'Df_vjF5HI1KXNve9c';

  // Initialize EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // SOS button click event
  sosButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default behavior of the button

    // Check geolocation permissions
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        console.log('Geolocation permission state:', permissionStatus.state);

        if (permissionStatus.state === 'granted') {
          // Permission already granted, proceed to get location
          getLocationAndSendEmail();
        } else if (permissionStatus.state === 'prompt') {
          // Ask for permission
          alert('Please allow location access when prompted.');
          getLocationAndSendEmail();
        } else if (permissionStatus.state === 'denied') {
          // Permission denied
          alert(
            'Location access is denied. Please enable location access in your browser settings and try again.'
          );
          // Redirect to help page
          window.location.href = 'help.html';
        }

        // Listen for permission state changes (optional)
        permissionStatus.onchange = () => {
          console.log('Permission status changed to:', permissionStatus.state);
        };
      })
      .catch((error) => {
        console.error('Error checking geolocation permissions:', error);
        alert('Failed to check geolocation permissions. Redirecting to the help page.');
        window.location.href = 'help.html';
      });
  });

  function getLocationAndSendEmail() {
    // Access device location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Prepare email data
          const emailData = {
            user_location: `Latitude: ${latitude}, Longitude: ${longitude}`,
            user_message: 'An SOS alert has been triggered. Please respond immediately.',
          };

          // Send email using EmailJS
          emailjs
            .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailData)
            .then(() => {
              alert('SOS message sent successfully!');
              // Redirect to help.html after email is sent
              window.location.href = 'help.html';
            })
            .catch((error) => {
              console.error('Failed to send SOS email:', error);
              alert('Failed to send SOS message. Redirecting to the help page.');
              // Redirect to help.html even if the email fails
              window.location.href = 'help.html';
            });
        },
        (error) => {
          console.error('Error accessing location:', error);
          alert('Unable to access location. Redirecting to the help page.');
          // Redirect to help.html if geolocation fails
          window.location.href = 'help.html';
        }
      );
    } else {
      alert('Geolocation is not supported by this browser. Redirecting to the help page.');
      // Redirect to help.html if geolocation is unavailable
      window.location.href = 'help.html';
    }
  }
});
