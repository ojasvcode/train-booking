import './style.css';
import { stations, searchStations } from './data/stations.js';
import { generateTrains, generateSeats, classNames } from './data/trains.js';

const app = document.getElementById('app');
let state = {
  page: 'home', from: null, to: null, date: '', passengers: 1, classFilter: 'all',
  trains: [], selectedTrain: null, selectedClass: null, seatData: null, selectedSeats: [],
  paxDetails: [], contact: { email: '', phone: '' }, bookings: JSON.parse(localStorage.getItem('railwayBookings') || '[]'),
};

function saveBookings() { localStorage.setItem('railwayBookings', JSON.stringify(state.bookings)); }
function navigate(page) { state.page = page; render(); window.scrollTo(0, 0); }

function render() {
  const pages = { home: renderHome, results: renderResults, seats: renderSeats, passenger: renderPassenger, payment: renderPayment, ticket: renderTicket, bookings: renderBookings };
  app.innerHTML = renderNavbar() + (pages[state.page] || renderHome)();
  bindEvents();
}

function renderNavbar() {
  return `<nav class="navbar" id="navbar">
    <div class="nav-brand" id="nav-home"><span>🚆</span> RailWay</div>
    <div class="nav-links">
      <button id="nav-bookings-btn">My Bookings</button>
      <button class="nav-cta" id="nav-book-btn">Book Now</button>
    </div>
  </nav>`;
}

function renderHome() {
  const today = new Date().toISOString().split('T')[0];
  return `<section class="hero">
    <div class="hero-badge">✨ India's Premium Train Booking Platform</div>
    <h1>Travel Smarter with <span class="gradient-text">RailWay</span></h1>
    <p>Book train tickets instantly across 8,000+ routes. Fast, reliable, and hassle-free.</p>
    <div class="search-card">
      <div class="search-row" style="position:relative">
        <div class="form-group">
          <label>From Station</label>
          <input type="text" id="from-input" placeholder="Enter city or station" autocomplete="off" value="${state.from ? state.from.name : ''}">
          <div class="autocomplete-list" id="from-list"></div>
        </div>
        <button class="swap-btn" id="swap-btn" type="button">⇄</button>
        <div class="form-group">
          <label>To Station</label>
          <input type="text" id="to-input" placeholder="Enter city or station" autocomplete="off" value="${state.to ? state.to.name : ''}">
          <div class="autocomplete-list" id="to-list"></div>
        </div>
      </div>
      <div class="search-row-3">
        <div class="form-group"><label>Travel Date</label><input type="date" id="date-input" min="${today}" value="${state.date || today}"></div>
        <div class="form-group"><label>Passengers</label><select id="pax-select">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${state.passengers===n?'selected':''}>${n} Passenger${n>1?'s':''}</option>`).join('')}</select></div>
        <div class="form-group"><label>Class</label><select id="class-select"><option value="all">All Classes</option>${Object.entries(classNames).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div>
      </div>
      <button class="btn-search" id="search-btn">🔍 Search Trains</button>
    </div>
    <div class="stats-bar">
      <div class="stat-item"><div class="stat-value">8,000+</div><div class="stat-label">Routes</div></div>
      <div class="stat-item"><div class="stat-value">2M+</div><div class="stat-label">Bookings</div></div>
      <div class="stat-item"><div class="stat-value">500+</div><div class="stat-label">Trains Daily</div></div>
      <div class="stat-item"><div class="stat-value">99.9%</div><div class="stat-label">Uptime</div></div>
    </div>
    <div class="train-track"><div class="train-anim">🚄</div></div>
  </section>`;
}

function renderResults() {
  const from = state.from, to = state.to;
  if (!from || !to) return renderHome();
  const trains = state.trains.length ? state.trains : (() => { state.trains = generateTrains(from.code, to.code); return state.trains; })();
  const filtered = state.classFilter === 'all' ? trains : trains.filter(t => t.classes.includes(state.classFilter));
  return `<div class="results-page">
    <button class="btn-back" id="back-home">← Back to Search</button>
    <div class="results-header"><h2>${from.city} → ${to.city}</h2><p>${state.date} · ${state.passengers} Passenger${state.passengers>1?'s':''} · ${filtered.length} trains found</p></div>
    <div class="results-filters">
      ${['all','1A','2A','3A','SL','CC','EC','2S'].map(c=>`<button class="filter-btn ${state.classFilter===c?'active':''}" data-filter="${c}">${c==='all'?'All Classes':classNames[c]}</button>`).join('')}
    </div>
    <div class="train-list">${filtered.map((t,i)=>`
      <div class="train-card" style="animation-delay:${i*.08}s" data-train-idx="${i}">
        <div class="train-card-header">
          <div><div class="train-name">${t.name}</div><div class="train-number">#${t.number} · ${t.runsOn.join(', ')}</div></div>
          <span class="train-type-badge">${t.type}</span>
        </div>
        <div class="train-schedule">
          <div class="train-time"><div class="time">${t.departure}</div><div class="station">${from.code}</div></div>
          <div class="train-line"><div class="duration">${t.duration} · ${t.distance}km</div><div class="line"></div></div>
          <div class="train-time"><div class="time">${t.arrival}</div><div class="station">${to.code}${t.daysLater?` <span class="days-later">+${t.daysLater}d</span>`:''}</div></div>
        </div>
        <div class="train-classes">${t.classes.map(c=>{
          const a=t.availability[c];const avText=a.available===0?'No seats':'Avl '+a.available;
          const avCls=a.available===0?'none':a.available<10?'low':'';
          return `<div class="class-chip ${state.selectedTrain===t.id&&state.selectedClass===c?'selected':''}" data-tid="${t.id}" data-cls="${c}">
            <div class="cls-name">${classNames[c]}</div><div class="cls-price">₹${t.pricing[c].toLocaleString()}</div>
            <div class="cls-avail ${avCls}">${avText}</div></div>`;}).join('')}
        </div>
        ${state.selectedTrain===t.id&&state.selectedClass?`<button class="book-btn" data-book="${t.id}" ${trains.find(x=>x.id===t.id).availability[state.selectedClass].available===0?'disabled':''}>Continue Booking →</button>`:''}
      </div>`).join('')}</div>
  </div>`;
}

function renderSeats() {
  const t = state.trains.find(x=>x.id===state.selectedTrain);
  if(!t) return renderResults();
  if(!state.seatData) state.seatData = generateSeats(t.id, state.selectedClass);
  const sd = state.seatData;
  return `<div class="seats-page">
    <button class="btn-back" id="back-results">← Back to Results</button>
    <h2>Select Your Seats</h2>
    <p class="seats-info">${t.name} · ${classNames[state.selectedClass]} · Select ${state.passengers} seat${state.passengers>1?'s':''}</p>
    <div class="seat-legend">
      <div class="legend-item"><div class="legend-box available"></div>Available</div>
      <div class="legend-item"><div class="legend-box selected"></div>Selected</div>
      <div class="legend-item"><div class="legend-box booked"></div>Booked</div>
    </div>
    <div class="seat-grid" style="grid-template-columns:repeat(${sd.cols},40px)">
      ${sd.seats.map(s=>`<div class="seat ${s.status==='booked'?'booked':state.selectedSeats.includes(s.id)?'selected':'available'}" data-seat="${s.id}" data-status="${s.status}" title="${s.type} · Seat ${s.number}">${s.number}</div>`).join('')}
    </div>
    ${state.selectedSeats.length?`<div class="selected-seats-summary"><h4>Selected: ${state.selectedSeats.length}/${state.passengers}</h4><p style="color:var(--text2);font-size:.85rem">${state.selectedSeats.join(', ')}</p></div>`:''}
    <button class="btn-search" id="seats-continue" ${state.selectedSeats.length!==state.passengers?'disabled':''} style="${state.selectedSeats.length!==state.passengers?'opacity:.5;cursor:not-allowed':''}">Continue to Passenger Details →</button>
  </div>`;
}

function renderPassenger() {
  if(!state.paxDetails.length) state.paxDetails = Array.from({length:state.passengers},(_,i)=>({name:'',age:'',gender:'Male',seat:state.selectedSeats[i]||''}));
  return `<div class="passenger-page">
    <button class="btn-back" id="back-seats">← Back to Seat Selection</button>
    <h2>Passenger Details</h2>
    ${state.paxDetails.map((p,i)=>`<div class="pax-card" style="animation-delay:${i*.1}s">
      <h3>Passenger ${i+1} — Seat ${p.seat}</h3>
      <div class="pax-row">
        <input type="text" placeholder="Full Name" data-pax="${i}" data-field="name" value="${p.name}">
        <input type="number" placeholder="Age" min="1" max="120" data-pax="${i}" data-field="age" value="${p.age}">
        <select data-pax="${i}" data-field="gender"><option ${p.gender==='Male'?'selected':''}>Male</option><option ${p.gender==='Female'?'selected':''}>Female</option><option ${p.gender==='Other'?'selected':''}>Other</option></select>
      </div></div>`).join('')}
    <div class="contact-section"><h3>📧 Contact Information</h3>
      <div class="contact-row">
        <input type="email" id="contact-email" placeholder="Email Address" value="${state.contact.email}">
        <input type="tel" id="contact-phone" placeholder="Phone Number" value="${state.contact.phone}">
      </div>
    </div>
    <button class="btn-search" id="pax-continue">Continue to Payment →</button>
  </div>`;
}

function renderPayment() {
  const t = state.trains.find(x=>x.id===state.selectedTrain);
  if(!t) return renderHome();
  const pricePerPax = t.pricing[state.selectedClass];
  const total = pricePerPax * state.passengers;
  const gst = Math.round(total * 0.05);
  return `<div class="payment-page">
    <button class="btn-back" id="back-pax">← Back</button>
    <h2>Review & Pay</h2>
    <div class="summary-card"><h3>🚆 Journey Details</h3>
      <div class="summary-row"><span class="label">Train</span><span class="value">${t.name} (#${t.number})</span></div>
      <div class="summary-row"><span class="label">Route</span><span class="value">${state.from.code} → ${state.to.code}</span></div>
      <div class="summary-row"><span class="label">Date</span><span class="value">${state.date}</span></div>
      <div class="summary-row"><span class="label">Class</span><span class="value">${classNames[state.selectedClass]}</span></div>
      <div class="summary-row"><span class="label">Departure</span><span class="value">${t.departure}</span></div>
      <div class="summary-row"><span class="label">Arrival</span><span class="value">${t.arrival}</span></div>
    </div>
    <div class="summary-card"><h3>👥 Passengers</h3>
      ${state.paxDetails.map(p=>`<div class="summary-row"><span class="label">${p.name} (${p.gender}, ${p.age}y)</span><span class="value">Seat ${p.seat}</span></div>`).join('')}
    </div>
    <div class="summary-card"><h3>💰 Fare Breakdown</h3>
      <div class="summary-row"><span class="label">Base Fare (${state.passengers}×₹${pricePerPax.toLocaleString()})</span><span class="value">₹${total.toLocaleString()}</span></div>
      <div class="summary-row"><span class="label">GST (5%)</span><span class="value">₹${gst.toLocaleString()}</span></div>
      <div class="summary-row"><span class="label">Service Fee</span><span class="value">₹30</span></div>
      <div class="summary-total"><span>Total</span><span class="value">₹${(total+gst+30).toLocaleString()}</span></div>
    </div>
    <h3 style="margin-bottom:1rem;font-size:1.1rem">Select Payment Method</h3>
    <div class="payment-methods">
      ${[{id:'upi',icon:'📱',name:'UPI'},{id:'card',icon:'💳',name:'Card'},{id:'nb',icon:'🏦',name:'Net Banking'},{id:'wallet',icon:'👛',name:'Wallet'}].map(m=>`
        <div class="payment-method" data-method="${m.id}"><div class="icon">${m.icon}</div><div class="name">${m.name}</div></div>`).join('')}
    </div>
    <button class="btn-pay" id="pay-btn">Pay ₹${(total+gst+30).toLocaleString()}</button>
  </div>`;
}

function renderTicket() {
  const booking = state.bookings[state.bookings.length - 1];
  if(!booking) return renderHome();
  return `<div class="ticket-page">
    <div class="ticket-success"><div class="check">✓</div><h2>Booking Confirmed!</h2><p>Your e-ticket has been generated</p></div>
    <div class="e-ticket">
      <div class="ticket-header"><h3>🚆 RailWay E-Ticket</h3><div class="pnr">PNR: ${booking.pnr}</div></div>
      <div class="ticket-body">
        <div class="ticket-route">
          <div><div class="time">${booking.departure}</div><div class="station">${booking.from}</div></div>
          <div class="arrow">→</div>
          <div style="text-align:right"><div class="time">${booking.arrival}</div><div class="station">${booking.to}</div></div>
        </div>
        <div class="ticket-details">
          <div class="ticket-detail"><div class="td-label">Train</div><div class="td-value">${booking.trainName}</div></div>
          <div class="ticket-detail"><div class="td-label">Train No</div><div class="td-value">${booking.trainNumber}</div></div>
          <div class="ticket-detail"><div class="td-label">Date</div><div class="td-value">${booking.date}</div></div>
          <div class="ticket-detail"><div class="td-label">Class</div><div class="td-value">${booking.class}</div></div>
          <div class="ticket-detail"><div class="td-label">Status</div><div class="td-value" style="color:var(--success)">CONFIRMED</div></div>
          <div class="ticket-detail"><div class="td-label">Amount</div><div class="td-value">₹${booking.total.toLocaleString()}</div></div>
        </div>
        <div class="ticket-passengers"><h4>Passengers</h4>
          ${booking.passengers.map(p=>`<div class="ticket-pax"><span>${p.name} (${p.gender}, ${p.age}y)</span><span>Seat ${p.seat}</span></div>`).join('')}
        </div>
        <div class="ticket-qr"><canvas id="qr-canvas" width="120" height="120"></canvas><p style="font-size:.75rem;color:var(--text3);margin-top:.5rem">Scan for verification</p></div>
      </div>
    </div>
    <button class="btn-download" id="btn-new-booking">🏠 Book Another Ticket</button>
  </div>`;
}

function renderBookings() {
  return `<div class="bookings-page">
    <button class="btn-back" id="back-home">← Back to Home</button>
    <h2>My Bookings</h2>
    ${state.bookings.length === 0 ? '<div class="no-bookings"><div class="icon">🎫</div><h3>No bookings yet</h3><p style="color:var(--text3)">Your booked tickets will appear here</p></div>' :
    state.bookings.slice().reverse().map(b => `<div class="booking-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <div><div style="font-weight:700;font-family:var(--font-display)">${b.trainName}</div><div style="font-size:.85rem;color:var(--text2)">PNR: ${b.pnr}</div></div>
        <span class="booking-status confirmed">CONFIRMED</span>
      </div>
      <div class="train-schedule">
        <div class="train-time"><div class="time">${b.departure}</div><div class="station">${b.from}</div></div>
        <div class="train-line"><div class="duration">${b.date}</div><div class="line"></div></div>
        <div class="train-time"><div class="time">${b.arrival}</div><div class="station">${b.to}</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:1rem;font-size:.9rem">
        <span style="color:var(--text2)">${b.passengers.length} Passenger${b.passengers.length>1?'s':''} · ${b.class}</span>
        <span style="font-weight:700;color:var(--success)">₹${b.total.toLocaleString()}</span>
      </div>
    </div>`).join('')}
  </div>`;
}

function drawQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const s = 6;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 120, 120);
  ctx.fillStyle = '#6366f1';
  for (let x = 0; x < 20; x++) for (let y = 0; y < 20; y++) {
    if (Math.random() > 0.5 || (x < 4 && y < 4) || (x > 15 && y < 4) || (x < 4 && y > 15)) {
      ctx.fillRect(x * s, y * s, s, s);
    }
  }
  // Corner squares
  const drawCorner = (ox, oy) => {
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(ox, oy, s*7, s*7);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ox+s, oy+s, s*5, s*5);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(ox+s*2, oy+s*2, s*3, s*3);
  };
  drawCorner(0, 0);
  drawCorner(s*13, 0);
  drawCorner(0, s*13);
}

function showLoading(msg, cb) {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `<div class="spinner"></div><div class="loading-text">${msg}</div>`;
  document.body.appendChild(overlay);
  setTimeout(() => { overlay.remove(); cb(); }, 1500);
}

function bindEvents() {
  // Navbar
  document.getElementById('nav-home')?.addEventListener('click', () => { state.trains = []; navigate('home'); });
  document.getElementById('nav-bookings-btn')?.addEventListener('click', () => navigate('bookings'));
  document.getElementById('nav-book-btn')?.addEventListener('click', () => { state.trains = []; navigate('home'); });

  // Scroll effect
  window.onscroll = () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  // Autocomplete
  ['from', 'to'].forEach(field => {
    const input = document.getElementById(`${field}-input`);
    const list = document.getElementById(`${field}-list`);
    if (!input || !list) return;
    input.addEventListener('input', () => {
      const results = searchStations(input.value);
      if (results.length && input.value.length > 0) {
        list.innerHTML = results.map(s => `<div class="autocomplete-item" data-code="${s.code}"><span>${s.name}, ${s.city}</span><span class="code">${s.code}</span></div>`).join('');
        list.classList.add('show');
      } else { list.classList.remove('show'); }
    });
    list.addEventListener('click', e => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;
      const code = item.dataset.code;
      const station = stations.find(s => s.code === code);
      state[field] = station;
      input.value = station.name;
      list.classList.remove('show');
    });
    input.addEventListener('blur', () => setTimeout(() => list.classList.remove('show'), 200));
  });

  // Swap
  document.getElementById('swap-btn')?.addEventListener('click', () => {
    [state.from, state.to] = [state.to, state.from];
    render();
  });

  // Search
  document.getElementById('search-btn')?.addEventListener('click', () => {
    state.date = document.getElementById('date-input')?.value || new Date().toISOString().split('T')[0];
    state.passengers = parseInt(document.getElementById('pax-select')?.value || 1);
    state.classFilter = document.getElementById('class-select')?.value || 'all';
    if (!state.from || !state.to) { alert('Please select both stations'); return; }
    if (state.from.code === state.to.code) { alert('From and To stations must be different'); return; }
    state.trains = [];
    state.selectedTrain = null;
    state.selectedClass = null;
    showLoading('Searching trains...', () => navigate('results'));
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { state.classFilter = btn.dataset.filter; render(); });
  });

  // Class chip selection
  document.querySelectorAll('.class-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.selectedTrain = chip.dataset.tid;
      state.selectedClass = chip.dataset.cls;
      render();
    });
  });

  // Book button
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.seatData = null;
      state.selectedSeats = [];
      state.paxDetails = [];
      navigate('seats');
    });
  });

  // Seats
  document.querySelectorAll('.seat[data-status="available"]').forEach(s => {
    s.addEventListener('click', () => {
      const id = s.dataset.seat;
      if (state.selectedSeats.includes(id)) {
        state.selectedSeats = state.selectedSeats.filter(x => x !== id);
      } else if (state.selectedSeats.length < state.passengers) {
        state.selectedSeats.push(id);
      }
      render();
    });
  });
  document.getElementById('seats-continue')?.addEventListener('click', () => {
    if (state.selectedSeats.length === state.passengers) navigate('passenger');
  });

  // Passenger input
  document.querySelectorAll('.pax-row input, .pax-row select').forEach(el => {
    el.addEventListener('input', () => {
      const i = parseInt(el.dataset.pax);
      const field = el.dataset.field;
      if (state.paxDetails[i]) state.paxDetails[i][field] = el.value;
    });
  });
  document.getElementById('contact-email')?.addEventListener('input', e => state.contact.email = e.target.value);
  document.getElementById('contact-phone')?.addEventListener('input', e => state.contact.phone = e.target.value);
  document.getElementById('pax-continue')?.addEventListener('click', () => {
    const valid = state.paxDetails.every(p => p.name && p.age);
    if (!valid) { alert('Please fill in all passenger details'); return; }
    navigate('payment');
  });

  // Payment method
  document.querySelectorAll('.payment-method').forEach(m => {
    m.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(x => x.classList.remove('selected'));
      m.classList.add('selected');
    });
  });

  // Pay
  document.getElementById('pay-btn')?.addEventListener('click', () => {
    const t = state.trains.find(x => x.id === state.selectedTrain);
    if (!t) return;
    const pricePerPax = t.pricing[state.selectedClass];
    const total = pricePerPax * state.passengers;
    const gst = Math.round(total * 0.05);
    const booking = {
      id: 'BK' + Date.now(),
      pnr: String(Math.floor(1000000000 + Math.random() * 9000000000)),
      trainName: t.name, trainNumber: t.number,
      from: state.from.code, to: state.to.code,
      fromCity: state.from.city, toCity: state.to.city,
      departure: t.departure, arrival: t.arrival,
      date: state.date, class: classNames[state.selectedClass],
      passengers: [...state.paxDetails],
      total: total + gst + 30, status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };
    state.bookings.push(booking);
    saveBookings();
    showLoading('Processing Payment...', () => { navigate('ticket'); setTimeout(drawQR, 100); });
  });

  // New booking
  document.getElementById('btn-new-booking')?.addEventListener('click', () => {
    state.selectedTrain = null; state.selectedClass = null;
    state.selectedSeats = []; state.paxDetails = [];
    state.seatData = null; state.trains = [];
    navigate('home');
  });

  // Back buttons
  document.getElementById('back-home')?.addEventListener('click', () => navigate('home'));
  document.getElementById('back-results')?.addEventListener('click', () => navigate('results'));
  document.getElementById('back-seats')?.addEventListener('click', () => navigate('seats'));
  document.getElementById('back-pax')?.addEventListener('click', () => navigate('passenger'));
}

render();
