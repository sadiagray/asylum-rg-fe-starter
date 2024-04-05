import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import Logo from '../../styles/Images/WhiteLogo.png';
import { colors } from '../../styles/data_vis_colors';
import { LoginButton } from '../common/login-button';
import { LogoutButton } from '../common/logout-button';
import { SignupButton } from '../common/signup-button';

const { primary_accent_color } = colors;

function HeaderContent() {
  const { isAuthenticated } = useAuth0();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: primary_accent_color,
        alignItems: 'center',
      }}
    >
      <div className="hrf-logo">
        <a href="https://www.humanrightsfirst.org/">
          <Image width={200} src={Logo} preview={false} alt="HRF logo white" />
        </a>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '10rem',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#E2F0F7',
            paddingRight: '5rem',
            fontSize: '1.4rem',
          }}
        >
          Home
        </Link>
        <Link
          to="/graphs"
          style={{ color: '#E2F0F7', paddingRight: '5rem', fontSize: '1.4rem' }}
        >
          Graphs
        </Link>
        {!isAuthenticated && (
          <>
            <SignupButton />
            <LoginButton style={{ color: '#E2F0F7', paddingRight: '75px' }} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Link
              to="/profile"
              style={{ color: '#E2F0F7', paddingRight: '75px' }}
            >
              Profile
            </Link>
            <LogoutButton style={{ color: '#E2F0F7', paddingRight: '75px' }} />
          </>
        )}
      </div>
    </div>
  );
}

export { HeaderContent };
