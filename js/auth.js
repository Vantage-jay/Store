// User Authentication System with SMS/Email OTP Choice
const auth = {
    currentUser: null,
    otpData: null,
    
    init() {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.updateUI();
        }
    },
    
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },
    
    // Send OTP via chosen method
    sendOTP(email, phone, method) {
        const otp = this.generateOTP();
        const expiresAt = Date.now() + (10 * 60 * 1000);
        
        this.otpData = {
            email: email,
            phone: phone,
            otp: otp,
            expiresAt: expiresAt,
            method: method, // 'sms' or 'email'
            attempts: 0
        };
        
        sessionStorage.setItem('pendingOTP', JSON.stringify(this.otpData));
        
        // Simulate delivery based on method
        if (method === 'sms') {
            this.simulateSMS(phone, otp);
        } else {
            this.simulateEmail(email, otp);
        }
        
        return true;
    },
    
    // Simulate SMS delivery
    simulateSMS(phone, otp) {
        console.log(`SMS to ${phone}: Your code is ${otp}`);
        setTimeout(() => {
            alert(`📱 SMS SENT TO ${phone}\n\nYour verification code is: ${otp}\n\n(Valid for 10 minutes)`);
        }, 500);
    },
    
    // Simulate Email delivery
    simulateEmail(email, otp) {
        console.log(`Email to ${email}: Your code is ${otp}`);
        setTimeout(() => {
            alert(`📧 EMAIL SENT TO ${email}\n\nYour verification code is: ${otp}\n\n(Valid for 10 minutes)`);
        }, 500);
    },
    
    verifyOTP(inputOTP) {
        const pending = JSON.parse(sessionStorage.getItem('pendingOTP'));
        
        if (!pending) {
            alert('OTP expired. Please request new code.');
            return false;
        }
        
        if (Date.now() > pending.expiresAt) {
            sessionStorage.removeItem('pendingOTP');
            alert('OTP expired. Please request new code.');
            return false;
        }
        
        if (pending.attempts >= 3) {
            sessionStorage.removeItem('pendingOTP');
            alert('Too many failed attempts. Please request new code.');
            return false;
        }
        
        if (inputOTP === pending.otp) {
            sessionStorage.removeItem('pendingOTP');
            return true;
        } else {
            pending.attempts++;
            sessionStorage.setItem('pendingOTP', JSON.stringify(pending));
            alert(`Invalid OTP. ${3 - pending.attempts} attempts remaining.`);
            return false;
        }
    },
    
    signup(name, email, password, phone) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.find(u => u.email === email)) {
            alert('Email already registered!');
            return false;
        }
        
        const pendingUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            phone: phone,
            isVerified: false,
            createdAt: new Date().toISOString()
        };
        
        sessionStorage.setItem('pendingUser', JSON.stringify(pendingUser));
        
        // Return info for OTP method selection
        return {
            status: 'otp_required',
            email: email,
            phone: phone
        };
    },
    
    completeSignup(otp) {
        if (!this.verifyOTP(otp)) return false;
        
        const pending = JSON.parse(sessionStorage.getItem('pendingUser'));
        if (!pending) {
            alert('Registration session expired. Please start again.');
            return false;
        }
        
        pending.isVerified = true;
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(pending);
        localStorage.setItem('users', JSON.stringify(users));
        
        sessionStorage.removeItem('pendingUser');
        this.currentUser = {
            id: pending.id,
            name: pending.name,
            email: pending.email
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUI();
        
        return true;
    },
    
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            alert('Invalid email or password!');
            return false;
        }
        
        if (!user.isVerified) {
            alert('Account not verified. Please sign up again.');
            return false;
        }
        
        sessionStorage.setItem('pendingLogin', JSON.stringify({
            email: email,
            id: user.id,
            name: user.name,
            phone: user.phone
        }));
        
        // Return info for OTP method selection
        return {
            status: 'otp_required',
            email: email,
            phone: user.phone
        };
    },
    
    completeLogin(otp) {
        if (!this.verifyOTP(otp)) return false;
        
        const pending = JSON.parse(sessionStorage.getItem('pendingLogin'));
        if (!pending) {
            alert('Login session expired. Please try again.');
            return false;
        }
        
        this.currentUser = {
            id: pending.id,
            name: pending.name,
            email: pending.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        sessionStorage.removeItem('pendingLogin');
        this.updateUI();
        
        return true;
    },
    
    resendOTP(method) {
        const pendingLogin = sessionStorage.getItem('pendingLogin');
        const pendingUser = sessionStorage.getItem('pendingUser');
        
        let email = null;
        let phone = null;
        
        if (pendingLogin) {
            const data = JSON.parse(pendingLogin);
            email = data.email;
            phone = data.phone;
        } else if (pendingUser) {
            const data = JSON.parse(pendingUser);
            email = data.email;
            phone = data.phone;
        }
        
        if (email) {
            this.sendOTP(email, phone, method);
            return true;
        }
        return false;
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        alert('Logged out successfully!');
    },
    
    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userName = document.getElementById('user-name');
        
        if (!loginBtn || !logoutBtn) return;
        
        if (this.currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline';
            if (userName) userName.textContent = `Hi, ${this.currentUser.name}`;
        } else {
            loginBtn.style.display = 'inline';
            logoutBtn.style.display = 'none';
            if (userName) userName.textContent = '';
        }
    },
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});
