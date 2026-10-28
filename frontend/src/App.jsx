import { useEffect, useState } from "react";
import SafetyGuidance from "./SafetyGuidance.jsx";
import { api } from "./api.js";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  GraduationCapIcon,
  Home01Icon,
  Location01Icon,
  Logout01Icon,
  Menu01Icon,
  Mail01Icon,
  Moon02Icon,
  Notification01Icon,
  Cancel01Icon,
  Search01Icon,
  Settings01Icon,
  Sun03Icon,
  UserCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  ["Home", Home01Icon],
  ["Learner", GraduationCapIcon],
  ["Tutor", UserCircleIcon],
  ["Study Partner", UserGroupIcon],
  ["Find Tutor", Search01Icon],
  ["Find Learner", UserGroupIcon],
  ["Find Study Partner", UserGroupIcon],
  ["Course Materials", BookOpen01Icon],
  ["Upcoming Sessions", Calendar03Icon],
  ["Messages", Mail01Icon],
  ["Notifications", Notification01Icon],
  ["Profile", UserCircleIcon],
  ["Settings", Settings01Icon],
];

const departments = [
  "Accounting",
  "Business Administration",
  "International Relations",
  "Local Government and Development Studies",
  "Public Administration",
  "Agricultural Economics",
  "Agricultural Extension and Rural Development",
  "Animal Sciences",
  "Crop Production and Protection",
  "Family Nutrition and Consumer Sciences",
  "Plant Science",
  "Soil Science",
  "Dramatic Arts",
  "English",
  "Foreign Languages",
  "History",
  "Linguistics and African Languages",
  "Music",
  "Philosophy",
  "Religious Studies",
  "Anatomy and Cell Biology",
  "Haematology and Immunology",
  "Medical Biochemistry",
  "Medical Microbiology and Parasitology",
  "Medical Pharmacology and Therapeutics",
  "Medical Rehabilitation",
  "Morbid Anatomy and Forensic Medicine",
  "Nursing Sciences",
  "Physiological Sciences",
  "Community Health and Nutrition",
  "Dermatology and Venerology",
  "Medicine",
  "Mental Health",
  "Obstetrics, Gynaecology and Perinatology",
  "Ophthalmology",
  "Orthopaedics and Traumatology",
  "Paediatrics and Child Health",
  "Radiology",
  "Surgery",
  "Child Dental Health",
  "Oral and Maxillofacial Surgery and Oral Pathology",
  "Preventive and Community Dentistry",
  "Restorative Dentistry",
  "Architecture",
  "Building",
  "Estate Management",
  "Fine and Applied Arts",
  "Quantity Surveying",
  "Surveying and Geoinformatics",
  "Urban and Regional Planning",
  "Adult Education and Lifelong Learning",
  "Arts and Social Sciences Education",
  "Counselling and Human Development",
  "Educational Foundation and Counseling",
  "Educational Management",
  "Institute of Education",
  "Physical and Health Education",
  "Science and Technology Education",
  "Business Law",
  "International Law",
  "Jurisprudence and Private Law",
  "Public Law",
  "Clinical Pharmacy and Pharmacy Administration",
  "Drug Research and Production Unit",
  "Pharmaceutical Chemistry",
  "Pharmaceutics and Industrial Pharmacy",
  "Pharmacognosy",
  "Pharmacology",
  "Biochemistry",
  "Botany",
  "Chemistry",
  "Geology",
  "Mathematics",
  "Microbiology",
  "Physics",
  "Statistics",
  "Zoology",
  "Demography and Social Statistics",
  "Economics",
  "Geography",
  "Political Science",
  "Psychology",
  "Sociology and Anthropology",
  "African Institute for Science Policy and Innovation",
  "Agricultural and Environmental Engineering",
  "Aerospace Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science and Engineering",
  "Electronic and Electrical Engineering",
  "Food Science and Technology",
  "Materials Science and Engineering",
  "Mechanical Engineering",
].sort((a, b) => a.localeCompare(b));

const tutors = [
  { name: "Blessing Okafor", subject: "Mathematics", courses: "MTH101, MTH201, MTH401", rating: "4.8", reviews: 12, initials: "BO", color: "brown" },
  { name: "Tunde Adebayo", subject: "Computer Science", courses: "CSC201, CSC301, CSC401", rating: "4.5", reviews: 9, initials: "TA", color: "blue" },
  { name: "Chidinma Eze", subject: "Computer Science", courses: "CSC201, CSC301, CSC401", rating: "4.8", reviews: 15, initials: "CE", color: "gold" },
];

// Sample data until the sessions endpoint is connected.
const sessions = [
  { course: "MTH201 - Calculus II", type: "One-to-One Session", time: "Today, 2:00 PM - 4:00 PM", place: "Library", initials: "BO" },
  { course: "CSC301 - Data Structures", type: "One-to-One Session", time: "Thu, 10:00 AM - 12:00 PM", place: "Engineering Block", initials: "TA" },
];

function App() {
  const [activeView, setActiveView] = useState(() => localStorage.getItem("studyconnect-token") ? "Home" : "Auth");
  const [userRole, setUserRole] = useState("LEARNER");
  const [currentUser, setCurrentUser] = useState(null);
  const [showRequest, setShowRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);
  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const [theme, setTheme] = useState(() => localStorage.getItem("studyconnect-theme") || "light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("studyconnect-token")) return;
    api.me().then((user) => {
      setCurrentUser(user);
      setUserRole(user.role || "LEARNER");
    }).catch(() => {
      localStorage.removeItem("studyconnect-token");
      setActiveView("Auth");
    });
  }, []);

  const openRequest = () => {
    setRequestSent(false);
    setShowRequest(true);
  };

  const navigate = (view) => {
    setActiveView(view);
    setIsMenuOpen(false);
  };

  const handleAuthenticated = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveView("Home");
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setIsMenuOpen(false);
    setActiveView("Home");
  };

  if (!authChecked) {
    return <div className="auth-app"><p style={{ padding: 24 }}>Loading...</p></div>;
  }

  // Nobody gets past this point without a real, verified account.
  if (!user) {
    return (
      <div className="auth-app">
        <AuthView onLogin={(role, user) => { setUserRole(role); setCurrentUser(user || null); setActiveView("Home"); }} />
      </div>
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar activeView={activeView} isOpen={isMenuOpen} onNavigate={navigate} onLogout={() => { localStorage.removeItem("studyconnect-token"); setCurrentUser(null); navigate("Auth"); }} />
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Icon icon={isMenuOpen ? Cancel01Icon : Menu01Icon} size={20} />
            <span>Menu</span>
          </button>
          <div className="mobile-brand"><span className="brand-mark"><Icon icon={GraduationCapIcon} size={16} /></span> StudyConnect</div>
          <div className="top-search"><Icon icon={Search01Icon} size={13} /><input placeholder="Search courses, tutors, or resources..." aria-label="Search" /></div>
          <button className="top-icon" aria-label="Search"><Icon icon={Search01Icon} size={16} /></button>
          <div className="user-chip"><div className="photo-avatar photo-chinedu">{initials(currentUser)}</div><span><strong>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "StudyConnect user"}</strong><small>{roleLabel(userRole)}</small></span><b>⌄</b></div>
        </header>
        <div className="page">
          {activeView === "Home" && <Dashboard role={userRole} onRequest={openRequest} onNavigate={navigate} />}
          {activeView === "Learner" && <RoleDashboard role="LEARNER" onNavigate={navigate} />}
          {activeView === "Tutor" && <RoleDashboard role="TUTOR" onNavigate={navigate} />}
          {activeView === "Study Partner" && <RoleDashboard role="STUDY_PARTNER" onNavigate={navigate} />}
          {activeView === "Find Tutor" && <TutorDirectory onRequest={openRequest} onTutor={(tutor) => { setSelectedTutor(tutor); navigate("Tutor Profile"); }} />}
          {activeView === "Find Tutors" && <TutorDirectory onRequest={openRequest} onTutor={(tutor) => { setSelectedTutor(tutor); navigate("Tutor Profile"); }} />}
          {["Find Learner", "Find Learners"].includes(activeView) && <DirectoryView title="Find a Learner" description="Connect with learners who are looking for support in your courses." />}
          {activeView === "Find Study Partner" && <DirectoryView title="Find a Study Partner" description="Find a reliable partner for focused, collaborative study." />}
          {activeView === "My Sessions" && <SessionsView onRequest={openRequest} onSession={(session) => { setSelectedSession(session); navigate("Session Details"); }} />}
          {activeView === "Upcoming Sessions" && <SessionsView onRequest={openRequest} onSession={(session) => { setSelectedSession(session); navigate("Session Details"); }} />}
          {activeView === "Session Details" && <SessionDetails session={selectedSession} onBack={() => navigate("My Sessions")} onChat={() => navigate("Chat Session")} />}
          {activeView === "Chat Session" && <ChatSession session={selectedSession} onBack={() => navigate("Session Details")} />}
          {activeView === "Tutor Profile" && <TutorProfile tutor={selectedTutor} onBack={() => navigate("Find Tutors")} onRequest={openRequest} />}
          {activeView === "Resources" && <ResourcesView />}
          {activeView === "Course Materials" && <MaterialsView />}
          {activeView === "Profile" && <ProfileView user={currentUser} onSaved={setCurrentUser} />}
          {activeView === "Settings" && <SettingsView theme={theme} onThemeChange={(nextTheme) => {
            setTheme(nextTheme);
            localStorage.setItem("studyconnect-theme", nextTheme);
          }} />}
          {["Messages", "Notifications"].includes(activeView) && <EmptyView title={activeView} />}
        </div>
    <footer className="app-footer">
      <p>© 2026 StudyConnect · Built by SWEP Team 22</p>
    </footer>
    </main>
    {isMenuOpen && <button className="menu-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} />}
    {showRequest && <RequestModal tutor={selectedTutor} sent={requestSent}
    onClose={() => setShowRequest(false)} onSubmit={(event) =>
    { event.preventDefault(); setRequestSent(true); }} />}
    </div>
  );
}

function initials(user) {
  return user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "SC";
}

function roleLabel(role) {
  return role === "STUDY_PARTNER" ? "Study Partner" : role === "TUTOR" ? "Tutor" : "Learner";
}
function Sidebar({ activeView, isOpen, onNavigate, onLogout }) {
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate("Home"); }}><span className="brand-mark"><Icon icon={GraduationCapIcon} size={19} /></span><span>StudyConnect</span></a>
      <nav id="main-navigation" aria-label="Main navigation">
        {navItems.map(([name, icon]) => <button key={name} className={`nav-item ${activeView === name ? "active" : ""}`} onClick={() => onNavigate(name)}><span className="nav-icon"><Icon icon={icon} size={16} /></span>{name}{["Messages", "Notifications"].includes(name) && <span className="nav-badge">1</span>}</button>)}
      </nav>
      <button className="nav-item logout" onClick={onLogout}><span className="nav-icon"><Icon icon={Logout01Icon} size={16} /></span>Logout</button>
    </aside>
  );
}

function Dashboard({ role, onRequest, onNavigate }) {
  return (
    <div className="dashboard-view">
      <section className="dashboard-heading"><div><h1>Good morning, Chinedu!</h1><p>{role === "TUTOR" ? "Manage your courses, learners, and upcoming sessions." : "Find a tutor, join a session, or access study resources."}</p></div><button className="primary-button" onClick={role === "TUTOR" ? () => onNavigate("Tutor") : onRequest}><Icon icon={Add01Icon} size={14} /> {role === "TUTOR" ? "Manage courses" : "Request a session"}</button></section>
      <SafetyGuidance />
      <section className="quick-grid">
        <QuickCard icon={UserGroupIcon} title="Find Tutors" text="Get matched with verified peer tutors" onClick={() => onNavigate("Find Tutors")} />
        <QuickCard icon={UserCircleIcon} title="Find Learners" text="Join or create a study group" onClick={() => onNavigate("Find Learners")} />
        <QuickCard icon={Calendar03Icon} title="My Sessions" text="View upcoming and past sessions" onClick={() => onNavigate("My Sessions")} />
        <QuickCard icon={BookOpen01Icon} title="Resources" text="Access shared academic materials" onClick={() => onNavigate("Resources")} />
      </section>
      <div className="content-columns">
        <section className="panel upcoming-panel"><PanelHeading title="Upcoming Sessions" action="View all" onClick={() => onNavigate("My Sessions")} />{sessions.map((session) => <SessionCard key={session.course} session={session} onOpen={() => onNavigate("Session Details")} />)}</section>
        <section className="panel activity-panel"><PanelHeading title="Recent Activity" action="View all" /><Activity icon={CheckmarkCircle02Icon} text="You completed a session with Blessing Okafor" time="2 hours ago" /><Activity icon={Mail01Icon} text="New message from Tunde Adebayo" time="3 hours ago" /><Activity icon={CheckmarkCircle02Icon} text="You received a 5-star rating" time="Yesterday" /></section>
      </div>
    </div>
  );
}

function RoleDashboard({ role, onNavigate }) {
  const isTutor = role === "TUTOR";
  const isPartner = role === "STUDY_PARTNER";
  const title = isTutor ? "Tutor Dashboard" : isPartner ? "Study Partner Dashboard" : "Learner Dashboard";
  const description = isTutor ? "Teach confidently with one place to manage your courses and learners." : isPartner ? "Plan focused study sessions and meet compatible partners." : "Stay on top of your learning goals and sessions.";
  const cards = isTutor
    ? [["Tutor", "Edit your profile and teaching courses"], ["Upcoming Sessions", "Review sessions with your learners"], ["Find Learner", "Connect with learners who need help"], ["Course Materials", "Share notes and solved past questions"]]
    : isPartner
      ? [["Find Study Partner", "Discover students with shared goals"], ["Upcoming Sessions", "Keep your study plan on track"], ["Course Materials", "Share and review materials"], ["Settings", "Update your preferences"]]
      : [["Find Tutor", "Get matched with verified peer tutors"], ["Upcoming Sessions", "View your upcoming tutorials"], ["Course Materials", "Access shared academic materials"], ["Find Study Partner", "Study together with your peers"]];
  return <div className="dashboard-view"><section className="dashboard-heading"><div><p className="eyebrow">YOUR SPACE</p><h1>{title}</h1><p>{description}</p></div></section><section className="role-banner"><strong>{isTutor ? "Teaching profile" : "Learning profile"}</strong><span>{isTutor ? "Your course ratings are shown separately for every course." : "Your progress and recommendations are tailored to your role."}</span></section><section className="quick-grid">{cards.map(([name, text]) => <QuickCard key={name} icon={name === "Settings" ? Settings01Icon : name.includes("Session") ? Calendar03Icon : name.includes("Material") ? BookOpen01Icon : UserGroupIcon} title={name} text={text} onClick={() => onNavigate(name)} />)}</section></div>;
}

function DirectoryView({ title, description }) {
  return <section className="panel directory-placeholder"><p className="eyebrow">DISCOVER</p><h1>{title}</h1><p>{description}</p><div className="directory-search"><Icon icon={Search01Icon} size={15} /><input placeholder="Search by course, department, or availability" /></div><button className="primary-button">Search directory</button></section>;
}

function MaterialsView() {
  const [materials, setMaterials] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => { api.materials().then(setMaterials).catch((error) => setMessage(error.message)); }, []);
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const courseId = window.prompt("Enter the UUID of the course this material belongs to:");
    const fileUrl = window.prompt("Enter the publicly hosted file URL:");
    if (!courseId || !fileUrl) return;
    try {
      const material = await api.uploadMaterial({ courseId, title: file.name, fileUrl, fileFormat: file.name.split(".").pop() });
      setMaterials((current) => [material, ...current]);
      setMessage("Material uploaded successfully.");
    } catch (error) { setMessage(error.message); }
  };
  return <section className="panel materials-view"><div className="view-heading"><div><p className="eyebrow">SHARED LIBRARY</p><h1>Course Materials</h1><p>Upload notes, study materials, and solved past questions for your peers.</p>{message && <small>{message}</small>}</div><label className="primary-button upload-button">Upload material<input type="file" hidden onChange={upload} /></label></div><div className="material-list">{materials.map((material) => <div className="material-item" key={material.id}><BookOpen01Icon /><span>{material.title}</span><small>{material.materialType || material.fileFormat || "Academic material"}</small></div>)}</div></section>;
}

function QuickCard({ icon, title, text, onClick }) {
  return <button className="quick-card" onClick={onClick}><span className="quick-icon"><Icon icon={icon} size={19} /></span><strong>{title}</strong><small>{text}</small></button>;
}

function PanelHeading({ title, action, onClick }) {
  return <div className="panel-heading"><h2>{title}</h2><button className="link-button" onClick={onClick}>{action} <Icon icon={ArrowRight01Icon} size={13} /></button></div>;
}

function SessionCard({ session, onOpen }) {
  return <article className="session-card"><div className="session-course"><div className="mini-avatar avatar-blue">{session.initials}</div><div><strong>{session.course}</strong><small>{session.type}</small></div></div><div className="session-detail"><span><Icon icon={Clock01Icon} size={12} /> {session.time}</span><span><Icon icon={Location01Icon} size={12} /> {session.place}</span></div><button className="small-button" onClick={onOpen}>View Details</button></article>;
}

function Activity({ icon, text, time }) {
  return <div className="activity"><span className="activity-icon"><Icon icon={icon} size={18} /></span><div><p>{text}</p><small>{time}</small></div></div>;
}

function Icon({ icon, size = 16 }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} />;
}

function TutorDirectory({ onRequest, onTutor }) {
  const [results, setResults] = useState([]);
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const search = () => api.tutors(course).then(setResults).catch((error) => setMessage(error.message));
  useEffect(() => { search(); }, []);
  const displayed = results.map((user) => ({ ...user, name: `${user.firstName} ${user.lastName}`, subject: user.department || "Peer tutor", courses: (user.coursesToTeach || []).join(", "), rating: Number(user.rating || 0).toFixed(1), reviews: user.reviewCount || 0, initials: initials(user), color: "blue" }));
  return <><section className="view-heading"><div><h1>Find a Tutor</h1><p>Search and connect with the right tutor for your course.</p>{message && <small>{message}</small>}</div></section><section className="filter-panel"><div className="directory-search">⌕<input value={course} onChange={(event) => setCourse(event.target.value)} placeholder="Search by course code or topic..." /></div><div className="filter-row"><button className="primary-button" onClick={search}>Search</button></div></section><div className="directory-title"><h2>Recommended Tutors</h2></div><section className="tutor-list">{displayed.map((tutor) => <TutorRow key={tutor.id} tutor={tutor} onRequest={onRequest} onTutor={() => onTutor(tutor)} />)}</section></>;
}

function TutorRow({ tutor, onRequest, onTutor }) {
  return <article className="tutor-row"><div className={`photo-avatar photo-${tutor.color}`}>{tutor.initials}</div><div className="tutor-main"><h3>{tutor.name} <em>Verified Tutor</em></h3><p>{tutor.subject} · {tutor.courses}</p><small>⌖ Available Today · ◷ Flexible</small></div><div className="rating"><strong>★ {tutor.rating}</strong><small>({tutor.reviews} reviews)</small></div><button className="small-button" onClick={onTutor}>View Profile</button></article>;
}

function SessionsView({ onRequest, onSession }) {
  const [items, setItems] = useState([]);
  useEffect(() => { api.sessions().then((data) => setItems(data.map((session) => ({ ...session, course: session.course?.code || session.course?.title || "Tutoring session", type: session.sessionType || "Tutoring session", time: new Date(session.scheduledAt).toLocaleString(), place: session.locationVenue || session.locationType || "Online", initials: initials(session.tutor) })))).catch(() => setItems([])); }, []);
  return <><section className="view-heading"><div><h1>My Sessions</h1><p>Manage your one-to-one and group study sessions.</p></div><button className="primary-button" onClick={onRequest}>+ Create a session</button></section><section className="panel sessions-full">{items.map((session) => <SessionCard key={session.id} session={session} onOpen={() => onSession(session)} />)}</section></>;
}

function SessionDetails({ user, session, onBack, onChat }) {
  return <><div className="back-link" onClick={onBack}>← Back to My Sessions</div><section className="details-header panel"><div><p className="eyebrow">SESSION DETAILS</p><h1>{session.course}</h1><p>{session.type} · 1 tutor + up to 6 learners</p><div className="session-detail"><span>◷ {session.time}</span><span>⌖ {session.place}</span></div></div><span className="status-pill">● Upcoming</span></section><section className="panel participants-panel"><div className="panel-heading"><h2>Participants (5/6)</h2><button className="invite-button">＋ Invite More</button></div><div className="participants">{["You", "T1", "T2", "T3", "T4"].map((person, index) => <div className="participant" key={person}><div className={`photo-avatar participant-avatar photo-${index % 2 ? "blue" : "brown"}`}>{index ? person : initialsOf(user)}</div><small>{person}</small><span>{index === 0 ? "Learner" : index === 1 ? "Tutor" : "Learner"}</span></div>)}</div></section><section className="panel session-status"><div><h2>Session Status <span className="status-pill">● Confirmed</span></h2><p>Everything is ready for your study session.</p></div><div className="detail-actions"><button className="outline-button" onClick={onChat}>◉ View Chat</button><button className="outline-button">▤ View Materials</button><button className="cancel-button">Cancel Session</button></div></section></>;
}

function ChatSession({ session, onBack }) {
  return <><div className="back-link" onClick={onBack}>← Back to Session Details</div><div className="chat-layout"><section className="panel chat-panel"><div className="chat-header"><div><h1>Session Chat</h1><p>{session.course}</p></div><span>ⓘ</span></div><div className="chat-messages"><div className="chat-message received"><b>Blessing Okafor</b><p>Hi everyone! I&apos;ve uploaded some past questions for today&apos;s session. Please take a look.</p><small>1:35 PM</small></div><div className="chat-message sent"><p>Great, thank you! I&apos;ll review them before we begin.</p><small>1:38 PM</small></div><div className="chat-file"><span className="file-icon">PDF</span><div><b>Past Questions - MTH201.pdf</b><small>2.4 MB</small></div><span>↓</span></div></div><div className="chat-input"><input placeholder="Type a message..." /><button>➤</button></div></section><aside className="panel files-panel"><h2>Session Files</h2>{["Past Questions - MTH201.pdf", "Lecture Notes - Calculus.pdf", "Study Guide.pdf"].map((file) => <div className="file-row" key={file}><span className="file-icon">PDF</span><div><b>{file}</b><small>Shared file</small></div></div>)}</aside></div></>;
}

function TutorProfile({ tutor, onBack, onRequest }) {
  const [editingCourses, setEditingCourses] = useState(false);
  const [courses, setCourses] = useState(tutor.courses ? tutor.courses.split(", ").filter(Boolean) : []);
  const saveCourses = async () => {
    if (tutor.id) await api.updateProfile({ coursesToTeach: courses });
    setEditingCourses(false);
  };
  return <><div className="back-link" onClick={onBack}>← Back to Find Tutors</div><section className="panel tutor-profile-header"><div className={`photo-avatar profile-photo photo-${tutor.color}`}>{tutor.initials}</div><div className="tutor-profile-name"><h1>{tutor.name} <em>Verified Tutor</em></h1><p>{tutor.subject} · {courses.join(", ")}</p><button className="primary-button" onClick={onRequest}>Request Session</button></div><div className="profile-rating"><strong>{tutor.rating}</strong><span>★★★★★</span><small>{tutor.reviews} reviews</small></div></section><div className="profile-detail-grid"><section className="panel"><div className="panel-heading"><h2>Courses & Ratings</h2><button className="small-button" onClick={editingCourses ? saveCourses : () => setEditingCourses(true)}>{editingCourses ? "Save" : "Edit"}</button></div>{editingCourses && <div className="course-edit-list">{["CSC201", "CSC301", "MTH101", "MTH201", "MTH301"].map((course) => <label key={course}><input type="checkbox" checked={courses.includes(course)} onChange={(event) => setCourses((current) => event.target.checked ? [...new Set([...current, course])] : current.filter((item) => item !== course))} /> {course}</label>)}</div>}{courses.map((course, index) => <div className="course-rating" key={course}><span>{course}</span><b>★★★★★ <small>{(4.8 - index / 10).toFixed(1)} ({12 - index} ratings)</small></b><i style={{ width: `${82 - index * 10}%` }} /></div>)}</section><section className="panel feedback-panel"><h2>Rate a course</h2><p>Only learners who completed this specific course can submit a rating.</p><select><option>Select completed course</option>{courses.map((course) => <option key={course}>{course}</option>)}</select><textarea placeholder="Write a review (optional)" /><button className="primary-button">Submit Review</button></section></div></>;
}

function ResourcesView() {
  return <><section className="view-heading"><div><h1>Resource Library</h1><p>Find and share academic materials with your campus community.</p></div><button className="primary-button">↑ Upload Resource</button></section><section className="filter-panel"><div className="directory-search">⌕<input placeholder="Search resources..." /></div><div className="filter-row"><select><option>All Departments</option></select><select><option>All Courses</option></select><select><option>All Types</option></select></div></section><section className="resource-grid">{["MTH201 Past Questions.pdf", "CSC301 Lecture Notes.pdf", "ENG101 Study Guide.pdf", "PHY101 Formula Sheet.pdf"].map((name) => <article className="resource-card" key={name}><div className="file-icon">PDF</div><strong>{name}</strong><small>Shared by a peer tutor · 2 days ago</small><button className="small-button">Download</button></article>)}</section></>;
}

function ProfileView({ user, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const save = async (event) => {
    event.preventDefault();
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const updated = await api.updateProfile(values);
      onSaved(updated);
      setEditing(false);
      setMessage("Profile updated.");
    } catch (error) { setMessage(error.message); }
  };
  if (!user) return <section className="panel">Loading profile...</section>;
  return <><section className="profile-banner"><div className="photo-avatar photo-chinedu large-avatar">{initials(user)}</div><div><h1>{user.firstName} {user.lastName}</h1><p>{user.level || "Student"} · {user.department || "Campus"}</p><span className="verified-pill">✓ {user.isVerified ? "Verified Student" : "Email pending"}</span></div><button className="outline-button" onClick={() => setEditing((value) => !value)}>{editing ? "Cancel" : "Edit Profile"}</button></section>{message && <p className="auth-help">{message}</p>}{editing && <form className="panel profile-edit-form" onSubmit={save}><label>First name<input name="firstName" defaultValue={user.firstName} /></label><label>Last name<input name="lastName" defaultValue={user.lastName} /></label><label>Department<input name="department" defaultValue={user.department || ""} /></label><label>Level<input name="level" defaultValue={user.level || ""} /></label><label>Bio<textarea name="bio" defaultValue={user.bio || ""} /></label><button className="primary-button" type="submit">Save changes</button></form>}<div className="profile-grid"><section className="panel"><PanelHeading title="Overview" action="" /><div className="overview-stats"><b>{user.totalSessionsAttended || 0}<small>Sessions</small></b><b>{Number(user.rating || 0).toFixed(1)}<small>Rating</small></b><b>{(user.coursesToTeach || []).length}<small>Courses</small></b></div></section></div></>;
}

function SettingsView({ theme, onThemeChange }) {
  return (
    <section className="settings-view">
      <div className="view-heading">
        <div><h1>Settings</h1><p>Personalize your StudyConnect workspace.</p></div>
      </div>
      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon">◐</div>
            <div><h2>Appearance</h2><p>Choose how StudyConnect looks on your device.</p></div>
          </div>
          <div className="theme-options" role="group" aria-label="Theme">
            <button
              className={`theme-option ${theme === "light" ? "selected" : ""}`}
              onClick={() => onThemeChange("light")}
              aria-pressed={theme === "light"}
            >
              <span className="theme-preview theme-preview-light"><Icon icon={Sun03Icon} size={17} /></span>
              <span><strong>Light theme</strong><small>Bright and clear</small></span>
              {theme === "light" && <b>✓</b>}
            </button>
            <button
              className={`theme-option ${theme === "dark" ? "selected" : ""}`}
              onClick={() => onThemeChange("dark")}
              aria-pressed={theme === "dark"}
            >
              <span className="theme-preview theme-preview-dark"><Icon icon={Moon02Icon} size={17} /></span>
              <span><strong>Dark theme</strong><small>Easy on the eyes</small></span>
              {theme === "dark" && <b>✓</b>}
            </button>
          </div>
        </section>
        <section className="settings-card settings-info-card">
          <div className="settings-icon">✦</div>
          <h2>StudyConnect preferences</h2>
          <p>Your theme is saved automatically on this device. More notification and privacy controls will be available here soon.</p>
        </section>
      </div>
    </section>
  );
}

function AuthView({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [gender, setGender] = useState("Female");
  const [role, setRole] = useState("LEARNER");
  const [resetStep, setResetStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationStep, setRegistrationStep] = useState("form");

  const submitAuth = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (mode === "login") {
        const result = await api.login({ email: values.email, password: values.password });
        localStorage.setItem("studyconnect-token", result.accessToken);
        onLogin(result.user?.role || "LEARNER");
      } else if (registrationStep === "verify") {
        const result = await api.verifyRegistration({ email: registrationEmail, code: values.code });
        localStorage.setItem("studyconnect-token", result.accessToken);
        onLogin(result.user?.role || role);
      } else {
        await api.register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          matricNumber: values.matricNumber,
          department: values.department,
          level: values.level,
          gender,
          role,
          coursesToTeach: values.coursesToTeach ? values.coursesToTeach.split(",").map((course) => course.trim()).filter(Boolean) : [],
        });
        setRegistrationEmail(values.email);
        setRegistrationStep("verify");
        setMessage("A verification code was sent to your email.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (resetStep === "email") {
        await api.forgotPassword({ email: resetEmail });
        setResetStep("code");
      } else if (resetStep === "code") {
        const result = await api.verifyPasswordOtp({ email: resetEmail, code: resetCode });
        setResetToken(result.resetToken);
        setResetStep("reset");
      } else {
        if (values.newPassword !== values.confirmPassword) throw new Error("Passwords do not match.");
        await api.resetPassword({ resetToken, newPassword: values.newPassword });
        setMessage("Your password was successfully reset.");
        setMode("login");
        setResetStep("email");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-screen">
      <section className="auth-hero" aria-label="About StudyConnect">
        <div className="auth-brand">
          <span className="auth-logo">◆</span>
          <span>StudyConnect</span>
        </div>
        <h1>StudyConnect</h1>
        <p className="auth-tagline">
          Learn <span>·</span> Support <span>·</span> Grow
        </p>
        <p className="auth-description">
          A peer-to-peer platform for physical tutoring and departmental resource sharing.
        </p>
        <footer>OAU Campus <span>|</span> Built by Students, For Students</footer>
      </section>

      <section className="auth-form-side" aria-label={mode === "signup" ? "Create an account" : "Log in"}>
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "selected" : ""}
              onClick={() => setMode("login")}
            >
              Log In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={mode === "signup" ? "selected" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <h2>{mode === "login" ? "Welcome Back" : mode === "signup" ? (registrationStep === "verify" ? "Verify Your Email" : "Create Your Account") : resetStep === "email" ? "Forgot Password?" : resetStep === "code" ? "Enter Reset Code" : "Reset Password"}</h2>
          {message && <p className="auth-help" role="status">{message}</p>}
          {mode === "forgot" ? (
            <form onSubmit={submitReset}>
              {resetStep === "email" && <><p className="auth-help">Enter your registered email and we&apos;ll send a password reset code.</p><label>Email Address<input required type="email" name="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} placeholder="Enter your email address" /></label></>}
              {resetStep === "code" && <><p className="auth-help">We sent a 6-digit code to <strong>{resetEmail}</strong>.</p><label>Verification code<input required name="code" value={resetCode} onChange={(event) => setResetCode(event.target.value)} inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="000000" /></label><button className="text-button" type="button" onClick={() => api.resendPasswordOtp({ email: resetEmail }).then(() => setMessage("A new code was sent.")).catch((error) => setMessage(error.message))}>Resend code</button></>}
              {resetStep === "reset" && <><label>New password<input required name="newPassword" type="password" minLength="6" placeholder="Enter a new password" /></label><label>Confirm password<input required name="confirmPassword" type="password" minLength="6" placeholder="Confirm your new password" /></label></>}
              <button className="primary-button auth-submit" disabled={busy} type="submit">{busy ? "Please wait..." : resetStep === "email" ? "Send reset code" : resetStep === "code" ? "Verify code" : "Reset password"}</button>
              <p className="auth-switch"><button type="button" onClick={() => { setMode("login"); setResetStep("email"); }}>Back to Log In</button></p>
            </form>
          ) : <form onSubmit={submitAuth}>
            {mode === "signup" && registrationStep === "form" && <><div className="role-toggle"><label>Gender<select value={gender} onChange={(event) => setGender(event.target.value)}><option>Female</option><option>Male</option></select></label></div><div className="role-toggle"><label>Account type<select value={role} onChange={(event) => setRole(event.target.value)}><option value="LEARNER">Learner</option><option value="TUTOR">Tutor</option><option value="STUDY_PARTNER">Study Partner</option></select></label></div><label>First Name<input required name="firstName" autoComplete="given-name" placeholder="First name" /></label><label>Last Name<input required name="lastName" autoComplete="family-name" placeholder="Last name" /></label><label>Student ID<input required name="matricNumber" placeholder="Enter your student ID" /></label><label>Department<select required name="department" defaultValue=""><option value="" disabled>Select your department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label><label>Level<select required name="level" defaultValue=""><option value="" disabled>Select your level</option><option>100 Level</option><option>200 Level</option><option>300 Level</option><option>400 Level</option><option>500 Level</option></select></label>{role === "TUTOR" && <fieldset className="course-picker"><legend>Courses you teach</legend><label><input type="text" name="coursesToTeach" placeholder="CSC201, MTH201" /> Enter course codes separated by commas</label></fieldset>}</>}
            {mode === "signup" && registrationStep === "verify" ? <><p className="auth-help">Enter the 6-digit code sent to {registrationEmail}.</p><label>Verification code<input required name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="000000" /></label><button className="text-button" type="button" onClick={() => api.resendRegistrationOtp({ email: registrationEmail }).then(() => setMessage("A new code was sent.")).catch((error) => setMessage(error.message))}>Resend code</button></> : <><label>Email Address<input required name="email" type="email" autoComplete="email" placeholder="Enter your email address" /></label><label>Password<input required name="password" type="password" minLength="6" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Enter your password" /></label></>}
            {mode === "login" && <button className="text-button forgot-link" type="button" onClick={() => setMode("forgot")}>Forgot Password?</button>}
            <button className="primary-button auth-submit" disabled={busy} type="submit">{busy ? "Please wait..." : mode === "login" ? "Log In" : registrationStep === "verify" ? "Verify email" : "Sign Up"}</button>
            <p className="auth-switch">{mode === "login" ? "Don’t have an account? " : "Already have an account? "}<button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Sign Up" : "Log In"}</button></p>
          </form>}
        </div>
      </section>
    </main>
  );
}

function EmptyView({ title, onBack }) {
  return (
    <div className="empty-view" style={{ textAlign: "center", padding: "70px 20px" }}>
      <span style={{ fontSize: "50px", display: "block", marginBottom: "12px" }}>🚀</span>
      <h1 style={{ fontSize: "24px", fontWeight: "700" }}>{title}</h1>
      <p style={{ color: "#6b7a9a", marginTop: "8px", fontSize: "13px", maxWidth: "400px", margin: "8px auto" }}>
        This area is ready for your campus activity. Our team is building amazing features here.
      </p>
      <button className="primary-button" style={{ marginTop: "18px" }} onClick={onBack}>
        Back to Dashboard
      </button>
    </div>
  );
}

function RequestModal({ sent, onClose, onSubmit }) {
  return <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="Close">×</button>{sent ? <div className="success-message"><div className="success-icon">✓</div><h2>Request sent!</h2><p>We&apos;ll notify you when a verified tutor responds.</p><button className="primary-button" onClick={onClose}>Done</button></div> : <><p className="eyebrow">STUDYCONNECT</p><h2>Request a study session</h2><p className="modal-subtitle">Tell us what you need help with.</p><form onSubmit={onSubmit}><label>Course or subject<input required placeholder="e.g. MTH201 - Calculus II" /></label><label>Describe your goal<textarea required rows="3" placeholder="What would you like to learn?" /></label><div className="form-row"><label>Date<input required type="date" /></label><label>Time<input required type="time" /></label></div><button className="primary-button full-width" type="submit">Send Request</button></form></>}</div></div>;
}

export default App;
