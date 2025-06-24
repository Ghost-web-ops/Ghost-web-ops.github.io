// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Header Background Change on Scroll ---
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Fade-in Animation on Scroll ---
    const fadeElems = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeElems.forEach(elem => {
        observer.observe(elem);
    });

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const body = document.body;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            body.classList.remove('light-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    applyTheme(savedTheme);

    // Event listener for the switcher
    themeSwitcher.addEventListener('click', () => {
        const isLight = body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- Gemini API - AI Bio Generator ---
    const generateBtn = document.getElementById('generate-bio-btn');
    const bioParagraph = document.getElementById('bio-text');
    const resetBtn = document.getElementById('reset-bio-btn');
    
    // Store the original bio text
    const originalBio = bioParagraph.innerHTML;

    if (generateBtn && bioParagraph && resetBtn) {
        generateBtn.addEventListener('click', async () => {
            // Set loading state
            const originalBtnText = generateBtn.textContent;
            generateBtn.disabled = true;
            generateBtn.textContent = 'AI is thinking... ✨';
            
            // --- Gemini API Call ---
            const apiKey = ""; // API key is handled by the environment
            const prompt = `Act as a professional career coach. Write a short, impressive, and professional bio (around 2-3 sentences) for a portfolio website. The person is Omar Yasser, a Full-Stack Web Developer with a background in Mechatronics Engineering. Highlight the combination of analytical engineering skills and web development passion. The tone should be confident and inspiring. Do not use markdown. Write the response in English.`;
            
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    
                    const generatedText = result.candidates[0].content.parts[0].text;
                    // Sanitize the text by replacing newlines with <br> for HTML display
                    bioParagraph.innerHTML = generatedText.replace(/\n/g, '<br>');
                    resetBtn.style.display = 'inline-block'; // Show the reset button
                } else {
                    console.error('Unexpected API response structure:', result);
                    bioParagraph.textContent = 'Sorry, an error occurred while generating the bio. Please try again.';
                }

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                bioParagraph.textContent = 'Sorry, the AI service is currently unavailable. Please check your connection.';
            } finally {
                // Restore button state
                generateBtn.disabled = false;
                generateBtn.textContent = originalBtnText;
            }
        });

        resetBtn.addEventListener('click', () => {
            bioParagraph.innerHTML = originalBio;
            resetBtn.style.display = 'none'; // Hide the reset button again
        });
    }

});