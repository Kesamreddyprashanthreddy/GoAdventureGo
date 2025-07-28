import React from 'react'
const PageBackground = React.memo(({ 
  children, 
  className = '', 
  variant = 'default',
  showParticles = true 
}) => {
  const getBackgroundImage = () => {
    switch (variant) {
      case 'hero':
        return '/css/images/Mountain.jpg'
      case 'packages':
        return '/css/images/himalaya.jpg'
      case 'hotels':
        return '/css/images/swit.jpg'
      case 'flights':
        return '/css/images/aurora.jpg'
      case 'about':
        return '/css/images/paris.jpg'
      case 'contact':
        return '/css/images/reef.jpg'
      default:
        return '/css/images/Mountain.jpg'
    }
  }
  return (
    <div className={`relative min-h-screen ${className}`}>
      {}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-auto"
          style={{
            backgroundImage: `url('${getBackgroundImage()}')`
          }}
        />
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80" />
      </div>
      {}
      {showParticles && (
        <div className="absolute inset-0 opacity-20 hidden lg:block">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-teal-400/60 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-orange-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      )}
      {}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
})
export default PageBackground
