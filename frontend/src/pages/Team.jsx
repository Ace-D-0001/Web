import { useState, useEffect } from 'react';
import axios from 'axios';
import './Team.css';

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/team`);
                setTeam(res.data);
            } catch (err) {
                console.error('Failed to fetch team');
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    if (loading) return <div className="loading-state">Loading our team...</div>;

    return (
        <div className="team-page">
            <header className="page-header">
                <h1 className="page-title">Meet Our Team</h1>
                <p className="page-subtitle">The brilliant minds behind SynergyStack.</p>
            </header>

            <section className="team-grid">
                {team.map((member) => (
                    <div key={member.id} className="team-card">
                        <div className="member-image-wrapper">
                            <img src={member.image_url || `https://ui-avatars.com/api/?name=${member.name}`} alt={member.name} className="member-image" />
                        </div>
                        <div className="member-info">
                            <h3 className="member-name">{member.name}</h3>
                            <p className="member-position">{member.position}</p>
                            <p className="member-email">{member.email}</p>
                        </div>
                    </div>
                ))}
                {team.length === 0 && (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px', color: 'var(--text-dim)' }}>
                        Team members are currently being updated. Please check back later.
                    </div>
                )}
            </section>
        </div>
    );
};

export default Team;
