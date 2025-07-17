# Seeds file for Awesome Backend
# Run with: mix run priv/repo/seeds.exs

alias AwesomeBackend.Repo
alias AwesomeBackend.Employees.Employee

# Clear existing data
Repo.delete_all(Employee)

# Create a complex organizational hierarchy

# Level 1: CEO
ceo = %Employee{
  name: "Sarah Johnson",
  title: "Chief Executive Officer",
  department: "director",
  email: "sarah.johnson@company.com",
  phone: "+1-555-0101",
  location: "New York, NY",
  bio: "Visionary leader with 15+ years of experience in technology and business strategy. Passionate about innovation and team development.",
  start_date: ~D[2020-01-15],
  skills: "Strategic Planning, Leadership, Business Development, Innovation Management",
  parent_id: nil
}
{:ok, ceo} = Repo.insert(ceo)

# Level 2: C-Suite Executives
cto = %Employee{
  name: "Michael Chen",
  title: "Chief Technology Officer",
  department: "director",
  email: "michael.chen@company.com",
  phone: "+1-555-0102",
  location: "San Francisco, CA",
  bio: "Technology leader with expertise in software architecture, cloud computing, and digital transformation.",
  start_date: ~D[2020-03-01],
  skills: "Software Architecture, Cloud Computing, Digital Transformation, Team Leadership",
  parent_id: ceo.id
}
{:ok, cto} = Repo.insert(cto)

cfo = %Employee{
  name: "Emily Rodriguez",
  title: "Chief Financial Officer",
  department: "director",
  email: "emily.rodriguez@company.com",
  phone: "+1-555-0103",
  location: "New York, NY",
  bio: "Financial expert with strong background in corporate finance, risk management, and strategic planning.",
  start_date: ~D[2020-02-15],
  skills: "Financial Planning, Risk Management, Strategic Analysis, Budgeting",
  parent_id: ceo.id
}
{:ok, cfo} = Repo.insert(cfo)

chro = %Employee{
  name: "David Thompson",
  title: "Chief Human Resources Officer",
  department: "director",
  email: "david.thompson@company.com",
  phone: "+1-555-0104",
  location: "New York, NY",
  bio: "HR leader focused on talent development, organizational culture, and employee engagement.",
  start_date: ~D[2020-04-01],
  skills: "Talent Management, Organizational Development, Employee Relations, Culture Building",
  parent_id: ceo.id
}
{:ok, chro} = Repo.insert(chro)

# Level 3: Technology Department
tech_director = %Employee{
  name: "Lisa Wang",
  title: "Director of Engineering",
  department: "management",
  email: "lisa.wang@company.com",
  phone: "+1-555-0201",
  location: "San Francisco, CA",
  bio: "Engineering leader with expertise in scalable systems, team management, and technical strategy.",
  start_date: ~D[2020-06-01],
  skills: "Engineering Management, System Architecture, Team Leadership, Agile Development",
  parent_id: cto.id
}
{:ok, tech_director} = Repo.insert(tech_director)

devops_manager = %Employee{
  name: "Alex Kumar",
  title: "DevOps Manager",
  department: "technical",
  email: "alex.kumar@company.com",
  phone: "+1-555-0202",
  location: "San Francisco, CA",
  bio: "DevOps specialist focused on infrastructure automation, CI/CD pipelines, and cloud operations.",
  start_date: ~D[2020-07-15],
  skills: "DevOps, CI/CD, Cloud Infrastructure, Automation, Kubernetes",
  parent_id: cto.id
}
{:ok, devops_manager} = Repo.insert(devops_manager)

# Level 4: Engineering Teams
frontend_lead = %Employee{
  name: "Jessica Park",
  title: "Frontend Team Lead",
  department: "technical",
  email: "jessica.park@company.com",
  phone: "+1-555-0301",
  location: "San Francisco, CA",
  bio: "Frontend specialist with expertise in React, TypeScript, and modern web development practices.",
  start_date: ~D[2020-08-01],
  skills: "React, TypeScript, JavaScript, UI/UX, Frontend Architecture",
  parent_id: tech_director.id
}
{:ok, frontend_lead} = Repo.insert(frontend_lead)

backend_lead = %Employee{
  name: "Robert Kim",
  title: "Backend Team Lead",
  department: "technical",
  email: "robert.kim@company.com",
  phone: "+1-555-0302",
  location: "San Francisco, CA",
  bio: "Backend engineer with expertise in Elixir, PostgreSQL, and distributed systems.",
  start_date: ~D[2020-08-15],
  skills: "Elixir, PostgreSQL, Distributed Systems, API Design, Performance Optimization",
  parent_id: tech_director.id
}
{:ok, backend_lead} = Repo.insert(backend_lead)

# Level 5: Individual Contributors
frontend_dev1 = %Employee{
  name: "Maria Garcia",
  title: "Senior Frontend Developer",
  department: "technical",
  email: "maria.garcia@company.com",
  phone: "+1-555-0401",
  location: "San Francisco, CA",
  bio: "Experienced frontend developer with strong focus on user experience and accessibility.",
  start_date: ~D[2020-09-01],
  skills: "React, CSS, Accessibility, User Experience, Performance",
  parent_id: frontend_lead.id
}
{:ok, frontend_dev1} = Repo.insert(frontend_dev1)

frontend_dev2 = %Employee{
  name: "James Wilson",
  title: "Frontend Developer",
  department: "technical",
  email: "james.wilson@company.com",
  phone: "+1-555-0402",
  location: "San Francisco, CA",
  bio: "Frontend developer passionate about clean code and modern web technologies.",
  start_date: ~D[2020-10-01],
  skills: "JavaScript, React, HTML, CSS, Testing",
  parent_id: frontend_lead.id
}
{:ok, frontend_dev2} = Repo.insert(frontend_dev2)

backend_dev1 = %Employee{
  name: "Sophie Anderson",
  title: "Senior Backend Developer",
  department: "technical",
  email: "sophie.anderson@company.com",
  phone: "+1-555-0403",
  location: "San Francisco, CA",
  bio: "Backend developer with expertise in Elixir, database design, and system architecture.",
  start_date: ~D[2020-09-15],
  skills: "Elixir, Phoenix, Database Design, System Architecture, Testing",
  parent_id: backend_lead.id
}
{:ok, backend_dev1} = Repo.insert(backend_dev1)

backend_dev2 = %Employee{
  name: "Carlos Mendez",
  title: "Backend Developer",
  department: "technical",
  email: "carlos.mendez@company.com",
  phone: "+1-555-0404",
  location: "San Francisco, CA",
  bio: "Backend developer focused on API development and database optimization.",
  start_date: ~D[2020-11-01],
  skills: "Elixir, API Development, Database Optimization, Git, Documentation",
  parent_id: backend_lead.id
}
{:ok, backend_dev2} = Repo.insert(backend_dev2)

# Level 3: Finance Department
finance_director = %Employee{
  name: "Amanda Foster",
  title: "Director of Finance",
  department: "management",
  email: "amanda.foster@company.com",
  phone: "+1-555-0203",
  location: "New York, NY",
  bio: "Finance leader with expertise in financial planning, analysis, and strategic decision making.",
  start_date: ~D[2020-06-15],
  skills: "Financial Planning, Analysis, Strategic Planning, Budget Management",
  parent_id: cfo.id
}
{:ok, finance_director} = Repo.insert(finance_director)

accounting_manager = %Employee{
  name: "Kevin O'Brien",
  title: "Accounting Manager",
  department: "operations",
  email: "kevin.obrien@company.com",
  phone: "+1-555-0204",
  location: "New York, NY",
  bio: "Accounting professional with strong background in GAAP, financial reporting, and compliance.",
  start_date: ~D[2020-07-01],
  skills: "GAAP, Financial Reporting, Compliance, Audit, Tax",
  parent_id: cfo.id
}
{:ok, accounting_manager} = Repo.insert(accounting_manager)

# Level 4: Finance Team
financial_analyst1 = %Employee{
  name: "Rachel Green",
  title: "Senior Financial Analyst",
  department: "operations",
  email: "rachel.green@company.com",
  phone: "+1-555-0303",
  location: "New York, NY",
  bio: "Financial analyst with expertise in modeling, forecasting, and business intelligence.",
  start_date: ~D[2020-08-01],
  skills: "Financial Modeling, Forecasting, Business Intelligence, Excel, SQL",
  parent_id: finance_director.id
}
{:ok, financial_analyst1} = Repo.insert(financial_analyst1)

financial_analyst2 = %Employee{
  name: "Tom Martinez",
  title: "Financial Analyst",
  department: "operations",
  email: "tom.martinez@company.com",
  phone: "+1-555-0304",
  location: "New York, NY",
  bio: "Financial analyst focused on budgeting, variance analysis, and financial reporting.",
  start_date: ~D[2020-09-01],
  skills: "Budgeting, Variance Analysis, Financial Reporting, Excel, PowerPoint",
  parent_id: finance_director.id
}
{:ok, financial_analyst2} = Repo.insert(financial_analyst2)

# Level 3: HR Department
hr_director = %Employee{
  name: "Jennifer Lee",
  title: "Director of Human Resources",
  department: "management",
  email: "jennifer.lee@company.com",
  phone: "+1-555-0205",
  location: "New York, NY",
  bio: "HR leader with expertise in talent acquisition, employee development, and organizational culture.",
  start_date: ~D[2020-06-01],
  skills: "Talent Acquisition, Employee Development, Organizational Culture, HR Strategy",
  parent_id: chro.id
}
{:ok, hr_director} = Repo.insert(hr_director)

recruiting_manager = %Employee{
  name: "Daniel Brown",
  title: "Recruiting Manager",
  department: "operations",
  email: "daniel.brown@company.com",
  phone: "+1-555-0206",
  location: "New York, NY",
  bio: "Recruiting specialist with expertise in technical hiring, employer branding, and candidate experience.",
  start_date: ~D[2020-07-01],
  skills: "Technical Recruiting, Employer Branding, Candidate Experience, ATS Management",
  parent_id: chro.id
}
{:ok, recruiting_manager} = Repo.insert(recruiting_manager)

# Level 4: HR Team
hr_specialist1 = %Employee{
  name: "Nicole Taylor",
  title: "HR Specialist",
  department: "operations",
  email: "nicole.taylor@company.com",
  phone: "+1-555-0305",
  location: "New York, NY",
  bio: "HR specialist focused on employee relations, benefits administration, and HR operations.",
  start_date: ~D[2020-08-15],
  skills: "Employee Relations, Benefits Administration, HR Operations, Compliance",
  parent_id: hr_director.id
}
{:ok, hr_specialist1} = Repo.insert(hr_specialist1)

hr_specialist2 = %Employee{
  name: "Ryan Johnson",
  title: "HR Specialist",
  department: "operations",
  email: "ryan.johnson@company.com",
  phone: "+1-555-0306",
  location: "New York, NY",
  bio: "HR specialist with expertise in performance management, training, and organizational development.",
  start_date: ~D[2020-09-15],
  skills: "Performance Management, Training, Organizational Development, HRIS",
  parent_id: hr_director.id
}
{:ok, hr_specialist2} = Repo.insert(hr_specialist2)

# Level 4: Recruiting Team
recruiter1 = %Employee{
  name: "Ashley Davis",
  title: "Technical Recruiter",
  department: "operations",
  email: "ashley.davis@company.com",
  phone: "+1-555-0307",
  location: "New York, NY",
  bio: "Technical recruiter with expertise in sourcing, interviewing, and candidate assessment.",
  start_date: ~D[2020-08-01],
  skills: "Technical Sourcing, Interviewing, Candidate Assessment, LinkedIn Recruiter",
  parent_id: recruiting_manager.id
}
{:ok, recruiter1} = Repo.insert(recruiter1)

recruiter2 = %Employee{
  name: "Marcus Williams",
  title: "Recruiter",
  department: "operations",
  email: "marcus.williams@company.com",
  phone: "+1-555-0308",
  location: "New York, NY",
  bio: "Recruiter focused on non-technical roles, campus recruiting, and diversity hiring.",
  start_date: ~D[2020-09-01],
  skills: "Non-Technical Recruiting, Campus Recruiting, Diversity Hiring, Event Planning",
  parent_id: recruiting_manager.id
}
{:ok, recruiter2} = Repo.insert(recruiter2)

# Level 3: Advisory Board
advisory_director = %Employee{
  name: "Patricia Clark",
  title: "Director of Advisory Services",
  department: "advisory",
  email: "patricia.clark@company.com",
  phone: "+1-555-0207",
  location: "Boston, MA",
  bio: "Advisory leader with expertise in strategic consulting, business transformation, and client relations.",
  start_date: ~D[2020-05-01],
  skills: "Strategic Consulting, Business Transformation, Client Relations, Project Management",
  parent_id: ceo.id
}
{:ok, advisory_director} = Repo.insert(advisory_director)

# Level 4: Advisory Team
senior_advisor1 = %Employee{
  name: "Gregory White",
  title: "Senior Business Advisor",
  department: "advisory",
  email: "gregory.white@company.com",
  phone: "+1-555-0309",
  location: "Boston, MA",
  bio: "Senior advisor with expertise in business strategy, market analysis, and growth planning.",
  start_date: ~D[2020-07-01],
  skills: "Business Strategy, Market Analysis, Growth Planning, Client Management",
  parent_id: advisory_director.id
}
{:ok, senior_advisor1} = Repo.insert(senior_advisor1)

senior_advisor2 = %Employee{
  name: "Michelle Adams",
  title: "Senior Technology Advisor",
  department: "advisory",
  email: "michelle.adams@company.com",
  phone: "+1-555-0310",
  location: "Boston, MA",
  bio: "Technology advisor with expertise in digital transformation, technology strategy, and innovation.",
  start_date: ~D[2020-07-15],
  skills: "Digital Transformation, Technology Strategy, Innovation, Technology Consulting",
  parent_id: advisory_director.id
}
{:ok, senior_advisor2} = Repo.insert(senior_advisor2)

# Level 3: Education Department
education_director = %Employee{
  name: "Christopher Moore",
  title: "Director of Education",
  department: "education",
  email: "christopher.moore@company.com",
  phone: "+1-555-0208",
  location: "Austin, TX",
  bio: "Education leader with expertise in curriculum development, training programs, and learning technology.",
  start_date: ~D[2020-06-01],
  skills: "Curriculum Development, Training Programs, Learning Technology, Instructional Design",
  parent_id: ceo.id
}
{:ok, education_director} = Repo.insert(education_director)

# Level 4: Education Team
training_manager = %Employee{
  name: "Stephanie Lewis",
  title: "Training Manager",
  department: "education",
  email: "stephanie.lewis@company.com",
  phone: "+1-555-0311",
  location: "Austin, TX",
  bio: "Training manager with expertise in corporate training, skill development, and learning management systems.",
  start_date: ~D[2020-07-01],
  skills: "Corporate Training, Skill Development, LMS, Instructional Design, Assessment",
  parent_id: education_director.id
}
{:ok, training_manager} = Repo.insert(training_manager)

# Level 5: Training Team
trainer1 = %Employee{
  name: "Brandon Hall",
  title: "Senior Trainer",
  department: "education",
  email: "brandon.hall@company.com",
  phone: "+1-555-0405",
  location: "Austin, TX",
  bio: "Senior trainer with expertise in technical training, leadership development, and workshop facilitation.",
  start_date: ~D[2020-08-01],
  skills: "Technical Training, Leadership Development, Workshop Facilitation, Presentation Skills",
  parent_id: training_manager.id
}
{:ok, trainer1} = Repo.insert(trainer1)

trainer2 = %Employee{
  name: "Amber Scott",
  title: "Trainer",
  department: "education",
  email: "amber.scott@company.com",
  phone: "+1-555-0406",
  location: "Austin, TX",
  bio: "Trainer focused on soft skills, communication, and professional development programs.",
  start_date: ~D[2020-09-01],
  skills: "Soft Skills Training, Communication, Professional Development, Coaching",
  parent_id: training_manager.id
}
{:ok, trainer2} = Repo.insert(trainer2)

# Update direct reports counts for all employees
employees = Repo.all(Employee)
Enum.each(employees, fn employee ->
  direct_reports = Repo.aggregate(Employee, :count, :parent_id, where: [parent_id: employee.id])
  Repo.update!(Employee.changeset(employee, %{direct_reports: direct_reports}))
end)

IO.puts("✅ Successfully seeded database with #{length(employees)} employees!")
IO.puts("📊 Organizational hierarchy created:")
IO.puts("   - 1 CEO")
IO.puts("   - 3 C-Suite Executives")
IO.puts("   - 6 Directors/Managers")
IO.puts("   - 8 Team Leads/Specialists")
IO.puts("   - 8 Individual Contributors")
IO.puts("   - Total: 26 employees across 6 departments")
