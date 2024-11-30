import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import authBg from '../../assets/images/authBg.jpg';
import Logo from '../../assets/images/logoBlack.png';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false); 
  const [ formData, setFormData ] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  console.log(formData)

  const handleChangeContact = (e) => {
    const inputValue = e.target.value;

    if (/^\d*$/.test(inputValue) && inputValue.length <= 11) {
      setFormData({...formData, contact: inputValue});
    }
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
    } else if (!formData.email.includes('gmail.com')) {
      errors.push('Please enter a valid Email Address (Gmail).');
    }

    // Username validation
    if (!formData.username.trim() || /[<>]/.test(formData.username)) {
      errors.push('Please enter a valid Username.');
    }

    // Address validation
    if (!formData.address.trim() || /[<>]/.test(formData.address)) {
      errors.push('Please enter a valid address.');
    }

    // Contact number validation
    if (!formData.contact.trim() || formData.contact.length !== 11) {
      errors.push('Please enter a valid Contact Number.');
    }

    // Password validation
    if (!formData.password.trim() || formData.password.length < 8 || !/\d/.test(formData.password)) {
      errors.push('Password must be at least 8 characters long and contain a number.');
    }

    // Confirm Password match
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    // If no errors, proceed with registration
    if (errors.length === 0) {
      try {
        const response = await fetch('https://idonate1.onrender.com/routes/accounts/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
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

        navigate('/verifyR', { state: { userId, email } });
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    } else {
      alert(errors.join('\n'));
    }
  };

  return (
    <div className="grid place-items-center min-h-screen font-Poppins">
      <div className="bg-[#f2f2f0] rounded-2xl py-10 px-12">
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

              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.contact}
                  onChange={handleChangeContact}
                  placeholder="Contact Number: 09123456789"
                  maxLength='11'
                  required
                />
              </div>

              <div className="authContainer">
                <input
                  type="text"
                  className='authFields'
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value})}
                  placeholder="Address: 123 Tirso Cruz St. Quiapo, Manila"
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
            </div>

            <div className="">
              <button type="submit" className='authButton'>Register</button>
              <p className='text-center text-sm'>Already have an account? <Link to="/login" className='text-blue-500 underline hover:text-blue-700'>Login</Link></p>
            </div>
          </form>

        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <img className="w-full h-full object-cover" src={authBg} alt="Registration" />
        </div>
          
      </div>
    </div>
  );
}

export default Register;
