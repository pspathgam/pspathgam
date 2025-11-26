document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- 1. LIVE CLOCKS FUNCTIONALITY ---
    function updateClocks() {
        const now = new Date();

        // Christian Date
        const christianDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('christian-date').textContent = christianDate;

        // Digital Clock
        const digitalTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        document.getElementById('digital-clock').textContent = digitalTime;

        // Islamic Date (Approximation - requires a proper Hijri library for accuracy, but this is a common JS method)
        // Using a basic approximation/fallback. For a production site, a library like `moment-hijri` is needed.
        const day = now.getDate();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();
        let hijriDate = 'Loading Hijri...';
        try {
             // Example using the native Intl API (may not be supported everywhere, but is modern/free)
             hijriDate = now.toLocaleDateString('en-US-u-ca-islamic', {day: 'numeric', month: 'long', year: 'numeric'});
        } catch (e) {
             // Fallback
             hijriDate = `Approx. Hijri: ${day}/${month}/${year}`;
        }
        document.getElementById('islamic-date').textContent = hijriDate;

        // Analog Clock
        const canvas = document.getElementById('analog-clock');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const radius = canvas.height / 2;
            ctx.translate(radius, radius);
            drawClock(ctx, radius, now);
        }
    }

    function drawClock(ctx, radius, now) {
        ctx.clearRect(-radius, -radius, radius * 2, radius * 2);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fill();

        // Clock Face Numbers
        ctx.font = radius * 0.15 + 'px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        for(let num = 1; num < 13; num++){
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillStyle = 'white';
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }

        // Clock Hands
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        // Hour hand
        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07, 'white');
        // Minute hand
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, 'white');
        // Second hand
        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, radius * 0.02, 'red');

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    setInterval(updateClocks, 1000);
    updateClocks(); // Initial call


    // --- 2. VERTICAL NEWS & EVENTS SCROLLER ---
    const scroller = document.getElementById('eventScroller');
    if (scroller) {
        const speed = 2000; // time between scroll (ms)
        const delay = 5000; // time before starting (ms)

        function startScroll() {
            const items = Array.from(scroller.children);
            if (items.length > 1) {
                // Get the height of the first item to scroll up by that amount
                const firstItemHeight = items[0].offsetHeight;
                
                // Animate the scroll
                scroller.style.transition = 'transform 1s ease-in-out';
                scroller.style.transform = `translateY(-${firstItemHeight}px)`;

                // After animation, reset transform and move the item to the end
                setTimeout(() => {
                    scroller.style.transition = 'none'; // Remove transition for instant jump
                    scroller.style.transform = 'translateY(0)';
                    scroller.appendChild(items[0]);
                }, 1000);
            }
        }
        
        // Start the scrolling after a short delay
        setTimeout(() => {
            setInterval(startScroll, speed);
        }, delay);
    }

    // --- 3. ADMIN PANEL FOUNDATION (Client-Side "Database") ---

    /**
     * Client-side function to save data to localStorage. 
     * Simulates a database layer for the no-PHP requirement.
     * @param {string} key - The key for the data (e.g., 'students', 'staff').
     * @param {Array} data - The array of objects to save.
     */
    window.saveData = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Error saving data for ${key}: `, e);
            alert('Error saving data. Local storage limit reached or access denied.');
            return false;
        }
    };

    /**
     * Client-side function to load data from localStorage.
     * @param {string} key - The key for the data.
     * @returns {Array} The parsed data array, or an empty array if none exists.
     */
    window.loadData = (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error loading data for ${key}: `, e);
            return [];
        }
    };

    // Initialize the "database" if it's the first run
    if (!localStorage.getItem('admin_users')) {
        const initialAdmin = [{
            username: 'admin',
            // SHA-256 for 'password123' (will be hashed on actual login/creation)
            // For a demo, a simplified check is used, but a full implementation requires a library.
            // In a real no-server setup, you can't use a secure method like bcrypt.
            // Using a simple placeholder hash that is checked in admin/login.html:
            passwordHash: 'e713531b7d513511854497e2528731d7e2e54d89d6e4b9d0e7078864a7538c35' 
        }];
        saveData('admin_users', initialAdmin);
        saveData('students', []);
        saveData('staff', []);
        saveData('mdm_reports', []);
        console.log('Admin data initialized. Default login: admin/password123 (hashed)');
    }

    // --- 4. PDF GENERATION UTILITY ---

    /**
     * Generates a PDF from an HTML element using html2canvas and jsPDF.
     * @param {string} elementId - The ID of the HTML element to render.
     * @param {string} filename - The name of the downloaded file.
     * @param {boolean} landscape - True for landscape mode (A4), false for portrait.
     */
    window.generatePDF = (elementId, filename, landscape = false) => {
        const element = document.getElementById(elementId);
        if (!element) {
            alert('Error: Element not found for PDF generation.');
            return;
        }

        const orientation = landscape ? 'l' : 'p';
        const doc = new window.jspdf.jsPDF(orientation, 'mm', 'a4');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Calculate size for fitting (adjusting for margin)
            const imgWidth = pdfWidth - 10;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 5; // Top margin

            doc.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - position);

            // Handle multiple pages for long content
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 5;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            doc.save(filename);
        }).catch(error => {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Check console for details.');
        });
    };
    
});

