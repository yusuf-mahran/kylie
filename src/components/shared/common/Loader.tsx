import './Loader.styles.css';

export function Loader() {
  return (
    <div className="cosmetics-loader-backdrop">
      <h1 className="logo">Kylie</h1>
      <div className="cosmetics-loader">
        <div className="cosmetics-loader-card">
          <div className="cosmetics-loader-main">
            <div className="cosmetics-loader-stage">
              <svg viewBox="0 0 100 100" className="loader-svg">
                <rect x="38" y="55" width="24" height="28" rx="2" />
                <rect x="36" y="82" width="28" height="6" rx="2" />
                <path d="M42 55 L42 38 L52 30 L52 55" />
                <line x1="42" y1="38" x2="52" y2="30" />
                <line x1="52" y1="30" x2="52" y2="55" />
                <line x1="42" y1="55" x2="52" y2="55" />
                <path d="M42 38 Q47 42 52 30" opacity="0" />
              </svg>

              <svg viewBox="0 0 100 100" className="loader-svg">
                <rect x="35" y="35" width="30" height="50" rx="6" />
                <rect x="40" y="25" width="20" height="10" rx="2" />
                <rect x="45" y="20" width="10" height="6" rx="1" />
                <line x1="35" y1="48" x2="65" y2="48" />
                <line x1="40" y1="55" x2="60" y2="55" />
                <line x1="40" y1="60" x2="55" y2="60" />
              </svg>

              <svg viewBox="0 0 100 100" className="loader-svg">
                <rect x="40" y="45" width="20" height="35" rx="3" />
                <rect x="44" y="35" width="12" height="10" rx="1" />
                <ellipse cx="50" cy="30" rx="8" ry="5" />
                <line x1="50" y1="25" x2="50" y2="15" />
                <circle cx="50" cy="12" r="4" />
                <path d="M50 55 L50 70" />
                <path d="M46 62 Q50 68 54 62" />
                <line x1="40" y1="78" x2="60" y2="78" />
              </svg>

              <svg viewBox="0 0 100 100" className="loader-svg">
                <rect x="28" y="50" width="44" height="30" rx="4" />
                <rect x="25" y="42" width="50" height="10" rx="2" />
                <line x1="28" y1="65" x2="72" y2="65" />
                <ellipse cx="50" cy="72" rx="12" ry="4" />
                <line x1="35" y1="55" x2="45" y2="55" />
              </svg>

              <svg viewBox="0 0 100 100" className="loader-svg">
                <path d="M35 75 L35 50 Q35 40 50 40 Q65 40 65 50 L65 75 Q65 80 50 80 Q35 80 35 75" />
                <rect x="42" y="32" width="16" height="10" rx="2" />
                <line x1="50" y1="32" x2="50" y2="25" />
                <circle cx="50" cy="22" r="4" />
                <path d="M50 22 Q60 18 65 25" />
                <line x1="38" y1="58" x2="62" y2="58" />
                <line x1="38" y1="63" x2="55" y2="63" />
              </svg>
            </div>

            <div className="cosmetics-loader-text">
              <svg
                version="1.1"
                id="cog12"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 96 96"
                enableBackground="new 0 0 96 96"
                xmlSpace="preserve"
                className="spinning-cog"
              >
                <path
                  className="spinning-cog4423"
                  d="M89.284,56.138c0,0-3.007-1.649-3.007-8.138c0-6.487,3.007-8.139,3.007-8.139c4.465-2.45,7.423-6.547,6.569-9.104c-0.852-2.556-8.015-7.62-12.906-6.195c0,0-3.293,0.96-7.882-3.627c-4.588-4.588-3.629-7.882-3.629-7.882c1.426-4.892,0.646-9.872-1.731-11.067C67.328,0.792,58.59,2.25,56.138,6.717c0,0-1.649,3.008-8.138,3.008c-6.487,0-8.139-3.008-8.139-3.008c-2.45-4.467-6.547-7.423-9.104-6.571C28.202,1,23.138,8.162,24.563,13.054c0,0,0.96,3.294-3.628,7.882s-7.882,3.627-7.882,3.627c-4.892-1.425-9.872-0.646-11.067,1.732c-1.195,2.378,0.264,11.116,4.73,13.566c0,0,3.008,1.651,3.008,8.139c0,6.488-3.008,8.138-3.008,8.138c-4.466,2.452-7.423,6.549-6.57,9.105c0.853,2.556,8.016,7.619,12.907,6.193c0,0,3.294-0.959,7.882,3.629c4.588,4.589,3.628,7.882,3.628,7.882c-1.426,4.892-0.647,9.871,1.731,11.066c2.378,1.195,11.116-0.265,13.566-4.729c0,0,1.651-3.007,8.139-3.007c6.488,0,8.138,3.007,8.138,3.007c2.452,4.465,6.549,7.423,9.105,6.57c2.556-0.853,7.619-8.016,6.193-12.907c0,0-0.959-3.293,3.629-7.882c4.589-4.588,7.882-3.629,7.882-3.629c4.892,1.426,9.871,0.646,11.066-1.729C95.209,67.327,93.749,58.59,89.284,56.138zM48,66.527c-10.231,0-18.526-8.296-18.526-18.527c0-10.232,8.295-18.526,18.526-18.526S66.527,37.768,66.527,48C66.527,58.231,58.231,66.527,48,66.527z"
                />
              </svg>
              <div className="cosmetics-loader-name">
                <span>Makeup</span>
                <span>Shampoo</span>
                <span>Serum</span>
                <span>Skincare</span>
                <span>Perfume</span>
              </div>
              <div className="cosmetics-loader-description">
                <span>Loading your beauty essentials</span>
                <span>Preparing your personalized experience</span>
                <span>Fetching the latest trends in beauty</span>
                <span>Curating the best products for you</span>
                <span>Almost there, just a moment</span>
              </div>
            </div>
          </div>

          <div className="cosmetics-loader-track">
            <div className="cosmetics-loader-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
