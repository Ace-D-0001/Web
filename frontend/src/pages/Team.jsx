import './Team.css';

const teamMembers = [
    {
        id: 1,
        name: 'John Doe',
        position: 'Lead Architect',
        email: 'john.doe@gmail.com',
        image: 'https://i.pravatar.cc/300?img=11'
    },
    {
        id: 2,
        name: 'Jane Smith',
        position: 'Full-Stack Developer',
        email: 'jane.smith@gmail.com',
        image: 'https://i.pravatar.cc/300?img=32'
    },
    {
        id: 3,
        name: 'Alex Rivera',
        position: 'UI/UX Designer',
        email: 'alex.rivera@gmail.com',
        image: 'https://i.pravatar.cc/300?img=12'
    },
    {
        id: 4,
        name: 'Sarah Chen',
        position: 'DevOps Engineer',
        email: 'sarah.chen@gmail.com',
        image: 'https://i.pravatar.cc/300?img=47'
    }
];

const Team = () => {
    return (
        <div className="team-page">
            <header className="page-header">
                <h1 className="page-title">Meet Our Team</h1>
                <p className="page-subtitle">The brilliant minds behind SynergyStack.</p>
            </header>

            <section className="team-grid">
                {teamMembers.map((member) => (
                    <div key={member.id} className="team-card">
                        <div className="member-image-wrapper">
                            <img src={member.image} alt={member.name} className="member-image" />
                        </div>
                        <div className="member-info">
                            <h3 className="member-name">{member.name}</h3>
                            <p className="member-position">{member.position}</p>
                            <p className="member-email">{member.email}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Team;
