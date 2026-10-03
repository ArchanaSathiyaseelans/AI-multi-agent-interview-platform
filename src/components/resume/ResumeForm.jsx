import React, { useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function Input({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider'>
                {label}
            </label>
            <input 
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value || ''}
                className='w-full bg-slate-50 dark:bg-zinc-800/90 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-zinc-500 shadow-sm'
            />
        </div>
    );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
    return (
        <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider'>
                {label}
            </label>
            <textarea 
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value || ''}
                rows={rows}
                className='w-full bg-slate-50 dark:bg-zinc-800/90 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-zinc-500 resize-none shadow-sm'
            />
        </div>
    );
}

function EntryCard({ children, onRemove, title }) {
    return (
        <div className='relative overflow-hidden bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-2xl p-4 shadow-sm space-y-3'>
            <div className='flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2 mb-2'>
                <span className='text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>{title}</span>
                <button 
                    type="button"
                    onClick={onRemove}
                    className='text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer'
                    title="Remove entry"
                >
                    <FiTrash2 size={15} />
                </button>
            </div>
            <div className='flex flex-col gap-3'>{children}</div>
        </div>
    );
}

function ResumeForm({ step, data, setData }) {
    const experienceList = Array.isArray(data?.experience) ? data.experience : [];
    const projectsList = Array.isArray(data?.projects) ? data.projects : [];
    const educationList = Array.isArray(data?.education) ? data.education : [];

    // Ensure at least 1 entry exists for Experience, Projects, and Education when visiting those steps
    useEffect(() => {
        if (step === 4 && experienceList.length === 0) {
            setData((prev) => ({
                ...prev,
                experience: [{ company: "", role: "", duration: "", description: "" }]
            }));
        } else if (step === 5 && projectsList.length === 0) {
            setData((prev) => ({
                ...prev,
                projects: [{ name: "", techStack: "", github: "", description: "" }]
            }));
        } else if (step === 6 && educationList.length === 0) {
            setData((prev) => ({
                ...prev,
                education: [{ college: "", degree: "", branch: "", cgpa: "", year: "" }]
            }));
        }
    }, [step]);

    if (step === 1) {
        return (
            <div className='flex flex-col gap-4'>
                <Input label="Full Name" placeholder="Rahul Sharma" onChange={(v) => setData({ ...data, name: v })} value={data.name} />
                <Input label="Email Address" placeholder="rahul@email.com" onChange={(v) => setData({ ...data, email: v })} value={data.email} />
                <Input label="Phone Number" placeholder="+91 9876543210" onChange={(v) => setData({ ...data, phone: v })} value={data.phone} />
                <Input label="Location" placeholder="Mumbai, India" onChange={(v) => setData({ ...data, location: v })} value={data.location} />
                <Input label="LinkedIn Profile URL" placeholder="linkedin.com/in/rahul" onChange={(v) => setData({ ...data, linkedin: v })} value={data.linkedin} />
                <Input label="GitHub Profile URL" placeholder="github.com/rahul" onChange={(v) => setData({ ...data, github: v })} value={data.github} />
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className='flex flex-col gap-3'>
                <TextArea 
                    label="Professional Summary"
                    placeholder="Passionate Full-Stack Engineer with experience building responsive web applications using React, Node.js, and MongoDB..."
                    rows={6}
                    onChange={(v) => setData({ ...data, summary: v })}
                    value={data.summary}
                />
                <p className='text-xs text-slate-500 dark:text-zinc-400 font-medium'>
                    Write a brief 2-3 sentence overview highlighting your core strengths and career goals.
                </p>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className='flex flex-col gap-3'>
                <TextArea 
                    label="Skills & Technologies (comma separated)"
                    placeholder="JavaScript, TypeScript, React.js, Node.js, Express, MongoDB, Tailwind CSS, Docker, Git"
                    rows={5}
                    onChange={(v) => setData({ ...data, skills: v })}
                    value={data.skills}
                />
                <p className='text-xs text-slate-500 dark:text-zinc-400 font-medium'>
                    Separate technical skills with commas for optimal ATS keyword matching.
                </p>
            </div>
        );
    }

    if (step === 4) {
        const addExp = () => {
            setData((prev) => ({
                ...prev,
                experience: [...(prev.experience || []), { company: "", role: "", duration: "", description: "" }]
            }));
        };

        const removeExp = (index) => {
            setData((prev) => ({
                ...prev,
                experience: (prev.experience || []).filter((_, i) => i !== index)
            }));
        };

        const updateExp = (index, field, value) => {
            const updated = (data.experience || []).map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            );
            setData((prev) => ({ ...prev, experience: updated }));
        };

        return (
            <div className='flex flex-col gap-4'>
                {experienceList.map((exp, index) => (
                    <EntryCard key={index} title={`Work Experience #${index + 1}`} onRemove={() => removeExp(index)}>
                        <Input label="Company / Organization Name" placeholder="Google / Microsoft / Tech Startup" onChange={(v) => updateExp(index, "company", v)} value={exp.company} />
                        <Input label="Job Title / Role" placeholder="Software Engineering Intern / Frontend Developer" onChange={(v) => updateExp(index, "role", v)} value={exp.role} />
                        <Input label="Duration" placeholder="Jan 2023 – Present" onChange={(v) => updateExp(index, "duration", v)} value={exp.duration} />
                        <TextArea label="Key Responsibilities & Achievements" placeholder={"• Developed REST APIs handling 10k daily requests\n• Reduced page load times by 35% with caching"} onChange={(v) => updateExp(index, "description", v)} value={exp.description} rows={3} />
                    </EntryCard>
                ))}

                <button 
                    type="button"
                    onClick={addExp} 
                    className='flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-indigo-500/30 dark:border-indigo-500/40 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer'
                >
                    <FiPlus size={15} /> Add Another Experience Entry
                </button>
            </div>
        );
    }

    if (step === 5) {
        const addPro = () => {
            setData((prev) => ({
                ...prev,
                projects: [...(prev.projects || []), { name: "", techStack: "", github: "", description: "" }]
            }));
        };

        const removePro = (index) => {
            setData((prev) => ({
                ...prev,
                projects: (prev.projects || []).filter((_, i) => i !== index)
            }));
        };

        const updatePro = (index, field, value) => {
            const updated = (data.projects || []).map((pro, i) =>
                i === index ? { ...pro, [field]: value } : pro
            );
            setData((prev) => ({ ...prev, projects: updated }));
        };

        return (
            <div className='flex flex-col gap-4'>
                {projectsList.map((pro, index) => (
                    <EntryCard key={index} title={`Project #${index + 1}`} onRemove={() => removePro(index)}>
                        <Input label="Project Name" placeholder="FresherAI Platform" onChange={(v) => updatePro(index, "name", v)} value={pro.name} />
                        <Input label="Tech Stack Used" value={pro.techStack} onChange={(v) => updatePro(index, "techStack", v)} placeholder="React, Express, MongoDB, Tailwind CSS" />
                        <Input label="GitHub / Live Demo Link" value={pro.github} onChange={(v) => updatePro(index, "github", v)} placeholder="github.com/rahul/fresherai" />
                        <TextArea label="Project Description & Features" value={pro.description} onChange={(v) => updatePro(index, "description", v)} placeholder="Built an end-to-end AI interview prep platform featuring voice mock interviews and PDF resume scoring." rows={3} />
                    </EntryCard>
                ))}

                <button 
                    type="button"
                    onClick={addPro} 
                    className='flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-indigo-500/30 dark:border-indigo-500/40 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer'
                >
                    <FiPlus size={15} /> Add Another Project
                </button>
            </div>
        );
    }

    if (step === 6) {
        const addEdu = () => {
            setData((prev) => ({
                ...prev,
                education: [...(prev.education || []), { college: "", degree: "", branch: "", cgpa: "", year: "" }]
            }));
        };

        const removeEdu = (index) => {
            setData((prev) => ({
                ...prev,
                education: (prev.education || []).filter((_, i) => i !== index)
            }));
        };

        const updateEdu = (index, field, value) => {
            const updated = (data.education || []).map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            );
            setData((prev) => ({ ...prev, education: updated }));
        };

        return (
            <div className='flex flex-col gap-4'>
                {educationList.map((edu, index) => (
                    <EntryCard key={index} title={`Education #${index + 1}`} onRemove={() => removeEdu(index)}>
                        <Input label="College / University Name" value={edu.college} onChange={(v) => updateEdu(index, "college", v)} placeholder="Indian Institute of Technology / University of Mumbai" />
                        <Input label="Degree Program" value={edu.degree} onChange={(v) => updateEdu(index, "degree", v)} placeholder="B.Tech / B.E. / B.Sc" />
                        <Input label="Major / Branch" value={edu.branch} onChange={(v) => updateEdu(index, "branch", v)} placeholder="Computer Science & Engineering" />
                        <Input label="CGPA / Score" value={edu.cgpa} onChange={(v) => updateEdu(index, "cgpa", v)} placeholder="8.5 / 10.0 or 85%" />
                        <Input label="Graduation Year / Timeline" value={edu.year} onChange={(v) => updateEdu(index, "year", v)} placeholder="2021 – 2025" />
                    </EntryCard>
                ))}

                <button 
                    type="button"
                    onClick={addEdu} 
                    className='flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-indigo-500/30 dark:border-indigo-500/40 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all cursor-pointer'
                >
                    <FiPlus size={15} /> Add Education Entry
                </button>
            </div>
        );
    }

    return null;
}

export default ResumeForm;
