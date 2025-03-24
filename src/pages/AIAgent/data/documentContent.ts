
// Sample content for the different document types
export const documentContent = {
  resume: `JOHN DOE
UX/UI Designer
john.doe@email.com | (123) 456-7890 | Portfolio: johndoe.design

EXPERIENCE
Senior UX Designer | ABC Design Studio | 2019 - Present
• Led the redesign of a financial app resulting in 35% increase in user engagement
• Conducted user interviews and usability tests with over 200 participants
• Collaborated with cross-functional teams to implement design systems

UX/UI Designer | XYZ Interactive | 2017 - 2019
• Designed responsive interfaces for web and mobile platforms
• Created wireframes, mockups, and interactive prototypes
• Optimized user flows resulting in 28% reduction in task completion time

EDUCATION
Master of Design, User Experience | Design University | 2017
Bachelor of Arts, Graphic Design | Creative Institute | 2015

SKILLS
• User Research
• Wireframing & Prototyping
• Usability Testing
• Figma, Adobe XD, Sketch
`,

  coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the Senior UX Designer position at Apple, as advertised on LinkedIn. With over 5 years of experience in UX/UI design and a proven track record of creating user-centered digital experiences, I am confident in my ability to make a significant contribution to your team.

In my current role as Senior UX Designer at ABC Design Studio, I led the redesign of a financial application that resulted in a 35% increase in user engagement and a 28% reduction in task completion time. I have extensive experience conducting user research, creating wireframes and prototypes, and collaborating with cross-functional teams to implement design solutions.

I am particularly drawn to Apple's commitment to intuitive and elegant design that puts the user first. My approach to design aligns perfectly with Apple's philosophy of creating products that are both beautiful and functional. I am excited about the opportunity to bring my skills and passion for user experience to a company that has consistently set the standard for design excellence.

I have attached my resume for your review, and you can find examples of my work at johndoe.design. I would welcome the opportunity to discuss how my experience and skills would benefit your team.

Thank you for your consideration.

Sincerely,
John Doe`,

  sop: `Statement of Purpose - John Doe

As I apply to the Master of Human-Computer Interaction program at Carnegie Mellon University, I am driven by a passion for creating digital experiences that truly serve human needs and enhance our relationship with technology.

My journey in user experience design began during my undergraduate studies in Graphic Design, where I discovered the power of purposeful design to solve real-world problems. Through coursework and internships, I developed a strong foundation in visual communication and user-centered design principles. However, I soon realized that effective digital experiences require more than visual appeal—they demand a deep understanding of human psychology, behavior, and needs.

For the past five years, I have been working as a UX/UI designer, most recently as a Senior Designer at ABC Design Studio. In this role, I have led redesign projects for financial applications, healthcare portals, and e-commerce platforms. My proudest achievement has been the complete overhaul of a complex financial management application, which resulted in a 35% increase in user engagement and significant improvements in task completion metrics.

While my professional experience has been rewarding, I have identified areas where I need to deepen my knowledge to advance my career and make more meaningful contributions to the field. I am particularly interested in developing expertise in:
1. Research methodologies and quantitative analysis
2. Cognitive psychology as it relates to human-computer interaction
3. Emerging technologies such as AR/VR and voice interfaces

Carnegie Mellon's MHCI program stands out for its interdisciplinary approach and rigorous research focus. I am excited about the opportunity to work with faculty who are leaders in the field and to collaborate with peers from diverse backgrounds. The program's emphasis on both theoretical foundations and practical application aligns perfectly with my learning goals.

After completing the MHCI program, my goal is to work at the intersection of design and research, either at a technology company focused on creating innovative user experiences or at a design consultancy where I can apply my skills across various domains. Long-term, I aspire to contribute to the evolution of how humans interact with technology, particularly as we move toward more ambient and seamless experiences.

Thank you for considering my application. I look forward to the opportunity to join the Carnegie Mellon community and to grow both personally and professionally through this transformative educational experience.
`,

  linkedInProfile: `# John Doe
UX/UI Designer | Creating User-Centered Digital Experiences | Portfolio: johndoe.design

## About
Passionate UX/UI Designer with 5+ years of experience creating intuitive digital experiences for financial, healthcare, and e-commerce industries. Specialized in user research, interaction design, and usability testing. Committed to creating products that are both beautiful and functional.

## Experience
### Senior UX Designer
ABC Design Studio | 2019 - Present
- Led the redesign of a financial app resulting in 35% increase in user engagement
- Conducted user interviews and usability tests with over 200 participants
- Collaborated with cross-functional teams to implement design systems
- Mentored junior designers and facilitated design thinking workshops

### UX/UI Designer
XYZ Interactive | 2017 - 2019
- Designed responsive interfaces for web and mobile platforms
- Created wireframes, mockups, and interactive prototypes
- Optimized user flows resulting in 28% reduction in task completion time
- Participated in agile development processes

## Education
### Master of Design, User Experience
Design University | 2017

### Bachelor of Arts, Graphic Design
Creative Institute | 2015

## Skills
- User Research
- Wireframing & Prototyping
- Usability Testing
- Interaction Design
- Visual Design
- Design Systems
- Figma, Adobe XD, Sketch
- HTML/CSS basics

## Certifications
- Google UX Design Professional Certificate
- Nielsen Norman Group UX Certified
`,

  portfolioDescription: `# John Doe - UX/UI Designer Portfolio

## About Me
I'm a UX/UI Designer with 5+ years of experience creating intuitive and engaging digital experiences. I believe in design that solves real problems and creates meaningful connections between people and technology.

## My Design Process
I follow a user-centered design process that emphasizes thorough research, collaborative ideation, iterative design, and data-driven decision making. For each project, I:

1. **Understand**: Research users and context to define clear problems
2. **Explore**: Ideate multiple solutions and create concepts
3. **Create**: Develop wireframes, prototypes, and visual designs
4. **Validate**: Test with users and refine based on feedback
5. **Implement**: Work with developers to bring designs to life

## Featured Projects

### Financial App Redesign - ABC Bank
The challenge was to simplify a complex financial management application with poor user engagement metrics. I led a complete redesign that resulted in:
- 35% increase in user engagement
- 28% reduction in task completion time
- 40% decrease in support tickets

The process included competitive analysis, user interviews, card sorting, journey mapping, wireframing, prototyping, and multiple rounds of usability testing.

### Healthcare Portal - MedConnect
Designed an accessible patient portal for a healthcare provider serving 500,000+ patients. Key achievements:
- Created an inclusive design for users with diverse abilities
- Simplified appointment scheduling, reducing steps by 60%
- Developed a medication management system with clear visual indicators
- Implemented responsive design for seamless cross-device experience

### E-commerce Mobile App - ShopEasy
Redesigned the mobile shopping experience for a major retail client. Highlights:
- Streamlined checkout process reducing abandonment by 25%
- Designed an innovative product filtering system
- Created a cohesive visual design system for long-term consistency
- Implemented gesture-based interactions for intuitive navigation

## Skills & Tools
**Design Skills**: User Research, Information Architecture, Wireframing, Prototyping, Visual Design, Interaction Design, Usability Testing

**Tools**: Figma, Adobe XD, Sketch, InVision, Principle, Illustrator, Photoshop

**Additional**: HTML/CSS basics, Design Systems, Accessibility Guidelines (WCAG), Agile/Scrum methodology

## Contact
I'm always interested in new challenges and opportunities. Let's connect!
- Email: john.doe@email.com
- Phone: (123) 456-7890
- Portfolio: johndoe.design
- LinkedIn: linkedin.com/in/johndoe
`
};

// Helper function to get document title from type
export const getDocumentTitle = (docType: string): string => {
  switch(docType) {
    case "resume": return "Resume";
    case "coverLetter": return "Cover Letter";
    case "sop": return "Statement of Purpose";
    case "linkedInProfile": return "LinkedIn Profile";
    case "portfolioDescription": return "Portfolio Description";
    default: return "Document";
  }
};

// Helper function to get document icon based on type
export const getDocumentIcon = (docType: string) => {
  switch(docType) {
    case "resume": return "FileText";
    case "coverLetter": return "FileSpreadsheet";
    case "sop": return "BookOpen";
    case "linkedInProfile": return "FileCode";
    case "portfolioDescription": return "FileText";
    default: return "FileText";
  }
};
