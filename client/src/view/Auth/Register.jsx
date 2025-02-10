import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import authBg from '../../assets/images/authBg.jpg';
import Logo from '../../assets/images/logoBlack.png';
import Logo1 from '../../assets/images/logo.png';
import { IoClose } from "react-icons/io5";

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Philippines');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+63');
  const countryCodes = [
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+63', country: 'Philippines' },
    { code: '+91', country: 'India' },
    { code: '+81', country: 'Japan' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+86', country: 'China' },
    { code: '+82', country: 'South Korea' },
    { code: '+7', country: 'Russia' },
    { code: '+55', country: 'Brazil' },
    { code: '+27', country: 'South Africa' },
    { code: '+34', country: 'Spain' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+92', country: 'Pakistan' },
    { code: '+20', country: 'Egypt' },
    { code: '+62', country: 'Indonesia' },
    { code: '+64', country: 'New Zealand' },
    { code: '+353', country: 'Ireland' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+41', country: 'Switzerland' },
    { code: '+32', country: 'Belgium' },
    { code: '+45', country: 'Denmark' },
    { code: '+52', country: 'Mexico' },
    { code: '+972', country: 'Israel' },
    { code: '+66', country: 'Thailand' },
    { code: '+65', country: 'Singapore' },
    { code: '+47', country: 'Norway' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+48', country: 'Poland' },
    { code: '+43', country: 'Austria' },
    { code: '+36', country: 'Hungary' },
    { code: '+351', country: 'Portugal' },
    { code: '+375', country: 'Belarus' },
    { code: '+380', country: 'Ukraine' },
    { code: '+30', country: 'Greece' },
    { code: '+57', country: 'Colombia' },
    { code: '+98', country: 'Iran' },
    { code: '+90', country: 'Turkey' },
    { code: '+56', country: 'Chile' },
    { code: '+233', country: 'Ghana' },
    { code: '+234', country: 'Nigeria' },
    { code: '+264', country: 'Namibia' },
    { code: '+258', country: 'Mozambique' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+975', country: 'Bhutan' },
    { code: '+372', country: 'Estonia' },
    { code: '+591', country: 'Bolivia' },
    { code: '+597', country: 'Suriname' },
    { code: '+675', country: 'Papua New Guinea' },
    { code: '+54', country: 'Argentina' },
    { code: '+507', country: 'Panama' },
    { code: '+592', country: 'Guyana' },
  ];

  const countryStartingDigits = {
    '+1': ['2', '3', '4', '5', '6', '7', '8', '9'], 
    '+44': ['7'],    
    '+63': ['9'],      
    '+91': ['6', '7', '8', '9'], 
    '+81': ['7', '8', '9'], 
    '+61': ['4'],   
    '+49': ['1'],    
    '+33': ['6', '7'], 
    '+39': ['3'],   
    '+86': ['1'],    
    '+82': ['1'],       
    '+7': ['9'],     
    '+55': ['9'],      
    '+27': ['6', '7', '8'], 
    '+34': ['6', '7'], 
    '+971': ['5'],     
    '+92': ['3'],     
    '+20': ['1'],     
    '+62': ['8'],    
    '+64': ['2', '3', '4', '5', '6', '7', '8', '9'], 
    '+353': ['8'],    
    '+31': ['6'],     
    '+46': ['7'],   
    '+41': ['7'],    
    '+32': ['4'],   
    '+45': ['2', '3', '4', '5', '6', '7'],
    '+52': ['1'],      
    '+972': ['5'],    
    '+66': ['6', '8', '9'], 
    '+65': ['8', '9'], 
    '+47': ['4', '9'],  
    '+420': ['6', '7'], 
    '+48': ['5', '6', '7', '8'], 
    '+43': ['6'],    
    '+36': ['2', '3', '4', '5', '6', '7'],
    '+351': ['9'],    
    '+375': ['2', '3', '4', '5'], 
    '+380': ['6', '7', '9'], 
    '+30': ['6', '9'],  
    '+57': ['3'],     
    '+98': ['9'],    
    '+90': ['5'],     
    '+56': ['9'],     
    '+233': ['2', '5'],
    '+234': ['7', '8', '9'], 
    '+264': ['8'],   
    '+258': ['8', '9'], 
    '+94': ['7'],      
    '+975': ['1', '7'], 
    '+372': ['5'],     
    '+591': ['6', '7'], 
    '+597': ['8'],    
    '+675': ['7'],    
    '+54': ['1', '2', '3', '4', '5', '6', '7', '8', '9'], 
    '+507': ['6'],    
    '+592': ['6', '7'], 
  };
  
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  console.log(formData);

  const handleChangeContact = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); 
  

    if (selectedCountryCode in countryStartingDigits) {
      const validStarts = countryStartingDigits[selectedCountryCode];
  
      if (inputValue.length > 0 && !validStarts.includes(inputValue[0])) {
        inputValue = validStarts[0] + inputValue.slice(1);
      }
    }
  

    const maxDigits = selectedCountryCode === '+63' ? 10 : 10; 
    inputValue = inputValue.substring(0, maxDigits);
  
    let formattedNumber = '';
    if (inputValue.length > 0) {
      formattedNumber += inputValue.substring(0, 3);
    }
    if (inputValue.length > 3) {
      formattedNumber += ' ' + inputValue.substring(3, 6);
    }
    if (inputValue.length > 6) {
      formattedNumber += ' ' + inputValue.substring(6, maxDigits);
    }
  
    setFormData({ ...formData, contact: formattedNumber });
    
  };
  
  
  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    
    // Find the selected country object
    const selectedCountryObj = countryCodes.find(country => country.code === newCode);
  
    // Ensure we correctly update both state values
    if (selectedCountryObj) {
      setSelectedCountry(selectedCountryObj.country); // Store country name
      setSelectedCountryCode(selectedCountryObj.code);
    }
  
    // Set the default first digit based on the country
    let defaultFirstDigit = '';
    if (newCode in countryStartingDigits) {
      defaultFirstDigit = countryStartingDigits[newCode][0]; 
    }
  
    setFormData({ ...formData, contact: defaultFirstDigit }); // Reset contact input
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = [];
  
    // First name validation
    if (!formData.firstname.trim() || !/^[a-zA-Z\s]*$/.test(formData.firstname)) {
      errors.push('Please enter a valid First name.');
    }
  
    // Last name validation
    if (!formData.lastname.trim() || !/^[a-zA-Z\s]*$/.test(formData.lastname)) {
      errors.push('Please enter a valid Last name.');
    }
  
    // Email validation
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid Email Address.');
    } else if (!formData.email.endsWith('@gmail.com')) {
      errors.push('Please enter a valid Email Address (Gmail).');
    } else if (!/^[a-zA-Z0-9]+@gmail\.com$/.test(formData.email)) {
      errors.push('Email should not contain special characters before "@gmail.com".');
    }
  
    // Username validation
    if (!formData.username.trim() || /[<>]/.test(formData.username)) {
      errors.push('Please enter a valid Username.');
    }
  
    // Password validation
    if (!formData.password.trim() || formData.password.length < 8 || !/\d/.test(formData.password)) {
      errors.push('Password must be at least 8 characters long and contain a number.');
    }
  
    // Confirm Password match
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }
  
    if (!agreeTerms) {
      errors.push('You must agree to the Terms and Conditions.');
    }
  
    const fullContactNumber = `${selectedCountryCode} ${formData.contact}`;
  
    const updatedFormData = {
      ...formData,
      contact: fullContactNumber,
    };
  
    if (errors.length === 0) {
      setIsLoading(true); // 🔹 Start loading
  
      try {
        const response = await fetch('https://idonate1.onrender.com/routes/accounts/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFormData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register');
        }
  
        const { userId, username, email } = await response.json();
  
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
  
        onLogin(userId, username);
        
        // 🔹 Simulate a short delay before navigating
        setTimeout(() => {
          navigate('/verifyR', { state: { userId, email } });
        }, 1500);
  
      } catch (error) {
        alert('Registration failed: ' + error.message);
        setIsLoading(false); // 🔹 Stop loading if there's an error
      }
    } else {
      alert(errors.join('\n'));
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="grid place-items-center h-screen font-Poppins">
      <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 flex justify-between py-3 px-6 font-Poppins ${isScrolled ? 'bg-red-800' : 'bg-transparent'}`}>
        <div className="logo">
          <img src={Logo1} alt="Logo" className='h-auto w-48' />
        </div>
        <div className="flex text-white my-auto">
          <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex' : 'max-sm:hidden'}`}>
            <Link className='nav' to="/">Home</Link>
            <Link className='nav' to="/events">Events</Link>
            <Link className='nav' to="/about">About us</Link>
            <Link className='nav' to="/login">Login</Link>
          </div>
        </div>
      </div>

      <div className="bg-[#f2f2f0] rounded-2xl py-10 px-12 mt-16 justify-items-center">
      <a href="/"><img className="w-[330px] h-auto mb-8" src={Logo} alt="Logo" /></a>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value})}
                  placeholder="First Name: Juan"
                  maxLength='30'
                  required
                />
              </div>

              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value})}
                  placeholder="Last Name: Dela Cruz"
                  maxLength='30'
                  required
                />
              </div>

              <div className="authContainer flex gap-2 w-full">
                <select
                  className="border rounded-l-md p-2 bg-white w-40 text-sm"
                  value={selectedCountryCode}
                  onChange={handleCountryChange}
                >
                  {countryCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.country} ({item.code})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="authFields border-l-0 rounded-r-md flex-grow text-sm"
                  value={formData.contact}
                  onChange={handleChangeContact}
                  placeholder="Mobile Number"
                  maxLength="12"
                  required
                />
              </div>


              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                  placeholder="Email: juan@gmail.com"
                  required
                />
              </div>

              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value})}
                  placeholder="Username"
                  required
                />
              </div>

              <div className='authContainer' >
                <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    required
                    className='authFields'
                />
                <span
                  className="my-auto mr-2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className='authContainer' >
                <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm Password"
                    required
                    className='authFields'
                />
                <span
                  className="my-auto mr-2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

            <div className="border border-gray-300 p-3 mt-5 bg-white overflow-y-auto max-w-md" style={{ maxHeight: '120px', fontSize: '15px' }}>
              <center><strong>Terms and Conditions for Data Privacy:</strong></center>
              <br></br>
              <center><strong>Republic Act No. 10173 - Data Privacy Act of 2012</strong>
              <br />
              <br />
              <p>
                The <strong>Data Privacy Act of 2012</strong> aims to protect personal data collected by organizations and individuals. It ensures 
                the rights of users regarding their personal information, setting guidelines on data collection, processing, and storage. For more information, visit the 
                <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                  National Privacy Commission
                </a>.
              </p>
              <br />
              <p>
                By registering on this platform, you acknowledge that your personal data will be handled in compliance with this law. You have 
                the right to access, modify, and request deletion of your data.   For more details, please review our  <span className="text-blue-500 underline cursor-pointer" onClick={() => setIsModalOpen(true)}>Privacy Policy</span>.
              </p></center>
              <br></br>
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="-mr-6 mb-4" />
              <label>I agree to the Terms and Conditions</label>
             </div>
            </div>
            
            <div className="">
            <button type="submit" className="authButton" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
              <p className='text-center text-sm'>Already have an account? <Link to="/login" className='text-blue-500 underline hover:text-blue-700'>Login</Link></p>
            </div>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setIsModalOpen(false)}>
                  <IoClose size={24} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
                <div className="text-sm max-h-80 overflow-y-auto">
                  
                  <h3 className="font-semibold mt-2 mb-2">1. Introduction</h3>
                  <p className="ml-5">We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.</p>

                  <h3 className="font-semibold mt-4 mb-2">2. Information We Collect</h3>
                  <ul className="list-disc list-inside ml-5">
                    <li><strong>Personal Information:</strong> When you register, we collect your name, email, contact number, and other account details.</li>
                    <li><strong>Usage Data:</strong> We gather data about how you interact with our platform to improve user experience.</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance functionality and track site performance.</li>
                  </ul>

                  <h3 className="font-semibold mt-4 mb-2">3. How We Use Your Information</h3>
                  <p className="ml-5">We use your information to:</p>
                  <ul className="list-disc list-inside ml-5">
                    <li>Provide and manage your account.</li>
                    <li>Verify your identity and ensure security.</li>
                    <li>Send important notifications or updates.</li>
                    <li>Analyze and enhance our services.</li>
                  </ul>

                  <h3 className="font-semibold mt-4 mb-2">4. Data Sharing & Security</h3>
                  <p className="ml-5">We do not sell or share your data with third parties, except:</p>
                  <ul className="list-disc list-inside ml-5">
                    <li>When required by law or government regulations.</li>
                    <li>For fraud prevention and security purposes.</li>
                  </ul>
                  <p className="ml-5">We implement strict security measures to protect your data from unauthorized access.</p>

                  <h3 className="font-semibold mt-4 mb-2">5. Your Rights</h3>
                  <p className="ml-5">You have the right to:</p>
                  <ul className="list-disc list-inside ml-5">
                    <li>Access, update, or delete your personal data.</li>
                    <li>Opt out of marketing communications.</li>
                    <li>Request a copy of the data we have collected.</li>
                  </ul>

                  <h3 className="font-semibold mt-4 mb-2">6. Contact Us</h3>
                  <p className="ml-5">If you have any questions or concerns about this Privacy Policy, please contact us at <strong>idonate2024@gmail.com</strong>.</p>
                </div>

                <div className="text-right mt-4">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}

        <div className="absolute top-0 left-0 w-full h-full -z-10">
        <img className="w-full h-full object-cover fixed top-0 left-0 brightness-50" src={authBg} alt="Registration" />

        </div>   
      </div>
    </div>
  );
}

export default Register;
