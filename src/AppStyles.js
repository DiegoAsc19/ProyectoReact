// src/AppStyles.js

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0b0f19', // Fondo general oscuro espacial
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
  },
  
  // --- MENÚ LATERAL CYBER-TECH ---
  sidebar: {
    width: '280px',
    backgroundColor: '#090d16',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 20px',
    boxShadow: '4px 0 25px rgba(0, 0, 0, 0.5)',
    borderRight: '2px solid #06b6d4',
  },
  menuTitle: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#06b6d4',
    textTransform: 'uppercase',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '20px',
    textShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
  },
  menuBtn: {
    border: 'none',
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: '15px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.25s ease',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  // --- RADAR CENTRAL QUE GIRA ---
  spinningIcon: {
    width: '35px',
    height: '35px',
    animation: 'spin 4s linear infinite', 
    filter: 'drop-shadow(0 0 8px #06b6d4)', 
  },
  
  // --- CONTENIDO PRINCIPAL ---
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px',
    backgroundColor: '#0f172a',
  },
  
  // --- TARJETAS OSCURAS CON BRILLO INTEGRADO ---
  card: {
    backgroundColor: '#0b1329',
    padding: '45px 40px',
    borderRadius: '24px',
    boxShadow: '0 0 40px rgba(6, 182, 212, 0.15), inset 0 0 20px rgba(6, 182, 212, 0.05)',
    width: '100%',
    maxWidth: '460px',
    border: '2px solid #1e293b',
  },
  cardWide: {
    backgroundColor: '#0b1329',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 0 40px rgba(6, 182, 212, 0.1), inset 0 0 20px rgba(6, 182, 212, 0.05)',
    width: '100%',
    maxWidth: '850px',
    border: '2px solid #1e293b',
    color: '#fff'
  },
  
  // --- CASILLAS DE FORMULARIO ---
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    marginTop: '10px',
  },
  input: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #1e293b',
    fontSize: '16px',
    backgroundColor: '#111936',
    color: '#38bdf8',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
    letterSpacing: '0.5px',
  },
  btn: {
    padding: '16px',
    backgroundColor: '#0284c7',
    backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    color: '#ffffff',
    border: '1px solid #38bdf8',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3), 0 0 15px rgba(6, 182, 212, 0.2)',
  },
  errorBanner: {
    backgroundColor: '#2d1a22',
    color: '#f87171',
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #7f1d1d',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '14px',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)',
  },
  
  // --- TABLAS ESTILO TERMINAL DE OPERACIONES ---
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '25px',
  },
  th: {
    backgroundColor: '#111936',
    borderBottom: '2px solid #1e293b',
    padding: '16px',
    textAlign: 'left',
    color: '#06b6d4',
    fontWeight: '700',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #1e293b',
    color: '#cbd5e1',
    fontSize: '15px',
    backgroundColor: '#090f21'
  },
  tr: {
    transition: 'all 0.2s ease',
  },

  // --- ESTILOS ENLAZADOS DEL ROBOT ASISTENTE ---
  robotContainer: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '75px',
    height: '75px',
    zIndex: '1000',
    cursor: 'pointer',
    animation: 'float 3s ease-in-out infinite', 
    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  robotSvg: {
    width: '100%',
    height: '100%',
    filter: 'drop-shadow(0 8px 16px rgba(6, 182, 212, 0.3))',
  },
  robotAntennaDot: {
    animation: 'blink 1.5s infinite alternate',
  },
  robotEye: {
    animation: 'eyePulse 2s infinite alternate',
  },
  robotThruster: {
    animation: 'thrust 0.2s infinite alternate',
  }
};

export default styles;