const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            padding: '2rem'
        }}>
            <div
                style={{
                    width: size === 'sm' ? '16px' : size === 'lg' ? '48px' : '32px',
                    height: size === 'sm' ? '16px' : size === 'lg' ? '48px' : '32px',
                    border: '3px solid #f3f4f6',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            {text && (
                <p style={{
                    marginTop: '1rem',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {text}
                </p>
            )}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default LoadingSpinner;